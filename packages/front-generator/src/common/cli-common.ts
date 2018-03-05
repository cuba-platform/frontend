import {OptionConfig} from "yeoman-generator";
import * as Base from "yeoman-generator";
import * as path from "path";
import {options as availableOptions} from "../generators/polymer2/app/cli-options";

export type OptionsConfig = {
  [optionName: string]: OptionConfig
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

export class BaseGenerator extends Base {

  options: CommonGenerationOptions = {};
  answers?: {};
  model?: {};

  constructor(args: string | string[], options: CommonGenerationOptions) {
    super(args, options);

    Object.keys(availableOptions).forEach(optionName => {
      this.option(optionName, availableOptions[optionName]);
    });

    this.sourceRoot(path.join(__dirname, 'template'));
    this.destinationRoot(this._getDestRoot());
  }

  private _getDestRoot(): string {
    const subDir = this.options.dest ? this.options.dest : '';
    return path.join(this.destinationRoot(), subDir)
  }
}