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
import {collectMethods, createMethodParamsType, createServiceCallParams} from "./method-params-type";
import {createIncludes, importDeclaration, ImportInfo} from "../import-utils";

const REST_SERVICES_VAR_NAME = 'restServices';
const CUBA_APP_NAME = 'cubaApp';
const CUBA_APP_TYPE = 'CubaApp';
const FETCH_OPTIONS_TYPE = 'FetchOptions';
const FETCH_OPTIONS_NAME = 'fetchOpts';
const CUBA_APP_MODULE_SPEC = '@cuba-platform/rest';

export type CreateServiceResult = {
  serviceNode: PropertyAssignment,
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
    serviceAssignmentList.push(createServiceResult.serviceNode);
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

  const methodWithOverloadsList = collectMethods([service]);
  const methodAssignments: PropertyAssignment[] = [];
  const methodParamsTypes: TypeAliasDeclaration[] = [];
  const imports: ImportInfo[] = [];
  const serviceName = service.name;

  methodWithOverloadsList.forEach(method => {

    const hasParams = method.methods.some(m => m.params.length > 0);

    const methodSubBody: ConciseBody = arrowFunc(
      hasParams ? createServiceCallParams(method.methodName, serviceName) : [],
      createInvokeServiceCall(serviceName, method.methodName, hasParams));

    const methodBody = arrowFunc(
      [param(CUBA_APP_NAME, CUBA_APP_TYPE), param(FETCH_OPTIONS_NAME + '?', FETCH_OPTIONS_TYPE)],
      methodSubBody);

    methodAssignments.push(ts.createPropertyAssignment(method.methodName, methodBody));
    if (hasParams) {
      const {paramTypeNode, importInfos} = createMethodParamsType(method.methods, serviceName, ctx);
      imports.push(...importInfos);
      methodParamsTypes.push(paramTypeNode);
    }
  });

  const serviceNode = ts.createPropertyAssignment(
    serviceName,
    ts.createObjectLiteral(methodAssignments, true));

  return {serviceNode, methodParamsTypes, imports};
}

function createInvokeServiceCall(serviceName: string, methodName: string, hasParams: boolean) {
  const argumentsArray: Expression[] = [str(serviceName), str(methodName)];
  argumentsArray.push(hasParams ? ts.createIdentifier('params') : ts.createIdentifier('{}'));
  argumentsArray.push(ts.createIdentifier(FETCH_OPTIONS_NAME));

  return ts.createBlock(
    [ts.createReturn(
      ts.createCall(
        ts.createIdentifier(`${CUBA_APP_NAME}.invokeService`), undefined, argumentsArray))
    ],
    true);
}

function arrowFunc(parameters: ParameterDeclaration[], body: ConciseBody): ArrowFunction {
  return ts.createArrowFunction(undefined, undefined, parameters, undefined, undefined, body);
}


