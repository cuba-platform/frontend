import {createService, generateServices} from "../../../../generators/sdk/services/services-generation";
import {renderTSNodes} from "../../../../common/ts-helpers";
import {collectMethods} from "../../../../generators/sdk/services/method-params-type";
import {RestService} from "../../../../common/model/cuba-model";
import * as assert from "assert";
import {assertContent, modelCtx} from "../../../test-commons";

const servicesModel: RestService[] = require('../../../fixtures/service-model.json');

const expectedRestServices = '' +
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

describe('generate TS REST service', () => {
  it('should generate rest service TS assignment from CUBA model', () => {
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

    const content = renderTSNodes([service.node]);
    assertContent(content, expected);
  });

  it('should generate rest service methods param types', () => {
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

  it('should generate all rest services from CUBA model', () => {
    const content = generateServices(servicesModel, modelCtx());
    assertContent(content, expectedRestServices);
  });

  it('should sort out duplicate rest services', () => {
    const servicesModelWithDuplicates: RestService[] = [];
    servicesModelWithDuplicates.push(servicesModel[0]);
    servicesModelWithDuplicates.push(servicesModel[0]);
    servicesModelWithDuplicates.push(servicesModel[1]);

    const content = generateServices(servicesModelWithDuplicates, modelCtx());
    assertContent(content, expectedRestServices);
  });

  it('should collect overload methods for service', () => {
    const methodWithOverloadsList = collectMethods(servicesModel[0].methods);
    assert.strictEqual(3, methodWithOverloadsList[0].methods.length);
  });


});



