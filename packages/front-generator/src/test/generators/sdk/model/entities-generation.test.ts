import {createEntityClass, ProjectEntityInfo} from "../../../../generators/sdk/model/entities-generation";
import {assertContent, createTestProjectEntityInfo} from "../../../test-commons";

import {EnumDeclaration} from "typescript";
import {Entity} from "../../../../common/model/cuba-model";
import {renderTSNodes} from "../../../../common/ts-helpers";
import {createIncludes} from "../../../../generators/sdk/import-utils";

const entityModel: Entity = require('../../../fixtures/entity-model.json');


describe('generate TS entity', function () {

  it('should create entity class', function () {
    const enMap = fillEntitiesMap([
        'com.company.mpg.entity.Garage',
        'com.company.mpg.entity.TechnicalCertificate',
      ],
      ['com.haulmont.cuba.core.entity.FileDescriptor']);

    const enumsMap = new Map<string, EnumDeclaration>();
    enumsMap.set('com.company.mpg.entity.CarType', {name: {text: 'CarType'}} as any);
    enumsMap.set('com.company.mpg.entity.EcoRank', {name: {text: 'EcoRank'}} as any);

    const classTsNode = createEntityClass({
      entity: entityModel,
      entitiesMap: enMap,
      enumsMap,
      isBaseProjectEntity: false
    });
    let content = renderTSNodes([classTsNode.classDeclaration]);

    let expected = '' +
      `export class Car {
      static NAME = "mpg$Car";
      manufacturer?: string | null;
      model?: string | null;
      regNumber?: string | null;
      purchaseDate?: any | null;
      wheelOnRight?: boolean | null;
      carType?: CarType | null;
      ecoRank?: EcoRank | null;
      garage?: Garage | null;
      maxPassengers?: number | null;
      price?: any | null;
      mileage?: any | null;
      technicalCertificate?: TechnicalCertificate | null;
      photo?: FileDescriptor | null;
    }`;
    assertContent(content, expected);

    const includes = createIncludes(classTsNode.importInfos, undefined);
    content = renderTSNodes(includes);
    expected = '' +
      `import { CarType, EcoRank } from "../enums/enums";
      import { Garage } from "./mpg$Garage";
      import { TechnicalCertificate } from "./mpg$TechnicalCertificate";
      import { FileDescriptor } from "./sys$FileDescriptor";`;

    assertContent(content, expected);
  });
});

function fillEntitiesMap(classNames: string[], baseClassNames: string[]): Map<string, ProjectEntityInfo> {
  const entitiesMap = new Map<string, ProjectEntityInfo>();
  classNames.forEach(en => entitiesMap.set(en, createTestProjectEntityInfo(en)));
  baseClassNames.forEach(en => entitiesMap.set(en, createTestProjectEntityInfo(en, true)));
  return entitiesMap;
}
