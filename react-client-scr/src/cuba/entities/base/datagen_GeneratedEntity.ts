import { BaseUuidEntity } from "./sys$BaseUuidEntity";
export class GeneratedEntity extends BaseUuidEntity {
  static NAME = "datagen_GeneratedEntity";
  entityName?: string | null;
  instanceId?: string | null;
  instName?: string | null;
  createTs?: any | null;
  createdBy?: string | null;
}
export type GeneratedEntityViewName =
  | "_base"
  | "_local"
  | "_minimal"
  | "generatedEntity-browse";
export type GeneratedEntityView<
  V extends GeneratedEntityViewName
> = V extends "_base"
  ? Pick<GeneratedEntity, "id" | "entityName" | "instanceId" | "instName">
  : V extends "_local"
  ? Pick<GeneratedEntity, "id" | "entityName" | "instanceId" | "instName">
  : V extends "_minimal"
  ? Pick<GeneratedEntity, "id" | "entityName">
  : V extends "generatedEntity-browse"
  ? Pick<
      GeneratedEntity,
      "id" | "createTs" | "createdBy" | "entityName" | "instanceId" | "instName"
    >
  : never;
