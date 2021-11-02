import { BaseUuidEntity } from "./sys$BaseUuidEntity";
import { ScheduledTask } from "./sys$ScheduledTask";
export class ScheduledExecution extends BaseUuidEntity {
  static NAME = "sys$ScheduledExecution";
  createTs?: any | null;
  createdBy?: string | null;
  sysTenantId?: string | null;
  task?: ScheduledTask | null;
  server?: string | null;
  startTime?: any | null;
  finishTime?: any | null;
  result?: string | null;
  durationSec?: any | null;
}
export type ScheduledExecutionViewName = "_base" | "_local" | "_minimal";
export type ScheduledExecutionView<
  V extends ScheduledExecutionViewName
> = V extends "_base"
  ? Pick<
      ScheduledExecution,
      | "id"
      | "sysTenantId"
      | "server"
      | "startTime"
      | "finishTime"
      | "result"
      | "durationSec"
    >
  : V extends "_local"
  ? Pick<
      ScheduledExecution,
      | "id"
      | "sysTenantId"
      | "server"
      | "startTime"
      | "finishTime"
      | "result"
      | "durationSec"
    >
  : never;
