import { BaseUuidEntity } from "./sys$BaseUuidEntity";
import { User } from "./sec$User";
import { EntityLogAttr } from "./sec$EntityLogAttr";
export class EntityLogItem extends BaseUuidEntity {
  static NAME = "sec$EntityLog";
  createTs?: any | null;
  createdBy?: string | null;
  sysTenantId?: string | null;
  eventTs?: any | null;
  user?: User | null;
  type?: any | null;
  entity?: string | null;
  entityRef?: any | null;
  entityInstanceName?: string | null;
  attributes?: EntityLogAttr | null;
  changes?: string | null;
  displayedEntityName?: string | null;
}
export type EntityLogItemViewName = "_base" | "_local" | "_minimal" | "logView";
export type EntityLogItemView<
  V extends EntityLogItemViewName
> = V extends "_base"
  ? Pick<
      EntityLogItem,
      | "id"
      | "sysTenantId"
      | "eventTs"
      | "type"
      | "entity"
      | "entityInstanceName"
      | "changes"
      | "displayedEntityName"
    >
  : V extends "_local"
  ? Pick<
      EntityLogItem,
      | "id"
      | "sysTenantId"
      | "eventTs"
      | "type"
      | "entity"
      | "entityInstanceName"
      | "changes"
      | "displayedEntityName"
    >
  : V extends "logView"
  ? Pick<
      EntityLogItem,
      | "id"
      | "sysTenantId"
      | "eventTs"
      | "type"
      | "entity"
      | "entityInstanceName"
      | "changes"
      | "displayedEntityName"
      | "user"
      | "entityRef"
    >
  : never;
