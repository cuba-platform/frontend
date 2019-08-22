import {RestService, RestServiceMethod} from "../model/cuba-model";
import {TypeAliasDeclaration, TypeElement, TypeNode} from "typescript";
import * as ts from "typescript";
import {exportModifier, param} from "../model/model-utils";

/**
 * In model could be methods with same name, but distinct parameters set,
 * we need to resolve this by using parameters type union.
 */
export type MethodWithOverloads = {
  serviceName: string
  methodName: string
  methods: RestServiceMethod[]
}

export function collectMethods(services: RestService[]): MethodWithOverloads[] {
  const methodWithOverloadsList: MethodWithOverloads[] = [];
  services.forEach(s => {
    s.methods.forEach(m => {
      const mwo = methodWithOverloadsList.find(value => value.serviceName == s.name && value.methodName == m.name);
      if (mwo) {
        //method with such name already exist - m is overload, add to methods
        mwo.methods.push(m);
      } else {
        //no methods with such name - create new entry
        methodWithOverloadsList.push({serviceName: s.name, methodName: m.name, methods: [m]});
      }
    })
  });
  return methodWithOverloadsList;
}

export function createMethodParamsType(overloadMethods: RestServiceMethod[], namePrefix: string): TypeAliasDeclaration {

  const typeNodes: TypeNode[] = [];

  overloadMethods.forEach(method => {
    const members: TypeElement[] = [];

    method.params.forEach(p =>
      members.push(ts.createPropertySignature(
        undefined,
        p.name,
        undefined,
        //TODO params type
        ts.createTypeReferenceNode('any', undefined),
        undefined))
    );

    typeNodes.push(ts.createTypeLiteralNode(members));
  });

  return  ts.createTypeAliasDeclaration(
    undefined,
    [exportModifier()],
    methodParamsTypeName(overloadMethods[0].name, namePrefix),
    undefined,
    ts.createUnionTypeNode(typeNodes));

}

export function createServiceCallParams(methodName: string, paramNamePrefix: string) {
  return [param('params', methodParamsTypeName(methodName, paramNamePrefix))];
}

function methodParamsTypeName(methodName: string, namePrefix: string) {
  return  `${namePrefix}_${methodName}_params`;
}