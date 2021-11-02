export class AbstractPermissionTarget {
  static NAME = "sec$AbstractTarget";
  id?: string;
  caption?: string | null;
  permissionValue?: string | null;
}
export type AbstractPermissionTargetViewName = "_base" | "_local" | "_minimal";
export type AbstractPermissionTargetView<
  V extends AbstractPermissionTargetViewName
> = never;
