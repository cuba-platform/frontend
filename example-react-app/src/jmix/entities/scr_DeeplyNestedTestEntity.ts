import { AssociationO2OTestEntity } from "./scr_AssociationO2OTestEntity";
export class DeeplyNestedTestEntity {
  static NAME = "scr_DeeplyNestedTestEntity";
  id?: string;
  name?: string | null;
  associationO2Oattr?: AssociationO2OTestEntity | null;
}
export type DeeplyNestedTestEntityViewName =
  | "_base"
  | "_instance_name"
  | "_local"
  | "deeplyNestedTestEntity-view";
export type DeeplyNestedTestEntityView<
  V extends DeeplyNestedTestEntityViewName
> = V extends "_base"
  ? Pick<DeeplyNestedTestEntity, "id" | "name">
  : V extends "_local"
  ? Pick<DeeplyNestedTestEntity, "id" | "name">
  : V extends "deeplyNestedTestEntity-view"
  ? Pick<DeeplyNestedTestEntity, "id" | "name" | "associationO2Oattr">
  : never;
