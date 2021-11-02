import { StandardEntity } from "./base/sys$StandardEntity";
import { AssociationO2OTestEntity } from "./scr_AssociationO2OTestEntity";
export class DeeplyNestedTestEntity extends StandardEntity {
  static NAME = "scr_DeeplyNestedTestEntity";
  name?: string | null;
  associationO2Oattr?: AssociationO2OTestEntity | null;
}
export type DeeplyNestedTestEntityViewName =
  | "_base"
  | "_local"
  | "_minimal"
  | "deeplyNestedTestEntity-view";
export type DeeplyNestedTestEntityView<
  V extends DeeplyNestedTestEntityViewName
> = V extends "_base"
  ? Pick<DeeplyNestedTestEntity, "id" | "name">
  : V extends "_local"
  ? Pick<DeeplyNestedTestEntity, "id" | "name">
  : V extends "_minimal"
  ? Pick<DeeplyNestedTestEntity, "id" | "name">
  : V extends "deeplyNestedTestEntity-view"
  ? Pick<DeeplyNestedTestEntity, "id" | "name" | "associationO2Oattr">
  : never;
