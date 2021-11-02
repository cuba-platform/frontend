import { EntityPropertyDiff } from "./sys$EntityPropertyDiff";
export class EntityClassPropertyDiff extends EntityPropertyDiff {
  static NAME = "sys$EntityClassPropertyDiff";
}
export type EntityClassPropertyDiffViewName = "_base" | "_local" | "_minimal";
export type EntityClassPropertyDiffView<
  V extends EntityClassPropertyDiffViewName
> = never;
