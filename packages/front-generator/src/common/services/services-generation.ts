import {RestService, RestServiceMethod} from "../model/cuba-model";
import * as ts from "typescript";
import {ConciseBody, PropertyAssignment, SyntaxKind} from "typescript";
import {renderTSNodes} from "../model/ts-helpers";
import {importDeclaration, param, str} from "../model/model-utils";

const REST_SERVICES_VAR_NAME = 'restServices';
const CUBA_APP_NAME = 'cubaApp';
const CUBA_APP_TYPE = 'CubaApp';
const CUBA_APP_MODULE_SPEC = '@cuba-platform/rest';

export function generateServices(services: RestService[]): string {

  //todo

  const importDec = importDeclaration(`{${CUBA_APP_TYPE}}`, CUBA_APP_MODULE_SPEC);
  return renderTSNodes([importDec, createServices(services)], '\n\n');
}

export function createServices(services: RestService[]) {
  const srvNodes: PropertyAssignment[] = [];
  services.forEach(srv => srvNodes.push(createService(srv)));

  const vd = ts.createVariableDeclaration(
    REST_SERVICES_VAR_NAME,
    undefined,
    ts.createObjectLiteral(srvNodes, true));

  return ts.createVariableStatement([
    ts.createToken(ts.SyntaxKind.ExportKeyword)
  ], [vd]);
}

export function createService(restService: RestService): PropertyAssignment {
  // //todo resolve methods with similar name
  const props: PropertyAssignment[] = [];

  restService.methods
    .reduce((acc, currentValue) => {
        return acc.find(a => a.name == currentValue.name) ? acc : [... acc, currentValue]
      },
      [] as RestServiceMethod[])
    .forEach(method => {

      const funcBody = ts.createBlock(
        [
          ts.createReturn(createInvokeServiceCall(restService.name, method.name))
        ],
        true);

      const arrowFuncNext: ConciseBody = ts.createArrowFunction(
        undefined,
        undefined,
        [param('params', 'any')],
        undefined,
        ts.createToken(SyntaxKind.EqualsGreaterThanToken),
        funcBody);

      const arrowFunc = ts.createArrowFunction(
        undefined,
        undefined,
        [param(CUBA_APP_NAME, CUBA_APP_TYPE)],
        undefined,
        ts.createToken(SyntaxKind.EqualsGreaterThanToken),
        arrowFuncNext);

      props.push(ts.createPropertyAssignment(method.name, arrowFunc))
    });

  return ts.createPropertyAssignment(
    restService.name,
    ts.createObjectLiteral(props, true));
}

function createInvokeServiceCall(serviceName: string, methodName: string) {
  const argumentsArray = [str(serviceName), str(methodName), ts.createIdentifier('params')];
  return ts.createCall(ts.createIdentifier(`${CUBA_APP_NAME}.invokeService`), undefined, argumentsArray);
}

