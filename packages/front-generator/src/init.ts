import {readdirSync, existsSync} from 'fs';
import * as YeomanEnvironment from "yeoman-environment";
import * as path from "path";
import {OptionsConfig} from "./common/cli-common";
import {Questions} from "yeoman-generator";

const GENERATORS_DIR_NAME = 'generators';
const CLI_OPTIONS_FILE_NAME = 'cli-options.js';

export interface ClientInfo {
  bundled: boolean;
  name: string
  generators: GeneratorInfo[];
}

export interface GeneratorInfo {
  name: string;
  options?: OptionsConfig;
  questions?: Questions;
}

export function collectClients(): ClientInfo[] {
  const clientsDirPath = path.join(__dirname, GENERATORS_DIR_NAME);
  return readdirSync(clientsDirPath).map((clientDirName):ClientInfo => {
    return {
      bundled: true,
      name: clientDirName,
      generators: collectGenerators(path.join(clientsDirPath, clientDirName))
    }});
}

export async function generate(generatorName: string, subGeneratorName: string, options?: {}): Promise<void> {
  const env = new YeomanEnvironment();

  const generator = require(path.join(__dirname, GENERATORS_DIR_NAME, generatorName, subGeneratorName));
  env.registerStub(generator, generator.name);
  env.run(generator.name, options);
}

function collectGenerators(generatorsDir: string): GeneratorInfo[] {
  const dirs = readdirSync(generatorsDir);
  return dirs.map((name): GeneratorInfo => {

    let options;
    if (existsSync(path.join(generatorsDir, name, CLI_OPTIONS_FILE_NAME))) {
      options = require(path.join(generatorsDir, name, CLI_OPTIONS_FILE_NAME)).options;
    }

    return {name, options};
  });
}