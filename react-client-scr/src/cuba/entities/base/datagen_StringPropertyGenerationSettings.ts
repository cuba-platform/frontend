import { PropertyGenerationSettings } from "./datagen_PropertyGenerationSettings";
export class StringPropGenSettings extends PropertyGenerationSettings {
  static NAME = "datagen_StringPropertyGenerationSettings";
  manualValue?: string | null;
  strategy?: any | null;
  fakerFunctionRef?: string | null;
}
export type StringPropGenSettingsViewName = "_base" | "_local" | "_minimal";
export type StringPropGenSettingsView<
  V extends StringPropGenSettingsViewName
> = never;
