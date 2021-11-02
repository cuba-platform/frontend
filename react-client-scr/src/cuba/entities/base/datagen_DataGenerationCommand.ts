import { BaseUuidEntity } from "./sys$BaseUuidEntity";
export class DataGenerationCommand extends BaseUuidEntity {
  static NAME = "datagen_DataGenerationCommand";
  type?: any | null;
  amount?: number | null;
  entityGenerationSettings?: any | null;
}
export type DataGenerationCommandViewName = "_base" | "_local" | "_minimal";
export type DataGenerationCommandView<
  V extends DataGenerationCommandViewName
> = never;
