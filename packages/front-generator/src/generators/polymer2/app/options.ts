import {GeneratorCliOptions} from "../../../common/generation";

export interface Polymer2AppGeneratorOptions {
  dest?: string;
}

export const options: GeneratorCliOptions = {
  dest: {
    alias: 'd',
    description: 'destination directory',
    type: String
  }
};