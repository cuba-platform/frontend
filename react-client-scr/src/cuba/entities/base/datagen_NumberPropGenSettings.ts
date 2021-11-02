import { PropertyGenerationSettings } from "./datagen_PropertyGenerationSettings";
export class NumberPropGenSettings extends PropertyGenerationSettings {
  static NAME = "datagen_NumberPropGenSettings";
  strategy?: any | null;
  manualIntegerValue?: any | null;
  manualFloatValue?: any | null;
  minRandomValue?: any | null;
  maxRandomValue?: any | null;
}
export type NumberPropGenSettingsViewName = "_base" | "_local" | "_minimal";
export type NumberPropGenSettingsView<
  V extends NumberPropGenSettingsViewName
> = never;
