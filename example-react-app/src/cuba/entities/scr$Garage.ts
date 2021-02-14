import { User } from "./scr_User";
import { Car } from "./scr$Car";
export class Garage {
  static NAME = "scr$Garage";
  id?: string;
  name?: string | null;
  address?: string | null;
  personnel?: User[] | null;
  capacity?: number | null;
  vanEntry?: boolean | null;
  workingHoursFrom?: any | null;
  workingHoursTo?: any | null;
  currentCars?: Car[] | null;
}
export type GarageViewName = "_base" | "_instance_name" | "_local";
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
  : never;
