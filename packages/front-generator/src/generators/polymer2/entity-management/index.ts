import {BaseGenerator} from "../../../common/base-generator";
import {EntityManagementAnswers, entityManagementGeneratorParams} from "./params";
import {OptionsConfig, PolymerElementOptions, polymerElementOptionsConfig} from "../../../common/cli-options";
import {EntityManagementTemplateModel} from "./template-model";
import * as path from "path";
import {StudioTemplateProperty} from "../../../common/studio/studio-model";
import {elementNameToClass} from "../../../common/utils";
import {EntityListTemplateModel} from "../entity-list/template-model";
import {EntityCardsTemplateModel} from "../entity-cards/template-model";
import {EntityEditTemplateModel} from "../entity-edit/template-model";
import {composeEditFields} from "../entity-edit";

class Polymer2EntityManagementGenerator extends BaseGenerator<EntityManagementAnswers, EntityManagementTemplateModel, PolymerElementOptions> {

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
    this.model = answersToManagementModel(this.answers, this.options.dirShift);
    this.fs.copyTpl(
      this.templatePath('entity-management.html'),
      this.destinationPath(this.model.componentName + '.html'), this.model
    );
    this.fs.copyTpl(
      this.templatePath(`../../entity-${this.model.listType}/template/entity-${this.model.listType}.html`),
      this.destinationPath(this.model.listComponentName + '.html'), answersToListModel(this.answers, this.options.dirShift)
    );
    this.fs.copyTpl(
      this.templatePath(`../../entity-edit/template/entity-edit.html`),
      this.destinationPath(this.model.editComponentName + '.html'), answersToEditModel(this.answers, this.options.dirShift)
    );
  }

  end() {
    this.log(`Entity list have been successfully generated into ${this.destinationRoot()}`);
  }

  _getParams(): StudioTemplateProperty[] {
    return entityManagementGeneratorParams;
  }

  _getAvailableOptions(): OptionsConfig {
    return polymerElementOptionsConfig;
  }
}

export function answersToManagementModel(answers: EntityManagementAnswers, dirShift: string | undefined): EntityManagementTemplateModel {
  return {
    componentName: answers.managementComponentName,
    className: elementNameToClass(answers.managementComponentName),
    relDirShift: dirShift || '',
    listComponentName: answers.listComponentName,
    editComponentName: answers.editComponentName,
    listType: answers.listType
  }
}

export function answersToListModel(answers: EntityManagementAnswers, dirShift: string | undefined): EntityListTemplateModel | EntityCardsTemplateModel {
  return {
    componentName: answers.listComponentName,
    className: elementNameToClass(answers.listComponentName),
    relDirShift: dirShift || '',
    entity: answers.entity,
    view: answers.listView
  }
}

export function answersToEditModel(answers: EntityManagementAnswers, dirShift: string | undefined): EntityEditTemplateModel {
  const {fields, imports} = composeEditFields(answers.entity, answers.editView);
  return {
    fields,
    imports,
    componentName: answers.editComponentName,
    className: elementNameToClass(answers.editComponentName),
    relDirShift: dirShift || '',
    view: answers.editView,
    entity: answers.entity,
  }
}


export {
  Polymer2EntityManagementGenerator as generator,
  polymerElementOptionsConfig as options,
  entityManagementGeneratorParams as params
};