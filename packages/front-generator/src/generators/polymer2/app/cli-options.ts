import {GeneratorCliOptions} from "../../../common/generation";

export interface Polymer2AppGeneratorOptions {
  dest?: string;
  model?: string;
}

export const options: GeneratorCliOptions = {
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