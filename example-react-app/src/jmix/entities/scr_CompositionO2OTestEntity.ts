import { DeeplyNestedTestEntity } from "./scr_DeeplyNestedTestEntity";
export class CompositionO2OTestEntity {
  static NAME = "scr_CompositionO2OTestEntity";
  id?: string;
  name?: string | null;
  quantity?: number | null;
  nestedComposition?: DeeplyNestedTestEntity | null;
}
export type CompositionO2OTestEntityViewName =
  | "_base"
  | "_instance_name"
  | "_local"
  | "compositionO2OTestEntity-view";
export type CompositionO2OTestEntityView<
  V extends CompositionO2OTestEntityViewName
> = V extends "_base"
  ? Pick<CompositionO2OTestEntity, "id" | "name" | "quantity">
  : V extends "_local"
  ? Pick<CompositionO2OTestEntity, "id" | "name" | "quantity">
  : V extends "compositionO2OTestEntity-view"
  ? Pick<
      CompositionO2OTestEntity,
      "id" | "name" | "quantity" | "nestedComposition"
    >
  : never;
