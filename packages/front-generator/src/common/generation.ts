import * as Base from "yeoman-generator";
import * as path from "path";
import {CommonGenerationOptions, OptionsConfig} from "./cli-common";

export class BaseGenerator extends Base {

  options: CommonGenerationOptions = {};
  answers?: {};
  model?: {};

  constructor(args: string | string[], options: CommonGenerationOptions) {
    super(args, options);
  }

  protected _populateOptions(availableOption: OptionsConfig) {
    Object.keys(availableOption).forEach(optionName => {
      this.option(optionName, availableOption[optionName]);
    });
  }

  protected _getDestRoot(): string {
    const subDir = this.options.dest ? this.options.dest : '';
    return path.join(this.destinationRoot(), subDir)
  }
}