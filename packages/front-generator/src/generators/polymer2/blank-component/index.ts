import * as path from "path";
import {OptionsConfig, polymerElementOptionsConfig, PolymerElementOptions} from "../../../common/cli-options";
import {blankComponentParams} from "./params";
import {Polymer2ComponentTemplateModel} from "./template-model";
import {BaseGenerator} from "../../../common/generation";
import {StudioTemplateProperty} from "../../../common/cuba-studio";
import {elementNameToClass} from "../../../common/utils";

export interface BlankComponentAnswers {
  componentName: string
}

class Polymer2ComponentGenerator extends BaseGenerator<BlankComponentAnswers, Polymer2ComponentTemplateModel, PolymerElementOptions> {

  constructor(args: string | string[], options: PolymerElementOptions) {
    super(args, options);
    this.sourceRoot(path.join(__dirname, 'template'));
  }

  // noinspection JSUnusedGlobalSymbols
  async prompting() {
    await this._promptOrParse();
  }

  // noinspection JSUnusedGlobalSymbols
  writing() {
    this.log(`Generating to ${this.destinationPath()}`);
    if (!this.answers) {
      throw new Error('Answers not provided');
    }
    this.model = blankComponentAnswersToModel(this.answers, this.options.dirShift);
    this.fs.copyTpl(
      this.templatePath('component.html'),
      this.destinationPath(this.model.componentName + '.html'), this.model
    );
  }

  end() {
    this.log(`Blank component has been successfully generated into ${this.destinationRoot()}`);
  }

  _getParams(): StudioTemplateProperty[] {
    return blankComponentParams;
  }

  _getAvailableOptions(): OptionsConfig {
    return polymerElementOptionsConfig;
  }

}


export function blankComponentAnswersToModel(answers: BlankComponentAnswers, dirShift: string | undefined): Polymer2ComponentTemplateModel {
  return {
    componentName: answers.componentName,
    className: elementNameToClass(answers.componentName),
    relDirShift: dirShift || ''
  }
}

export {
  Polymer2ComponentGenerator as generator,
  polymerElementOptionsConfig as options,
  blankComponentParams as params
};