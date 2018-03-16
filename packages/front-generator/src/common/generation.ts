import * as Base from "yeoman-generator";
import * as path from "path";
import {CommonGenerationOptions, OptionsConfig} from "./cli-options";
import {StudioTemplateProperty} from "./cuba-studio";

export abstract class BaseGenerator extends Base {

  options: CommonGenerationOptions = {};
  answers?: {};
  model?: {};

  protected _populateOptions(availableOption: OptionsConfig) {
    Object.keys(availableOption).forEach(optionName => {
      this.option(optionName, availableOption[optionName]);
    });
  }

  protected _getDestRoot(): string {
    if (!this.options.dest) {
      return this.destinationRoot();
    }
    if (path.isAbsolute(this.options.dest)) {
      return this.options.dest
    }
    return path.join(this.destinationRoot(), this.options.dest)
  }
}

/**
 * Designates that generator can be used in non interactive mode e.g. by CUBA Studio
 *
 * Leading underscore in methods needed to prevent yeoman from running the method in generation cycle
 */
export interface NonInteractiveGenerator {

  _getParams(): StudioTemplateProperty[];

  _getOptions(): OptionsConfig;

}

export interface GeneratorExports {
  generator: typeof BaseGenerator,
  options?: OptionsConfig,
  params?: StudioTemplateProperty[]
}