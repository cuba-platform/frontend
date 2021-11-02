import { AbstractConditionDescriptor } from "./sec$AbstractConditionDescriptor";
export class PropertyConditionDescriptor extends AbstractConditionDescriptor {
  static NAME = "sec$PropertyConditionDescriptor";
}
export type PropertyConditionDescriptorViewName =
  | "_base"
  | "_local"
  | "_minimal";
export type PropertyConditionDescriptorView<
  V extends PropertyConditionDescriptorViewName
> = never;
