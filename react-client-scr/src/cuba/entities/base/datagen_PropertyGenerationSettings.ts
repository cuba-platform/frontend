import { BaseUuidEntity } from "./sys$BaseUuidEntity";
export class PropertyGenerationSettings extends BaseUuidEntity {
  static NAME = "datagen_PropertyGenerationSettings";
}
export type PropertyGenerationSettingsViewName =
  | "_base"
  | "_local"
  | "_minimal";
export type PropertyGenerationSettingsView<
  V extends PropertyGenerationSettingsViewName
> = never;
