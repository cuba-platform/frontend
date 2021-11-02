import { BaseUuidEntity } from "./sys$BaseUuidEntity";
export class CategoryAttributeEnumValue extends BaseUuidEntity {
  static NAME = "sys$CategoryAttributeEnumValue";
  value?: string | null;
  localizedValues?: string | null;
}
export type CategoryAttributeEnumValueViewName =
  | "_base"
  | "_local"
  | "_minimal";
export type CategoryAttributeEnumValueView<
  V extends CategoryAttributeEnumValueViewName
> = never;
