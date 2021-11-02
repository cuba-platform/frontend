import { BaseGenericIdEntity } from "./sys$BaseGenericIdEntity";
export class CategoryAttributeConfiguration extends BaseGenericIdEntity {
  static NAME = "sys$CategoryAttributeConfiguration";
  id?: string;
  minInt?: number | null;
  minDouble?: any | null;
  minDecimal?: any | null;
  maxInt?: number | null;
  maxDouble?: any | null;
  maxDecimal?: any | null;
  validatorGroovyScript?: string | null;
  columnName?: string | null;
  columnAlignment?: string | null;
  columnWidth?: number | null;
  numberFormatPattern?: string | null;
  optionsLoaderType?: any | null;
  optionsLoaderScript?: string | null;
  recalculationScript?: string | null;
  xCoordinate?: number | null;
  yCoordinate?: number | null;
}
export type CategoryAttributeConfigurationViewName =
  | "_base"
  | "_local"
  | "_minimal";
export type CategoryAttributeConfigurationView<
  V extends CategoryAttributeConfigurationViewName
> = never;
