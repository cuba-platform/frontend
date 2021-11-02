import { StandardEntity } from "./sys$StandardEntity";
import { Group } from "./sec$Group";
export class Constraint extends StandardEntity {
  static NAME = "sec$Constraint";
  checkType?: any | null;
  operationType?: any | null;
  code?: string | null;
  entityName?: string | null;
  joinClause?: string | null;
  whereClause?: string | null;
  groovyScript?: string | null;
  filterXml?: string | null;
  isActive?: boolean | null;
  group?: Group | null;
  sysTenantId?: string | null;
}
export type ConstraintViewName =
  | "_base"
  | "_local"
  | "_minimal"
  | "edit"
  | "group.browse";
export type ConstraintView<V extends ConstraintViewName> = V extends "_base"
  ? Pick<
      Constraint,
      | "id"
      | "checkType"
      | "operationType"
      | "code"
      | "entityName"
      | "joinClause"
      | "whereClause"
      | "groovyScript"
      | "filterXml"
      | "isActive"
      | "sysTenantId"
    >
  : V extends "_local"
  ? Pick<
      Constraint,
      | "id"
      | "checkType"
      | "operationType"
      | "code"
      | "entityName"
      | "joinClause"
      | "whereClause"
      | "groovyScript"
      | "filterXml"
      | "isActive"
      | "sysTenantId"
    >
  : V extends "edit"
  ? Pick<
      Constraint,
      | "id"
      | "entityName"
      | "isActive"
      | "code"
      | "checkType"
      | "operationType"
      | "joinClause"
      | "whereClause"
      | "groovyScript"
      | "filterXml"
      | "group"
    >
  : V extends "group.browse"
  ? Pick<
      Constraint,
      | "id"
      | "group"
      | "entityName"
      | "isActive"
      | "operationType"
      | "joinClause"
      | "whereClause"
      | "groovyScript"
    >
  : never;
