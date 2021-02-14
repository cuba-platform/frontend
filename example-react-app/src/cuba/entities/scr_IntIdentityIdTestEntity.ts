import { DatatypesTestEntity3 } from "./scr_DatatypesTestEntity3";
import { DatatypesTestEntity } from "./scr_DatatypesTestEntity";
export class IntIdentityIdTestEntity {
  static NAME = "scr_IntIdentityIdTestEntity";
  id?: string;
  description?: string | null;
  updateTs?: any | null;
  updatedBy?: string | null;
  deleteTs?: any | null;
  deletedBy?: string | null;
  createTs?: any | null;
  createdBy?: string | null;
  version?: number | null;
  datatypesTestEntity3?: DatatypesTestEntity3 | null;
  datatypesTestEntity?: DatatypesTestEntity | null;
}
export type IntIdentityIdTestEntityViewName =
  | "_base"
  | "_instance_name"
  | "_local";
export type IntIdentityIdTestEntityView<
  V extends IntIdentityIdTestEntityViewName
> = V extends "_base"
  ? Pick<
      IntIdentityIdTestEntity,
      | "id"
      | "description"
      | "updateTs"
      | "updatedBy"
      | "deleteTs"
      | "deletedBy"
      | "createTs"
      | "createdBy"
      | "version"
    >
  : V extends "_local"
  ? Pick<
      IntIdentityIdTestEntity,
      | "id"
      | "description"
      | "updateTs"
      | "updatedBy"
      | "deleteTs"
      | "deletedBy"
      | "createTs"
      | "createdBy"
      | "version"
    >
  : never;
