import {RestService} from "../../../common/model/cuba-model";
import * as ts from "typescript";
import {
  ArrowFunction,
  ConciseBody,
  Expression,
  ParameterDeclaration,
  PropertyAssignment,
  TypeAliasDeclaration, TypeNode,
  VariableStatement
} from "typescript";
import {renderTSNodes} from "../../../common/ts-helpers";
import {collectMethods, createMethodParamsType, MethodWithOverloads} from "./method-params-type";
import {createIncludes, importDeclaration, ImportInfo} from "../import-utils";
import {
  CUBA_APP_MODULE_SPEC,
  CUBA_APP_NAME,
  CUBA_APP_TYPE,
  FETCH_OPTIONS_NAME,
  FETCH_OPTIONS_TYPE
} from "../../../common/constants";
import {exportModifier, idn, param, str} from "../../../common/ts-shorthands";
import {ModelContext} from "../model/model-utils";

const REST_SERVICES_VAR_NAME = 'restServices';

export type CreateItemResult = {
  node: PropertyAssignment,
  methodParamsTypes: TypeAliasDeclaration[],
  imports: ImportInfo[]
}

export function generateServices(services: RestService[], ctx: ModelContext): string {
  const importDec = importDeclaration([CUBA_APP_TYPE, FETCH_OPTIONS_TYPE], CUBA_APP_MODULE_SPEC);
  const servicesResult = createServices(services, ctx);
  const includes = createIncludes(servicesResult.importInfos);
  return renderTSNodes(
    [importDec, ...includes, ...servicesResult.paramTypes, servicesResult.servicesNode],
    '\n\n');
}

function createServices(services: RestService[], ctx: ModelContext)
  : { servicesNode: VariableStatement, paramTypes: TypeAliasDeclaration[], importInfos: ImportInfo[] } {

  const assignmentList: PropertyAssignment[] = [];
  const paramTypes: TypeAliasDeclaration[] = [];
  const importInfos: ImportInfo[] = [];

  services
    .reduce((acc: RestService[], curr: RestService) => {
      if (!acc.find(restService => restService.name === curr.name)) acc.push(curr);
      return acc;
    }, [] as RestService[])
    .forEach(srv => {
    const createItemResult = createService(srv, ctx);
    assignmentList.push(createItemResult.node);
    createItemResult.methodParamsTypes.forEach(mpt => paramTypes.push(mpt));
    importInfos.push(...createItemResult.imports);
  });

  const variableDeclaration = ts.createVariableDeclaration(
    REST_SERVICES_VAR_NAME,
    undefined,
    ts.createObjectLiteral(assignmentList, true));

  const servicesNode = ts.createVariableStatement([exportModifier()], [variableDeclaration]);
  return {servicesNode, paramTypes, importInfos};
}


export function createService(service: RestService, ctx: ModelContext): CreateItemResult {
  const methodAssignments: PropertyAssignment[] = [];
  const methodParamsTypes: TypeAliasDeclaration[] = [];
  const imports: ImportInfo[] = [];
  const serviceName = service.name;

  collectMethods(service.methods).forEach((mwo: MethodWithOverloads) => {

    let paramTypeName: string | undefined = undefined;

    //if any of overloads has params - create special type for it
    if (mwo.methods.some(m => m.params.length > 0)) {
      const {paramTypeNode, importInfos, name} = createMethodParamsType(mwo.methods, serviceName, ctx);
      imports.push(...importInfos);
      methodParamsTypes.push(paramTypeNode);
      paramTypeName = name;
    }

    const cubaCallFunc = cubaAppCallFunc('invokeService', paramTypeName, undefined, [serviceName, mwo.methodName], []);
    methodAssignments.push(ts.createPropertyAssignment(mwo.methodName, cubaCallFunc));
  });

  const node = ts.createPropertyAssignment(serviceName, ts.createObjectLiteral(methodAssignments, true));
  return {node, methodParamsTypes, imports};

}

export function cubaAppCallFunc(method: string,
                                paramTypeName: string | undefined,
                                functionType: TypeNode | undefined,
                                cubaAppCallParams: string[],
                                typeArguments: TypeNode[]): ArrowFunction {

  const methodSubBody: ConciseBody = arrowFunc(
    paramTypeName ? [param('params', paramTypeName)] : [],
    functionType,
    cubaAppMethodCall(method, cubaAppCallParams, paramTypeName != null, typeArguments));

  return arrowFunc(
    [param(CUBA_APP_NAME, CUBA_APP_TYPE), param(FETCH_OPTIONS_NAME + '?', FETCH_OPTIONS_TYPE)],
    undefined,
    methodSubBody);
}

function cubaAppMethodCall(methodName: string, signature: string[], withParams: boolean, typeArguments: TypeNode[]) {
  const argumentsArray: Expression[] = signature.map(s => str(s));
  argumentsArray.push(withParams ? idn('params') : idn('{}'));
  argumentsArray.push(idn(FETCH_OPTIONS_NAME));

  return ts.createBlock(
    [ts.createReturn(
      ts.createCall(
        ts.createPropertyAccess(idn(CUBA_APP_NAME), idn(methodName)), typeArguments, argumentsArray))
    ],
    true);
}

export function arrowFunc(parameters: ParameterDeclaration[], functionType: TypeNode | undefined,
                          body: ConciseBody): ArrowFunction {

  return ts.createArrowFunction(undefined, undefined, parameters, functionType, undefined, body);
}
