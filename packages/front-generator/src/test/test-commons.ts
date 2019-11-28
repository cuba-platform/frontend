import {Entity, Enum} from "../common/model/cuba-model";
import {ProjectEntityInfo} from "../generators/sdk/model/entities-generation";
import * as assert from "assert";
import {collectModelContext, ModelContext} from "../generators/sdk/model/model-utils";
import * as fs from "fs";
import prettier = require('prettier');

const enumsModel: Enum[] = require('./fixtures/enums-model.json');
const entityModel: Entity = require('./fixtures/entity-model.json');

export function modelCtx(): ModelContext {
  return collectModelContext({entities: [entityModel], enums: enumsModel} as any);
}

export function createTestProjectEntityInfo(className: string, isBase: boolean = false): ProjectEntityInfo {
  const shortName = className.split('.').pop();
  return {
    type: {className: className},
    entity: {className: shortName, name: (isBase ? 'sys$' : 'mpg$') + shortName}
  } as any;
}

export function assertContent(actual: string, expect: string, multiline: boolean = true) {
  assert.strictEqual(drain(actual, multiline), drain(expect, multiline));
}

function drain(content: string, multiline: boolean = true) {
  const result = multiline
    ? content
      .replace(/^\s+/gm, '') //spaces at the line start, and empty lines
    : content
      .replace(/\n/g, ' ');  //multiline false - join in one line

  return result
    .replace(/\s{2,}/g, ' ') //two or more spaces with one space
    .trim();
}

export function format(file: string) {
  const formatted = prettier.format(fs.readFileSync(file, 'utf8'), {parser: "typescript"});
  fs.writeFileSync(file, formatted, 'utf8');
}