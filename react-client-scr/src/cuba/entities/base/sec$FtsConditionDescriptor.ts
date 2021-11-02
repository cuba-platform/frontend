import { AbstractConditionDescriptor } from "./sec$AbstractConditionDescriptor";
export class FtsConditionDescriptor extends AbstractConditionDescriptor {
  static NAME = "sec$FtsConditionDescriptor";
}
export type FtsConditionDescriptorViewName = "_base" | "_local" | "_minimal";
export type FtsConditionDescriptorView<
  V extends FtsConditionDescriptorViewName
> = never;
