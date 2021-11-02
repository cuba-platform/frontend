import { AbstractCondition } from "./sec$AbstractCondition";
export class PropertyCondition extends AbstractCondition {
  static NAME = "sec$PropertyCondition";
}
export type PropertyConditionViewName = "_base" | "_local" | "_minimal";
export type PropertyConditionView<V extends PropertyConditionViewName> = never;
