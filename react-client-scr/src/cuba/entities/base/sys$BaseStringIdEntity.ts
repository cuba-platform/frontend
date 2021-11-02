import { BaseGenericIdEntity } from "./sys$BaseGenericIdEntity";
export class BaseStringIdEntity extends BaseGenericIdEntity {
  static NAME = "sys$BaseStringIdEntity";
}
export type BaseStringIdEntityViewName = "_base" | "_local" | "_minimal";
export type BaseStringIdEntityView<
  V extends BaseStringIdEntityViewName
> = never;
