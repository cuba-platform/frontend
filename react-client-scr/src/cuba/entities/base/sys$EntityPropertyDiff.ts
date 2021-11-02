import { BaseUuidEntity } from "./sys$BaseUuidEntity";
export class EntityPropertyDiff extends BaseUuidEntity {
  static NAME = "sys$EntityPropertyDiff";
  label?: string | null;
  name?: string | null;
  beforeString?: string | null;
  afterString?: string | null;
  beforeCaption?: string | null;
  afterCaption?: string | null;
  itemState?: any | null;
}
export type EntityPropertyDiffViewName = "_base" | "_local" | "_minimal";
export type EntityPropertyDiffView<
  V extends EntityPropertyDiffViewName
> = never;
