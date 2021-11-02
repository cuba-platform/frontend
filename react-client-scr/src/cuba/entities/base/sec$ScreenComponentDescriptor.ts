import { BaseUuidEntity } from "./sys$BaseUuidEntity";
export class ScreenComponentDescriptor extends BaseUuidEntity {
  static NAME = "sec$ScreenComponentDescriptor";
  parent?: ScreenComponentDescriptor | null;
  caption?: string | null;
}
export type ScreenComponentDescriptorViewName = "_base" | "_local" | "_minimal";
export type ScreenComponentDescriptorView<
  V extends ScreenComponentDescriptorViewName
> = never;
