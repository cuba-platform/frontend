import { BaseGenericIdEntity } from "./sys$BaseGenericIdEntity";
export class BaseUuidEntity extends BaseGenericIdEntity {
  static NAME = "sys$BaseUuidEntity";
  id?: string;
}
export type BaseUuidEntityViewName = "_base" | "_local" | "_minimal";
export type BaseUuidEntityView<V extends BaseUuidEntityViewName> = never;
