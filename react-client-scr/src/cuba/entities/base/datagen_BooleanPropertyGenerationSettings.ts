import { PropertyGenerationSettings } from "./datagen_PropertyGenerationSettings";
export class BooleanPropertyGenerationSettings extends PropertyGenerationSettings {
  static NAME = "datagen_BooleanPropertyGenerationSettings";
  manualValue?: boolean | null;
  strategy?: any | null;
}
export type BooleanPropertyGenerationSettingsViewName =
  | "_base"
  | "_local"
  | "_minimal";
export type BooleanPropertyGenerationSettingsView<
  V extends BooleanPropertyGenerationSettingsViewName
> = never;
