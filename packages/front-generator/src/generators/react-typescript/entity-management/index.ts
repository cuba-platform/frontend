import {BaseGenerator} from "../../../common/base-generator";
import {EntityManagementAnswers, entityManagementGeneratorParams} from "./params";
import {OptionsConfig, PolymerElementOptions, polymerElementOptionsConfig} from "../../../common/cli-options";
import {EditRelations, EditRelationsSplit, EntityManagementTemplateModel, RelationImport} from "./template-model";
import * as path from "path";
import {StudioTemplateProperty, StudioTemplatePropertyType} from "../../../common/studio/studio-model";
import {capitalizeFirst, elementNameToClass, unCapitalizeFirst} from "../../../common/utils";
import {addToMenu} from "../common/menu";
import {EntityAttribute, ProjectModel} from "../../../common/model/cuba-model";
import {findEntity} from "../../../common/model/cuba-model-utils";
import {EntityTemplateModel, getEntityPath} from "../common/template-model";
import * as entityManagementEn from "./entity-management-en.json";
import * as entityManagementRu from "./entity-management-ru.json";
import {writeComponentI18nMessages} from "../common/i18n";
import {createEntityTemplateModel, getDisplayedAttributes, ScreenType} from "../common/entity";
import {fromStudioProperties} from '../../../common/questions';

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
    const {className, listComponentName, editComponentName, listType} = this.model;

    const extension = '.tsx.ejs';
    this.fs.copyTpl(
      this.templatePath('EntityManagement' + extension),
      this.destinationPath(className + extension), this.model
    );

    let listTemplateFile = capitalizeFirst(listType) + extension;
    this.fs.copyTpl(
      this.templatePath(listTemplateFile),
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

  async _additionalPrompts(answers: EntityManagementAnswers): Promise<EntityManagementAnswers> {
    if (!this.cubaProjectModel) {
      throw Error('Additional prompt failed: cannot find project model');
    }
    const entityName = answers.entity.name;
    if (!entityName) {
      throw Error('Additional prompt failed: cannot find entity name');
    }
    const entity = findEntity(this.cubaProjectModel, entityName);
    if (!entity) {
      throw Error('Additional prompt failed: cannot find entity');
    }

    const nestedEntityQuestions = entity.attributes.reduce((questions: StudioTemplateProperty[], attr: EntityAttribute) => {
      if (attr.mappingType === 'COMPOSITION') {
        questions.push(
          {
            code: 'nestedEntityView_' + attr.name,
            caption: 'View for nested entity attribute ' + attr.name,
            propertyType: StudioTemplatePropertyType.NESTED_ENTITY_VIEW,
            options: [attr.name, attr.type.entityName!],
            required: true
          },
        );
      }
      return questions;
    }, []);

    const nestedEntityAnswers = await this.prompt(fromStudioProperties(nestedEntityQuestions, this.cubaProjectModel));

    const nestedEntityInfo = Object.values(nestedEntityAnswers).reduce((result, answer) => {
      result = {...result, ...answer};
      return result;
    }, {});

    return {...answers, nestedEntityInfo};
  }
}

export function answersToManagementModel(answers: EntityManagementAnswers,
                                         projectModel:ProjectModel,
                                         dirShift: string | undefined): EntityManagementTemplateModel {
  const className = elementNameToClass(answers.managementComponentName);
  const entity: EntityTemplateModel = createEntityTemplateModel(answers.entity, projectModel);

  const listAttributes: EntityAttribute[] =
    getDisplayedAttributes(answers.listView.allProperties, entity, projectModel, ScreenType.BROWSER);

  const editAttributes: EntityAttribute[] =
    getDisplayedAttributes(answers.editView.allProperties, entity, projectModel, ScreenType.EDITOR);

  const { editAssociations, editCompositions } = getRelations(projectModel, editAttributes);

  const nestedEntityInfo = answers.nestedEntityInfo;

  // Associations only
  const relationImports = getRelationImports(editAssociations, entity);

  return {
    componentName: answers.managementComponentName,
    className,
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
    nestedEntityInfo,
    editCompositions,
    editAssociations,
    relationImports
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

export function getRelations(projectModel: ProjectModel, attributes: EntityAttribute[]): EditRelationsSplit {
  return attributes.reduce<EditRelationsSplit>((relations, attribute) => {
    if (attribute.type == null || (attribute.mappingType !== 'ASSOCIATION' && attribute.mappingType !== 'COMPOSITION')) {
      return relations;
    }
    const entity = findEntity(projectModel, attribute.type.entityName!);
    if (entity) {
      const entityWithPath = {
        ...entity,
        path: getEntityPath(entity, projectModel)
      };
      if (attribute.mappingType === 'ASSOCIATION') {
        relations.editAssociations[attribute.name] = entityWithPath;
      }
      if (attribute.mappingType === 'COMPOSITION') {
        relations.editCompositions[attribute.name] = entityWithPath;
      }
    }
    return relations;
  }, {editAssociations: {}, editCompositions: {}});
}

const description = 'CRUD (list + editor) screens for specified entity';

export {
  ReactEntityManagementGenerator as generator,
  polymerElementOptionsConfig as options,
  entityManagementGeneratorParams as params,
  description
};
