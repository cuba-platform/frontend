import * as path from "path";
import {OptionsConfig, polymerElementOptionsConfig, PolymerElementOptions} from "../../../common/cli-options";
import {blankComponentParams} from "./params";
import {BaseGenerator} from "../../../common/base-generator";
import {StudioTemplateProperty} from "../../../common/studio/studio-model";
import {elementNameToClass, unCapitalizeFirst} from "../../../common/utils";
import {CommonTemplateModel} from "../../polymer2/common/template-model";
import {addToMenu} from "../common/menu";
import {Entity, View} from "../../../common/model/cuba-model";

export interface BlankComponentAnswers {
  componentName: string
}

class ReactComponentGenerator extends BaseGenerator<BlankComponentAnswers, BlankComponentTemplateModel, PolymerElementOptions> {

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
    if (!addToMenu(this.fs, {
      componentFileName: this.model.className,
      componentClassName: this.model.className,
      caption: this.model.className,
      dirShift: this.options.dirShift,
      destRoot: this.destinationRoot(),
      menuLink: '/' + this.model.nameLiteral,
      pathPattern: '/' + this.model.nameLiteral
    })) {
      this.log('Unable to add component to menu: route registry not found');
    }
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

export interface BlankComponentTemplateModel extends CommonTemplateModel {
  nameLiteral: string;
}

export function blankComponentAnswersToModel(answers: BlankComponentAnswers, dirShift: string | undefined): BlankComponentTemplateModel {
  const className = elementNameToClass(answers.componentName);
  return {
    className,
    componentName: answers.componentName,
    relDirShift: dirShift || '',
    nameLiteral: unCapitalizeFirst(className)
  }
}

const description = 'Empty React class-based component';

export {
  ReactComponentGenerator as generator,
  polymerElementOptionsConfig as options,
  blankComponentParams as params,
  description
};