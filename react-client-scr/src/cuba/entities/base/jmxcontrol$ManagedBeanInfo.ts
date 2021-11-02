import { BaseUuidEntity } from "./sys$BaseUuidEntity";
import { JmxInstance } from "./sys$JmxInstance";
export class ManagedBeanInfo extends BaseUuidEntity {
  static NAME = "jmxcontrol$ManagedBeanInfo";
  className?: string | null;
  description?: string | null;
  objectName?: string | null;
  domain?: string | null;
  propertyList?: string | null;
  jmxInstance?: JmxInstance | null;
}
export type ManagedBeanInfoViewName = "_base" | "_local" | "_minimal";
export type ManagedBeanInfoView<V extends ManagedBeanInfoViewName> = never;
