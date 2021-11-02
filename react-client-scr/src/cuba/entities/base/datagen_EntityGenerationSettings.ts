import { BaseUuidEntity } from "./sys$BaseUuidEntity";
import { PropertyGenerationSettings } from "./datagen_PropertyGenerationSettings";
export class EntityGenerationSettings extends BaseUuidEntity {
  static NAME = "datagen_EntityGenerationSettings";
  amount?: number | null;
  properties?: PropertyGenerationSettings | null;
}
export type EntityGenerationSettingsViewName = "_base" | "_local" | "_minimal";
export type EntityGenerationSettingsView<
  V extends EntityGenerationSettingsViewName
> = never;
