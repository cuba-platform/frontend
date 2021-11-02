import { StandardEntity } from "./base/sys$StandardEntity";
export class AssociationM2OTestEntity extends StandardEntity {
  static NAME = "scr_AssociationM2OTestEntity";
  name?: string | null;
}
export type AssociationM2OTestEntityViewName =
  | "_base"
  | "_local"
  | "_minimal"
  | "associationM2OTestEntity-view";
export type AssociationM2OTestEntityView<
  V extends AssociationM2OTestEntityViewName
> = V extends "_base"
  ? Pick<AssociationM2OTestEntity, "id" | "name">
  : V extends "_local"
  ? Pick<AssociationM2OTestEntity, "id" | "name">
  : V extends "_minimal"
  ? Pick<AssociationM2OTestEntity, "id" | "name">
  : V extends "associationM2OTestEntity-view"
  ? Pick<AssociationM2OTestEntity, "id" | "name">
  : never;
