import { AbstractCondition } from "./sec$AbstractCondition";
export class FtsCondition extends AbstractCondition {
  static NAME = "sec$FtsCondition";
}
export type FtsConditionViewName = "_base" | "_local" | "_minimal";
export type FtsConditionView<V extends FtsConditionViewName> = never;
