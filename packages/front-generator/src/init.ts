import {readdir} from 'fs';
import {promisify} from 'util';
import * as YeomanEnvironment from "yeoman-environment";
import * as path from "path";

const GENERATORS_DIR = 'packages/@cuba-platform';
const GENERATOR_COMMON_PREFIX = 'generator-cuba-';
const GENERATOR_COMMON_SUFFIX = '-front';


export interface GeneratorInfo {
  bundled: boolean;
  name: string;
}

export async function collectGenerators(): Promise<GeneratorInfo[]> {

  const dirs = await promisify(readdir)(GENERATORS_DIR);

  return dirs
    .filter(dirName => dirName.startsWith(GENERATOR_COMMON_PREFIX))
    .map(dirName => {
      return {
        name: extractName(dirName),
        bundled: true
      }
    });

}

export async function generate(generatorInfo: GeneratorInfo): Promise<void> {
  const env = new YeomanEnvironment();

  const generator = require.resolve(path.join(GENERATORS_DIR, fromName(generatorInfo.name)));

  env.registerStub(generator, "cuba:generator");

  console.log('generated');
}

function extractName(dirName: string): string {
  return dirName.replace(GENERATOR_COMMON_PREFIX, '').replace(GENERATOR_COMMON_SUFFIX, '');
}

function fromName(name: string): string {
  return GENERATOR_COMMON_PREFIX + name + GENERATOR_COMMON_SUFFIX;
}