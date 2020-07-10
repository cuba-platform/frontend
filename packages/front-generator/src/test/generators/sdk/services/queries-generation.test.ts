import {renderTSNodes} from "../../../../common/ts-helpers";
import {RestQuery} from "../../../../common/model/cuba-model";
import {assertContent, createTestProjectEntityInfo, modelCtx} from "../../../test-commons";
import {createQuery, generateQueries} from "../../../../generators/sdk/services/queries-generation";
import {cubaAppCallFunc} from "../../../../generators/sdk/services/services-generation";
import {TypeNode} from "typescript";
import * as ts from "typescript";

const queriesModelCar: RestQuery[] = require('../../../fixtures/query-model-car.json');
const queriesModelFull: RestQuery[] = require('../../../fixtures/query-model-full.json');
const queriesModelOverloads: RestQuery[] = require('../../../fixtures/query-model-overloads.json');


describe('generate TS REST query', () => {
  it('should generate all queries from model', function () {
    const ctx = modelCtx();
    ctx.entitiesMap.set('com.company.mpg.entity.FavoriteCar',
      createTestProjectEntityInfo('com.company.mpg.entity.FavoriteCar'));

    const content = generateQueries(queriesModelFull, ctx);
    const expected = '' +
      `import { CubaApp, FetchOptions, SerializedEntity, EntitiesWithCount } from "@cuba-platform/rest";
      
      import { Car } from "./entities/mpg$Car";
      import { FavoriteCar } from "./entities/mpg$FavoriteCar";
      
      export type queries_Car_ecoCars_params = {
        ecoRank: string;
      };
      
      export type queries_Car_carsByType_params = {
        carType: string;
      };
      
      export type queries_FavoriteCar_allCars_params = {
        car: Car;
      };
      
      export var restQueries = {
        Car: {
          allCars: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (): Promise<SerializedEntity<Car>[]> => {
            return cubaApp.query<Car>("mpg$Car", "allCars", {}, fetchOpts);
          },
          allCarsCount: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (): Promise<Number> => {
            return cubaApp.queryCount("mpg$Car", "allCars", {}, fetchOpts);
          },
          allCarsWithCount: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (): Promise<EntitiesWithCount<Car>> => {
            return cubaApp.queryWithCount<Car>("mpg$Car", "allCars", {}, fetchOpts);
          },
          ecoCars: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (params: queries_Car_ecoCars_params): Promise<SerializedEntity<Car>[]> => {
            return cubaApp.query<Car>("mpg$Car", "ecoCars", params, fetchOpts);
          },
          ecoCarsCount: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (params: queries_Car_ecoCars_params): Promise<Number> => {
            return cubaApp.queryCount("mpg$Car", "ecoCars", params, fetchOpts);
          },
          ecoCarsWithCount: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (params: queries_Car_ecoCars_params): Promise<EntitiesWithCount<Car>> => {
            return cubaApp.queryWithCount<Car>("mpg$Car", "ecoCars", params, fetchOpts);
          },
          carsByType: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (params: queries_Car_carsByType_params): Promise<SerializedEntity<Car>[]> => {
            return cubaApp.query<Car>("mpg$Car", "carsByType", params, fetchOpts);
          },
          carsByTypeCount: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (params: queries_Car_carsByType_params): Promise<Number> => {
            return cubaApp.queryCount("mpg$Car", "carsByType", params, fetchOpts);
          },
          carsByTypeWithCount: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (params: queries_Car_carsByType_params): Promise<EntitiesWithCount<Car>> => {
            return cubaApp.queryWithCount<Car>("mpg$Car", "carsByType", params, fetchOpts);
          }
        },
        FavoriteCar: {
          allCars: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (params: queries_FavoriteCar_allCars_params): Promise<SerializedEntity<FavoriteCar>[]> => {
            return cubaApp.query<FavoriteCar>("mpg$FavoriteCar", "allCars", params, fetchOpts);
          },
          allCarsCount: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (params: queries_FavoriteCar_allCars_params): Promise<Number> => {
            return cubaApp.queryCount("mpg$FavoriteCar", "allCars", params, fetchOpts);
          },
          allCarsWithCount: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (params: queries_FavoriteCar_allCars_params): Promise<EntitiesWithCount<FavoriteCar>> => {
            return cubaApp.queryWithCount<FavoriteCar>("mpg$FavoriteCar", "allCars", params, fetchOpts);
          }
        }
      };`;
    assertContent(content, expected);
  });

  it('should generate rest query TS assignment from CUBA model', function () {

    const queryResult = createQuery(queriesModelCar[0].entity, queriesModelCar, modelCtx());
    const content = renderTSNodes([queryResult.node]);
    const expect = '' +
      `Car: {
        ecoCars: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (): Promise<SerializedEntity<Car>[]> => {
            return cubaApp.query<Car>("mpg$Car", "ecoCars", {}, fetchOpts);
        },
        ecoCarsCount: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (): Promise<Number> => {
            return cubaApp.queryCount("mpg$Car", "ecoCars", {}, fetchOpts);
        },
        ecoCarsWithCount: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (): Promise<EntitiesWithCount<Car>> => {
            return cubaApp.queryWithCount<Car>("mpg$Car", "ecoCars", {}, fetchOpts);
        },
        carsByType: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (params: queries_Car_carsByType_params): Promise<SerializedEntity<Car>[]> => {
            return cubaApp.query<Car>("mpg$Car", "carsByType", params, fetchOpts);
        },
        carsByTypeCount: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (params: queries_Car_carsByType_params): Promise<Number> => {
            return cubaApp.queryCount("mpg$Car", "carsByType", params, fetchOpts);
        },
        carsByTypeWithCount: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (params: queries_Car_carsByType_params): Promise<EntitiesWithCount<Car>> => {
            return cubaApp.queryWithCount<Car>("mpg$Car", "carsByType", params, fetchOpts);
        }
    }`;
    assertContent(content, expect);
  });

  it('should resolve queries overload', function () {
    const content = generateQueries(queriesModelOverloads, modelCtx());
    const expect = '' +
      `import { CubaApp, FetchOptions, SerializedEntity, EntitiesWithCount } from "@cuba-platform/rest";
      import { Car } from "./entities/mpg$Car";
      
      export type queries_Car_ecoCars_params = {} | {
          ecoRank: string;
      } | {
          model: string;
      };
      
      export var restQueries = {
          Car: {
              ecoCars: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (params: queries_Car_ecoCars_params): Promise<SerializedEntity<Car>[]> => {
                  return cubaApp.query<Car>("mpg$Car", "ecoCars", params, fetchOpts);
              },
              ecoCarsCount: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (params: queries_Car_ecoCars_params): Promise<Number> => {
                  return cubaApp.queryCount("mpg$Car", "ecoCars", params, fetchOpts);
              },
              ecoCarsWithCount: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (params: queries_Car_ecoCars_params): Promise<EntitiesWithCount<Car>> => {
                  return cubaApp.queryWithCount<Car>("mpg$Car", "ecoCars", params, fetchOpts);
              }
          }
      };`;
    assertContent(content, expect);
  });

  it('should generate rest query methods param types', function () {
    const queryResult = createQuery(queriesModelCar[0].entity, queriesModelCar, modelCtx());

    const content = renderTSNodes(queryResult.methodParamsTypes);
    const expect = '' +
      `export type queries_Car_carsByType_params = {
          carType: string;
      };`;
    assertContent(content, expect);
  });

  it('should create cuba app query call', function () {
    const paramTypeName = undefined;
    const entityName = 'mpg$Car';
    const qName = 'favoriteCars';
    const typeArguments: TypeNode[] = [ts.createTypeReferenceNode('Car', undefined)];

    // functionType - Promise<SerializedEntity<EntityClass>[]>
    const entityClassTypeNode = ts.createTypeReferenceNode('Car', []);
    const serializedEntityTypeNode = ts.createTypeReferenceNode('SerializedEntity', [entityClassTypeNode]);
    const serializedEntityArrayTypeNode = ts.createArrayTypeNode(serializedEntityTypeNode);
    const functionType: TypeNode = ts.createTypeReferenceNode('Promise', [serializedEntityArrayTypeNode]);

    const content = renderTSNodes([
      cubaAppCallFunc('query', paramTypeName, functionType, [entityName, qName], typeArguments)
    ]);

    const expect = '' +
      `(cubaApp: CubaApp, fetchOpts?: FetchOptions) => (): Promise<SerializedEntity<Car>[]> => {
        return cubaApp.query<Car>("mpg$Car", "favoriteCars", {}, fetchOpts);
      }`;

    assertContent(content, expect);
  });

});