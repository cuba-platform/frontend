import {BaseGenerator} from "../../../common/base-generator";
import {EntityManagementAnswers, entityManagementGeneratorParams} from "./params";
import {OptionsConfig, PolymerElementOptions, polymerElementOptionsConfig} from "../../../common/cli-options";
import {EditRelations, EntityManagementTemplateModel} from "./template-model";
import * as path from "path";
import {StudioTemplateProperty} from "../../../common/studio/studio-model";
import {elementNameToClass, unCapitalizeFirst} from "../../../common/utils";
import {addToMenu} from "../common/menu";
import {EntityAttribute, MappingType, ProjectModel} from "../../../common/model/cuba-model";
import {collectAttributesFromHierarchy, findEntity, isToOneAttribute} from "../../../common/model/cuba-model-utils";
import {EntityTemplateModel, getEntityPath} from "../common/template-model";
import * as entityManagementEn from "./entity-management-en.json";
import * as entityManagementRu from "./entity-management-ru.json";
import { writeI18nMessages } from "../common/i18n";

class ReactEntityManagementGenerator extends BaseGenerator<EntityManagementAnswers, EntityManagementTemplateModel, PolymerElementOptions> {

  constructor(args: string | string[], options: PolymerElementOptions) {
    super(args, options);
    this.sourceRoot(path.join(__dirname, 'template'));
  }

  // noinspection JSUnusedGlobalSymbols
  async prompting() {
    await this._obtainAnswers();
  }

  // noinspection JSUnusedGlobalSymbols
  writing() {
    this.log(`Generating to ${this.destinationPath()}`);
    if (!this.answers) {
      throw new Error('Answers not provided');
    }
    this.model = answersToManagementModel(this.answers, this.cubaProjectModel!, this.options.dirShift);
    const {className, listComponentName, editComponentName} = this.model;

    const extension = '.tsx.ejs';
    this.fs.copyTpl(
      this.templatePath('EntityManagement' + extension),
      this.destinationPath(className + extension), this.model
    );
    this.fs.copyTpl(
      this.templatePath('EntityManagementBrowser' + extension),
      this.destinationPath(listComponentName + extension), this.model
    );
    this.fs.copyTpl(
      this.templatePath('EntityManagementEditor' + extension),
      this.destinationPath(editComponentName + extension), this.model
    );

    writeI18nMessages(this.fs, className, this.options.dirShift, entityManagementEn, entityManagementRu);

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

export function answersToManagementModel(answers: EntityManagementAnswers,
                                         projectModel:ProjectModel,
                                         dirShift: string | undefined): EntityManagementTemplateModel {
  const className = elementNameToClass(answers.managementComponentName);
  const entity: EntityTemplateModel = {
    ...answers.entity,
    path: getEntityPath(answers.entity, projectModel)
  };

  const attributesInView: EntityAttribute[] = answers.editView.allProperties.reduce((attrArrMap:EntityAttribute[], prop) => {
    const attr = collectAttributesFromHierarchy(entity, projectModel).find(ea => ea.name === prop.name);
    if (attr) {
      attrArrMap.push(attr);
    }
    return attrArrMap;
  }, []);

  return {
    componentName: answers.managementComponentName,
    className: className,
    relDirShift: dirShift || '',
    listComponentName: answers.listComponentName,
    editComponentName: answers.editComponentName,
    listType: answers.listType,
    nameLiteral: unCapitalizeFirst(className),
    entity,
    listView: answers.listView,
    editView: answers.editView,
    editAttributes: attributesInView,
    editRelations: getRelations(projectModel, attributesInView)
  }
}

function getRelations(projectModel: ProjectModel, attributes: EntityAttribute[]): EditRelations  {
  return attributes.reduce<EditRelations>((relations, attribute) => {
    if (attribute.type == null || attribute.mappingType !== MappingType.ASSOCIATION) {
      return relations;
    }
    const entity = findEntity(projectModel, attribute.type.entityName!);
    if (entity) {
      relations[attribute.name] = {
        ...entity,
        path: getEntityPath(entity, projectModel)
      }
    }
    return relations;
  }, {});
}

const description = 'CRUD (list + editor) screens for specified entity';

export {
  ReactEntityManagementGenerator as generator,
  polymerElementOptionsConfig as options,
  entityManagementGeneratorParams as params,
  description
};
