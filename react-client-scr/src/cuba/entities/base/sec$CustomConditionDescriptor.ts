import { AbstractConditionDescriptor } from "./sec$AbstractConditionDescriptor";
export class CustomConditionDescriptor extends AbstractConditionDescriptor {
  static NAME = "sec$CustomConditionDescriptor";
}
export type CustomConditionDescriptorViewName = "_base" | "_local" | "_minimal";
export type CustomConditionDescriptorView<
  V extends CustomConditionDescriptorViewName
> = never;
