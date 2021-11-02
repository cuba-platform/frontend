import { AbstractCondition } from "./sec$AbstractCondition";
export class DynamicAttributesCondition extends AbstractCondition {
  static NAME = "sec$DynamicAttributesCondition";
}
export type DynamicAttributesConditionViewName =
  | "_base"
  | "_local"
  | "_minimal";
export type DynamicAttributesConditionView<
  V extends DynamicAttributesConditionViewName
> = never;
