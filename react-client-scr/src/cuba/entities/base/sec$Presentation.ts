import { BaseUuidEntity } from "./sys$BaseUuidEntity";
import { User } from "./sec$User";
export class Presentation extends BaseUuidEntity {
  static NAME = "sec$Presentation";
  createTs?: any | null;
  createdBy?: string | null;
  componentId?: string | null;
  name?: string | null;
  xml?: string | null;
  user?: User | null;
  autoSave?: boolean | null;
  updateTs?: any | null;
  updatedBy?: string | null;
  sysTenantId?: string | null;
}
export type PresentationViewName = "_base" | "_local" | "_minimal" | "app";
export type PresentationView<V extends PresentationViewName> = V extends "_base"
  ? Pick<
      Presentation,
      "id" | "name" | "componentId" | "xml" | "autoSave" | "sysTenantId"
    >
  : V extends "_local"
  ? Pick<
      Presentation,
      "id" | "componentId" | "name" | "xml" | "autoSave" | "sysTenantId"
    >
  : V extends "_minimal"
  ? Pick<Presentation, "id" | "name">
  : V extends "app"
  ? Pick<
      Presentation,
      "id" | "componentId" | "name" | "xml" | "user" | "autoSave"
    >
  : never;
