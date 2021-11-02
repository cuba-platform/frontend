import { BaseUuidEntity } from "./sys$BaseUuidEntity";
import { Group } from "./sec$Group";
export class GroupHierarchy extends BaseUuidEntity {
  static NAME = "sec$GroupHierarchy";
  createTs?: any | null;
  createdBy?: string | null;
  sysTenantId?: string | null;
  group?: Group | null;
  parent?: Group | null;
  level?: number | null;
}
export type GroupHierarchyViewName = "_base" | "_local" | "_minimal";
export type GroupHierarchyView<
  V extends GroupHierarchyViewName
> = V extends "_base"
  ? Pick<GroupHierarchy, "id" | "sysTenantId" | "level">
  : V extends "_local"
  ? Pick<GroupHierarchy, "id" | "sysTenantId" | "level">
  : never;
