import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
import { DatatypesTestEntity3 } from "./scr_DatatypesTestEntity3";
import { DatatypesTestEntity } from "./scr_DatatypesTestEntity";
export class IntegerIdTestEntity extends BaseIntegerIdEntity {
  static NAME = "scr_IntegerIdTestEntity";
  description?: string | null;
  createTs?: any | null;
  createdBy?: string | null;
  updateTs?: any | null;
  updatedBy?: string | null;
  deleteTs?: any | null;
  deletedBy?: string | null;
  version?: number | null;
  datatypesTestEntity3?: DatatypesTestEntity3 | null;
  datatypesTestEntities?: DatatypesTestEntity[] | null;
}
export type IntegerIdTestEntityViewName = "_base" | "_local" | "_minimal";
export type IntegerIdTestEntityView<
  V extends IntegerIdTestEntityViewName
> = V extends "_base"
  ? Pick<IntegerIdTestEntity, "id" | "description">
  : V extends "_local"
  ? Pick<IntegerIdTestEntity, "id" | "description">
  : V extends "_minimal"
  ? Pick<IntegerIdTestEntity, "id" | "description">
  : never;
