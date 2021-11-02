import { BaseUuidEntity } from "./sys$BaseUuidEntity";
export class ManagedBeanAttribute extends BaseUuidEntity {
  static NAME = "jmxcontrol$ManagedBeanAttribute";
  name?: string | null;
  description?: string | null;
  type?: string | null;
  readableWriteable?: string | null;
  readable?: boolean | null;
  writeable?: boolean | null;
  valueString?: string | null;
}
export type ManagedBeanAttributeViewName = "_base" | "_local" | "_minimal";
export type ManagedBeanAttributeView<
  V extends ManagedBeanAttributeViewName
> = never;
