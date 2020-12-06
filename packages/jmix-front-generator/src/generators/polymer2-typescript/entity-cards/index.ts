import {entityCardsAnswersToModel} from "../../polymer2/entity-cards";
import {OptionsConfig, PolymerElementOptions, polymerElementOptionsConfig} from "../../../common/cli-options";
import {EntityCardsAnswers, entityCardsParams} from "../../polymer2/entity-cards/params";
import * as path from "path";
import {BaseGenerator} from "../../../common/base-generator";
import {StudioTemplateProperty} from "../../../common/studio/studio-model";
import {EntityCardsTemplateModel} from "../../polymer2/entity-cards/template-model";
import {TSPolymerElementModel} from "../common";

type TemplateModel = EntityCardsTemplateModel & TSPolymerElementModel;

class EntityCardsTSGenerator extends BaseGenerator<EntityCardsAnswers, TemplateModel, PolymerElementOptions> {

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
      ...entityCardsAnswersToModel(this.answers, this.options.dirShift),
      projectNamespace: this.cubaProjectModel!.project.namespace
    };
    this.fs.copyTpl(
      this.templatePath('entity-cards.html'),
      this.destinationPath(this.model.componentName + '.html'), this.model
    );
    this.fs.copyTpl(
      this.templatePath('entity-cards.ts'),
      this.destinationPath(this.model.componentName + '.ts'), this.model
    );
  }

  end() {
    this.log(`Entity cards have been successfully generated into ${this.destinationRoot()}`);
  }

  _getParams(): StudioTemplateProperty[] {
    return entityCardsParams;
  }

  _getAvailableOptions(): OptionsConfig {
    return polymerElementOptionsConfig;
  }
}


export {
  EntityCardsTSGenerator as generator,
  polymerElementOptionsConfig as options,
  entityCardsParams as params
}
