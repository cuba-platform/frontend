import {createEntityClass, ProjectEntityInfo} from "../../../../generators/sdk/model/entities-generation";
import {assertContent, createTestProjectEntityInfo} from "../../../test-commons";

import {EnumDeclaration} from "typescript";
import {Entity} from "../../../../common/model/cuba-model";
import {renderTSNodes} from "../../../../common/ts-helpers";
import {createIncludes} from "../../../../generators/sdk/import-utils";

const entityModel: Entity = require('../../../fixtures/entity-model.json');
const projectModel = require('../../../fixtures/project-model--scr.json');

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

  it('should create an Integer ID entity class', () => {
    const integerIdEntityModel = projectModel.entities.find((e: any) => e.name === 'scr_IntegerIdTestEntity');

    const classTsNode = createEntityClass({
      entity: integerIdEntityModel,
      entitiesMap: new Map<string, ProjectEntityInfo>(),
      enumsMap: new Map<string, EnumDeclaration>(),
      isBaseProjectEntity: false
    });
    let content = renderTSNodes([classTsNode.classDeclaration]);

    let expected =
      `export class IntegerIdTestEntity {
        static NAME = "scr_IntegerIdTestEntity";
        description?: string | null;
        createTs?: any | null;
        createdBy?: string | null;
        updateTs?: any | null;
        updatedBy?: string | null;
        deleteTs?: any | null;
        deletedBy?: string | null;
        version?: number | null;
        datatypesTestEntity3?: any | null;
        datatypesTestEntities?: any | null;
      }`;
      assertContent(content, expected);
  });

  it('should create a String ID entity class', () => {
    const stringIdEntityModel = projectModel.entities.find((e: any) => e.name === 'scr_StringIdTestEntity');

    const classTsNode = createEntityClass({
      entity: stringIdEntityModel,
      entitiesMap: new Map<string, ProjectEntityInfo>(),
      enumsMap: new Map<string, EnumDeclaration>(),
      isBaseProjectEntity: false
    });
    let content = renderTSNodes([classTsNode.classDeclaration]);

    let expected =
      `export class StringIdTestEntity {
        static NAME = "scr_StringIdTestEntity";
        id?: string;
        description?: string | null;
        productCode?: string | null;
        createTs?: any | null;
        createdBy?: string | null;
        updateTs?: any | null;
        updatedBy?: string | null;
        deleteTs?: any | null;
        deletedBy?: string | null;
        version?: number | null;
        datatypesTestEntity?: any | null;
        datatypesTestEntity3?: any | null;
      }`;
    assertContent(content, expected);
  });

  it('should create a class for a String ID entity that has an attribute named `id` ' +
    'but the actual ID attribute has a different name', () => {
    const weirdStringIdEntityModel =
      projectModel.entities.find((e: any) => e.name === 'scr_WeirdStringIdTestEntity');

    const classTsNode = createEntityClass({
      entity: weirdStringIdEntityModel,
      entitiesMap: new Map<string, ProjectEntityInfo>(),
      enumsMap: new Map<string, EnumDeclaration>(),
      isBaseProjectEntity: false
    });
    let content = renderTSNodes([classTsNode.classDeclaration]);

    let expected =
      `export class WeirdStringIdTestEntity {
        static NAME = "scr_WeirdStringIdTestEntity";
        id?: string;
        description?: string | null;
        createTs?: any | null;
        createdBy?: string | null;
        updateTs?: any | null;
        updatedBy?: string | null;
        deleteTs?: any | null;
        deletedBy?: string | null;
        version?: number | null;
        datatypesTestEntity3?: any | null;
      }`;
    assertContent(content, expected);
  });
});

function fillEntitiesMap(classNames: string[], baseClassNames: string[]): Map<string, ProjectEntityInfo> {
  const entitiesMap = new Map<string, ProjectEntityInfo>();
  classNames.forEach(en => entitiesMap.set(en, createTestProjectEntityInfo(en)));
  baseClassNames.forEach(en => entitiesMap.set(en, createTestProjectEntityInfo(en, true)));
  return entitiesMap;
}
