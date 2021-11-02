import { BaseUuidEntity } from "./sys$BaseUuidEntity";
import { LoggedEntity } from "./sec$LoggedEntity";
export class LoggedAttribute extends BaseUuidEntity {
  static NAME = "sec$LoggedAttribute";
  createTs?: any | null;
  createdBy?: string | null;
  entity?: LoggedEntity | null;
  name?: string | null;
}
export type LoggedAttributeViewName = "_base" | "_local" | "_minimal";
export type LoggedAttributeView<
  V extends LoggedAttributeViewName
> = V extends "_base"
  ? Pick<LoggedAttribute, "id" | "name">
  : V extends "_local"
  ? Pick<LoggedAttribute, "id" | "name">
  : never;
