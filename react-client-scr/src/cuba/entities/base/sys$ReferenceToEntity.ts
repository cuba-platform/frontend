import { EmbeddableEntity } from "./sys$EmbeddableEntity";
export class ReferenceToEntity extends EmbeddableEntity {
  static NAME = "sys$ReferenceToEntity";
  entityId?: any | null;
  stringEntityId?: string | null;
  intEntityId?: number | null;
  longEntityId?: any | null;
}
export type ReferenceToEntityViewName = "_base" | "_local" | "_minimal";
export type ReferenceToEntityView<
  V extends ReferenceToEntityViewName
> = V extends "_base"
  ? Pick<
      ReferenceToEntity,
      "entityId" | "stringEntityId" | "intEntityId" | "longEntityId"
    >
  : V extends "_local"
  ? Pick<
      ReferenceToEntity,
      "entityId" | "stringEntityId" | "intEntityId" | "longEntityId"
    >
  : never;
