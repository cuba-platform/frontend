export interface Model {
  project: ProjectInfo;
  entities: Entity[];
  views: View[];
}

export interface ProjectInfo {
  name: string;
  namespace: string;
  modulePrefix: string;
  locales: Locale[];
}

export type InheritanceType = 'SINGLE_TABLE' | 'TABLE_PER_CLASS' | 'JOINED'

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
  attributes: {
    [attributeName: string]: EntityAttribute
  },
  inheritanceType?: InheritanceType
}

export interface EntityAttribute {
  name: string;
  type: string; // todo
  readOnly: boolean;
  column: string,
  mandatory: true,
  unique: false,
  length: number,
  transient: boolean
}

export interface View {
  name: string;
  entity: string;
  classFqn: string;
  parentName: string;
  overwrite: boolean;
  systemProperties: boolean;
  properties: ViewProperty[];
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