import { BaseUuidEntity } from "./sys$BaseUuidEntity";
export class FtsQueue extends BaseUuidEntity {
  static NAME = "sys$FtsQueue";
  createTs?: any | null;
  createdBy?: string | null;
  entityId?: any | null;
  stringEntityId?: string | null;
  intEntityId?: number | null;
  longEntityId?: any | null;
  entityName?: string | null;
  changeType?: any | null;
  sourceHost?: string | null;
  indexingHost?: string | null;
  fake?: boolean | null;
}
export type FtsQueueViewName = "_base" | "_local" | "_minimal";
export type FtsQueueView<V extends FtsQueueViewName> = V extends "_base"
  ? Pick<
      FtsQueue,
      | "id"
      | "entityId"
      | "stringEntityId"
      | "intEntityId"
      | "longEntityId"
      | "entityName"
      | "changeType"
      | "sourceHost"
      | "indexingHost"
      | "fake"
    >
  : V extends "_local"
  ? Pick<
      FtsQueue,
      | "id"
      | "entityId"
      | "stringEntityId"
      | "intEntityId"
      | "longEntityId"
      | "entityName"
      | "changeType"
      | "sourceHost"
      | "indexingHost"
      | "fake"
    >
  : never;
