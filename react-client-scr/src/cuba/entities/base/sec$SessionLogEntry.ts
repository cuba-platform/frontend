import { StandardEntity } from "./sys$StandardEntity";
import { User } from "./sec$User";
export class SessionLogEntry extends StandardEntity {
  static NAME = "sec$SessionLogEntry";
  sessionId?: any | null;
  substitutedUser?: User | null;
  user?: User | null;
  userData?: string | null;
  lastAction?: any | null;
  clientInfo?: string | null;
  address?: string | null;
  startedTs?: any | null;
  finishedTs?: any | null;
  clientType?: any | null;
  server?: string | null;
  sysTenantId?: string | null;
}
export type SessionLogEntryViewName =
  | "_base"
  | "_local"
  | "_minimal"
  | "sessionLogEntry-view";
export type SessionLogEntryView<
  V extends SessionLogEntryViewName
> = V extends "_base"
  ? Pick<
      SessionLogEntry,
      | "id"
      | "sessionId"
      | "userData"
      | "lastAction"
      | "clientInfo"
      | "address"
      | "startedTs"
      | "finishedTs"
      | "clientType"
      | "server"
      | "sysTenantId"
    >
  : V extends "_local"
  ? Pick<
      SessionLogEntry,
      | "id"
      | "sessionId"
      | "userData"
      | "lastAction"
      | "clientInfo"
      | "address"
      | "startedTs"
      | "finishedTs"
      | "clientType"
      | "server"
      | "sysTenantId"
    >
  : V extends "sessionLogEntry-view"
  ? Pick<
      SessionLogEntry,
      | "id"
      | "sessionId"
      | "userData"
      | "lastAction"
      | "clientInfo"
      | "address"
      | "startedTs"
      | "finishedTs"
      | "clientType"
      | "server"
      | "sysTenantId"
      | "user"
      | "substitutedUser"
    >
  : never;
