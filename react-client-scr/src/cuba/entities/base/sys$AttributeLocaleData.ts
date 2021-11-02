import { StandardEntity } from "./sys$StandardEntity";
export class AttributeLocaleData extends StandardEntity {
  static NAME = "sys$AttributeLocaleData";
  name?: string | null;
  description?: string | null;
  locale?: string | null;
  language?: string | null;
  languageWithCode?: string | null;
}
export type AttributeLocaleDataViewName = "_base" | "_local" | "_minimal";
export type AttributeLocaleDataView<
  V extends AttributeLocaleDataViewName
> = V extends "_base"
  ? Pick<AttributeLocaleData, "id" | "name" | "languageWithCode">
  : V extends "_minimal"
  ? Pick<AttributeLocaleData, "id" | "name" | "languageWithCode">
  : never;
