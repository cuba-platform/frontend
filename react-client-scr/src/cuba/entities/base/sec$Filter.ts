import { StandardEntity } from "./sys$StandardEntity";
import { User } from "./sec$User";
export class FilterEntity extends StandardEntity {
  static NAME = "sec$Filter";
  componentId?: string | null;
  name?: string | null;
  code?: string | null;
  xml?: string | null;
  user?: User | null;
  globalDefault?: boolean | null;
  sysTenantId?: string | null;
}
export type FilterEntityViewName = "_base" | "_local" | "_minimal" | "app";
export type FilterEntityView<V extends FilterEntityViewName> = V extends "_base"
  ? Pick<
      FilterEntity,
      | "id"
      | "name"
      | "componentId"
      | "code"
      | "xml"
      | "globalDefault"
      | "sysTenantId"
    >
  : V extends "_local"
  ? Pick<
      FilterEntity,
      | "id"
      | "componentId"
      | "name"
      | "code"
      | "xml"
      | "globalDefault"
      | "sysTenantId"
    >
  : V extends "_minimal"
  ? Pick<FilterEntity, "id" | "name">
  : V extends "app"
  ? Pick<
      FilterEntity,
      "id" | "componentId" | "name" | "code" | "xml" | "globalDefault" | "user"
    >
  : never;
