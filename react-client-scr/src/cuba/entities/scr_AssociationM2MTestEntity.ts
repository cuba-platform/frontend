import { StandardEntity } from "./base/sys$StandardEntity";
import { DatatypesTestEntity } from "./scr_DatatypesTestEntity";
export class AssociationM2MTestEntity extends StandardEntity {
  static NAME = "scr_AssociationM2MTestEntity";
  datatypesTestEntities?: DatatypesTestEntity[] | null;
  name?: string | null;
}
export type AssociationM2MTestEntityViewName =
  | "_base"
  | "_local"
  | "_minimal"
  | "associationM2MTestEntity-view";
export type AssociationM2MTestEntityView<
  V extends AssociationM2MTestEntityViewName
> = V extends "_base"
  ? Pick<AssociationM2MTestEntity, "id" | "name">
  : V extends "_local"
  ? Pick<AssociationM2MTestEntity, "id" | "name">
  : V extends "_minimal"
  ? Pick<AssociationM2MTestEntity, "id" | "name">
  : V extends "associationM2MTestEntity-view"
  ? Pick<AssociationM2MTestEntity, "id" | "name" | "datatypesTestEntities">
  : never;
