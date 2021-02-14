import { DatatypesTestEntity } from "./scr_DatatypesTestEntity";
import { IntIdentityIdTestEntity } from "./scr_IntIdentityIdTestEntity";
import { IntegerIdTestEntity } from "./scr_IntegerIdTestEntity";
import { StringIdTestEntity } from "./scr_StringIdTestEntity";
import { WeirdStringIdTestEntity } from "./scr_WeirdStringIdTestEntity";
export class DatatypesTestEntity2 {
  static NAME = "scr_DatatypesTestEntity2";
  id?: string;
  datatypesTestEntityAttr?: DatatypesTestEntity | null;
  intIdentityIdTestEntityAttr?: IntIdentityIdTestEntity | null;
  integerIdTestEntityAttr?: IntegerIdTestEntity | null;
  stringIdTestEntityAttr?: StringIdTestEntity | null;
  weirdStringIdTestEntityAttr?: WeirdStringIdTestEntity | null;
}
export type DatatypesTestEntity2ViewName =
  | "_base"
  | "_instance_name"
  | "_local"
  | "datatypesTestEntity2-view";
export type DatatypesTestEntity2View<
  V extends DatatypesTestEntity2ViewName
> = V extends "datatypesTestEntity2-view"
  ? Pick<
      DatatypesTestEntity2,
      | "id"
      | "datatypesTestEntityAttr"
      | "intIdentityIdTestEntityAttr"
      | "integerIdTestEntityAttr"
      | "stringIdTestEntityAttr"
      | "weirdStringIdTestEntityAttr"
    >
  : never;
