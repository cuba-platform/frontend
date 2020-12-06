import {BlankComponentAnswers, blankComponentAnswersToModel,} from "../../polymer2/blank-component";
import {blankComponentParams} from "../../polymer2/blank-component/params";
import {OptionsConfig, PolymerElementOptions, polymerElementOptionsConfig} from "../../../common/cli-options";
import * as path from "path";
import {Polymer2ComponentTemplateModel} from "../../polymer2/blank-component/template-model";
import {BaseGenerator} from "../../../common/base-generator";
import {StudioTemplateProperty} from "../../../common/studio/studio-model";
import {TSPolymerElementModel} from "../common";

type TemplateModel = Polymer2ComponentTemplateModel & TSPolymerElementModel;

class Polymer2ComponentTSGenerator extends BaseGenerator<BlankComponentAnswers, TemplateModel, PolymerElementOptions> {

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
    this.model = {
      ...blankComponentAnswersToModel(this.answers, this.options.dirShift),
      projectNamespace: this.cubaProjectModel!.project.namespace
    };
    this.fs.copyTpl(
      this.templatePath('component.html'),
      this.destinationPath(this.model.componentName + '.html'), this.model
    );
    this.fs.copyTpl(
      this.templatePath('component.ts'),
      this.destinationPath(this.model.componentName + '.ts'), this.model
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

export {
  Polymer2ComponentTSGenerator as generator,
  polymerElementOptionsConfig as options,
  blankComponentParams as params
};