import {RestQuery} from "../../../common/model/cuba-model";
import {collectMethods, createMethodParamsType, MethodWithOverloads} from "./method-params-type";
import * as ts from "typescript";
import {PropertyAssignment, TypeAliasDeclaration} from "typescript";
import {createIncludes, importDeclaration, ImportInfo} from "../import-utils";
import {CreateItemResult, cubaAppCallFunc} from "./services-generation";
import {CUBA_APP_MODULE_SPEC, CUBA_APP_TYPE, FETCH_OPTIONS_TYPE} from "../../../common/constants";
import {renderTSNodes} from "../../../common/ts-helpers";
import {exportModifier} from "../../../common/ts-shorthands";
import {ModelContext} from "../model/model-utils";

const QUERIES_VAR_NAME = 'restQueries';

export function generateQueries(restQueries: RestQuery[], ctx: ModelContext): string {
  const importDec = importDeclaration([CUBA_APP_TYPE, FETCH_OPTIONS_TYPE], CUBA_APP_MODULE_SPEC);
  const queriesResult = createQueries(restQueries, ctx);
  const includes = createIncludes(queriesResult.importInfos);
  return renderTSNodes(
    [importDec, ...includes, ...queriesResult.methodParamTypes, queriesResult.node],
    '\n\n');
}

function createQueries(restQueries: RestQuery[], ctx: ModelContext) {

  const assignmentList: PropertyAssignment[] = [];
  const methodParamTypes: TypeAliasDeclaration[] = [];
  const importInfos: ImportInfo[] = [];

  const queriesByEntity: Map<string, RestQuery[]> = new Map();
  restQueries.forEach(q => {
    const queriesOfEntity: RestQuery[] | undefined = queriesByEntity.get(q.entity);
    if (queriesOfEntity) {
      queriesOfEntity.push(q);
    } else {
      queriesByEntity.set(q.entity, [q]);
    }
  });

  [...queriesByEntity.entries()].forEach(([entityName, queries]) => {
    const createItemResult = createQuery(entityName, queries, ctx);
    assignmentList.push(createItemResult.node);
    createItemResult.methodParamsTypes.forEach(mpt => methodParamTypes.push(mpt));
    importInfos.push(...createItemResult.imports);
  });

  const variableDeclaration = ts.createVariableDeclaration(
    QUERIES_VAR_NAME,
    undefined,
    ts.createObjectLiteral(assignmentList, true));

  const node = ts.createVariableStatement([exportModifier()], [variableDeclaration]);
  return {node, methodParamTypes, importInfos};
}

/**
 * Call example:
 *        restQueries.Car.carsByType(cubaApp, fetchOpts?)(params?)
 *        restQueries.Car.carsByTypeCount(cubaApp, fetchOpts?)(params?)
 *        restQueries.Car.carsByTypeWithCount(cubaApp, fetchOpts?)(params?)
 *
 * Cuba REST call:
 *        cubaApp.query("mpg$Car", "carsByType", params, fetchOpts);
 *        cubaApp.queryCount("mpg$Car", "carsByType", params, fetchOpts);
 *        cubaApp.queryWithCount("mpg$Car", "carsByType", params, fetchOpts);
 */
export function createQuery(entityName: string, queries: RestQuery[], ctx: ModelContext): CreateItemResult {
  const methodAssignments: PropertyAssignment[] = [];
  const methodParamsTypes: TypeAliasDeclaration[] = [];
  const imports: ImportInfo[] = [];

  const className = findClassName(entityName, ctx);
  const paramTypePrefix = 'queries_' + className;

  //'overload' queries - queries with both same entity and name
  collectMethods(queries).forEach((mwo: MethodWithOverloads) => {

    let paramTypeName: string | undefined = undefined;

    //if any of overloads has params - create special type for it
    if (mwo.methods.some(m => m.params.length > 0)) {
      const {paramTypeNode, importInfos, name} = createMethodParamsType(mwo.methods, paramTypePrefix, ctx);
      imports.push(...importInfos);
      methodParamsTypes.push(paramTypeNode);
      paramTypeName = name;
    }

    ['', 'Count', 'WithCount'].forEach(suffix => {
      const qName = mwo.methodName;
      const cubaCallFunc = cubaAppCallFunc('query' + suffix, paramTypeName, [entityName, qName]);
      methodAssignments.push(ts.createPropertyAssignment(qName + suffix, cubaCallFunc));
    });

  });

  //todo do we need to resolve entities with same names, or entity.name is unique in CUBA  ?

  const node = ts.createPropertyAssignment(className, ts.createObjectLiteral(methodAssignments, true));
  return {node, methodParamsTypes, imports};
}

function findClassName(entityName: string, ctx: ModelContext) {
  const entry = [...ctx.entitiesMap.entries()]
    .find(([, projEntityInfo]) => {
      return projEntityInfo.entity.name == entityName;
    });
  return entry![1].entity.className;
}

