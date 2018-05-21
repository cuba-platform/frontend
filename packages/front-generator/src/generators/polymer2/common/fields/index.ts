import {
  Cardinality,
  EntityAttribute,
  FILE_DESCRIPTOR_FQN,
  MappingType,
  TemporalType
} from "../../../../common/cuba-model";
import {render} from 'ejs';
import * as fs from "fs";
import * as path from "path";

export interface FieldModel {
  type: PolymerUIFieldType;
  bindPath: string;
  errorBindPath: string;
  label: string;
  required: boolean;
  maxLength: number | null;
}

export interface EnumFieldModel extends FieldModel {
  enumItems: string;
}

export interface LookupFieldModel extends FieldModel {
  lookupEntityName: string;
  itemsBindPath: string;
}

export const enum PolymerUIFieldType {
  ENUM = 'enum',
  FILE = 'file',
  LOOKUP = 'lookup',
  BOOLEAN = 'boolean',
  NUMBER = 'number',
  FP_NUMBER = 'fpNumber',
  TEXT = 'text',
  DATE = 'date',
  DATE_TIME = 'dateTime',
  TIME = 'time'
}

export const fieldDependencies = {
  [PolymerUIFieldType.BOOLEAN]: [
    'paper-checkbox/paper-checkbox.html'
  ],
  [PolymerUIFieldType.DATE]: [
    'paper-input/paper-input.html',
    'vaadin-date-picker/vaadin-date-picker-light.html',
    'iron-icons/iron-icons.html'
  ],
  [PolymerUIFieldType.DATE_TIME]: [
    'paper-input/paper-input.html'
  ],
  [PolymerUIFieldType.ENUM]: [
    'vaadin-combo-box/vaadin-combo-box.html'
  ],
  [PolymerUIFieldType.FILE]: [
    'cuba-file-field/cuba-file-field.html'
  ],
  [PolymerUIFieldType.FP_NUMBER]: [
    'paper-input/paper-input.html'
  ],
  [PolymerUIFieldType.NUMBER]: [
    'paper-input/paper-input.html'
  ],
  [PolymerUIFieldType.LOOKUP]: [
    'cuba-ui/cuba-lookup.html',
    'cuba-data/cuba-entities.html',
    'vaadin-combo-box/vaadin-combo-box.html'
  ],
  [PolymerUIFieldType.TEXT]: [
    'paper-input/paper-input.html'
  ],
  [PolymerUIFieldType.TIME]: [
    'paper-input/paper-input.html'
  ]
};

export const getFieldType = (attribute: EntityAttribute): PolymerUIFieldType => {
  if (attribute.mappingType === MappingType.ENUM) {
    return PolymerUIFieldType.ENUM;
  }
  if (isFile(attribute)) {
    return PolymerUIFieldType.FILE;
  }
  if (isToOneRelation(attribute)) {
    return PolymerUIFieldType.LOOKUP;
  }
  if (attribute.mappingType === MappingType.DATATYPE) {
    if (isAttributeTypeOf(attribute, 'java.lang.Boolean')) {
      return PolymerUIFieldType.BOOLEAN;
    }
    if (isAttributeTypeOf(attribute, 'java.lang.Integer') || isAttributeTypeOf(attribute, 'java.lang.Long')) {
      return PolymerUIFieldType.NUMBER;
    }
    if (isAttributeTypeOf(attribute, 'java.math.BigDecimal') || isAttributeTypeOf(attribute, 'java.lang.Double')) {
      return PolymerUIFieldType.FP_NUMBER;
    }
    if (isAttributeTypeOf(attribute, 'java.lang.String')) {
      return PolymerUIFieldType.TEXT;
    }
    if (isAttributeTypeOf(attribute, 'java.util.Date') && attribute.temporalType != null) {
      if (attribute.temporalType === TemporalType.DATE)
        return PolymerUIFieldType.DATE;
      if (attribute.temporalType == TemporalType.TIMESTAMP)
        return PolymerUIFieldType.DATE_TIME;
      if (attribute.temporalType == TemporalType.TIME)
        return PolymerUIFieldType.TIME;
    }
  }
  return PolymerUIFieldType.TEXT;
};

export const getFieldModel = (attribute: EntityAttribute): FieldModel | EnumFieldModel | LookupFieldModel => {
  const fieldType = getFieldType(attribute);
  let model: FieldModel | EnumFieldModel | LookupFieldModel = {
    type: fieldType,
    bindPath: 'entity.' + attribute.name,
    errorBindPath: 'serverErrors.' + attribute.name,
    label: `[[msg('${attribute.name}')]]`,
    required: attribute.mandatory,
    maxLength: attribute.length
  };
  if (fieldType === PolymerUIFieldType.ENUM) {
    (model as EnumFieldModel).enumItems = `[[enumValues('${attribute.type.fqn}')]]`;
  }
  if (fieldType === PolymerUIFieldType.LOOKUP && attribute.type.entityName) {
    (model as LookupFieldModel).lookupEntityName = attribute.type.entityName;
    (model as LookupFieldModel).itemsBindPath = `entity_${attribute.name}Options`
  }
  return model;
};

export const getFieldHtml = (model: FieldModel): string => {
  const html = render(fs.readFileSync(path.join(__dirname, 'template', model.type + 'Field.html'), 'utf8'), model);
  return html;
};

function isFile(attribute: EntityAttribute): boolean {
  return isToOneRelation(attribute) && isAttributeTypeOf(attribute, FILE_DESCRIPTOR_FQN);

}

function isToOneRelation(attribute: EntityAttribute): boolean {
  return (attribute.mappingType === MappingType.ASSOCIATION || attribute.mappingType === MappingType.COMPOSITION)
    && (attribute.cardinality === Cardinality.MANY_TO_ONE || attribute.cardinality === Cardinality.ONE_TO_ONE);
}

// todo extensions inheritance
function isAttributeTypeOf(attribute: EntityAttribute, fqn: string): boolean {
  return attribute.type != null && attribute.type.fqn === fqn;
}