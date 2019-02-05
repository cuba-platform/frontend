import {StudioTemplateProperty, StudioTemplatePropertyType} from "../../../common/cuba-studio";
import {Entity, View} from "../../../common/model/cuba-model";

export const entityEditParams: StudioTemplateProperty[] = [
  {
    caption: "Entity",
    code: "entity",
    propertyType: StudioTemplatePropertyType.ENTITY,
    required: true
  },
  {
    caption: "Edit component name",
    code: "editComponentName",
    propertyType: StudioTemplatePropertyType.POLYMER_COMPONENT_NAME,
    defaultValue: "-edit",
    required: true
  },
  {
    caption: "Edit view",
    code: "editView",
    propertyType: StudioTemplatePropertyType.VIEW,
    relatedProperty: "entity",
    required: true
  }
];

export interface EntityEditAnswers {
  entity: Entity;
  editComponentName: string;
  editView: View;
}