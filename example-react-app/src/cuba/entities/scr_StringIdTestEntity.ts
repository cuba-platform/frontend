import { DatatypesTestEntity } from "./scr_DatatypesTestEntity";
import { DatatypesTestEntity3 } from "./scr_DatatypesTestEntity3";
export class StringIdTestEntity {
  static NAME = "scr_StringIdTestEntity";
  id?: string;
  description?: string | null;
  productCode?: string | null;
  createTs?: any | null;
  createdBy?: string | null;
  updateTs?: any | null;
  updatedBy?: string | null;
  deleteTs?: any | null;
  deletedBy?: string | null;
  version?: number | null;
  datatypesTestEntity?: DatatypesTestEntity | null;
  datatypesTestEntity3?: DatatypesTestEntity3 | null;
}
export type StringIdTestEntityViewName = "_base" | "_instance_name" | "_local";
export type StringIdTestEntityView<
  V extends StringIdTestEntityViewName
> = V extends "_base"
  ? Pick<
      StringIdTestEntity,
      | "id"
      | "description"
      | "productCode"
      | "createTs"
      | "createdBy"
      | "updateTs"
      | "updatedBy"
      | "deleteTs"
      | "deletedBy"
      | "version"
    >
  : V extends "_local"
  ? Pick<
      StringIdTestEntity,
      | "id"
      | "description"
      | "productCode"
      | "createTs"
      | "createdBy"
      | "updateTs"
      | "updatedBy"
      | "deleteTs"
      | "deletedBy"
      | "version"
    >
  : never;
