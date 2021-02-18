import { CarType, EcoRank } from "../enums/enums";
import { Garage } from "./scr$Garage";
import { TechnicalCertificate } from "./scr$TechnicalCertificate";
export class Car {
  static NAME = "scr$Car";
  id?: string;
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
}
export type CarViewName = "_base" | "_instance_name" | "_local" | "car-edit";
export type CarView<V extends CarViewName> = V extends "_base"
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
    >
  : never;
