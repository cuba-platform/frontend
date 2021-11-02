import { StandardEntity } from "./base/sys$StandardEntity";
import { DeeplyNestedTestEntity } from "./scr_DeeplyNestedTestEntity";
export class CompositionO2OTestEntity extends StandardEntity {
  static NAME = "scr_CompositionO2OTestEntity";
  name?: string | null;
  quantity?: number | null;
  nestedComposition?: DeeplyNestedTestEntity | null;
}
export type CompositionO2OTestEntityViewName =
  | "_base"
  | "_local"
  | "_minimal"
  | "compositionO2OTestEntity-view";
export type CompositionO2OTestEntityView<
  V extends CompositionO2OTestEntityViewName
> = V extends "_base"
  ? Pick<CompositionO2OTestEntity, "id" | "name" | "quantity">
  : V extends "_local"
  ? Pick<CompositionO2OTestEntity, "id" | "name" | "quantity">
  : V extends "_minimal"
  ? Pick<CompositionO2OTestEntity, "id" | "name">
  : V extends "compositionO2OTestEntity-view"
  ? Pick<
      CompositionO2OTestEntity,
      "id" | "name" | "quantity" | "nestedComposition"
    >
  : never;
