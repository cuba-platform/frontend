import {Entity, EntityAttribute, ProjectModel, ViewProperty} from "../../../common/model/cuba-model";
import {collectAttributesFromHierarchy} from "../../../common/model/cuba-model-utils";
import {EntityTemplateModel, getEntityPath} from "./template-model";

export enum ScreenType {
  BROWSER = 'browser',
  EDITOR = 'editor'
}

export function createEntityTemplateModel(entity: Entity, projectModel: ProjectModel) {
  return {
    ...entity,
    path: getEntityPath(entity, projectModel)
  };
}

export function getDisplayedAttributes(
  viewProperties: ViewProperty[], entity: EntityTemplateModel, projectModel: ProjectModel, screenType: ScreenType
): EntityAttribute[] {
  return viewProperties.reduce((attrArr: EntityAttribute[], prop) => {
    const attr = collectAttributesFromHierarchy(entity, projectModel).find(ea => ea.name === prop.name);
    if (attr && isDisplayedAttribute(attr, screenType)) {
      attrArr.push(attr);
    }
    return attrArr;
  }, []);
}

function isDisplayedAttribute(attr: EntityAttribute, screenType: ScreenType) {
  if (screenType === ScreenType.BROWSER) {
    // Do not display many to many associations in browser
    if (attr.mappingType === 'ASSOCIATION' && attr.cardinality === "MANY_TO_MANY") {
      return false;
    }

    // Do not display one to many compositions in browser
    if (attr.mappingType === 'COMPOSITION' && attr.cardinality === 'ONE_TO_MANY') {
      return false;
    }
  }

  // Do not display one to many associations
  if (attr.mappingType === 'ASSOCIATION' && attr.cardinality === 'ONE_TO_MANY') {
    return false;
  }

  // Do not display byte arrays
  // noinspection RedundantIfStatementJS
  if (attr.mappingType === 'DATATYPE' && attr.type?.fqn === 'byte[]') {
    return false;
  }

  return true;
}
