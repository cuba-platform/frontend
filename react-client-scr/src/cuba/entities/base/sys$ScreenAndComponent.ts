import { BaseUuidEntity } from "./sys$BaseUuidEntity";
export class ScreenAndComponent extends BaseUuidEntity {
  static NAME = "sys$ScreenAndComponent";
  screen?: string | null;
  component?: string | null;
}
export type ScreenAndComponentViewName = "_base" | "_local" | "_minimal";
export type ScreenAndComponentView<
  V extends ScreenAndComponentViewName
> = never;
