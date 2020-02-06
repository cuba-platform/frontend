import {Entity, EntityAttribute, ProjectModel, ViewProperty} from "../../../common/model/cuba-model";
import {collectAttributesFromHierarchy} from "../../../common/model/cuba-model-utils";
import {EntityTemplateModel, getEntityPath} from "./template-model";

export function createEntityTemplateModel(entity: Entity, projectModel: ProjectModel) {
  return {
    ...entity,
    path: getEntityPath(entity, projectModel)
  };
}

export function determineDisplayedAttributes(
  viewProperties: ViewProperty[], entity: EntityTemplateModel, projectModel: ProjectModel
) {
  return viewProperties.reduce((attrArr: EntityAttribute[], prop) => {
    const attr = collectAttributesFromHierarchy(entity, projectModel).find(ea => ea.name === prop.name);
    if (attr) {
      attrArr.push(attr);
    }
    return attrArr;
  }, []).filter((attr: EntityAttribute) => {
    const isOneToManyAssociation = (attr.mappingType === 'ASSOCIATION' && attr.cardinality === 'ONE_TO_MANY');

    const isOneToOneAssociationInverseSide =
      attr.mappingType === 'ASSOCIATION'
      && attr.cardinality === 'ONE_TO_ONE'
      && (attr.mappedBy && attr.mappedBy.length > 0);

    const isByteArray = (attr.mappingType === 'DATATYPE' && attr.type?.fqn === 'byte[]');

    return !isOneToManyAssociation && !isOneToOneAssociationInverseSide && !isByteArray;
  });
}