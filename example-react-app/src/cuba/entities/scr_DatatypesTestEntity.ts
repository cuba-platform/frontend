import { TestEnum } from "../enums/enums";
import { AssociationO2OTestEntity } from "./scr_AssociationO2OTestEntity";
import { AssociationO2MTestEntity } from "./scr_AssociationO2MTestEntity";
import { AssociationM2OTestEntity } from "./scr_AssociationM2OTestEntity";
import { AssociationM2MTestEntity } from "./scr_AssociationM2MTestEntity";
import { CompositionO2OTestEntity } from "./scr_CompositionO2OTestEntity";
import { CompositionO2MTestEntity } from "./scr_CompositionO2MTestEntity";
import { IntIdentityIdTestEntity } from "./scr_IntIdentityIdTestEntity";
import { IntegerIdTestEntity } from "./scr_IntegerIdTestEntity";
import { DatatypesTestEntity3 } from "./scr_DatatypesTestEntity3";
import { StringIdTestEntity } from "./scr_StringIdTestEntity";
export class DatatypesTestEntity {
  static NAME = "scr_DatatypesTestEntity";
  id?: string;
  bigDecimalAttr?: any | null;
  booleanAttr?: boolean | null;
  dateAttr?: any | null;
  dateTimeAttr?: any | null;
  doubleAttr?: any | null;
  integerAttr?: number | null;
  longAttr?: any | null;
  stringAttr?: string | null;
  timeAttr?: any | null;
  uuidAttr?: any | null;
  localDateTimeAttr?: any | null;
  offsetDateTimeAttr?: any | null;
  localDateAttr?: any | null;
  localTimeAttr?: any | null;
  offsetTimeAttr?: any | null;
  enumAttr?: TestEnum | null;
  associationO2Oattr?: AssociationO2OTestEntity | null;
  associationO2Mattr?: AssociationO2MTestEntity[] | null;
  associationM2Oattr?: AssociationM2OTestEntity | null;
  associationM2Mattr?: AssociationM2MTestEntity[] | null;
  compositionO2Oattr?: CompositionO2OTestEntity | null;
  compositionO2Mattr?: CompositionO2MTestEntity[] | null;
  name?: string | null;
  intIdentityIdTestEntityAssociationO2OAttr?: IntIdentityIdTestEntity | null;
  integerIdTestEntityAssociationM2MAttr?: IntegerIdTestEntity[] | null;
  datatypesTestEntity3?: DatatypesTestEntity3 | null;
  stringIdTestEntityAssociationO2O?: StringIdTestEntity | null;
  stringIdTestEntityAssociationM2O?: StringIdTestEntity | null;
  readOnlyStringAttr?: string | null;
}
export type DatatypesTestEntityViewName =
  | "_base"
  | "_instance_name"
  | "_local"
  | "datatypesTestEntity-view";
export type DatatypesTestEntityView<
  V extends DatatypesTestEntityViewName
> = V extends "_base"
  ? Pick<
      DatatypesTestEntity,
      | "id"
      | "bigDecimalAttr"
      | "booleanAttr"
      | "dateAttr"
      | "dateTimeAttr"
      | "doubleAttr"
      | "integerAttr"
      | "longAttr"
      | "stringAttr"
      | "timeAttr"
      | "uuidAttr"
      | "localDateTimeAttr"
      | "offsetDateTimeAttr"
      | "localDateAttr"
      | "localTimeAttr"
      | "offsetTimeAttr"
      | "enumAttr"
      | "name"
      | "readOnlyStringAttr"
    >
  : V extends "_local"
  ? Pick<
      DatatypesTestEntity,
      | "id"
      | "bigDecimalAttr"
      | "booleanAttr"
      | "dateAttr"
      | "dateTimeAttr"
      | "doubleAttr"
      | "integerAttr"
      | "longAttr"
      | "stringAttr"
      | "timeAttr"
      | "uuidAttr"
      | "localDateTimeAttr"
      | "offsetDateTimeAttr"
      | "localDateAttr"
      | "localTimeAttr"
      | "offsetTimeAttr"
      | "enumAttr"
      | "name"
      | "readOnlyStringAttr"
    >
  : V extends "datatypesTestEntity-view"
  ? Pick<
      DatatypesTestEntity,
      | "id"
      | "bigDecimalAttr"
      | "booleanAttr"
      | "dateAttr"
      | "dateTimeAttr"
      | "doubleAttr"
      | "integerAttr"
      | "longAttr"
      | "stringAttr"
      | "timeAttr"
      | "uuidAttr"
      | "localDateTimeAttr"
      | "offsetDateTimeAttr"
      | "localDateAttr"
      | "localTimeAttr"
      | "offsetTimeAttr"
      | "enumAttr"
      | "name"
      | "readOnlyStringAttr"
      | "associationO2Oattr"
      | "associationO2Mattr"
      | "associationM2Oattr"
      | "associationM2Mattr"
      | "compositionO2Oattr"
      | "compositionO2Mattr"
      | "intIdentityIdTestEntityAssociationO2OAttr"
      | "integerIdTestEntityAssociationM2MAttr"
      | "stringIdTestEntityAssociationO2O"
      | "stringIdTestEntityAssociationM2O"
    >
  : never;
