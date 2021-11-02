import { BaseGenericIdEntity } from "./base/sys$BaseGenericIdEntity";
export class CompositeKeyEntity extends BaseGenericIdEntity {
  static NAME = "scr_CompositeKeyEntity";
  id?: object;
  testfld?: string | null;
  uuid?: any | null;
}
export type CompositeKeyEntityViewName = "_base" | "_local" | "_minimal";
export type CompositeKeyEntityView<
  V extends CompositeKeyEntityViewName
> = V extends "_base"
  ? Pick<CompositeKeyEntity, "id" | "testfld">
  : V extends "_local"
  ? Pick<CompositeKeyEntity, "id" | "testfld">
  : never;
