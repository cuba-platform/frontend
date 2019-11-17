import {EntityAttribute, FILE_DESCRIPTOR_FQN} from "../../../../common/model/cuba-model";
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
    'vaadin-checkbox/vaadin-checkbox.html'
  ],
  [PolymerUIFieldType.DATE]: [
    'vaadin-text-field/vaadin-text-field.html',
    'vaadin-date-picker/vaadin-date-picker-light.html',
    'iron-icons/iron-icons.html'
  ],
  [PolymerUIFieldType.DATE_TIME]: [
    'vaadin-text-field/vaadin-text-field.html'
  ],
  [PolymerUIFieldType.ENUM]: [
    'vaadin-combo-box/vaadin-combo-box.html'
  ],
  [PolymerUIFieldType.FILE]: [
    'cuba-file-field/cuba-file-field.html'
  ],
  [PolymerUIFieldType.FP_NUMBER]: [
    'vaadin-text-field/vaadin-text-field.html'
  ],
  [PolymerUIFieldType.NUMBER]: [
    'vaadin-text-field/vaadin-text-field.html'
  ],
  [PolymerUIFieldType.LOOKUP]: [
    'cuba-ui/cuba-lookup.html',
    'cuba-data/cuba-entities.html',
    'vaadin-combo-box/vaadin-combo-box.html'
  ],
  [PolymerUIFieldType.TEXT]: [
    'vaadin-text-field/vaadin-text-field.html'
  ],
  [PolymerUIFieldType.TIME]: [
    'vaadin-text-field/vaadin-text-field.html'
  ]
};

export const getFieldType = (attribute: EntityAttribute): PolymerUIFieldType => {
  if (attribute.mappingType === 'ENUM') {
    return PolymerUIFieldType.ENUM;
  }
  if (isFile(attribute)) {
    return PolymerUIFieldType.FILE;
  }
  if (isToOneRelation(attribute)) {
    return PolymerUIFieldType.LOOKUP;
  }
  if (attribute.mappingType === 'DATATYPE') {
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
      if (attribute.temporalType === 'DATE')
        return PolymerUIFieldType.DATE;
      if (attribute.temporalType == 'TIMESTAMP')
        return PolymerUIFieldType.DATE_TIME;
      if (attribute.temporalType == 'TIME')
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
  return render(fs.readFileSync(path.join(__dirname, 'template', model.type + 'Field.html'), 'utf8'), model);
};

function isFile(attribute: EntityAttribute): boolean {
  return isToOneRelation(attribute) && isAttributeTypeOf(attribute, FILE_DESCRIPTOR_FQN);

}

function isToOneRelation(attribute: EntityAttribute): boolean {
  return (attribute.mappingType === 'ASSOCIATION' || attribute.mappingType === 'COMPOSITION')
    && (attribute.cardinality === 'MANY_TO_ONE' || attribute.cardinality === 'ONE_TO_ONE');
}

// todo extensions inheritance
function isAttributeTypeOf(attribute: EntityAttribute, fqn: string): boolean {
  return attribute.type != null && attribute.type.fqn === fqn;
}