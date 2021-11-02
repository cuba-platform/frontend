export class AttributeTarget {
  static NAME = "sec$AttributeTarget";
  id?: string;
  permissionVariant?: any | null;
}
export type AttributeTargetViewName = "_base" | "_local" | "_minimal";
export type AttributeTargetView<V extends AttributeTargetViewName> = never;
