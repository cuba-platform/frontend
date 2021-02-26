export interface ProjectModel {
  project: ProjectInfo;
  entities: Entity[] | {[entityName: string]: Entity};
  baseProjectEntities?: Entity[] | {[entityName: string]: Entity};
  enums: Enum[];
  views: View[];
  restQueries: RestQuery[];
  restServices: RestService[];
}

export interface ProjectInfo {
  name: string;
  namespace: string;
  modulePrefix: string;
  locales: Locale[];
  restClientId?: string;
  restClientSecret?: string;
}

export type InheritanceType = 'SINGLE_TABLE' | 'TABLE_PER_CLASS' | 'JOINED'

export interface Entity {
  name?: string;
  className: string;
  packageName: string;
  dataStore?: string,
  table?: string,
  parentClassName: string,
  discriminator?: string,
  updatable: boolean,
  creatable: boolean,
  hasUuid: boolean,
  softDelete: boolean,
  versioned: boolean,
  reference?: string,
  parentPackage: string,
  embeddable: boolean,
  persistentEntity: boolean,
  replaceParent: boolean,
  systemLevel: boolean,
  namePattern?: string,
  mappedSuperclass: boolean,
  fqn: string,
  imported: boolean,
  attributes: EntityAttribute[],
  inheritanceType?: InheritanceType,
  idAttributeName?: string
}

export interface Datatype {
  packageName: string;
  className: string;
  fqn: string;
  label: string;
  entityName?: string
}

export interface EnumValue {
  id: string;
  name: string;
}

export interface Enum extends Datatype {
  values: EnumValue[]
}

export type MappingType = 'DATATYPE' | 'ENUM' | 'ASSOCIATION' | 'COMPOSITION' | 'EMBEDDED'

export type TemporalType = 'DATE' | 'TIME' | 'TIMESTAMP'

export type Cardinality = 'ONE_TO_ONE' | 'ONE_TO_MANY' | 'MANY_TO_ONE' | 'MANY_TO_MANY'

export interface EntityAttribute {
  name: string;
  type: Datatype;
  mappingType: MappingType;
  cardinality?: Cardinality;
  readOnly: boolean;
  column: string;
  mandatory: boolean;
  unique: boolean;
  length: number; // TODO VP: should be optional, but that would break polymer generator
  mappedBy?: string;
  transient: boolean;
  temporalType?: TemporalType;
  attributes?: EntityAttribute[];
}

export interface View {
  name: string;
  entity: string;
  classFqn: string;
  parentName: string;
  overwrite: boolean;
  systemProperties: boolean;
  properties: ViewProperty[];
  allProperties: ViewProperty[];
}

export interface ViewProperty {
  name: string;
  entity?: string;
  classFqn?: string;
  lazy?: boolean;
}

export type BuiltinView = '_local' | '_minimal' | '_base'

export interface Locale {
  code: string;
  caption: string;
}

export interface RestQuery {
  name: string;
  jpql: string;
  entity: string;
  view: string;
  params: RestParam[];
}

export interface RestParam {
  name: string;
  type: string;
}

export interface RestService {
  name: string;
  methods: RestServiceMethod[];
}

export interface RestServiceMethod {
  name: string;
  params: RestParam[];
}

export const FILE_DESCRIPTOR_FQN = 'com.haulmont.cuba.core.entity.FileDescriptor';

export function getEntitiesArray(entities: Entity[] | { [entityName: string]: Entity } | undefined): Entity[] {
  if (!entities) {
    return [];
  }
  return Array.isArray(entities)
    ? entities
    : Object.keys(entities).map(k => (entities as { [entityName: string]: Entity }) [k]);
}
