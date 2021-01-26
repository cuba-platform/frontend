import * as Base from "yeoman-generator";
import {capitalizeFirst, elementNameToClass, normalizeRelativePath, unCapitalizeFirst} from '../../../common/utils';
import {writeComponentI18nMessages} from '../common/i18n';
import {addToMenu, addRoute, RouteInfo} from '../common/menu';
import {Entity, EntityAttribute, ProjectModel, View} from '../../../common/model/cuba-model';
import {EditRelations, EditRelationsSplit, EntityManagementTemplateModel, RelationImport} from './template-model';
import {EntityTemplateModel, getEntityPath} from '../common/template-model';
import {createEntityTemplateModel, getDisplayedAttributes, ScreenType} from '../common/entity';
import {getEntityFromAnswers, stringIdAnswersToModel, stringIdPrompts} from '../common/base-entity-screen-generator';
// noinspection ES6PreferShortImport
import {BaseEntityScreenAnswers} from '../common/base-entity-screen-generator/params';
// noinspection ES6PreferShortImport
import { ComponentOptions } from "../../../common/cli-options";
import {
  entityManagementGeneratorParams,
  listShowIdQuestions,
  listIdPositionQuestion,
  editIdPositionQuestion,
} from "./params";
import {StudioTemplateProperty, StudioTemplatePropertyType, ViewInfo} from '../../../common/studio/studio-model';
import {fromStudioProperties} from '../../../common/questions';
import {findEntity, findView} from '../../../common/model/cuba-model-utils';

/**
 * @deprecated
 */
export interface EntityManagementAnswers<T> extends BaseEntityScreenAnswers {
  managementComponentName: string;
  listType: T;
  listComponentName: string;
  listView: View;
  editComponentName: string;
  editView: View;
  nestedEntityInfo?: Record<string, string>;
}

/**
 * @deprecated
 */
export function writeReactTSEntityManagement<
  T extends string,
  A extends EntityManagementAnswers<T>,
  O extends ComponentOptions>(
  gen: Pick<Base, 'log' | 'destinationPath' | 'destinationRoot' | 'templatePath' | 'fs'> & {
    answers?: A,
    options?: O,
  },
  componentMessagesPerLocale: Record<string, Record<string, string>>,
  cubaProjectModel?: ProjectModel,
): { model: EntityManagementTemplateModel<T> } {
  gen.log(`Generating to ${gen.destinationPath()}`);

  const {answers, options} = gen;
  if (answers == null) {
    throw Error('Answers not found when trying to write an entity management component')
  }
  if (options == null) {
    throw Error('Options not found when trying to write an entity management component');
  }
  if (cubaProjectModel == null) {
    throw Error('Project model not found when trying to write an entity management component');
  }

  const model = answersToManagementModel<T, A, O>(answers, cubaProjectModel, options.dirShift);
  const {className, listComponentClass, editComponentClass, listType} = model;

  const extension = '.tsx.ejs';

  writeManagementComponent(gen, extension, className, model);
  writeListComponent(gen, listType, extension, listComponentClass, model);
  writeEditorComponent(gen, extension, editComponentClass, model);
  writeComponentI18nMessages(
    gen.fs,
    className,
    options.dirShift,
    cubaProjectModel.project?.locales,
    componentMessagesPerLocale
  );
  addMenuItem(gen, options, className, model);

  return {model};
}

/**
 * @deprecated
 */
export function writeManagementComponent<T extends string, M extends EntityManagementTemplateModel<T>>(
  gen: Pick<Base, 'fs' | 'templatePath' | 'destinationPath'>,
  extension: string,
  className: string,
  model: M
) {
  gen.fs.copyTpl(
    gen.templatePath('EntityManagement' + extension),
    gen.destinationPath(className + extension), model
  );
}

/**
 * @deprecated
 */
export function writeListComponent<T extends string, M extends EntityManagementTemplateModel<T>>(
  gen: Pick<Base, 'fs' | 'templatePath' | 'destinationPath'>,
  listType: string,
  extension: string,
  listComponentClass: string,
  model: M
) {
  const listTemplateFile = capitalizeFirst(listType) + extension;
  gen.fs.copyTpl(
    gen.templatePath(listTemplateFile),
    gen.destinationPath(listComponentClass + extension), model
  );
}

/**
 * @deprecated
 */
export function writeEditorComponent<T extends string, M extends EntityManagementTemplateModel<T>>(
  gen: Pick<Base, 'fs' | 'templatePath' | 'destinationPath'>,
  extension: string,
  editComponentClass: string,
  model: M
) {
  gen.fs.copyTpl(
    gen.templatePath('EntityManagementEditor' + extension),
    gen.destinationPath(editComponentClass + extension), model
  );
}

/**
 * @deprecated
 */
export function addMenuItem<T extends string, M extends EntityManagementTemplateModel<T>, O extends ComponentOptions>(
  gen: Pick<Base, 'fs' | 'destinationRoot' | 'log'>,
  options: O,
  className: string,
  model: M,
  addRouteCallback: (
    routingContents: string,
    routeInfo: RouteInfo,
    customComponentParams?: any
  ) => string = addRoute,
  customComponentParams?: any
) {
  if (!addToMenu(gen.fs, {
    componentFileName: className,
    componentClassName: className,
    caption: className,
    dirShift: options.dirShift,
    destRoot: gen.destinationRoot(),
    menuLink: '/' + model.nameLiteral,
    pathPattern: '/' + model.nameLiteral + '/:entityId?'
  },
    addRouteCallback,
    customComponentParams
  )) {
    gen.log('Unable to add component to menu: route registry not found');
  }
}

/**
 * @deprecated
 */
export function answersToManagementModel<
  T extends string,
  A extends EntityManagementAnswers<T>,
  O extends ComponentOptions
>(answers: A,
  projectModel: ProjectModel,
  dirShift: string | undefined
): EntityManagementTemplateModel<T> {
  const className = elementNameToClass(answers.managementComponentName);
  const entity: EntityTemplateModel = createEntityTemplateModel(answers.entity, projectModel);

  const { stringIdName, listAttributes, editAttributes } = stringIdAnswersToModel(
    answers,
    projectModel,
    entity,
    getDisplayedAttributes(answers.listView.allProperties, entity, projectModel, ScreenType.BROWSER),
    getDisplayedAttributes(answers.editView.allProperties, entity, projectModel, ScreenType.EDITOR)
  );

  const readOnlyFields = editAttributes
    .filter((attr: EntityAttribute) => attr.readOnly)
    .map((attr: EntityAttribute) => attr.name);

  const { editAssociations, editCompositions } = getRelations(projectModel, editAttributes);

  const nestedEntityInfo = answers.nestedEntityInfo;

  // Associations only
  const relationImports = getRelationImports(editAssociations, entity);

  return {
    componentName: answers.managementComponentName,
    className,
    relDirShift: normalizeRelativePath(dirShift),
    listComponentClass: elementNameToClass(answers.listComponentName),
    editComponentClass: elementNameToClass(answers.editComponentName),
    listType: answers.listType,
    nameLiteral: unCapitalizeFirst(className),
    entity,
    listView: answers.listView,
    listAttributes,
    editView: answers.editView,
    editAttributes,
    readOnlyFields,
    nestedEntityInfo,
    editCompositions,
    editAssociations,
    relationImports,
    stringIdName
  }
}

/**
 * @deprecated
 */
export async function additionalPrompts<T extends string, A extends EntityManagementAnswers<T>>(
  gen: Pick<Base, 'prompt'>,
  answers: A,
  cubaProjectModel: ProjectModel,
): Promise<A> {
  const entity = await getEntityFromAnswers(answers, cubaProjectModel);

  const stringIdAnswers = await stringIdPrompts(
    gen,
    entity,
    cubaProjectModel,
    listShowIdQuestions,
    listIdPositionQuestion,
    editIdPositionQuestion
  );

  const nestedEntityInfo = await nestedEntityPrompts(
    gen,
    answers,
    entity,
    cubaProjectModel
  );

  return {
    ...answers,
    ...stringIdAnswers,
    ...nestedEntityInfo
  };
}

/**
 * @deprecated
 */
export async function nestedEntityPrompts<T extends string, A extends EntityManagementAnswers<T>>(
  gen: Pick<Base, 'prompt'>,
  answers: A,
  entity: Entity,
  cubaProjectModel: ProjectModel,
): Promise<Partial<A>> {

  const viewAttrs = getViewAttrs(cubaProjectModel, answers);

  const nestedEntityQuestions = entity.attributes
    .filter(attr => viewAttrs.includes(attr.name))
    .reduce((questions: StudioTemplateProperty[], attr: EntityAttribute) => {
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

  let nestedEntityInfo = {};
  if (nestedEntityQuestions.length > 0) {
    const nestedEntityAnswers = await gen.prompt(fromStudioProperties(nestedEntityQuestions, cubaProjectModel));

    nestedEntityInfo = Object.values(nestedEntityAnswers).reduce((result, answer) => {
      result = {...result, ...answer};
      return result;
    }, {});
  }

  return nestedEntityInfo;
}

/**
 * @deprecated
 */
export function getViewAttrs<T extends string, A extends EntityManagementAnswers<T>>(
  projectModel: ProjectModel,
  answers: A
): string[] {
  const listView = findView(projectModel, answers.listView as unknown as ViewInfo);
  const editView = findView(projectModel, answers.editView as unknown as ViewInfo);
  const listAttrs = listView?.allProperties.map(p => p.name) || [];
  const editAttrs = editView?.allProperties.map(p => p.name) || [];
  return [...new Set([...listAttrs, ...editAttrs])];
}

/**
 * @deprecated
 */
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

/**
 * @deprecated
 */
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

/**
 * @deprecated
 */
export {
  EntityManagementTemplateModel,
  entityManagementGeneratorParams,
  listShowIdQuestions,
  listIdPositionQuestion,
  editIdPositionQuestion
};
