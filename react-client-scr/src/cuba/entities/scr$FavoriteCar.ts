import { StandardEntity } from "./base/sys$StandardEntity";
import { Car } from "./scr$Car";
import { User } from "./base/sec$User";
export class FavoriteCar extends StandardEntity {
  static NAME = "scr$FavoriteCar";
  car?: Car | null;
  user?: User | null;
  notes?: string | null;
}
export type FavoriteCarViewName =
  | "_base"
  | "_local"
  | "_minimal"
  | "favoriteCar-edit"
  | "favoriteCar-view";
export type FavoriteCarView<V extends FavoriteCarViewName> = V extends "_base"
  ? Pick<FavoriteCar, "id" | "car" | "notes">
  : V extends "_local"
  ? Pick<FavoriteCar, "id" | "notes">
  : V extends "_minimal"
  ? Pick<FavoriteCar, "id" | "car">
  : V extends "favoriteCar-edit"
  ? Pick<FavoriteCar, "id" | "notes" | "car" | "user">
  : V extends "favoriteCar-view"
  ? Pick<FavoriteCar, "id" | "notes" | "car" | "user">
  : never;
