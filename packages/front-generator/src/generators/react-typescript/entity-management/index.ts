import {BaseGenerator} from "../../../common/base-generator";
import {EntityManagementAnswers, entityManagementGeneratorParams} from "./params";
import {OptionsConfig, PolymerElementOptions, polymerElementOptionsConfig} from "../../../common/cli-options";
import {EditRelations, EntityManagementTemplateModel, RelationImport} from "./template-model";
import * as path from "path";
import {StudioTemplateProperty} from "../../../common/studio/studio-model";
import {elementNameToClass, unCapitalizeFirst} from "../../../common/utils";
import {addToMenu} from "../common/menu";
import {EntityAttribute, ProjectModel} from "../../../common/model/cuba-model";
import {findEntity} from "../../../common/model/cuba-model-utils";
import {EntityTemplateModel, getEntityPath} from "../common/template-model";
import * as entityManagementEn from "./entity-management-en.json";
import * as entityManagementRu from "./entity-management-ru.json";
import {writeComponentI18nMessages} from "../common/i18n";
import {createEntityTemplateModel, getDisplayedAttributes} from "../common/entity";

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

    writeComponentI18nMessages(this.fs, className, this.options.dirShift, entityManagementEn, entityManagementRu);

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
  const entity: EntityTemplateModel = createEntityTemplateModel(answers.entity, projectModel);

  const listAttributes: EntityAttribute[] =
    getDisplayedAttributes(answers.listView.allProperties, entity, projectModel);

  const editAttributes: EntityAttribute[] =
    getDisplayedAttributes(answers.editView.allProperties, entity, projectModel);

  const editRelations = getRelations(projectModel, editAttributes);

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
    listAttributes,
    editView: answers.editView,
    editAttributes,
    editRelations,
    relationImports: getRelationImports(editRelations, entity)
  }
}

export function getRelationImports(relations: EditRelations, entity: EntityTemplateModel): RelationImport[] {
  const entities: EntityTemplateModel[] = Object.values(relations);
  entities.unshift(entity);
  return entities
    // todo - need to think about className collision here (same className with different path)
    .reduce( // remove identical Imports (className and path both match)
      (acc, relationImport) => {
        if (!acc.some(ri => ri.className == relationImport.className && ri.path == relationImport.path)) {
          acc.push(relationImport);
        }
        return acc;
      } , [] as RelationImport[])
}

export function getRelations(projectModel: ProjectModel, attributes: EntityAttribute[]): EditRelations  {
  return attributes.reduce<EditRelations>((relations, attribute) => {
    if (attribute.type == null || attribute.mappingType !== 'ASSOCIATION') {
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
