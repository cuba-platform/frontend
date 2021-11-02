import { BaseUuidEntity } from "./sys$BaseUuidEntity";
export class ManagedBeanOperationParameter extends BaseUuidEntity {
  static NAME = "jmxcontrol$ManagedBeanOperationParameter";
  name?: string | null;
  description?: string | null;
  type?: string | null;
  javaType?: string | null;
}
export type ManagedBeanOperationParameterViewName =
  | "_base"
  | "_local"
  | "_minimal";
export type ManagedBeanOperationParameterView<
  V extends ManagedBeanOperationParameterViewName
> = never;
