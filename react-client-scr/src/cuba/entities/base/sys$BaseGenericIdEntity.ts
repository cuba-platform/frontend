export class BaseGenericIdEntity {
  static NAME = "sys$BaseGenericIdEntity";
}
export type BaseGenericIdEntityViewName = "_base" | "_local" | "_minimal";
export type BaseGenericIdEntityView<
  V extends BaseGenericIdEntityViewName
> = never;
