import {EntityAttribute, ProjectModel, View} from "../../../../../common/model/cuba-model";
import {getDisplayedAttributes, ScreenType} from "../../../../../generators/react-typescript/common/entity";
import {EntityWithPath} from "../entity";

export type EditAttributesTemplateModel = {
  editAttributes: EntityAttribute[];
};

export type EditAttributesWithViewTemplateModel = EditAttributesTemplateModel & {
  editView: View;
};

export type EditViewAnswers = {
  entity: EntityWithPath;
  editView: View;
}

export type EditAttributesAnswers = {
  entity: EntityWithPath;
  editAttributes: string;
}

/**
 * Use in REST-based entity-management templates
 *
 * @param answers
 * @param projectModel
 */
export function deriveEditAttributesFromView(answers: EditViewAnswers, projectModel: ProjectModel) {
  return {
    editAttributes: getDisplayedAttributes(
      answers.editView.allProperties,
      answers.entity,
      projectModel,
      ScreenType.EDITOR
    ),
    editView: answers.editView
  };
}

/**
 * Use in GraphQL-based entity-management templates
 *
 * @param answers
 * @param projectModel
 */
export function deriveEditAttributesFromStringAnswer(answers: EditAttributesAnswers, projectModel: ProjectModel) {
  const viewProps = answers
    .editAttributes
    .split(',')
    .map(name => ({name}));

  return {
    editAttributes: getDisplayedAttributes(
      viewProps,
      answers.entity,
      projectModel,
      ScreenType.EDITOR
    )
  }
}
