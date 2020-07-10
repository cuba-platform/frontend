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

  const result: CommanderOptionInfo[] = [];
  Object.keys(optionsConfig).forEach(optionFullName => {
    const {type, alias, description} = optionsConfig[optionFullName];
    if (alias) {
      const pattern = `-${alias}, --${optionFullName}${type === String ? ` [${optionFullName}]` : ''}`;
      description ? result.push({pattern, description}) : result.push({pattern});
    }
  });
  return result;
}

export function pickOptions(cmd: {[key:string]: any}, availableOptions?: OptionsConfig):{[key:string]: string|boolean} {
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
  answers?: string;
  verbose?: boolean;
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
  },
  verbose: {
    alias: 'b',
    description: 'log out additional info about generation process',
    type: Boolean
  }
};

export interface PolymerElementOptions extends CommonGenerationOptions {
  dirShift?: string;
}

// Same as PolymerElementOptions but with a neutral name. To be used in non-Polymer generators.
export interface ComponentOptions extends CommonGenerationOptions {
  dirShift?: string;
}

export const polymerElementOptionsConfig: OptionsConfig = {
  ...commonGenerationOptionsConfig,
  dirShift: {
    alias: 's',
    description: 'directory shift for html imports e.g ../../',
    type: String
  },
  answers: {
    alias: 'a',
    description: 'fulfilled params for generator to avoid interactive input in serialized JSON string',
    type: String
  }
};

// Same as polymerElementOptionsConfig but with a neutral name. To be used in non-Polymer generators.
export const componentOptionsConfig: OptionsConfig = {
  ...commonGenerationOptionsConfig,
  dirShift: {
    alias: 's',
    description: 'directory shift for html imports e.g ../../',
    type: String
  },
  answers: {
    alias: 'a',
    description: 'fulfilled params for generator to avoid interactive input in serialized JSON string',
    type: String
  }
};