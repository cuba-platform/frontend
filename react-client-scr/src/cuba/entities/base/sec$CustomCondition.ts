import { AbstractCondition } from "./sec$AbstractCondition";
export class CustomCondition extends AbstractCondition {
  static NAME = "sec$CustomCondition";
}
export type CustomConditionViewName = "_base" | "_local" | "_minimal";
export type CustomConditionView<V extends CustomConditionViewName> = never;
