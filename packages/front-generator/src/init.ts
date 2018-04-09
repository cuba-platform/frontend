import {existsSync, readdirSync, statSync} from 'fs';
import * as YeomanEnvironment from "yeoman-environment";
import * as path from "path";
import {OptionsConfig} from "./common/cli-options";
import {StudioTemplateProperty} from "./common/cuba-studio";
import {GeneratorExports} from "./common/generation";

const GENERATORS_DIR_NAME = 'generators';
const GENERATOR_FILE_NAME = 'index.js';

export interface ClientInfo {
  bundled: boolean;
  name: string
  generators: GeneratorInfo[];
}

export interface GeneratorInfo {
  name: string;
  options?: OptionsConfig;
  params?: StudioTemplateProperty[]
}

export function collectClients(): ClientInfo[] {
  const clientsDirPath = path.join(__dirname, GENERATORS_DIR_NAME);
  return readdirSync(clientsDirPath).map((clientDirName): ClientInfo => {
    return {
      bundled: true,
      name: clientDirName,
      generators: collectGenerators(path.join(clientsDirPath, clientDirName))
    }
  });
}

export async function generate(generatorName: string, subGeneratorName: string, options?: {}): Promise<void> {
  const env = new YeomanEnvironment();

  const {generator} = await import(path.join(__dirname, GENERATORS_DIR_NAME, generatorName, subGeneratorName));
  env.registerStub(generator, generator.name);
  env.run(generator.name, options);
}

function collectGenerators(generatorsDir: string): GeneratorInfo[] {
  const dirs = readdirSync(generatorsDir);
  return dirs.reduce((generators: GeneratorInfo[], name: string) => {

    const generatorPath = path.join(generatorsDir, name);
    if (existsSync(generatorPath)
        && existsSync(path.join(generatorPath, GENERATOR_FILE_NAME))
        && statSync(generatorPath).isDirectory()) {
      const generatorExports: GeneratorExports = require(generatorPath);
      if (generatorExports.generator == null) {
        return generators;
      }
      const options = generatorExports.options;
      const params = generatorExports.params;
      generators.push({name, options, params});
      return generators;
    } else {
      return generators;
    }
  }, []);
}