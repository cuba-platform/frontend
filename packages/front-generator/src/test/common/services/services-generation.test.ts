import {createService, generateServices} from "../../../common/services/services-generation";
import {renderTSNodes} from "../../../common/model/ts-helpers";
import {collectMethods, createMethodParamsType} from "../../../common/services/method-params-type";
import {RestService} from "../../../common/model/cuba-model";
import {assertContent} from "../../generator.test";
import * as assert from "assert";

const servicesModel: RestService[] = require('./../../fixtures/service-model.json');

describe('generate TS REST service', () => {
  it('should generate rest service TS assignment from CUBA model', function () {
    const restService = servicesModel[0];
    const service = createService(restService);
    const expected = '' +
      `mpg_FavoriteService: {
        addFavorite: (cubaApp: CubaApp) => (params: mpg_FavoriteService_addFavorite_params) => {
            return cubaApp.invokeService("mpg_FavoriteService", "addFavorite", params);
        },
        getFavorites: (cubaApp: CubaApp) => () => {
            return cubaApp.invokeService("mpg_FavoriteService", "getFavorites", {});
        }
    }`;

    const content = renderTSNodes([service.serviceNode]);
    assertContent(content, expected);
  });

  it('should generate rest service methods param types', function () {
    const restService = servicesModel[0];
    const service = createService(restService);
    const expected = '' +
      `export type mpg_FavoriteService_addFavorite_params = {
          carId: any;
          notes: any;
      } | {
          car: any;
          notes: any;
      } | {
          favInfo: any;
      };`;
    const content = renderTSNodes(service.methodParamsTypes);
    assertContent(content, expected)

  });

  it('should generate all rest services from CUBA model', function () {
    const expected = '' +
      `import {CubaApp} from "@cuba-platform/rest";

      export type mpg_FavoriteService_addFavorite_params = {
          carId: any;
          notes: any;
      } | {
          car: any;
          notes: any;
      } | {
          favInfo: any;
      };

      export var restServices = {
          mpg_FavoriteService: {
              addFavorite: (cubaApp: CubaApp) => (params: mpg_FavoriteService_addFavorite_params) => {
                  return cubaApp.invokeService("mpg_FavoriteService", "addFavorite", params);
              },
              getFavorites: (cubaApp: CubaApp) => () => {
                  return cubaApp.invokeService("mpg_FavoriteService", "getFavorites", {});
              }
          },
          mpg_TestService: {
              getTestInfo: (cubaApp: CubaApp) => () => {
                  return cubaApp.invokeService("mpg_TestService", "getTestInfo", {});
              }
          }
      };`;

    const content = generateServices(servicesModel);
    assertContent(content, expected);
  });

  it('should collect overload methods for service', function () {
    const methodWithOverloadsList = collectMethods([servicesModel[0]]);
    assert.strictEqual(3, methodWithOverloadsList[0].methods.length);
  });

  it('should generate rest method params type', function () {
    const restService = servicesModel[0];
    const methodWithOverloadsList = collectMethods([restService]);
    const expect = '' +
      `export type mpg_FavoriteService_addFavorite_params = {
          carId: any;
          notes: any;
      } | {
          car: any;
          notes: any;
      } | {
          favInfo: any;
      };`;

    const content = createMethodParamsType(methodWithOverloadsList[0].methods, restService.name);
    assertContent(renderTSNodes([content]), expect);
  });
});
