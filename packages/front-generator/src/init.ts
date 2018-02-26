import {readdirSync, existsSync} from 'fs';
import * as YeomanEnvironment from "yeoman-environment";
import * as path from "path";
import {GeneratorCliOptions} from "./common/generation";

const GENERATORS_DIR = 'generators';

export interface GeneratorInfo {
  bundled: boolean;
  name: string;
  options?: GeneratorCliOptions;
}

export function collectGenerators(): GeneratorInfo[] {
  return scanDir(path.join(__dirname, GENERATORS_DIR));
}

export function collectSubGenerators(generatorName: string): GeneratorInfo[] {
  return scanDir(path.join(__dirname, GENERATORS_DIR, generatorName));
}

export async function generate(generatorName: string, subGeneratorName: string, options?: {}): Promise<void> {
  const env = new YeomanEnvironment();

  const generator = require(path.join(__dirname, GENERATORS_DIR, generatorName, subGeneratorName));
  env.registerStub(generator, generator.name);
  env.run(generator.name, options);

}

function scanDir(generatorsDir: string) {
  const dirs = readdirSync(generatorsDir);
  return dirs.map(dirName => {

    const generatorInfo: GeneratorInfo = {
      name: dirName,
      bundled: true
    };

    if (existsSync(path.join(generatorsDir, dirName, 'options.js'))) {
      generatorInfo.options = require(path.join(generatorsDir, dirName, 'options.js')).options;
    }

    return generatorInfo;
  });
}