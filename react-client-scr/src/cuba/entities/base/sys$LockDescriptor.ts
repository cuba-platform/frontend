import { BaseUuidEntity } from "./sys$BaseUuidEntity";
export class LockDescriptor extends BaseUuidEntity {
  static NAME = "sys$LockDescriptor";
  createTs?: any | null;
  createdBy?: string | null;
  name?: string | null;
  timeoutSec?: number | null;
}
export type LockDescriptorViewName = "_base" | "_local" | "_minimal";
export type LockDescriptorView<
  V extends LockDescriptorViewName
> = V extends "_base"
  ? Pick<LockDescriptor, "id" | "name" | "timeoutSec">
  : V extends "_local"
  ? Pick<LockDescriptor, "id" | "name" | "timeoutSec">
  : never;
