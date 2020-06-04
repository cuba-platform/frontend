import {BaseGenerator} from '../../../../common/base-generator';
import {BaseEntityScreenAnswers} from './params';
import {BaseEntityScreenTemplateModel} from './template-model';
import {ComponentOptions} from '../../../../common/cli-options';
import {Entity, EntityAttribute, ProjectModel} from '../../../../common/model/cuba-model';
import {collectAttributesFromHierarchy, findEntity} from '../../../../common/model/cuba-model-utils';
import {isStringIdEntity} from '../entity';
import {fromStudioProperties} from '../../../../common/questions';
import {idAttrNameQuestions} from '../questions';
import {EntityTemplateModel} from '../template-model';
import {StudioTemplateProperty} from '../../../../common/studio/studio-model';

export abstract class BaseEntityScreenGenerator<
  A extends BaseEntityScreenAnswers,
  M extends BaseEntityScreenTemplateModel,
  O extends ComponentOptions
> extends BaseGenerator<A, M, O> {

  protected constructor(args: string | string[], options: ComponentOptions) {
    super(args, options);
  }

  protected async _getEntityFromAnswers(answers: A): Promise<Entity> {
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
    return entity;
  }

  protected async _stringIdPrompts(answers: A, entity: Entity): Promise<Partial<A>> {
    if (!this.cubaProjectModel) {
      throw Error('Additional prompt failed: cannot find project model');
    }

    let stringIdAnswers = {};
    if (isStringIdEntity(this.cubaProjectModel, entity)) {
      let idAttrNameAnswers = {};
      if (entity.idAttributeName == null) {
        // Seems that the project model was created with an older version of Studio.
        // Ask for ID attribute name.
        idAttrNameAnswers = await this.prompt(fromStudioProperties(
          idAttrNameQuestions, this.cubaProjectModel
        ));
      }

      // Ask whether to show the ID field in the List component
      const showIdAnswers = await this.prompt(fromStudioProperties(
        this._getListShowIdQuestions(), this.cubaProjectModel
      ));

      // Ask at which position to show the ID field in the List and Edit components
      const idPositionQuestions = [];
      if (showIdAnswers.listShowIdAttr) {
        idPositionQuestions.push(this._getListIdPositionQuestion());
      }
      if (this._getEditIdPositionQuestion != null) {
        idPositionQuestions.push(this._getEditIdPositionQuestion());
      }
      let idPositionAnswers = {};
      if (idPositionQuestions.length > 0) {
        idPositionAnswers = await this.prompt(fromStudioProperties(
          idPositionQuestions,
          this.cubaProjectModel
        ));
      }

      stringIdAnswers = {...idAttrNameAnswers, ...showIdAnswers, ...idPositionAnswers};
    }
    return stringIdAnswers;
  }

  protected abstract _getListShowIdQuestions(): StudioTemplateProperty[];
  protected abstract _getListIdPositionQuestion(): StudioTemplateProperty;

  /**
   * Has to be defined in the generator implementation only if it generates an Edit component.
   */
  protected _getEditIdPositionQuestion?(): StudioTemplateProperty;

}

export function stringIdAnswersToModel<
  A extends BaseEntityScreenAnswers,
  E extends EntityAttribute[] | undefined,
  R = E extends EntityAttribute[] ? EntityAttribute[] : undefined
>(
  answers: A,
  projectModel: ProjectModel,
  entity: EntityTemplateModel,
  listAttributesArg: EntityAttribute[],
  editAttributesArg?: E,
): {
  stringIdName?: string,
  listAttributes: EntityAttribute[],
  editAttributes: R,
} {

  const listAttributes = listAttributesArg.slice();
  const editAttributes = editAttributesArg?.slice();

  if (!isStringIdEntity(projectModel, entity)) {
    return {
      listAttributes,
      editAttributes: editAttributes as unknown as R
    };
  }

  const stringIdName = answers.entity.idAttributeName ?? answers.idAttrName;
  if (stringIdName == null) {
    throw new Error('Could not find the stringIdName');
  }
  const allEntityAttributes = collectAttributesFromHierarchy(entity, projectModel);
  const idAttr = allEntityAttributes.find(attr => attr.name === stringIdName);
  if (idAttr == null) {
    throw new Error(`Unable to find ID attribute. Expected the ID attribute to be named "${stringIdName}".`);
  }
  if (editAttributes != null && stringIdName !== 'id') {
    const impostorAttrIndex = editAttributes.findIndex(attr => attr.name === 'id');
    if (impostorAttrIndex !== -1) {
      // An edge case when we have a non-ID string attribute named "id", and a differently named ID attribute.
      // We do not show the attribute named "id" in the editor.
      // We still show it in the List Component (it will display the same value as the real ID attribute).
      editAttributes.splice(impostorAttrIndex, 1);
    }
  }
  if (editAttributes != null && answers.editIdAttrPos != null) {
    editAttributes.splice(answers.editIdAttrPos, 0, idAttr);
  }
  if (answers.listShowIdAttr && answers.listIdAttrPos != null) {
    listAttributes.splice(answers.listIdAttrPos, 0, idAttr);
  }

  return {
    stringIdName,
    listAttributes,
    editAttributes: editAttributes as unknown as R
  };
}
