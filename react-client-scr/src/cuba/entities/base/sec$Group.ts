import { StandardEntity } from "./sys$StandardEntity";
import { GroupHierarchy } from "./sec$GroupHierarchy";
import { Constraint } from "./sec$Constraint";
import { SessionAttribute } from "./sec$SessionAttribute";
export class Group extends StandardEntity {
  static NAME = "sec$Group";
  name?: string | null;
  parent?: Group | null;
  hierarchyList?: GroupHierarchy[] | null;
  constraints?: Constraint[] | null;
  sessionAttributes?: SessionAttribute[] | null;
  sysTenantId?: string | null;
}
export type GroupViewName =
  | "_base"
  | "_local"
  | "_minimal"
  | "group.browse"
  | "group.copy"
  | "group.edit"
  | "group.export"
  | "group.lookup";
export type GroupView<V extends GroupViewName> = V extends "_base"
  ? Pick<Group, "id" | "name" | "sysTenantId">
  : V extends "_local"
  ? Pick<Group, "id" | "name" | "sysTenantId">
  : V extends "_minimal"
  ? Pick<Group, "id" | "name">
  : V extends "group.browse"
  ? Pick<Group, "id" | "name" | "parent">
  : V extends "group.copy"
  ? Pick<Group, "id" | "name" | "parent" | "constraints" | "sessionAttributes">
  : V extends "group.edit"
  ? Pick<Group, "id" | "name" | "parent" | "constraints" | "sessionAttributes">
  : V extends "group.export"
  ? Pick<
      Group,
      | "id"
      | "name"
      | "sysTenantId"
      | "parent"
      | "constraints"
      | "sessionAttributes"
    >
  : V extends "group.lookup"
  ? Pick<Group, "id" | "name">
  : never;
