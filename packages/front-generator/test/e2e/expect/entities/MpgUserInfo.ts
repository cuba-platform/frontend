import { BaseUuidEntity } from "./base/sys$BaseUuidEntity";
import { Car } from "./mpg$Car";
export class MpgUserInfo extends BaseUuidEntity {
    static NAME = "MpgUserInfo";
    firstName?: string | null;
    lastName?: string | null;
    favouriteCars?: Car | null;
}
export type MpgUserInfoViewName = "_minimal" | "_local" | "_base";
export type MpgUserInfoView<V extends MpgUserInfoViewName> = never;
