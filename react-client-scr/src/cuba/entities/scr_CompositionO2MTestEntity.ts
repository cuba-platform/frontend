import { StandardEntity } from "./base/sys$StandardEntity";
import { DatatypesTestEntity } from "./scr_DatatypesTestEntity";
export class CompositionO2MTestEntity extends StandardEntity {
  static NAME = "scr_CompositionO2MTestEntity";
  datatypesTestEntity?: DatatypesTestEntity | null;
  quantity?: number | null;
  name?: string | null;
}
export type CompositionO2MTestEntityViewName =
  | "_base"
  | "_local"
  | "_minimal"
  | "compositionO2MTestEntity-view";
export type CompositionO2MTestEntityView<
  V extends CompositionO2MTestEntityViewName
> = V extends "_base"
  ? Pick<CompositionO2MTestEntity, "id" | "name" | "quantity">
  : V extends "_local"
  ? Pick<CompositionO2MTestEntity, "id" | "quantity" | "name">
  : V extends "_minimal"
  ? Pick<CompositionO2MTestEntity, "id" | "name">
  : V extends "compositionO2MTestEntity-view"
  ? Pick<
      CompositionO2MTestEntity,
      "id" | "quantity" | "name" | "datatypesTestEntity"
    >
  : never;
