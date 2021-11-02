import { AbstractConditionDescriptor } from "./sec$AbstractConditionDescriptor";
export class HeaderConditionDescriptor extends AbstractConditionDescriptor {
  static NAME = "sec$HeaderConditionDescriptor";
}
export type HeaderConditionDescriptorViewName = "_base" | "_local" | "_minimal";
export type HeaderConditionDescriptorView<
  V extends HeaderConditionDescriptorViewName
> = never;
