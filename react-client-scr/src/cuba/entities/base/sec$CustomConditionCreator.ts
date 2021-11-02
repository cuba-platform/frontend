import { AbstractConditionDescriptor } from "./sec$AbstractConditionDescriptor";
export class CustomConditionCreator extends AbstractConditionDescriptor {
  static NAME = "sec$CustomConditionCreator";
}
export type CustomConditionCreatorViewName = "_base" | "_local" | "_minimal";
export type CustomConditionCreatorView<
  V extends CustomConditionCreatorViewName
> = never;
