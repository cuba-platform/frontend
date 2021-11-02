import { AbstractConditionDescriptor } from "./sec$AbstractConditionDescriptor";
export class DynamicAttributesConditionCreator extends AbstractConditionDescriptor {
  static NAME = "sec$DynamicAttributesConditionCreator";
}
export type DynamicAttributesConditionCreatorViewName =
  | "_base"
  | "_local"
  | "_minimal";
export type DynamicAttributesConditionCreatorView<
  V extends DynamicAttributesConditionCreatorViewName
> = never;
