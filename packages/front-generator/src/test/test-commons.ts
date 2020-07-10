import {Entity, Enum} from "../common/model/cuba-model";
import {ProjectEntityInfo} from "../generators/sdk/model/entities-generation";
import * as assert from "assert";
import {collectModelContext, ModelContext} from "../generators/sdk/model/model-utils";
import * as fs from "fs";
import prettier = require('prettier');
import * as path from "path";
import {deprecate} from "util";
import {strictEqual} from "assert";

const enumsModel: Enum[] = require('./fixtures/enums-model.json');
const entityModel: Entity = require('./fixtures/entity-model.json');

export function modelCtx(): ModelContext {
  return collectModelContext({entities: [entityModel], enums: enumsModel} as any);
}

export function createTestProjectEntityInfo(className: string, isBase: boolean = false): ProjectEntityInfo {
  const shortName = className.split('.').pop();
  return {
    type: {className: className},
    entity: {className: shortName, name: (isBase ? 'sys$' : 'mpg$') + shortName, fqn: className}
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

export function opts(dir: string, answers: any, modelPath: string) {
  return {
    model: modelPath,
    dest: dir,
    debug: true,
    answers: Buffer.from(JSON.stringify(answers)).toString('base64')
  }
}

/**
 * @deprecated use assertFilesPlain, which is not change file content, it is not required since we are using prettier
 */
export function assertFiles(filePath: string, clientDir: string, fixturesDir: string) {
  const actual = fs.readFileSync(path.join(clientDir, filePath), 'utf8');
  const expect = fs.readFileSync(path.join(fixturesDir, filePath), 'utf8');
  assertContent(actual, expect);
}

export function assertFilesPlain(filePath: string, clientDir: string, fixturesDir: string) {
  const actual = fs.readFileSync(path.join(clientDir, filePath), 'utf8');
  const expect = fs.readFileSync(path.join(fixturesDir, filePath), 'utf8');
  strictEqual(actual, expect);
}
