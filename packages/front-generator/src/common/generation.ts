import * as Base from "yeoman-generator";
import * as path from "path";
import {CommonGenerationOptions, commonGenerationOptionsConfig, OptionsConfig} from "./cli-options";
import {StudioTemplateProperty} from "./cuba-studio";
import {fromStudioProperties} from "./questions";

export abstract class BaseGenerator<A, M, O extends CommonGenerationOptions> extends Base {

  options: O = ({} as O);
  answers?: A;
  model?: M;

  constructor(args: string | string[], options: CommonGenerationOptions) {
    super(args, options);
    this._populateOptions(this._getAvailableOptions());
    this.destinationRoot(this._getDestRoot());
  }

  protected async _promptOrParse() {
    if (this.options.answers) {
      this.answers = JSON.parse(Buffer.from(this.options.answers, 'base64').toString('utf8')) as A;
      return Promise.resolve();
    }
    this.answers = await this.prompt(fromStudioProperties(this._getParams())) as A;
  }

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

  _getAvailableOptions(): OptionsConfig {
    return commonGenerationOptionsConfig;
  }

  _getParams(): StudioTemplateProperty[] {
    return [];
  }
}

export interface GeneratorExports {
  generator: typeof BaseGenerator,
  options?: OptionsConfig,
  params?: StudioTemplateProperty[]
}