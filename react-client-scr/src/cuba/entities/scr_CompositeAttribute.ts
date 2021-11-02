import { EmbeddableEntity } from "./base/sys$EmbeddableEntity";
export class CompositeAttribute extends EmbeddableEntity {
  static NAME = "scr_CompositeAttribute";
  first_field?: string | null;
  second_field?: string | null;
  third_field?: string | null;
}
export type CompositeAttributeViewName = "_base" | "_local" | "_minimal";
export type CompositeAttributeView<
  V extends CompositeAttributeViewName
> = V extends "_base"
  ? Pick<CompositeAttribute, "first_field" | "second_field" | "third_field">
  : V extends "_local"
  ? Pick<CompositeAttribute, "first_field" | "second_field" | "third_field">
  : never;
