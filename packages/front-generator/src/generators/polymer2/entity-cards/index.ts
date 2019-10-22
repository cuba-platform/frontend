import {BaseGenerator} from "../../../common/base-generator";
import {EntityCardsAnswers, entityCardsParams} from "./params";
import {OptionsConfig, PolymerElementOptions, polymerElementOptionsConfig} from "../../../common/cli-options";
import {StudioTemplateProperty} from "../../../common/studio/studio-model";
import * as path from "path";
import {EntityCardsTemplateModel} from "./template-model";
import {elementNameToClass} from "../../../common/utils";


class EntityCardsGenerator extends BaseGenerator<EntityCardsAnswers, EntityCardsTemplateModel, PolymerElementOptions> {

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
    this.model = entityCardsAnswersToModel(this.answers, this.options.dirShift);
    this.fs.copyTpl(
      this.templatePath('entity-cards.html'),
      this.destinationPath(this.model.componentName + '.html'), this.model
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

export function entityCardsAnswersToModel(answers: EntityCardsAnswers, dirShift: string | undefined): EntityCardsTemplateModel {
  return {
    componentName: answers.componentName,
    className: elementNameToClass(answers.componentName),
    relDirShift: dirShift || '',
    entity: answers.entity,
    view: answers.entityView
  }
}

export {
  EntityCardsGenerator as generator,
  polymerElementOptionsConfig as options,
  entityCardsParams as params
}
