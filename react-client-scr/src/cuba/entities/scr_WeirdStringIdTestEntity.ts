import { BaseStringIdEntity } from "./base/sys$BaseStringIdEntity";
import { DatatypesTestEntity3 } from "./scr_DatatypesTestEntity3";
export class WeirdStringIdTestEntity extends BaseStringIdEntity {
  static NAME = "scr_WeirdStringIdTestEntity";
  id?: string;
  description?: string | null;
  createTs?: any | null;
  createdBy?: string | null;
  updateTs?: any | null;
  updatedBy?: string | null;
  deleteTs?: any | null;
  deletedBy?: string | null;
  version?: number | null;
  datatypesTestEntity3?: DatatypesTestEntity3 | null;
}
export type WeirdStringIdTestEntityViewName = "_base" | "_local" | "_minimal";
export type WeirdStringIdTestEntityView<
  V extends WeirdStringIdTestEntityViewName
> = V extends "_base"
  ? Pick<WeirdStringIdTestEntity, "description" | "id">
  : V extends "_local"
  ? Pick<WeirdStringIdTestEntity, "description" | "id">
  : V extends "_minimal"
  ? Pick<WeirdStringIdTestEntity, "id" | "description">
  : never;
