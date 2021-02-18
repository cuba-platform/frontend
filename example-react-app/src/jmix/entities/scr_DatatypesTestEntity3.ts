import { DatatypesTestEntity } from "./scr_DatatypesTestEntity";
import { IntegerIdTestEntity } from "./scr_IntegerIdTestEntity";
import { IntIdentityIdTestEntity } from "./scr_IntIdentityIdTestEntity";
import { StringIdTestEntity } from "./scr_StringIdTestEntity";
import { WeirdStringIdTestEntity } from "./scr_WeirdStringIdTestEntity";
export class DatatypesTestEntity3 {
  static NAME = "scr_DatatypesTestEntity3";
  id?: string;
  datatypesTestEntityAttr?: DatatypesTestEntity[] | null;
  integerIdTestEntityAttr?: IntegerIdTestEntity[] | null;
  intIdentityIdTestEntityAttr?: IntIdentityIdTestEntity[] | null;
  stringIdTestEntityAttr?: StringIdTestEntity[] | null;
  weirdStringIdTestEntityAttr?: WeirdStringIdTestEntity[] | null;
  name?: string | null;
}
export type DatatypesTestEntity3ViewName =
  | "_base"
  | "_instance_name"
  | "_local"
  | "datatypesTestEntity3-view";
export type DatatypesTestEntity3View<
  V extends DatatypesTestEntity3ViewName
> = V extends "_base"
  ? Pick<DatatypesTestEntity3, "id" | "name">
  : V extends "_local"
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
