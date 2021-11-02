import { BaseIdentityIdEntity } from "./sys$BaseIdentityIdEntity";
export class QueryResult extends BaseIdentityIdEntity {
  static NAME = "sys$QueryResult";
  sessionId?: any | null;
  queryKey?: number | null;
  entityId?: any | null;
  stringEntityId?: string | null;
  intEntityId?: number | null;
  longEntityId?: any | null;
}
export type QueryResultViewName = "_base" | "_local" | "_minimal";
export type QueryResultView<V extends QueryResultViewName> = V extends "_base"
  ? Pick<
      QueryResult,
      | "id"
      | "sessionId"
      | "queryKey"
      | "entityId"
      | "stringEntityId"
      | "intEntityId"
      | "longEntityId"
    >
  : V extends "_local"
  ? Pick<
      QueryResult,
      | "id"
      | "sessionId"
      | "queryKey"
      | "entityId"
      | "stringEntityId"
      | "intEntityId"
      | "longEntityId"
    >
  : never;
