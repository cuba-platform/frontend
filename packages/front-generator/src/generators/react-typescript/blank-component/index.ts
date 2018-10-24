import * as path from "path";
import {OptionsConfig, polymerElementOptionsConfig, PolymerElementOptions} from "../../../common/cli-options";
import {blankComponentParams} from "./params";
import {BaseGenerator} from "../../../common/generation";
import {StudioTemplateProperty} from "../../../common/cuba-studio";
import {elementNameToClass} from "../../../common/utils";
import {CommonTemplateModel} from "../../polymer2/common/template-model";

export interface BlankComponentAnswers {
  componentName: string
}

class ReactComponentGenerator extends BaseGenerator<BlankComponentAnswers, CommonTemplateModel, PolymerElementOptions> {

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
      this.templatePath('Component.tsx'),
      this.destinationPath(this.model.componentName + '.tsx'), this.model
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


export function blankComponentAnswersToModel(answers: BlankComponentAnswers, dirShift: string | undefined): CommonTemplateModel {
  return {
    componentName: answers.componentName,
    className: elementNameToClass(answers.componentName),
    relDirShift: dirShift || ''
  }
}

export {
  ReactComponentGenerator as generator,
  polymerElementOptionsConfig as options,
  blankComponentParams as params
};