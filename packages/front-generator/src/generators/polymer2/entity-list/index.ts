import {EntityListAnswers, entityListParams} from "./params";
import {BaseGenerator} from "../../../common/generation";
import {StudioTemplateProperty} from "../../../common/studio/studio-model";
import {OptionsConfig, PolymerElementOptions, polymerElementOptionsConfig} from "../../../common/cli-options";
import {EntityListTemplateModel} from "./template-model";
import * as path from "path";
import {elementNameToClass} from "../../../common/utils";

class EntityListGenerator extends BaseGenerator<EntityListAnswers, EntityListTemplateModel, PolymerElementOptions> {

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
    this.model = entityListAnswersToModel(this.answers, this.options.dirShift);
    this.fs.copyTpl(
      this.templatePath('entity-list.html'),
      this.destinationPath(this.model.componentName + '.html'), this.model
    );
  }

  end() {
    this.log(`Entity list have been successfully generated into ${this.destinationRoot()}`);
  }

  _getParams(): StudioTemplateProperty[] {
    return entityListParams;
  }

  _getAvailableOptions(): OptionsConfig {
    return polymerElementOptionsConfig;
  }
}

export function entityListAnswersToModel(answers: EntityListAnswers, dirShift: string | undefined): EntityListTemplateModel {
  return {
    componentName: answers.componentName,
    className: elementNameToClass(answers.componentName),
    relDirShift: dirShift || '',
    entity: answers.entity,
    view: answers.entityView
  }
}

export {
  EntityListGenerator as generator,
  entityListParams as params,
  polymerElementOptionsConfig as options
}