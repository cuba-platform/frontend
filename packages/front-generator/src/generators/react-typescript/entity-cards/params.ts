import {StudioTemplateProperty, StudioTemplatePropertyType} from "../../../common/studio/studio-model";
import {Entity, View} from "../../../common/model/cuba-model";
import {BaseEntityScreenAnswers} from '../common/base-entity-screen-generator/params';

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

export const listShowIdQuestions = [
  {
    code: 'listShowIdAttr',
    caption: 'Show ID attribute in the component?',
    propertyType: StudioTemplatePropertyType.BOOLEAN,
    required: true
  }
];

export const listIdPositionQuestion = {
  code: 'listIdAttrPos',
  caption: 'Position of the ID attribute in the card \n' +
    '(behaves like an array index, e.g. enter 0 for the ID to appear as the first row, \n' +
    '-1 for next-to-last, etc.).',
  propertyType: StudioTemplatePropertyType.INTEGER,
  required: true
};

export interface EntityCardsAnswers extends BaseEntityScreenAnswers {
  componentName: string;
  entityView: View;
}