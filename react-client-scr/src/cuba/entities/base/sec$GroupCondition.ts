import { AbstractCondition } from "./sec$AbstractCondition";
export class GroupCondition extends AbstractCondition {
  static NAME = "sec$GroupCondition";
}
export type GroupConditionViewName = "_base" | "_local" | "_minimal";
export type GroupConditionView<V extends GroupConditionViewName> = never;
