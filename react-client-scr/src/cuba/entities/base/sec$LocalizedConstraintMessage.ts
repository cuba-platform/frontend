import { StandardEntity } from "./sys$StandardEntity";
export class LocalizedConstraintMessage extends StandardEntity {
  static NAME = "sec$LocalizedConstraintMessage";
  entityName?: string | null;
  operationType?: any | null;
  values?: string | null;
}
export type LocalizedConstraintMessageViewName =
  | "_base"
  | "_local"
  | "_minimal";
export type LocalizedConstraintMessageView<
  V extends LocalizedConstraintMessageViewName
> = V extends "_base"
  ? Pick<
      LocalizedConstraintMessage,
      "id" | "entityName" | "operationType" | "values"
    >
  : V extends "_local"
  ? Pick<
      LocalizedConstraintMessage,
      "id" | "entityName" | "operationType" | "values"
    >
  : never;
