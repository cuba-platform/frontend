import { BaseGenericIdEntity } from "./sys$BaseGenericIdEntity";
export class BaseDbGeneratedIdEntity extends BaseGenericIdEntity {
  static NAME = "sys$BaseDbGeneratedIdEntity";
}
export type BaseDbGeneratedIdEntityViewName = "_base" | "_local" | "_minimal";
export type BaseDbGeneratedIdEntityView<
  V extends BaseDbGeneratedIdEntityViewName
> = never;
