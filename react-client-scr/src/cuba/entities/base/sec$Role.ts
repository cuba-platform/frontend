import { StandardEntity } from "./sys$StandardEntity";
import { Permission } from "./sec$Permission";
export class Role extends StandardEntity {
  static NAME = "sec$Role";
  name?: string | null;
  locName?: string | null;
  description?: string | null;
  type?: any | null;
  defaultRole?: boolean | null;
  sysTenantId?: string | null;
  securityScope?: string | null;
  permissions?: Permission[] | null;
  locSecurityScope?: string | null;
}
export type RoleViewName =
  | "_base"
  | "_local"
  | "_minimal"
  | "role.browse"
  | "role.copy"
  | "role.edit"
  | "role.export"
  | "role.lookup";
export type RoleView<V extends RoleViewName> = V extends "_base"
  ? Pick<
      Role,
      | "id"
      | "locName"
      | "name"
      | "description"
      | "type"
      | "defaultRole"
      | "sysTenantId"
      | "securityScope"
      | "locSecurityScope"
    >
  : V extends "_local"
  ? Pick<
      Role,
      | "id"
      | "name"
      | "locName"
      | "description"
      | "type"
      | "defaultRole"
      | "sysTenantId"
      | "securityScope"
      | "locSecurityScope"
    >
  : V extends "_minimal"
  ? Pick<Role, "id" | "locName" | "name">
  : V extends "role.browse"
  ? Pick<Role, "id" | "name">
  : V extends "role.copy"
  ? Pick<
      Role,
      "id" | "name" | "type" | "locName" | "permissions" | "description"
    >
  : V extends "role.edit"
  ? Pick<Role, "id" | "name" | "type">
  : V extends "role.export"
  ? Pick<
      Role,
      | "id"
      | "name"
      | "locName"
      | "description"
      | "type"
      | "defaultRole"
      | "sysTenantId"
      | "securityScope"
      | "locSecurityScope"
      | "permissions"
    >
  : V extends "role.lookup"
  ? Pick<Role, "id" | "name">
  : never;
