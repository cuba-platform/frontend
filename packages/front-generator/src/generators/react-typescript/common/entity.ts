import {Entity, EntityAttribute, ProjectModel, ViewProperty} from "../../../common/model/cuba-model";
import {collectAttributesFromHierarchy} from "../../../common/model/cuba-model-utils";
import {EntityTemplateModel, getEntityPath} from "./template-model";

export function createEntityTemplateModel(entity: Entity, projectModel: ProjectModel) {
  return {
    ...entity,
    path: getEntityPath(entity, projectModel)
  };
}

export function getDisplayedAttributes(
  viewProperties: ViewProperty[], entity: EntityTemplateModel, projectModel: ProjectModel
): EntityAttribute[] {
  return viewProperties.reduce((attrArr: EntityAttribute[], prop) => {
    const attr = collectAttributesFromHierarchy(entity, projectModel).find(ea => ea.name === prop.name);
    if (attr && isDisplayedAttribute(attr)) {
      attrArr.push(attr);
    }
    return attrArr;
  }, []);
}

function isDisplayedAttribute(attr: EntityAttribute) {
  // Do not display one to many associations
  if (attr.mappingType === 'ASSOCIATION' && attr.cardinality === 'ONE_TO_MANY') {
    return false;
  }

  // Do not display one to one associations on the inverse side
  if (
    attr.mappingType === 'ASSOCIATION'
    && attr.cardinality === 'ONE_TO_ONE'
    && (attr.mappedBy && attr.mappedBy.length > 0)
  ) {
    return false;
  }

  // Do not display byte arrays
  // noinspection RedundantIfStatementJS
  if (attr.mappingType === 'DATATYPE' && attr.type?.fqn === 'byte[]') {
    return false;
  }

  return true;
}