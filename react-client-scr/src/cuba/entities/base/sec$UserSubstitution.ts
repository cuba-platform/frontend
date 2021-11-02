import { StandardEntity } from "./sys$StandardEntity";
import { User } from "./sec$User";
export class UserSubstitution extends StandardEntity {
  static NAME = "sec$UserSubstitution";
  user?: User | null;
  substitutedUser?: User | null;
  startDate?: any | null;
  endDate?: any | null;
  sysTenantId?: string | null;
}
export type UserSubstitutionViewName =
  | "_base"
  | "_local"
  | "_minimal"
  | "app"
  | "user.edit"
  | "usersubst.edit";
export type UserSubstitutionView<
  V extends UserSubstitutionViewName
> = V extends "_base"
  ? Pick<UserSubstitution, "id" | "startDate" | "endDate" | "sysTenantId">
  : V extends "_local"
  ? Pick<UserSubstitution, "id" | "startDate" | "endDate" | "sysTenantId">
  : V extends "app"
  ? Pick<UserSubstitution, "id" | "substitutedUser">
  : V extends "user.edit"
  ? Pick<UserSubstitution, "id" | "substitutedUser" | "startDate" | "endDate">
  : V extends "usersubst.edit"
  ? Pick<
      UserSubstitution,
      "id" | "user" | "substitutedUser" | "startDate" | "endDate"
    >
  : never;
