import { StandardEntity } from "./base/sys$StandardEntity";
import { User } from "./base/sec$User";
import { Car } from "./scr$Car";
export class Garage extends StandardEntity {
  static NAME = "scr$Garage";
  name?: string | null;
  address?: string | null;
  personnel?: User[] | null;
  capacity?: number | null;
  vanEntry?: boolean | null;
  workingHoursFrom?: any | null;
  workingHoursTo?: any | null;
  currentCars?: Car | null;
}
export type GarageViewName = "_base" | "_local" | "_minimal";
export type GarageView<V extends GarageViewName> = V extends "_base"
  ? Pick<
      Garage,
      | "id"
      | "name"
      | "address"
      | "capacity"
      | "vanEntry"
      | "workingHoursFrom"
      | "workingHoursTo"
    >
  : V extends "_local"
  ? Pick<
      Garage,
      | "id"
      | "name"
      | "address"
      | "capacity"
      | "vanEntry"
      | "workingHoursFrom"
      | "workingHoursTo"
    >
  : V extends "_minimal"
  ? Pick<Garage, "id" | "name">
  : never;
