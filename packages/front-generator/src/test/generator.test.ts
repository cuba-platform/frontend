import {collectClients, generate} from "../init";
import * as assert from "assert";

import {createEntityClass, ProjectEntityInfo} from "../common/model/entities-generation";
import {Entity, Enum} from "../common/model/cuba-model";
import * as path from "path";
import {createEnums} from "../common/model/enums-generation";
import {renderTSNodes} from "../common/model/ts-helpers";

const enumsModel: Enum[] = require('./enums-model.json');
const entityModel: Entity = require('./entity-model.json');
const enumsModelDuplicates: Enum[] = require('./enums-model--identical-names.json');
const modelPath = require.resolve('../../test/projectModel.json');
const tmpGenerationDir = path.join(process.cwd(), '.tmp');

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
    return generate('sdk', 'all', {
      model: modelPath,
      dest: path.join(tmpGenerationDir, 'sdk'),
      debug: true
    });
  })
});

describe('generate TS entity', function () {
  it(createEntityClass.name, function () {
    const entitiesMap = new Map<string, ProjectEntityInfo>();
    entitiesMap.set('com.company.mpg.entity.Garage', {type: {className: 'Garage'}} as any);
    entitiesMap.set('com.company.mpg.entity.TechnicalCertificate', {type: {className: 'TechnicalCertificate'}} as any);
    entitiesMap.set('com.haulmont.cuba.core.entity.FileDescriptor', {type: {className: 'FileDescriptor'}} as any);

    const classTsNode = createEntityClass(entityModel, entitiesMap);
    const content = renderTSNodes([classTsNode.classDeclaration]);

    const expected = `export class Car {
    static NAME = "mpg$Car";
    manufacturer?: string | null;
    model?: string | null;
    regNumber?: string | null;
    purchaseDate?: any | null;
    wheelOnRight?: boolean | null;
    carType?: any | null;
    ecoRank?: any | null;
    garage?: Garage | null;
    maxPassengers?: number | null;
    price?: any | null;
    mileage?: any | null;
    technicalCertificate?: TechnicalCertificate | null;
    photo?: FileDescriptor | null;
}
`;

    assert(expected == content);
  });
});

describe('generate TS enums', () => {
  it(createEnums.name, () => {
    let enums = createEnums(enumsModel);
    let content = renderTSNodes(enums.map(e => e.node));
    const res = 'export enum CarType { SEDAN = "SEDAN", HATCHBACK = "HATCHBACK" } ' +
      'export enum EcoRank { EURO1 = "EURO1", EURO2 = "EURO2", EURO3 = "EURO3" } ';
    assert(res == drain(content));

    enums = [];
    content = renderTSNodes(enums.map(e => e.node));
    assert("" == content)
  });

  it('should resolve enum duplicated names', () => {
    const enums = createEnums(enumsModelDuplicates);
    const content = renderTSNodes(enums.map(e => e.node));

    const expected = '' +
      'export enum com_company_mpg_entity_CarType { SEDAN = "SEDAN", HATCHBACK = "HATCHBACK" } ' +
      'export enum com_company_mpg_entity2_CarType { SEDAN_V2 = "SEDAN_V2", HATCHBACK_V2 = "HATCHBACK_V2" } ' +
      'export enum EcoRank { EURO1 = "EURO1", EURO2 = "EURO2", EURO3 = "EURO3" } ';
    assert(expected == drain(content));
  });
});

function drain(result: string) {
  return result.replace(/\n/g, ' ').replace(/\s{2,}/g, ' ');
}