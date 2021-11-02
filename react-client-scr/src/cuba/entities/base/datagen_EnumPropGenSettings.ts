import { PropertyGenerationSettings } from "./datagen_PropertyGenerationSettings";
export class EnumPropGenSettings extends PropertyGenerationSettings {
  static NAME = "datagen_EnumPropGenSettings";
  strategy?: any | null;
}
export type EnumPropGenSettingsViewName = "_base" | "_local" | "_minimal";
export type EnumPropGenSettingsView<
  V extends EnumPropGenSettingsViewName
> = never;
