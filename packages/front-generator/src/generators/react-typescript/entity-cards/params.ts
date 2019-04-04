import {StudioTemplateProperty, StudioTemplatePropertyType} from "../../../common/studio/studio-model";
import {Entity, View} from "../../../common/model/cuba-model";

export const entityCardsParams: StudioTemplateProperty[] = [
  {
    caption: "Entity",
    code: "entity",
    propertyType: StudioTemplatePropertyType.ENTITY,
    required: true
  },
  {
    caption: "Component class name",
    code: "componentName",
    propertyType: StudioTemplatePropertyType.POLYMER_COMPONENT_NAME,
    defaultValue: "Cards",
    required: true
  },
  {
    caption: "Entity view",
    code: "entityView",
    propertyType: StudioTemplatePropertyType.VIEW,
    relatedProperty: "entity",
    required: true
  }
];

export interface EntityCardsAnswers {
  entity: Entity;
  componentName: string;
  entityView: View;
}