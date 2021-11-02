import { StandardEntity } from "./sys$StandardEntity";
import { CategoryAttribute } from "./sys$CategoryAttribute";
export class Category extends StandardEntity {
  static NAME = "sys$Category";
  name?: string | null;
  entityType?: string | null;
  isDefault?: boolean | null;
  categoryAttrs?: CategoryAttribute[] | null;
  localeNames?: string | null;
  localeName?: string | null;
  special?: string | null;
}
export type CategoryViewName =
  | "_base"
  | "_local"
  | "_minimal"
  | "category.defaultEdit"
  | "category.edit"
  | "for.cache";
export type CategoryView<V extends CategoryViewName> = V extends "_base"
  ? Pick<
      Category,
      | "id"
      | "localeName"
      | "name"
      | "entityType"
      | "isDefault"
      | "localeNames"
      | "special"
    >
  : V extends "_local"
  ? Pick<
      Category,
      "id" | "name" | "entityType" | "isDefault" | "localeNames" | "special"
    >
  : V extends "_minimal"
  ? Pick<Category, "id" | "localeName">
  : V extends "category.defaultEdit"
  ? Pick<Category, "id" | "localeName" | "isDefault">
  : V extends "category.edit"
  ? Pick<
      Category,
      | "id"
      | "name"
      | "entityType"
      | "isDefault"
      | "localeNames"
      | "special"
      | "categoryAttrs"
    >
  : V extends "for.cache"
  ? Pick<
      Category,
      | "id"
      | "name"
      | "entityType"
      | "isDefault"
      | "localeNames"
      | "special"
      | "categoryAttrs"
    >
  : never;
