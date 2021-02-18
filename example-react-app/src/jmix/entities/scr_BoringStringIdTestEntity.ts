export class BoringStringIdTestEntity {
  static NAME = "scr_BoringStringIdTestEntity";
  id?: string;
  description?: string | null;
  createTs?: any | null;
  createdBy?: string | null;
  deleteTs?: any | null;
  deletedBy?: string | null;
  updateTs?: any | null;
  updatedBy?: string | null;
  version?: number | null;
  uuid?: any | null;
}
export type BoringStringIdTestEntityViewName =
  | "_base"
  | "_instance_name"
  | "_local";
export type BoringStringIdTestEntityView<
  V extends BoringStringIdTestEntityViewName
> = V extends "_base"
  ? Pick<
      BoringStringIdTestEntity,
      | "id"
      | "description"
      | "createTs"
      | "createdBy"
      | "deleteTs"
      | "deletedBy"
      | "updateTs"
      | "updatedBy"
      | "version"
      | "uuid"
    >
  : V extends "_local"
  ? Pick<
      BoringStringIdTestEntity,
      | "id"
      | "description"
      | "createTs"
      | "createdBy"
      | "deleteTs"
      | "deletedBy"
      | "updateTs"
      | "updatedBy"
      | "version"
      | "uuid"
    >
  : never;
