import {existsSync, readdirSync, statSync} from 'fs';
import * as YeomanEnvironment from "yeoman-environment";
import * as path from "path";
import {OptionsConfig} from "./common/cli-options";
import {StudioTemplateProperty} from "./common/studio/studio-model";
import {GeneratorExports} from "./common/base-generator";

const GENERATORS_DIR_NAME = 'generators';
const GENERATOR_FILE_NAME = 'index.js';
const INFO_FILE_NAME = 'info.json';

/**
 * @alpha
 */
export interface GeneratedClientInfo {
  bundled: boolean;
  name: string
  generators: GeneratorInfo[];
  bower?: boolean,
  clientBaseTech?: string
}

export interface ProvidedClientInfo {
  bower: boolean
  clientBaseTech: string
}

export interface GeneratorInfo {
  name: string;
  description?: string;
  options?: OptionsConfig;
  params?: StudioTemplateProperty[]
}

export function collectClients(generatorFileName?: string): GeneratedClientInfo[] {
  const clientsDirPath = path.join(__dirname, GENERATORS_DIR_NAME);
  return readdirSync(clientsDirPath).map((clientDirName): GeneratedClientInfo => {
    return readClient(clientsDirPath, clientDirName, generatorFileName);
  });
}

/**
 * @alpha
 */
export function readClient(clientsDirPath: string, clientDirName: string, generatorFileName?: string) {
  const info:ProvidedClientInfo = require(path.join(clientsDirPath, clientDirName, INFO_FILE_NAME));
  return {
    bundled: true,
    name: clientDirName,
    bower: info.bower,
    clientBaseTech: info.clientBaseTech,
    generators: collectGenerators(path.join(clientsDirPath, clientDirName), generatorFileName)
  }
}

export async function generate(
  generatorName: string,
  subGeneratorName: string,
  options?: {},
  baseDir: string = __dirname
): Promise<void> {
  const env = new YeomanEnvironment();

  const {generator} = await import(path.join(baseDir, GENERATORS_DIR_NAME, generatorName, subGeneratorName));
  env.registerStub(generator, generator.name);
  return env.run(generator.name, options);
}

function collectGenerators(generatorsDir: string, genFileName?: string): GeneratorInfo[] {
  const dirs = readdirSync(generatorsDir);
  return dirs.reduce((generators: GeneratorInfo[], name: string) => {

    genFileName = genFileName ? genFileName : GENERATOR_FILE_NAME;
    const generatorPath = path.join(generatorsDir, name);
    if (existsSync(path.join(generatorPath, genFileName)) && statSync(generatorPath).isDirectory()) {
      const generatorExports: GeneratorExports = require(generatorPath);
      if (generatorExports.generator == null) {
        return generators;
      }
      const options = generatorExports.options;
      const params = generatorExports.params;
      const description = generatorExports.description;
      generators.push({name, options, params, description});
      return generators;
    } else {
      return generators;
    }
  }, []);
}