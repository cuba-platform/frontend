import { BaseGenericIdEntity } from "./sys$BaseGenericIdEntity";
export class BaseLongIdEntity extends BaseGenericIdEntity {
  static NAME = "sys$BaseLongIdEntity";
  id?: string;
}
export type BaseLongIdEntityViewName = "_base" | "_local" | "_minimal";
export type BaseLongIdEntityView<V extends BaseLongIdEntityViewName> = never;
