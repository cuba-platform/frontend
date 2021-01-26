import {EntityAttribute, ProjectModel, View} from "../../../../../common/model/cuba-model";
import {getDisplayedAttributes, ScreenType} from "../../../../../generators/react-typescript/common/entity";
import {EntityWithPath} from "../entity";

export type ListAttributesTemplateModel = {
  listAttributes: EntityAttribute[];
}

export type ListAttributesWithViewTemplateModel = ListAttributesTemplateModel & {
  listView: View;
}

export type ListViewAnswers = {
  entity: EntityWithPath;
  listView: View;
}

export type ListAttributesAnswers = {
  entity: EntityWithPath;
  listAttributes: string;
}

/**
 * To be used in REST-based templates that are displaying entities
 *
 * @param answers
 * @param projectModel
 */
export const deriveViewBasedBrowserTemplateModel = (
  answers: ListViewAnswers, projectModel: ProjectModel
): ListAttributesWithViewTemplateModel => {
  return {
    listView: answers.listView,
    listAttributes: getDisplayedAttributes(
      answers.listView.allProperties,
      answers.entity,
      projectModel,
      ScreenType.BROWSER
    )
  };
}

/**
 * To be used in GraphQL-based templates that are displaying entities
 *
 * @param answers
 * @param projectModel
 */
export const deriveListAttributesFromStringAnswer = (
  answers: ListAttributesAnswers, projectModel: ProjectModel
): ListAttributesTemplateModel => {
  const viewProps = answers
    .listAttributes
    .split(',')
    .map(name => ({name}));

  return {
    listAttributes: getDisplayedAttributes(
      viewProps,
      answers.entity,
      projectModel,
      ScreenType.BROWSER
    )
  };
}