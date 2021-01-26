import {ProjectModel} from "../../../../common/model/cuba-model";
import {
  EntityInfo, RestQueryInfo, RestServiceMethodInfo,
  StudioTemplateProperty,
  StudioTemplatePropertyType,
  ViewInfo
} from "../../../../common/studio/studio-model";
import {findEntity, findQuery, findServiceMethod, findView} from "../../../../common/model/cuba-model-utils";

/**
 * This function takes the answers and adds context / additional data retrieved from project model
 *
 * @param projectModel
 * @param generatorParams
 * @param answers
 */
export function refineAnswers<T>(projectModel: ProjectModel, generatorParams: StudioTemplateProperty[], answers: any): T {
  const refinedAnswers: { [key: string]: any } = {};

  if (answers == null) return refinedAnswers as T;

  Object.keys(answers).forEach((key: string) => {
    const prop = generatorParams.find(p => p.code === key);

    // leave answer as is if it is not exist in props
    if (prop == null) {
      refinedAnswers[key] = answers[key];
      return;
    }

    switch (prop.propertyType) {
      case StudioTemplatePropertyType.ENTITY:
        refinedAnswers[key] = findEntity(projectModel, (answers[key] as EntityInfo));
        return;
      case StudioTemplatePropertyType.VIEW:
        refinedAnswers[key] = findView(projectModel, (answers[key] as ViewInfo));
        return;
      case StudioTemplatePropertyType.REST_QUERY:
        refinedAnswers[key] = findQuery(projectModel, (answers[key] as RestQueryInfo));
        return;
      case StudioTemplatePropertyType.REST_SERVICE_METHOD:
        refinedAnswers[key] = findServiceMethod(projectModel, (answers[key] as RestServiceMethodInfo));
        return;
      case StudioTemplatePropertyType.INTEGER:
        const value = answers[key];
        if (!Number.isInteger(value)) throw new Error(`Question with code '${key}' has INTEGER type and can't contain '${value}' as answer`);
        refinedAnswers[key] = value;
        return;
      default:
        refinedAnswers[key] = answers[key];
    }
  });
  return refinedAnswers as T;
}
