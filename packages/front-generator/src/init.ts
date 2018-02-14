import {readdirSync} from 'fs';
import * as YeomanEnvironment from "yeoman-environment";
import * as path from "path";

const GENERATORS_DIR = 'generators';

export interface GeneratorInfo {
  bundled: boolean;
  name: string;
}

export function collectGenerators(): GeneratorInfo[] {
  return scanDir(path.join(__dirname, GENERATORS_DIR));
}

export function collectSubGenerators(generatorName: string): GeneratorInfo[] {
  return scanDir(path.join(__dirname, GENERATORS_DIR, generatorName));
}

export async function generate(generatorName: string, subgeneratorName: string): Promise<void> {
  const env = new YeomanEnvironment();

  const generator = require(path.join(__dirname, GENERATORS_DIR, generatorName, subgeneratorName, 'index'));
  env.registerStub(generator, generator.name);
  env.run(generator.name);

}

function scanDir(generatorsDir: string) {
  const dirs = readdirSync(generatorsDir);
  return dirs.map(dirName => {
    return {
      name: dirName,
      bundled: true
    }
  });
}