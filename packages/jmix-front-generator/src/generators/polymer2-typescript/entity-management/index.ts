import {EntityManagementTemplateModel} from "../../polymer2/entity-management/template-model";
import {OptionsConfig, PolymerElementOptions, polymerElementOptionsConfig} from "../../../common/cli-options";
import * as path from "path";
import {BaseGenerator} from "../../../common/base-generator";
import {StudioTemplateProperty} from "../../../common/studio/studio-model";
import {EntityManagementAnswers, entityManagementGeneratorParams} from "../../polymer2/entity-management/params";
import {answersToEditModel, answersToListModel, answersToManagementModel} from "../../polymer2/entity-management";
import {TSPolymerElementModel} from "../common";

type TemplateModel = EntityManagementTemplateModel & TSPolymerElementModel & {listComponentClass: string};

class Polymer2EntityManagementTSGenerator extends BaseGenerator<EntityManagementAnswers, TemplateModel, PolymerElementOptions> {

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
    const projectNamespace = this.cubaProjectModel!.project.namespace;
    const listTemplateModel = {projectNamespace, ...answersToListModel(this.answers, this.options.dirShift)};
    const editTemplateModel = {projectNamespace, ...answersToEditModel(this.answers, this.options.dirShift)};
    this.model = {
      projectNamespace,
      ...answersToManagementModel(this.answers, this.options.dirShift),
      listComponentClass: listTemplateModel.className
    };
    this.fs.copyTpl(
      this.templatePath('entity-management.html'),
      this.destinationPath(this.model.componentName + '.html'),
      this.model
    );
    this.fs.copyTpl(
      this.templatePath('entity-management.ts'),
      this.destinationPath(this.model.componentName + '.ts'),
      this.model
    );


    this.fs.copyTpl(
      this.templatePath(`../../entity-${this.model.listType}/template/entity-${this.model.listType}.html`),
      this.destinationPath(this.model.listComponentName + '.html'),
      listTemplateModel
    );
    this.fs.copyTpl(
      this.templatePath(`../../entity-${this.model.listType}/template/entity-${this.model.listType}.ts`),
      this.destinationPath(this.model.listComponentName + '.ts'),
      listTemplateModel
    );

    this.fs.copyTpl(
      this.templatePath(`../../entity-edit/template/entity-edit.html`),
      this.destinationPath(this.model.editComponentName + '.html'), editTemplateModel
    );
    this.fs.copyTpl(
      this.templatePath(`../../entity-edit/template/entity-edit.ts`),
      this.destinationPath(this.model.editComponentName + '.ts'), editTemplateModel
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


export {
  Polymer2EntityManagementTSGenerator as generator,
  polymerElementOptionsConfig as options,
  entityManagementGeneratorParams as params
};