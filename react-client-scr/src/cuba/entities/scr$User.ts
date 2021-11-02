import { User } from "./base/sec$User";
export class ScrUser extends User {
  static NAME = "scr$User";
  phone?: string | null;
}
export type ScrUserViewName = "_base" | "_local" | "_minimal";
export type ScrUserView<V extends ScrUserViewName> = V extends "_base"
  ? Pick<
      ScrUser,
      | "id"
      | "login"
      | "name"
      | "phone"
      | "loginLowerCase"
      | "password"
      | "passwordEncryption"
      | "firstName"
      | "lastName"
      | "middleName"
      | "position"
      | "email"
      | "language"
      | "timeZone"
      | "timeZoneAuto"
      | "active"
      | "changePasswordAtNextLogon"
      | "groupNames"
      | "ipMask"
      | "sysTenantId"
    >
  : V extends "_local"
  ? Pick<
      ScrUser,
      | "id"
      | "phone"
      | "login"
      | "loginLowerCase"
      | "password"
      | "passwordEncryption"
      | "name"
      | "firstName"
      | "lastName"
      | "middleName"
      | "position"
      | "email"
      | "language"
      | "timeZone"
      | "timeZoneAuto"
      | "active"
      | "changePasswordAtNextLogon"
      | "groupNames"
      | "ipMask"
      | "sysTenantId"
    >
  : V extends "_minimal"
  ? Pick<ScrUser, "id" | "login" | "name">
  : never;
