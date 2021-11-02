import { StandardEntity } from "./base/sys$StandardEntity";
import { DatatypesTestEntity } from "./scr_DatatypesTestEntity";
import { IntegerIdTestEntity } from "./scr_IntegerIdTestEntity";
import { IntIdentityIdTestEntity } from "./scr_IntIdentityIdTestEntity";
import { StringIdTestEntity } from "./scr_StringIdTestEntity";
import { WeirdStringIdTestEntity } from "./scr_WeirdStringIdTestEntity";
export class DatatypesTestEntity3 extends StandardEntity {
  static NAME = "scr_DatatypesTestEntity3";
  datatypesTestEntityAttr?: DatatypesTestEntity[] | null;
  integerIdTestEntityAttr?: IntegerIdTestEntity[] | null;
  intIdentityIdTestEntityAttr?: IntIdentityIdTestEntity[] | null;
  stringIdTestEntityAttr?: StringIdTestEntity[] | null;
  weirdStringIdTestEntityAttr?: WeirdStringIdTestEntity[] | null;
  name?: string | null;
}
export type DatatypesTestEntity3ViewName =
  | "_base"
  | "_local"
  | "_minimal"
  | "datatypesTestEntity3-view";
export type DatatypesTestEntity3View<
  V extends DatatypesTestEntity3ViewName
> = V extends "_base"
  ? Pick<DatatypesTestEntity3, "id" | "name">
  : V extends "_local"
  ? Pick<DatatypesTestEntity3, "id" | "name">
  : V extends "_minimal"
  ? Pick<DatatypesTestEntity3, "id" | "name">
  : V extends "datatypesTestEntity3-view"
  ? Pick<
      DatatypesTestEntity3,
      | "id"
      | "name"
      | "datatypesTestEntityAttr"
      | "integerIdTestEntityAttr"
      | "intIdentityIdTestEntityAttr"
      | "stringIdTestEntityAttr"
      | "weirdStringIdTestEntityAttr"
    >
  : never;
