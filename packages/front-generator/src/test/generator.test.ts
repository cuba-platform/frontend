import {collectClients, generate} from "../init";
import * as assert from "assert";

import {createEntityClass, ProjectEntityInfo} from "../common/model/entities-generation";
import {Entity, Enum} from "../common/model/cuba-model";
import * as path from "path";
import {createEnums} from "../common/model/enums-generation";
import {renderTSNodes} from "../common/model/ts-helpers";
import {EnumDeclaration} from "typescript";
import {createIncludes} from "../common/import-utils";
import {createTestProjectEntityInfo} from "./test-commons";

const enumsModel: Enum[] = require('./enums-model.json');
const entityModel: Entity = require('./entity-model.json');
const enumsModelDuplicates: Enum[] = require('./enums-model--identical-names.json');

const modelPath = require.resolve('../../test/projectModel.json');
const tmpGenerationDir = path.join(process.cwd(), '.tmp');
const {promisify} = require('util');
const rimraf = promisify(require('rimraf'));
const fs = require('fs');

describe('generator', function () {
  it(collectClients.name, async function () {
    const generators = collectClients();
    assert(Array.isArray(generators));
    console.log(generators.reduce((p, gen) => p + gen.name + '\n', ''));
  });

  it('generates Polymer client', function () {
    return generate('polymer2', 'app', {
      model: modelPath,
      dest: path.join(tmpGenerationDir, 'polymer2-app'),
      debug: true
    });
  });

  it('generates React client', function () {
    return generate('react-typescript', 'app', {
      model: modelPath,
      dest: path.join(tmpGenerationDir, 'react-client'),
      debug: true
    });
  });

  it('generates SDK', function () {
    const sdkDir = `${tmpGenerationDir}/sdk`;
    return rimraf(`${sdkDir}/*`)
      .then(() => {
        return generate('sdk', 'all', {
          model: modelPath,
          dest: sdkDir,
          debug: true
        });
      })
      .then(() => {
        assert.ok(fs.existsSync(`${sdkDir}/services.ts`));
        assert.ok(fs.existsSync(`${sdkDir}/queries.ts`));
        assert.ok(fs.existsSync(`${sdkDir}/enums/enums.ts`));
        assert.ok(fs.existsSync(`${sdkDir}/entities/base`));
      });
  })
});

describe('generate TS entity', function () {

  it(createEntityClass.name, function () {
    const enMap = entitiesMap([
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
      `import { CarType, EcoRank } from "./../enums/enums";
      import { Garage } from "./mpg$Garage";
      import { TechnicalCertificate } from "./mpg$TechnicalCertificate";
      import { FileDescriptor } from "./sys$FileDescriptor";`;

    assertContent(content, expected);
  });
});

describe('generate TS enums', () => {
  it(createEnums.name, () => {
    let enums = createEnums(enumsModel);
    let content = renderTSNodes(enums.map(e => e.node));
    const res = 'export enum CarType { SEDAN = "SEDAN", HATCHBACK = "HATCHBACK" } ' +
      'export enum EcoRank { EURO1 = "EURO1", EURO2 = "EURO2", EURO3 = "EURO3" } ';
    assertContent(content, res, false);

    enums = [];
    content = renderTSNodes(enums.map(e => e.node));
    assertContent(content, '');
  });

  it('should resolve enum duplicated names', () => {
    const enums = createEnums(enumsModelDuplicates);
    const content = renderTSNodes(enums.map(e => e.node));

    const expected = '' +
      'export enum com_company_mpg_entity_CarType { SEDAN = "SEDAN", HATCHBACK = "HATCHBACK" } ' +
      'export enum com_company_mpg_entity2_CarType { SEDAN_V2 = "SEDAN_V2", HATCHBACK_V2 = "HATCHBACK_V2" } ' +
      'export enum EcoRank { EURO1 = "EURO1", EURO2 = "EURO2", EURO3 = "EURO3" } ';
    assertContent(expected, content, false);
  });
});

export function assertContent(actual: string, expect: string, multiline: boolean = true) {
  assert.strictEqual(drain(actual, multiline), drain(expect, multiline));
}

function drain(result: string, multiline: boolean = true) {
  return multiline
    ? result
      .replace(/^\s*\n/gm, '')
      .replace(/[ ]{2,}/g, ' ')
      .replace(/\n /g, '\n')
      .trim()
    : result
      .replace(/\n/g, ' ')
      .replace(/ {2,}/g, ' ')
      .trim()
}

function entitiesMap(classNames: string[], baseClassNames: string[]): Map<string, ProjectEntityInfo> {
  const entitiesMap = new Map<string, ProjectEntityInfo>();
  classNames.forEach(en => entitiesMap.set(en, createTestProjectEntityInfo(en)));
  baseClassNames.forEach(en => entitiesMap.set(en, createTestProjectEntityInfo(en, true)));
  return entitiesMap;
}
