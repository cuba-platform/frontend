import {RestQuery} from "../../../common/model/cuba-model";
import {collectMethods, createMethodParamsType, MethodWithOverloads} from "./method-params-type";
import * as ts from "typescript";
import {ImportDeclaration, PropertyAssignment, TypeAliasDeclaration, TypeNode} from "typescript";
import {createIncludes, entityImportInfo, importDeclaration, ImportInfo} from "../import-utils";
import {CreateItemResult, cubaAppCallFunc} from "./services-generation";
import {
  CUBA_APP_MODULE_SPEC,
  CUBA_APP_TYPE,
  ENTITIES_DIR,
  ENTITIES_WITH_COUNT_TYPE,
  FETCH_OPTIONS_TYPE,
  SERIALIZED_ENTITY_TYPE
} from "../../../common/constants";
import {renderTSNodes} from "../../../common/ts-helpers";
import {exportModifier} from "../../../common/ts-shorthands";
import {findEntityByName, ModelContext} from "../model/model-utils";
import {ProjectEntityInfo} from "../model/entities-generation";

const QUERIES_VAR_NAME = 'restQueries';

export function generateQueries(restQueries: RestQuery[], ctx: ModelContext): string {

  // import declaration
  // import { CubaApp, FetchOptions, SerializedEntity, EntitiesWithCount } from "@haulmont/jmix-rest";
  const importDec = importDeclaration(
    [CUBA_APP_TYPE, FETCH_OPTIONS_TYPE, SERIALIZED_ENTITY_TYPE, ENTITIES_WITH_COUNT_TYPE],
    CUBA_APP_MODULE_SPEC);

  // compose import infos of entities, entities are used as function type parameters, i.e. 'Car' entity is used as
  // cubaApp.query<Car>("scr$Car", "allCars", {}, fetchOpts);
  const entityImportInfos: ImportInfo[] = restQueries
    .map(restQuery => restQuery.entity)
    .reduce((importInfos: ImportInfo[], entityName: string) => {
        const entityInfo: ProjectEntityInfo | undefined = findEntityByName(entityName, ctx);
        // do not add duplicates
        if (entityInfo && !importInfos.find(ii => ii.className === entityInfo.entity.className)) {
          importInfos.push(entityImportInfo(entityInfo, ENTITIES_DIR));
        }
        return importInfos;
      }
      , []);

  const queriesResult = createQueries(restQueries, ctx);

  // includes composed from import infos of entities + import infos of types, used in parameters, i.e
  //
  // export type queries_FavoriteCar_allCars_params = {
  //  car: Car;
  // };
  const includes: ImportDeclaration[] = createIncludes([...queriesResult.importInfos, ...entityImportInfos]);

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

    const typeArguments: TypeNode[] = [ts.createTypeReferenceNode(className, [])];


    ['', 'Count', 'WithCount'].forEach(suffix => {
      const qName = mwo.methodName;

      let functionType: TypeNode | undefined = undefined;
      // Promise<EntitiesWithCount<ClassName>>
      if (suffix === 'WithCount') functionType = createEntitiesWithCountQueryFunctionType(className);
      // Promise<SerializedEntity<ClassName>[]>
      if (suffix === '') functionType = createSerializedEntityQueryFunctionType(className);
      // Promise<Number>
      if (suffix === 'Count') functionType = createCountQueryFunctionType();

      const cubaCallFunc = cubaAppCallFunc(
        'query' + suffix,
        paramTypeName,
        functionType,
        [entityName, qName],
        suffix !== 'Count' ? typeArguments : []);

      methodAssignments.push(ts.createPropertyAssignment(qName + suffix, cubaCallFunc));
    });

  });

  //todo do we need to resolve entities with same names, or entity.name is unique in CUBA  ?

  const node = ts.createPropertyAssignment(className, ts.createObjectLiteral(methodAssignments, true));
  return {node, methodParamsTypes, imports};
}

/**
 * @param className name used in function type
 * @return 'Promise<SerializedEntity<ClassName>[]>'
 */
function createSerializedEntityQueryFunctionType(className: string): TypeNode {
  const entityClassTypeNode = ts.createTypeReferenceNode(className, []);
  const entityTypeNode = ts.createTypeReferenceNode(SERIALIZED_ENTITY_TYPE, [entityClassTypeNode]);
  const entityArrayTypeNode = ts.createArrayTypeNode(entityTypeNode);
  return ts.createTypeReferenceNode('Promise', [entityArrayTypeNode]);
}

/**
 * @param className name used in function type
 * @return 'Promise<EntitiesWithCount<ClassName>>'
 */
function createEntitiesWithCountQueryFunctionType(className: string): TypeNode {
  const entityClassTypeNode = ts.createTypeReferenceNode(className, []);
  const entityTypeNode = ts.createTypeReferenceNode(ENTITIES_WITH_COUNT_TYPE, [entityClassTypeNode]);
  return ts.createTypeReferenceNode('Promise', [entityTypeNode]);
}

/**
 * @return 'Promise<Number>'
 */
function createCountQueryFunctionType(): TypeNode {
  const numberTypeNode = ts.createTypeReferenceNode('Number', []);
  return ts.createTypeReferenceNode('Promise', [numberTypeNode]);
}

function findClassName(entityName: string, ctx: ModelContext) {
  const entry = [...ctx.entitiesMap.entries()]
    .find(([, projEntityInfo]) => {
      return projEntityInfo.entity.name == entityName;
    });
  return entry![1].entity.className;
}

