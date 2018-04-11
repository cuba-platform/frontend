export interface ProjectModel {
  project: ProjectInfo;
  entities: {
    [entityName: string]: Entity;
  };
  baseProjectEntities?: {
    [entityName: string]: Entity;
  };
  views: View[];
  restQueries: RestQuery[];
  restServices: RestService[];
}

export interface ProjectInfo {
  name: string;
  namespace: string;
  modulePrefix: string;
  locales: Locale[];
}

export const enum InheritanceType {
  SINGLE_TABLE = 'SINGLE_TABLE',
  TABLE_PER_CLASS = 'TABLE_PER_CLASS',
  JOINED = 'JOINED'
}

export interface Entity {
  name: string;
  className: string;
  packageName: string;
  dataStore: string,
  table: string,
  parentClassName: string,
  discriminator: string,
  updatable: boolean,
  creatable: boolean,
  hasUuid: boolean,
  softDelete: boolean,
  versioned: boolean,
  reference: string,
  parentPackage: string,
  embeddable: boolean,
  persistentEntity: true,
  replaceParent: boolean,
  systemLevel: boolean,
  namePattern: string,
  mappedSuperclass: boolean,
  fqn: string,
  imported: boolean,
  attributes: EntityAttribute[],
  inheritanceType?: InheritanceType
}

export interface Datatype {
  packageName: string;
  className: string;
  fqn: string;
  label: string;
  entityName?: string
}

export const enum MappingType {
  DATATYPE = 'DATATYPE',
  ENUM = 'ENUM',
  ASSOCIATION = 'ASSOCIATION',
  COMPOSITION = 'COMPOSITION',
  EMBEDDED = 'EMBEDDED'
}

export const enum TemporalType {
  DATE = 'DATE',
  TIME = 'TIME',
  TIMESTAMP = 'TIMESTAMP'
}

export const enum Cardinality {
  ONE_TO_ONE = 'ONE_TO_ONE',
  ONE_TO_MANY = 'ONE_TO_MANY',
  MANY_TO_ONE = 'MANY_TO_ONE',
  MANY_TO_MANY = 'MANY_TO_MANY'
}

export interface EntityAttribute {
  name: string;
  type: Datatype;
  mappingType: MappingType;
  cardinality?: Cardinality;
  readOnly: boolean;
  column: string;
  mandatory: boolean;
  unique: boolean;
  length: number;
  transient: boolean;
  temporalType?: TemporalType;
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
  lazy: boolean;
}

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