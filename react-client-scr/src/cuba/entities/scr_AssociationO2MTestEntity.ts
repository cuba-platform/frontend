import { StandardEntity } from "./base/sys$StandardEntity";
import { DatatypesTestEntity } from "./scr_DatatypesTestEntity";
export class AssociationO2MTestEntity extends StandardEntity {
  static NAME = "scr_AssociationO2MTestEntity";
  datatypesTestEntity?: DatatypesTestEntity | null;
  name?: string | null;
}
export type AssociationO2MTestEntityViewName =
  | "_base"
  | "_local"
  | "_minimal"
  | "associationO2MTestEntity-view";
export type AssociationO2MTestEntityView<
  V extends AssociationO2MTestEntityViewName
> = V extends "_base"
  ? Pick<AssociationO2MTestEntity, "id" | "name">
  : V extends "_local"
  ? Pick<AssociationO2MTestEntity, "id" | "name">
  : V extends "_minimal"
  ? Pick<AssociationO2MTestEntity, "id" | "name">
  : V extends "associationO2MTestEntity-view"
  ? Pick<AssociationO2MTestEntity, "id" | "name" | "datatypesTestEntity">
  : never;
