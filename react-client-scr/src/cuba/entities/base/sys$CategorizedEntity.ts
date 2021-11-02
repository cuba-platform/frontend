import { BaseUuidEntity } from "./sys$BaseUuidEntity";
import { Category } from "./sys$Category";
export class CategorizedEntity extends BaseUuidEntity {
  static NAME = "sys$CategorizedEntity";
  category?: Category | null;
}
export type CategorizedEntityViewName = "_base" | "_local" | "_minimal";
export type CategorizedEntityView<V extends CategorizedEntityViewName> = never;
