import {OptionConfig} from "yeoman-generator";

export type OptionsConfig = {
  [optionName: string]: OptionConfig
}

interface CommanderOptionInfo {
  pattern: string;
  description?: string;
}

export function extractAvailableOptions(optionsConfig?: OptionsConfig): CommanderOptionInfo[] {
  if (!optionsConfig) {
    return [];
  }
  return Object.keys(optionsConfig).map(optionFullName => {
    const {type, alias, description} = optionsConfig[optionFullName];
    const pattern = `-${alias}, --${optionFullName}${type === String ? ` [${optionFullName}]` : ''}`;

    return {pattern, description}
  });
}

export function pickOptions(cmd: {[key:string]: any}, availableOptions?: OptionsConfig, ):{[key:string]: string|boolean} {
  const passedOptions: { [key: string]: any } = {};
  if (availableOptions) {
    Object.keys(availableOptions).forEach(optionFullName => {
      if (cmd.hasOwnProperty(optionFullName)) {
        passedOptions[optionFullName] = cmd[optionFullName] as string | boolean;
      }
    })
  }
  return passedOptions;
}

export interface CommonGenerationOptions {
  dest?: string;
  model?: string;
}

export const commonGenerationOptionsConfig: OptionsConfig = {
  dest: {
    alias: 'd',
    description: 'destination directory',
    type: String
  },
  model: {
    alias: 'm',
    description: 'specify path to project model, if given no interactive prompt will be invoked',
    type: String
  }
};