export class User {
  static NAME = "scr_User";
  id?: string;
  version?: number | null;
  username?: string | null;
  password?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  enabled?: boolean | null;
  phone?: string | null;
}
export type UserViewName = "_base" | "_instance_name" | "_local";
export type UserView<V extends UserViewName> = V extends "_base"
  ? Pick<
      User,
      | "id"
      | "version"
      | "username"
      | "password"
      | "firstName"
      | "lastName"
      | "email"
      | "enabled"
      | "phone"
    >
  : V extends "_local"
  ? Pick<
      User,
      | "id"
      | "version"
      | "username"
      | "password"
      | "firstName"
      | "lastName"
      | "email"
      | "enabled"
      | "phone"
    >
  : never;
