import { BaseDbGeneratedIdEntity } from "./sys$BaseDbGeneratedIdEntity";
export class BaseIdentityIdEntity extends BaseDbGeneratedIdEntity {
  static NAME = "sys$BaseIdentityIdEntity";
  id?: string;
}
export type BaseIdentityIdEntityViewName = "_base" | "_local" | "_minimal";
export type BaseIdentityIdEntityView<
  V extends BaseIdentityIdEntityViewName
> = never;
