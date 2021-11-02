import { AbstractPermissionTarget } from "./sec$AbstractTarget";
export class UiPermissionTarget extends AbstractPermissionTarget {
  static NAME = "sec$UiTarget";
  permissionVariant?: any | null;
  screen?: string | null;
  component?: string | null;
}
export type UiPermissionTargetViewName = "_base" | "_local" | "_minimal";
export type UiPermissionTargetView<
  V extends UiPermissionTargetViewName
> = never;
