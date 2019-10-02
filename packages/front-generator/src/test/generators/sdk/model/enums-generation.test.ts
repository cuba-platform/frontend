import {createEnums} from "../../../../generators/sdk/model/enums-generation";
import {renderTSNodes} from "../../../../common/ts-helpers";
import {assertContent} from "../../../test-commons";
import {Enum} from "../../../../common/model/cuba-model";

const enumsModel: Enum[] = require('../../../fixtures/enums-model.json');
const enumsModelDuplicates: Enum[] = require('../../../fixtures/enums-model--identical-names.json');

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