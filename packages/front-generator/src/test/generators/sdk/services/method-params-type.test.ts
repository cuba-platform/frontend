import {
  collectMethods,
  createMethodParamsType,
  ParamTypeInfo,
  parseParamType
} from "../../../../generators/sdk/services/method-params-type";
import {renderTSNodes} from "../../../../common/ts-helpers";
import {assertContent, modelCtx} from "../../../test-commons";
import {Entity, Enum, RestService} from "../../../../common/model/cuba-model";
import {isImportEquals} from "../../../../generators/sdk/import-utils";
import * as assert from "assert";
import {collectModelContext} from "../../../../generators/sdk/model/model-utils";
const servicesModel: RestService[] = require('../../../fixtures/service-model.json');

const enumsModelWithDuplicates: Enum[] = require('../../../fixtures/enums-model--identical-names.json');
const entityModel: Entity = require('../../../fixtures/entity-model.json');
const baseEntityModel: Entity = require('../../../fixtures/base-entity-model.json');

describe('should generate new type form method params, an imports for this type', () => {
  it('should generate rest method params type', function () {
    const restService = servicesModel[0];
    const methodWithOverloadsList = collectMethods(restService.methods);
    const ctx = modelCtx();
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
