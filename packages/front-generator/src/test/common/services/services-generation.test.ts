import {createService, generateServices} from "../../../common/services/services-generation";
import {renderTSNodes} from "../../../common/model/ts-helpers";
import {
  collectMethods,
  createMethodParamsType,
  ParamTypeInfo,
  parseParamType
} from "../../../common/services/method-params-type";
import {Entity, Enum, RestService} from "../../../common/model/cuba-model";
import {assertContent} from "../../generator.test";
import * as assert from "assert";
import {collectModelContext, ModelContext} from "../../../common/model/model-utils";
import {isImportEquals} from "../../../common/import-utils";

const servicesModel: RestService[] = require('./../../fixtures/service-model.json');
const enumsModel: Enum[] = require('../../enums-model.json');
const enumsModelWithDuplicates: Enum[] = require('../../enums-model--identical-names.json');
const entityModel: Entity = require('./../../entity-model.json');
const baseEntityModel: Entity = require('../../fixtures/base-entity-model.json');


describe('generate TS REST service', () => {
  it('should generate rest service TS assignment from CUBA model', function () {
    const restService = servicesModel[0];
    const service = createService(restService, modelCtx());
    const expected = '' +
      `mpg_FavoriteService: {
        addFavorite: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (params: mpg_FavoriteService_addFavorite_params) => {
            return cubaApp.invokeService("mpg_FavoriteService", "addFavorite", params, fetchOpts);
        },
        getFavorites: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => () => {
            return cubaApp.invokeService("mpg_FavoriteService", "getFavorites", {}, fetchOpts);
        }
    }`;

    const content = renderTSNodes([service.serviceNode]);
    assertContent(content, expected);
  });

  it('should generate rest service methods param types', function () {
    const restService = servicesModel[0];
    const service = createService(restService, modelCtx());
    const expected = '' +
      `export type mpg_FavoriteService_addFavorite_params = {
          carId: string;
          notes: string;
      } | {
          car: Car;
          notes: string;
      } | {
          favInfo: any;
      };`;
    const content = renderTSNodes(service.methodParamsTypes);
    assertContent(content, expected)
  });

  it('should generate all rest services from CUBA model', function () {
    const expected = '' +
      `import { CubaApp, FetchOptions } from "@cuba-platform/rest";
      import { Car } from "./entities/mpg$Car";
      
      export type mpg_FavoriteService_addFavorite_params = {
          carId: string;
          notes: string;
      } | {
          car: Car;
          notes: string;
      } | {
          favInfo: any;
      };

      export var restServices = {
          mpg_FavoriteService: {
              addFavorite: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (params: mpg_FavoriteService_addFavorite_params) => {
                  return cubaApp.invokeService("mpg_FavoriteService", "addFavorite", params, fetchOpts);
              },
              getFavorites: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => () => {
                  return cubaApp.invokeService("mpg_FavoriteService", "getFavorites", {}, fetchOpts);
              }
          },
          mpg_TestService: {
              getTestInfo: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => () => {
                  return cubaApp.invokeService("mpg_TestService", "getTestInfo", {}, fetchOpts);
              }
          }
      };`;

    const content = generateServices(servicesModel, modelCtx());
    assertContent(content, expected);
  });

  it('should collect overload methods for service', function () {
    const methodWithOverloadsList = collectMethods([servicesModel[0]]);
    assert.strictEqual(3, methodWithOverloadsList[0].methods.length);
  });

  it('should generate rest method params type', function () {
    const restService = servicesModel[0];
    const methodWithOverloadsList = collectMethods([restService]);
    const ctx = collectModelContext({entities: [entityModel], enums: enumsModel} as any);
    const expect = '' +
      `export type mpg_FavoriteService_addFavorite_params = {
          carId: string;
          notes: string;
      } | {
          car: Car;
          notes: string;
      } | {
          favInfo: any;
      };`;

    const content = createMethodParamsType(methodWithOverloadsList[0].methods, restService.name, ctx);
    assertContent(renderTSNodes([content.paramTypeNode]), expect);
  });

  it('should parse service parameter type', function () {
    let ctx = collectModelContext({
      entities: [entityModel], baseProjectEntities: [baseEntityModel], enums: enumsModelWithDuplicates
    } as any);

    let param = {name: 'car', type: 'com.company.mpg.entity.Car'};
    let paramTypeInfo = parseParamType(param, ctx);
    assertParamType(paramTypeInfo, 'Car', 'Car', './entities/mpg$Car');

    param = {name: 'folder', type: 'com.haulmont.cuba.core.entity.Folder'};
    paramTypeInfo = parseParamType(param, ctx);
    assertParamType(paramTypeInfo, 'Folder', 'Folder', './entities/base/sys$Folder');

    param = {name: 'carId', type: 'java.util.UUID'};
    paramTypeInfo = parseParamType(param, ctx);
    assertParamType(paramTypeInfo, 'string');

    param = {name: 'carType', type: 'com.company.mpg.entity.CarType'};
    paramTypeInfo = parseParamType(param, ctx);
    assertParamType(paramTypeInfo, 'com_company_mpg_entity_CarType',
      'com_company_mpg_entity_CarType', './enums/enums');

    ctx = modelCtx();

    param = {name: 'carType', type: 'com.company.mpg.entity.CarType'};
    paramTypeInfo = parseParamType(param, ctx);
    assertParamType(paramTypeInfo, 'CarType', 'CarType', './enums/enums');

    param = {name: 'date', type: 'java.util.Date'};
    paramTypeInfo = parseParamType(param, ctx);
    assertParamType(paramTypeInfo, 'any');
  });
});

function assertParamType(paramTypeInfo: ParamTypeInfo, typeNode: string, className?: string, importPath?: string) {
  assert.strictEqual(renderTSNodes([paramTypeInfo.typeNode], ''), typeNode);
  if (className && importPath) assert(isImportEquals(paramTypeInfo.importInfo, {className, importPath}))
}

function modelCtx(): ModelContext {
  return collectModelContext({entities: [entityModel], enums: enumsModel} as any);
}


