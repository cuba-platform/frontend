import * as path from "path";
import {CommonGenerationOptions, commonGenerationOptionsConfig, OptionsConfig} from "../../../common/cli-options";
import {entityManagementParams} from "./params";
import {Polymer2ComponentTemplateModel} from "./template-model";
import {BaseGenerator, NonInteractiveGenerator} from "../../../common/generation";
import {StudioTemplateProperty} from "../../../common/cuba-studio";
import {fromStudioProperties} from "../../../common/questions";

interface Answers {
  componentName: string
}

class Polymer2ComponentGenerator extends BaseGenerator implements NonInteractiveGenerator {

  answers?: Answers;
  model?: Polymer2ComponentTemplateModel;

  constructor(args: string | string[], options: CommonGenerationOptions) {
    super(args, options);

    this._populateOptions(this._getOptions());

    this.sourceRoot(path.join(__dirname, 'template'));
    this.destinationRoot(this._getDestRoot());
  }

  // noinspection JSUnusedGlobalSymbols
  async prompting() {
    this.answers = await this.prompt(fromStudioProperties(this._getParams())) as Answers;
  }

  prepareModel() {
    this.model = {
      componentName: this.answers!.componentName,
      className: this.answers!.componentName,
      relDirShift: ''
    }
  }

  // noinspection JSUnusedGlobalSymbols
  writing() {
    this.log(`Generating to ${this.destinationPath()}`);

    if (!this.model) {
      throw new Error('Model is not provided');
    }

    this.fs.copyTpl(this.templatePath() + '/*.*', this.destinationPath(), this.model);
  }

  end() {
    this.log(`Blank component has been successfully generated into ${this.destinationRoot()}`);
  }

  _getOptions(): OptionsConfig {
    return commonGenerationOptionsConfig;
  }

  _getParams(): StudioTemplateProperty[] {
    return entityManagementParams;
  }
}

export {
  Polymer2ComponentGenerator as generator,
  commonGenerationOptionsConfig as options,
  entityManagementParams as params
};