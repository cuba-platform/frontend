import { BaseUuidEntity } from "./sys$BaseUuidEntity";
import { EntityLogItem } from "./sec$EntityLog";
export class EntityLogAttr extends BaseUuidEntity {
  static NAME = "sec$EntityLogAttr";
  logItem?: EntityLogItem | null;
  name?: string | null;
  value?: string | null;
  oldValue?: string | null;
  valueId?: string | null;
  oldValueId?: string | null;
  messagesPack?: string | null;
  displayValue?: string | null;
  displayOldValue?: string | null;
  displayName?: string | null;
  locValue?: string | null;
  locOldValue?: string | null;
}
export type EntityLogAttrViewName = "_base" | "_local" | "_minimal";
export type EntityLogAttrView<V extends EntityLogAttrViewName> = never;
