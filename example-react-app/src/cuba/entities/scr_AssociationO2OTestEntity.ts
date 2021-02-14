import { DatatypesTestEntity } from "./scr_DatatypesTestEntity";
import { DeeplyNestedTestEntity } from "./scr_DeeplyNestedTestEntity";
export class AssociationO2OTestEntity {
  static NAME = "scr_AssociationO2OTestEntity";
  id?: string;
  datatypesTestEntity?: DatatypesTestEntity | null;
  name?: string | null;
  deeplyNestedTestEntity?: DeeplyNestedTestEntity | null;
}
export type AssociationO2OTestEntityViewName =
  | "_base"
  | "_instance_name"
  | "_local"
  | "associationO2OTestEntity-view";
export type AssociationO2OTestEntityView<
  V extends AssociationO2OTestEntityViewName
> = V extends "_base"
  ? Pick<AssociationO2OTestEntity, "id" | "name">
  : V extends "_local"
  ? Pick<AssociationO2OTestEntity, "id" | "name">
  : V extends "associationO2OTestEntity-view"
  ? Pick<AssociationO2OTestEntity, "id" | "name" | "datatypesTestEntity">
  : never;
