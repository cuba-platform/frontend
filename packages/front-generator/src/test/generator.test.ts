import {collectClients, generate} from "../init";
import * as assert from "assert";

import {createEntityClass, ProjectEntityInfo} from "../common/model/entities-generation";
import {Entity, Enum, RestService} from "../common/model/cuba-model";
import * as path from "path";
import {createEnums} from "../common/model/enums-generation";
import {renderTSNodes} from "../common/model/ts-helpers";
import {EnumDeclaration} from "typescript";
import {createService, generateServices} from "../common/services/services-generation";

const enumsModel: Enum[] = require('./enums-model.json');
const entityModel: Entity = require('./entity-model.json');
const enumsModelDuplicates: Enum[] = require('./enums-model--identical-names.json');
const servicesModel: RestService[] = require('./fixtures/service-model.json');

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
    const entitiesMap = new Map<string, ProjectEntityInfo>();
    entitiesMap.set('com.company.mpg.entity.Garage', {type: {className: 'Garage'}} as any);
    entitiesMap.set('com.company.mpg.entity.TechnicalCertificate', {type: {className: 'TechnicalCertificate'}} as any);
    entitiesMap.set('com.haulmont.cuba.core.entity.FileDescriptor', {type: {className: 'FileDescriptor'}} as any);

    const enumsMap = new Map<string, EnumDeclaration>();
    enumsMap.set('com.company.mpg.entity.CarType', {name: 'CarType'} as any);
    enumsMap.set('com.company.mpg.entity.EcoRank', {name: 'EcoRank'} as any);

    const classTsNode = createEntityClass({entity: entityModel, entitiesMap, enumsMap, isBaseProjectEntity: false});
    const content = renderTSNodes([classTsNode.classDeclaration]);

    const expected = '' +
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
    assertContent(expected, content);
  });
});

describe('generate TS enums', () => {
  it(createEnums.name, () => {
    let enums = createEnums(enumsModel);
    let content = renderTSNodes(enums.map(e => e.node));
    const res = 'export enum CarType { SEDAN = "SEDAN", HATCHBACK = "HATCHBACK" } ' +
      'export enum EcoRank { EURO1 = "EURO1", EURO2 = "EURO2", EURO3 = "EURO3" } ';
    assertContent(content, res);

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
    assertContent(expected, content);
  });
});

describe('generate TS REST service', () => {
  it('should generate rest service TS assignment from CUBA model', function () {
    const service = createService(servicesModel[0]);
    const expected = '' +
      `mpg_FavoriteService: {
        addFavorite: (cubaApp: CubaApp) => (params: any) => {
            return cubaApp.invokeService("mpg_FavoriteService", "addFavorite", params);
        },
        getFavorites: (cubaApp: CubaApp) => (params: any) => {
            return cubaApp.invokeService("mpg_FavoriteService", "getFavorites", params);
        }
    }`;

    const content = renderTSNodes([service]);
    assertContent(content, expected);
  });

  it('should generate all rest services from CUBA model', function () {
    const expected = '' +
      `import {CubaApp} from "@cuba-platform/rest";
      export var restServices = {
          mpg_FavoriteService: {
              addFavorite: (cubaApp: CubaApp) => (params: any) => {
                  return cubaApp.invokeService("mpg_FavoriteService", "addFavorite", params);
              },
              getFavorites: (cubaApp: CubaApp) => (params: any) => {
                  return cubaApp.invokeService("mpg_FavoriteService", "getFavorites", params);
              }
          },
           mpg_TestService: {
              getTestInfo: (cubaApp: CubaApp) => (params: any) => {
                  return cubaApp.invokeService("mpg_TestService", "getTestInfo", params);
              }
          }
      };`;

    const content = generateServices(servicesModel);
    assertContent(content, expected);
  });
});

function assertContent(actual: string, expect: string) {
  assert.strictEqual(drain(actual), drain(expect));
}

function drain(result: string) {
  return result.replace(/\n/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}