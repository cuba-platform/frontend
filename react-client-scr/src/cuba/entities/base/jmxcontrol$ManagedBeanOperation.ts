import { BaseUuidEntity } from "./sys$BaseUuidEntity";
export class ManagedBeanOperation extends BaseUuidEntity {
  static NAME = "jmxcontrol$ManagedBeanOperation";
  name?: string | null;
  returnType?: string | null;
  description?: string | null;
  runAsync?: boolean | null;
  timeout?: any | null;
}
export type ManagedBeanOperationViewName = "_base" | "_local" | "_minimal";
export type ManagedBeanOperationView<
  V extends ManagedBeanOperationViewName
> = never;
