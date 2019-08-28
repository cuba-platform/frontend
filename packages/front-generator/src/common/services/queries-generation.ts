import {RestQuery} from "../model/cuba-model";
import {ModelContext} from "../model/model-utils";
import {createMethodParamsType} from "./method-params-type";
import * as ts from "typescript";
import {PropertyAssignment, TypeAliasDeclaration} from "typescript";
import {ImportInfo} from "../import-utils";
import {cubaAppCallFunc} from "./services-generation";

// export function createQueries() {
//   const queriesByEntity: Map<string, RestQuery[]> = new Map();
// }

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
export function createQuery(entityName: string, queries: RestQuery[], ctx: ModelContext) {
  const methodAssignments: PropertyAssignment[] = [];
  const methodParamsTypes: TypeAliasDeclaration[] = [];
  const imports: ImportInfo[] = [];

  const className = findClassName(entityName, ctx);
  const paramTypePrefix = 'queries_' + className;

  //todo 'overload' query - queries with same name

  queries.forEach((query: RestQuery) => {

    let paramTypeName : string | undefined = undefined;

    //if has params - create special type for it
    if (query.params.length > 0) {
      const {paramTypeNode, importInfos, name} = createMethodParamsType([query], paramTypePrefix, ctx);
      imports.push(...importInfos);
      methodParamsTypes.push(paramTypeNode);
      paramTypeName = name;
    }

    ['', 'Count', 'WithCount'].forEach(suffix => {
      const cubaCallFunc = cubaAppCallFunc('query' + suffix, paramTypeName, [entityName, query.name]);
      methodAssignments.push(ts.createPropertyAssignment(query.name + suffix, cubaCallFunc));
    });

  });

  //todo do we resolve entities with same names, or entity.name is unique in CUBA  ?

  const node = ts.createPropertyAssignment(className, ts.createObjectLiteral(methodAssignments, true));
  return {node, methodParamsTypes, imports};
}

function findClassName(entityName: string, ctx: ModelContext) {
  const entry = [...ctx.entitiesMap.entries()]
    .find(([, projEntityInfo]) => { return projEntityInfo.entity.name == entityName; });
  return entry![1].entity.className;
}

