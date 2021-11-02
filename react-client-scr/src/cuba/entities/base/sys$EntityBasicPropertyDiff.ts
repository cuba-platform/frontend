import { EntityPropertyDiff } from "./sys$EntityPropertyDiff";
export class EntityBasicPropertyDiff extends EntityPropertyDiff {
  static NAME = "sys$EntityBasicPropertyDiff";
}
export type EntityBasicPropertyDiffViewName = "_base" | "_local" | "_minimal";
export type EntityBasicPropertyDiffView<
  V extends EntityBasicPropertyDiffViewName
> = never;
