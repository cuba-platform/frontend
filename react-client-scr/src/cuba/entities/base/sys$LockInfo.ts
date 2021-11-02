import { BaseUuidEntity } from "./sys$BaseUuidEntity";
import { User } from "./sec$User";
export class LockInfo extends BaseUuidEntity {
  static NAME = "sys$LockInfo";
  entityId?: string | null;
  entityName?: string | null;
  since?: any | null;
  user?: User | null;
}
export type LockInfoViewName = "_base" | "_local" | "_minimal";
export type LockInfoView<V extends LockInfoViewName> = never;
