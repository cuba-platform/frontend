import { DatatypesTestEntity3 } from "./scr_DatatypesTestEntity3";
import { DatatypesTestEntity } from "./scr_DatatypesTestEntity";
export class IntegerIdTestEntity {
  static NAME = "scr_IntegerIdTestEntity";
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
  datatypesTestEntities?: DatatypesTestEntity[] | null;
}
export type IntegerIdTestEntityViewName = "_base" | "_instance_name" | "_local";
export type IntegerIdTestEntityView<
  V extends IntegerIdTestEntityViewName
> = V extends "_base"
  ? Pick<
      IntegerIdTestEntity,
      | "id"
      | "description"
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
      IntegerIdTestEntity,
      | "id"
      | "description"
      | "createTs"
      | "createdBy"
      | "updateTs"
      | "updatedBy"
      | "deleteTs"
      | "deletedBy"
      | "version"
    >
  : never;
