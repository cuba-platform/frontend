import {BaseGenerator} from "../../../common/generation";
import {EntityManagementAnswers, entityManagementGeneratorParams} from "./params";
import {OptionsConfig, PolymerElementOptions, polymerElementOptionsConfig} from "../../../common/cli-options";
import {EntityManagementTemplateModel} from "./template-model";
import * as path from "path";
import {StudioTemplateProperty} from "../../../common/studio/studio-model";
import {elementNameToClass, unCapitalizeFirst} from "../../../common/utils";
import {addToMenu} from "../common/menu";

class ReactEntityManagementGenerator extends BaseGenerator<EntityManagementAnswers, EntityManagementTemplateModel, PolymerElementOptions> {

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
    const {className} = this.model;

    this.fs.copyTpl(
      this.templatePath('EntityManagement.tsx'),
      this.destinationPath(className + '.tsx'), this.model
    );
    this.fs.copyTpl(
      this.templatePath('EntityManagementStore.ts'),
      this.destinationPath(className + 'Store.ts'), this.model
    );
    this.fs.copyTpl(
      this.templatePath('EntityManagementBrowser.tsx'),
      this.destinationPath(className + 'Browser.tsx'), this.model
    );
    this.fs.copyTpl(
      this.templatePath('EntityManagementEditor.tsx'),
      this.destinationPath(className + 'Editor.tsx'), this.model
    );

    if (!addToMenu(this.fs, {
      componentFileName: className,
      componentClassName: className,
      caption: className,
      dirShift: this.options.dirShift,
      destRoot: this.destinationRoot(),
      menuLink: '/'+this.model.nameLiteral,
      pathPattern: '/'+this.model.nameLiteral + '/:entityId?'
    })) {
      this.log('Unable to add component to menu: route registry not found');
    }
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
  const className = elementNameToClass(answers.managementComponentName);
  return {
    componentName: answers.managementComponentName,
    className: className,
    relDirShift: dirShift || '',
    listComponentName: answers.listComponentName,
    editComponentName: answers.editComponentName,
    listType: answers.listType,
    nameLiteral: unCapitalizeFirst(className),
    entity: answers.entity,
    listView: answers.listView,
    editView: answers.editView
  }
}

export {
  ReactEntityManagementGenerator as generator,
  polymerElementOptionsConfig as options,
  entityManagementGeneratorParams as params
};