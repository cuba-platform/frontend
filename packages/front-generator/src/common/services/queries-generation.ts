import {RestQuery} from "../model/cuba-model";
import {ModelContext, param} from "../model/model-utils";
import {createMethodParamsType} from "./method-params-type";
import * as ts from "typescript";
import {ConciseBody, PropertyAssignment, TypeAliasDeclaration} from "typescript";
import {ImportInfo} from "../import-utils";
import {arrowFunc, createServiceCallParams, cubaAppMethodCall} from "./services-generation";
import {CUBA_APP_NAME, CUBA_APP_TYPE, FETCH_OPTIONS_NAME, FETCH_OPTIONS_TYPE} from "../common";

// todo query count

// export function createQueries() {
//   const queriesByEntity: Map<string, RestQuery[]> = new Map();
// }

/**
 * Call example: restQueries.Car.carsByType(cubaApp, fetchOpts?)(params?)
 * Cuba REST call: cubaApp.query("mpg$Car", "carsByType", params, fetchOpts);
 */
export function createQuery(entityName: string, queries: RestQuery[], ctx: ModelContext) {
  const methodAssignments: PropertyAssignment[] = [];
  const methodParamsTypes: TypeAliasDeclaration[] = [];
  const imports: ImportInfo[] = [];

  const className = findClassName(entityName, ctx);
  const paramTypeName = 'queries_' + className;

  //todo 'overload' query - queries with same name

  queries.forEach((query: RestQuery) => {

    const hasParams = query.params.length > 0;

    const methodSubBody: ConciseBody = arrowFunc(
      hasParams ? createServiceCallParams(query.name, paramTypeName) : [],
      cubaAppMethodCall('query', [entityName, query.name], hasParams));

    const methodBody = arrowFunc(
      [param(CUBA_APP_NAME, CUBA_APP_TYPE), param(FETCH_OPTIONS_NAME + '?', FETCH_OPTIONS_TYPE)],
      methodSubBody);

    methodAssignments.push(ts.createPropertyAssignment(query.name, methodBody));
    if (hasParams) {
      const {paramTypeNode, importInfos} = createMethodParamsType([query], paramTypeName, ctx);
      imports.push(...importInfos);
      methodParamsTypes.push(paramTypeNode);
    }
  });

  //todo do we resolve entities with same names, or entity.name is unique in CUBA  ?

  const node = ts.createPropertyAssignment(
    className,
    ts.createObjectLiteral(methodAssignments, true));

  return {node, methodParamsTypes, imports};
}

function findClassName(entityName: string, ctx: ModelContext) {
  const entry = [...ctx.entitiesMap.entries()].find(([, projEntityInfo]) => { return projEntityInfo.entity.name == entityName; });
  return entry![1].entity.className;
}

