import {RestService} from "../model/cuba-model";
import * as ts from "typescript";
import {
  ArrowFunction,
  ConciseBody,
  Expression,
  ParameterDeclaration,
  PropertyAssignment,
  TypeAliasDeclaration, VariableStatement
} from "typescript";
import {renderTSNodes} from "../model/ts-helpers";
import {exportModifier, importDeclaration, param, str} from "../model/model-utils";
import {restServices} from "../../../test/e2e/generated/sdk/services";
import {collectMethods, createMethodParamsType, createServiceCallParams} from "./method-params-type";

const REST_SERVICES_VAR_NAME = 'restServices';
const CUBA_APP_NAME = 'cubaApp';
const CUBA_APP_TYPE = 'CubaApp';
const CUBA_APP_MODULE_SPEC = '@cuba-platform/rest';

export type CreateServiceResult = {
  serviceNode: PropertyAssignment,
  methodParamsTypes: TypeAliasDeclaration[]
}

export function generateServices(services: RestService[]): string {
  const importDec = importDeclaration(`{${CUBA_APP_TYPE}}`, CUBA_APP_MODULE_SPEC);
  const servicesResult = createServices(services);
  return renderTSNodes([importDec, ...servicesResult.paramTypes, servicesResult.servicesNode], '\n\n');
}

export function createServices(services: RestService[])
  : { servicesNode: VariableStatement, paramTypes: TypeAliasDeclaration[] } {

  const serviceAssignmentList: PropertyAssignment[] = [];
  const paramTypes: TypeAliasDeclaration[] = [];

  services.forEach(srv => {
    const createServiceResult = createService(srv);
    serviceAssignmentList.push(createServiceResult.serviceNode);
    createServiceResult.methodParamsTypes.forEach(mpt => paramTypes.push(mpt));
  });

  const variableDeclaration = ts.createVariableDeclaration(
    REST_SERVICES_VAR_NAME,
    undefined,
    ts.createObjectLiteral(serviceAssignmentList, true));

  const servicesNode = ts.createVariableStatement([exportModifier()], [variableDeclaration]);
  return {servicesNode, paramTypes};
}

export function createService(service: RestService): CreateServiceResult {

  const methodWithOverloadsList = collectMethods([service]);
  const methodAssignments: PropertyAssignment[] = [];
  const methodParamsTypes: TypeAliasDeclaration[] = [];
  const serviceName = service.name;

  methodWithOverloadsList.forEach(method => {

    const hasParams = method.methods.some(m => m.params.length > 0);

    const methodSubBody: ConciseBody = arrowFunc(
      hasParams ? createServiceCallParams(method.methodName, serviceName) : [],
      createInvokeServiceCall(serviceName, method.methodName, hasParams));

    const methodBody = arrowFunc(
      [param(CUBA_APP_NAME, CUBA_APP_TYPE)],
      methodSubBody);

    methodAssignments.push(ts.createPropertyAssignment(method.methodName, methodBody));
    if (hasParams) methodParamsTypes.push(createMethodParamsType(method.methods, serviceName));
  });

  const serviceNode = ts.createPropertyAssignment(
    serviceName,
    ts.createObjectLiteral(methodAssignments, true));

  return {serviceNode, methodParamsTypes}
}

function createInvokeServiceCall(serviceName: string, methodName: string, hasParams: boolean) {
  const argumentsArray: Expression[] = [str(serviceName), str(methodName)];
  argumentsArray.push(hasParams ? ts.createIdentifier('params') : ts.createIdentifier('{}'));

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


