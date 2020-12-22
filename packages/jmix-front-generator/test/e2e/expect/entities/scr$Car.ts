import { StandardEntity } from "./base/sys$StandardEntity";
import { CarType, EcoRank } from "../enums/enums";
import { Garage } from "./scr$Garage";
import { TechnicalCertificate } from "./scr$TechnicalCertificate";
import { FileDescriptor } from "./base/sys$FileDescriptor";
export class Car extends StandardEntity {
  static NAME = "scr$Car";
  manufacturer?: string | null;
  model?: string | null;
  regNumber?: string | null;
  purchaseDate?: any | null;
  manufactureDate?: any | null;
  wheelOnRight?: boolean | null;
  carType?: CarType | null;
  ecoRank?: EcoRank | null;
  garage?: Garage | null;
  maxPassengers?: number | null;
  price?: any | null;
  mileage?: any | null;
  technicalCertificate?: TechnicalCertificate | null;
  photo?: FileDescriptor | null;
}
export type CarViewName = "_minimal" | "_local" | "_base" | "car-edit";
export type CarView<V extends CarViewName> = V extends "_minimal"
  ? Pick<Car, "id" | "manufacturer" | "model">
  : V extends "_local"
    ? Pick<
      Car,
      | "id"
      | "manufacturer"
      | "model"
      | "regNumber"
      | "purchaseDate"
      | "manufactureDate"
      | "wheelOnRight"
      | "carType"
      | "ecoRank"
      | "maxPassengers"
      | "price"
      | "mileage"
      >
    : V extends "_base"
      ? Pick<
        Car,
        | "id"
        | "manufacturer"
        | "model"
        | "regNumber"
        | "purchaseDate"
        | "manufactureDate"
        | "wheelOnRight"
        | "carType"
        | "ecoRank"
        | "maxPassengers"
        | "price"
        | "mileage"
        >
      : V extends "car-edit"
        ? Pick<
          Car,
          | "id"
          | "manufacturer"
          | "model"
          | "regNumber"
          | "purchaseDate"
          | "manufactureDate"
          | "wheelOnRight"
          | "carType"
          | "ecoRank"
          | "maxPassengers"
          | "price"
          | "mileage"
          | "garage"
          | "technicalCertificate"
          | "photo"
          >
        : never;