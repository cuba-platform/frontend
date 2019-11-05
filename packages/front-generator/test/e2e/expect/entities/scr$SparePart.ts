import { StandardEntity } from "./base/sys$StandardEntity";
export class SparePart extends StandardEntity {
  static NAME = "scr$SparePart";
  name?: string | null;
  spareParts?: SparePart | null;
}
export type SparePartViewName =
  | "_minimal"
  | "_local"
  | "_base"
  | "sparePart-view";
export type SparePartView<V extends SparePartViewName> = V extends "_minimal"
  ? Pick<SparePart, "id" | "name">
  : V extends "_local"
    ? Pick<SparePart, "id" | "name">
    : V extends "_base"
      ? Pick<SparePart, "id" | "name">
      : V extends "sparePart-view"
        ? Pick<SparePart, "id" | "name" | "spareParts">
        : never;