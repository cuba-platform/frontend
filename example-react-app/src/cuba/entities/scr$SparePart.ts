export class SparePart {
  static NAME = "scr$SparePart";
  id?: string;
  name?: string | null;
  spareParts?: SparePart | null;
}
export type SparePartViewName =
  | "_base"
  | "_instance_name"
  | "_local"
  | "sparePart-view";
export type SparePartView<V extends SparePartViewName> = V extends "_base"
  ? Pick<SparePart, "id" | "name">
  : V extends "_local"
  ? Pick<SparePart, "id" | "name">
  : V extends "sparePart-view"
  ? Pick<SparePart, "id" | "name" | "spareParts">
  : never;
