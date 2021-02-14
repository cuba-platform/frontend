import { Car } from "./scr$Car";
export class CarRent {
  static NAME = "scr$CarRent";
  id?: string;
  car?: Car | null;
  fromDate?: any | null;
  fromTime?: any | null;
  fromDateTime?: any | null;
}
export type CarRentViewName =
  | "_base"
  | "_instance_name"
  | "_local"
  | "carRent-edit";
export type CarRentView<V extends CarRentViewName> = V extends "_base"
  ? Pick<CarRent, "id" | "fromDate" | "fromTime" | "fromDateTime">
  : V extends "_local"
  ? Pick<CarRent, "id" | "fromDate" | "fromTime" | "fromDateTime">
  : V extends "carRent-edit"
  ? Pick<CarRent, "id" | "fromDate" | "fromTime" | "fromDateTime" | "car">
  : never;
