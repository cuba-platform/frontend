import { BaseUuidEntity } from "./sys$BaseUuidEntity";
export class UserSessionEntity extends BaseUuidEntity {
  static NAME = "sec$UserSessionEntity";
  login?: string | null;
  userName?: string | null;
  address?: string | null;
  clientInfo?: string | null;
  since?: any | null;
  lastUsedTs?: any | null;
  system?: boolean | null;
  sysTenantId?: string | null;
}
export type UserSessionEntityViewName = "_base" | "_local" | "_minimal";
export type UserSessionEntityView<V extends UserSessionEntityViewName> = never;
