import {RestService} from "../model/cuba-model";
import * as ts from "typescript";
import {
  ArrowFunction,
  ConciseBody,
  Expression,
  ParameterDeclaration,
  PropertyAssignment,
  TypeAliasDeclaration,
  VariableStatement
} from "typescript";
import {renderTSNodes} from "../model/ts-helpers";
import {exportModifier, ModelContext, param, str} from "../model/model-utils";
import {restServices} from "../../../test/e2e/generated/sdk/services";
import {collectMethods, createMethodParamsType, MethodWithOverloads} from "./method-params-type";
import {createIncludes, importDeclaration, ImportInfo} from "../import-utils";
import {CUBA_APP_MODULE_SPEC, CUBA_APP_NAME, CUBA_APP_TYPE, FETCH_OPTIONS_NAME, FETCH_OPTIONS_TYPE} from "../common";

const REST_SERVICES_VAR_NAME = 'restServices';

export type CreateServiceResult = {
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

export function createServices(services: RestService[], ctx: ModelContext)
  : { servicesNode: VariableStatement, paramTypes: TypeAliasDeclaration[], importInfos: ImportInfo[] } {

  const serviceAssignmentList: PropertyAssignment[] = [];
  const paramTypes: TypeAliasDeclaration[] = [];
  const importInfos: ImportInfo[] = [];

  services.forEach(srv => {
    const createServiceResult = createService(srv, ctx);
    serviceAssignmentList.push(createServiceResult.node);
    createServiceResult.methodParamsTypes.forEach(mpt => paramTypes.push(mpt));
    importInfos.push(...createServiceResult.imports);
  });

  const variableDeclaration = ts.createVariableDeclaration(
    REST_SERVICES_VAR_NAME,
    undefined,
    ts.createObjectLiteral(serviceAssignmentList, true));

  const servicesNode = ts.createVariableStatement([exportModifier()], [variableDeclaration]);
  return {servicesNode, paramTypes, importInfos};
}


export function createService(service: RestService, ctx: ModelContext): CreateServiceResult {
  const methodAssignments: PropertyAssignment[] = [];
  const methodParamsTypes: TypeAliasDeclaration[] = [];
  const imports: ImportInfo[] = [];
  const serviceName = service.name;

  collectMethods(service.methods).forEach((mwo: MethodWithOverloads) => {

    let paramTypeName : string | undefined = undefined;

    //if any of overloads has params - create special type for it
    if (mwo.methods.some(m => m.params.length > 0)) {
      const {paramTypeNode, importInfos, name} = createMethodParamsType(mwo.methods, serviceName, ctx);
      imports.push(...importInfos);
      methodParamsTypes.push(paramTypeNode);
      paramTypeName = name;
    }

    const cubaCallFunc = cubaAppCallFunc('invokeService', paramTypeName, [serviceName, mwo.methodName]);
    methodAssignments.push(ts.createPropertyAssignment(mwo.methodName, cubaCallFunc));
  });

  const node = ts.createPropertyAssignment(serviceName, ts.createObjectLiteral(methodAssignments, true));
  return {node, methodParamsTypes, imports};

}

export function cubaAppCallFunc(method: string, paramTypeName: string | undefined, cubaAppCallParams: string[]): ArrowFunction {
  const methodSubBody: ConciseBody = arrowFunc(
    paramTypeName ? [param('params', paramTypeName)] : [],
    cubaAppMethodCall(method, cubaAppCallParams, paramTypeName != null));

  return arrowFunc(
    [param(CUBA_APP_NAME, CUBA_APP_TYPE), param(FETCH_OPTIONS_NAME + '?', FETCH_OPTIONS_TYPE)],
    methodSubBody);
}

function cubaAppMethodCall(methodName: string, signature: string[], withParams: boolean) {
  const argumentsArray: Expression[] = signature.map(s => str(s));
  argumentsArray.push(withParams ? ts.createIdentifier('params') : ts.createIdentifier('{}'));
  argumentsArray.push(ts.createIdentifier(FETCH_OPTIONS_NAME));

  return ts.createBlock(
    [ts.createReturn(
      ts.createCall(
        //todo rewrite with ts.createMethodCall
        ts.createIdentifier(`${CUBA_APP_NAME}.${methodName}`), undefined, argumentsArray))
    ],
    true);
}

export function arrowFunc(parameters: ParameterDeclaration[], body: ConciseBody): ArrowFunction {
  return ts.createArrowFunction(undefined, undefined, parameters, undefined, undefined, body);
}
