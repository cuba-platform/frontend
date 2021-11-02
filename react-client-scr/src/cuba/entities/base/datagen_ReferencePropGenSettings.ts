import { PropertyGenerationSettings } from "./datagen_PropertyGenerationSettings";
import { BaseGenericIdEntity } from "./sys$BaseGenericIdEntity";
export class ReferencePropGenSettings extends PropertyGenerationSettings {
  static NAME = "datagen_ReferencePropGenSettings";
  referenceEntity?: BaseGenericIdEntity | null;
}
export type ReferencePropGenSettingsViewName = "_base" | "_local" | "_minimal";
export type ReferencePropGenSettingsView<
  V extends ReferencePropGenSettingsViewName
> = never;
