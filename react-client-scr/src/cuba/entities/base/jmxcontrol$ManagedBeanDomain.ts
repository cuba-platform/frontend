import { BaseUuidEntity } from "./sys$BaseUuidEntity";
export class ManagedBeanDomain extends BaseUuidEntity {
  static NAME = "jmxcontrol$ManagedBeanDomain";
  name?: string | null;
}
export type ManagedBeanDomainViewName = "_base" | "_local" | "_minimal";
export type ManagedBeanDomainView<V extends ManagedBeanDomainViewName> = never;
