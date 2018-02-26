import {GeneratorCliOptions} from "../../../common/generation";

export interface Polymer2AppGeneratorOptions {
  debug?: boolean;
}

export const options: GeneratorCliOptions = {
  debug: {
    alias: 'd',
    description: 'run generator in debug mode (generate to .tmp)',
    type: Boolean
  }
};