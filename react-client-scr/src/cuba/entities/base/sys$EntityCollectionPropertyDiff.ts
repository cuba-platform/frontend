import { EntityPropertyDiff } from "./sys$EntityPropertyDiff";
export class EntityCollectionPropertyDiff extends EntityPropertyDiff {
  static NAME = "sys$EntityCollectionPropertyDiff";
}
export type EntityCollectionPropertyDiffViewName =
  | "_base"
  | "_local"
  | "_minimal";
export type EntityCollectionPropertyDiffView<
  V extends EntityCollectionPropertyDiffViewName
> = never;
