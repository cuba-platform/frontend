import { BaseStringIdEntity } from "./base/sys$BaseStringIdEntity";
export class BoringStringIdTestEntity extends BaseStringIdEntity {
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
export type BoringStringIdTestEntityViewName = "_base" | "_local" | "_minimal";
export type BoringStringIdTestEntityView<
  V extends BoringStringIdTestEntityViewName
> = V extends "_base"
  ? Pick<BoringStringIdTestEntity, "id" | "description">
  : V extends "_local"
  ? Pick<BoringStringIdTestEntity, "id" | "description">
  : V extends "_minimal"
  ? Pick<BoringStringIdTestEntity, "id" | "description">
  : never;
