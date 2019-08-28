import {renderTSNodes} from "../../../common/model/ts-helpers";
import {RestQuery} from "../../../common/model/cuba-model";
import {modelCtx} from "../../test-commons";
import {assertContent} from "../../generator.test";
import {createQuery} from "../../../common/services/queries-generation";

const queriesModel: RestQuery[] = require('../../fixtures/query-model.json');


describe('generate TS REST query', () => {
  it('should generate rest query TS assignment from CUBA model', function () {

    const queryResult = createQuery(queriesModel[0].entity, queriesModel, modelCtx());
    const content = renderTSNodes([queryResult.node]);
    const expect = '' +
      `Car: {
        ecoCars: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => () => {
            return cubaApp.query("mpg$Car", "ecoCars", {}, fetchOpts);
        },
        ecoCarsCount: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => () => {
            return cubaApp.queryCount("mpg$Car", "ecoCars", {}, fetchOpts);
        },
        ecoCarsWithCount: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => () => {
            return cubaApp.queryWithCount("mpg$Car", "ecoCars", {}, fetchOpts);
        },
        carsByType: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (params: queries_Car_carsByType_params) => {
            return cubaApp.query("mpg$Car", "carsByType", params, fetchOpts);
        },
        carsByTypeCount: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (params: queries_Car_carsByType_params) => {
            return cubaApp.queryCount("mpg$Car", "carsByType", params, fetchOpts);
        },
        carsByTypeWithCount: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (params: queries_Car_carsByType_params) => {
            return cubaApp.queryWithCount("mpg$Car", "carsByType", params, fetchOpts);
        }
    }`;
    assertContent(content, expect);
  });


  it('should generate rest query methods param types', function () {
    const queryResult = createQuery(queriesModel[0].entity, queriesModel, modelCtx());

    const content = renderTSNodes(queryResult.methodParamsTypes);
    const expect = '' +
      `export type queries_Car_carsByType_params = {
          carType: string;
      };`;
    assertContent(content, expect);
  });

});