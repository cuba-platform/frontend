import * as path from "path";
import {options as availableOptions} from "../app/cli-options";
import {CommonGenerationOptions, commonGenerationOptionsConfig} from "../../../common/cli-common";
import {questions} from "./questions";
import {Polymer2ComponentTemplateModel} from "./template-model";
import {BaseGenerator} from "../../../common/generation";

interface Answers {
  componentName: string
}

class Polymer2ComponentGenerator extends BaseGenerator {

  answers?: Answers;
  model?: Polymer2ComponentTemplateModel;

  constructor(args: string | string[], options: CommonGenerationOptions) {
    super(args, options);

    this._populateOptions(commonGenerationOptionsConfig);

    this.sourceRoot(path.join(__dirname, 'template'));
    this.destinationRoot(this._getDestRoot());
  }

  // noinspection JSUnusedGlobalSymbols
  async prompting() {
    this.answers = await this.prompt(questions) as Answers;
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
}

export = Polymer2ComponentGenerator;