import { AbstractPermissionTarget } from "./sec$AbstractTarget";
export class BasicPermissionTarget extends AbstractPermissionTarget {
  static NAME = "sec$Target";
  permissionVariant?: any | null;
}
export type BasicPermissionTargetViewName = "_base" | "_local" | "_minimal";
export type BasicPermissionTargetView<
  V extends BasicPermissionTargetViewName
> = never;
