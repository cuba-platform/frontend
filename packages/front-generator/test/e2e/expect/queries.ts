import { CubaApp, FetchOptions } from "@cuba-platform/rest";

import { Car } from "./entities/scr$Car";

export type queries_Car_ecoCars_params =
  | {}
  | {
      ecoRank: string;
    }
  | {
      model: string;
    };

export type queries_Car_carsByType_params = {
  carType: string;
};

export type queries_FavoriteCar_allCars_params = {
  car: Car;
};

export var restQueries = {
  Car: {
    allCars: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => () => {
      return cubaApp.query("scr$Car", "allCars", {}, fetchOpts);
    },
    allCarsCount: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => () => {
      return cubaApp.queryCount("scr$Car", "allCars", {}, fetchOpts);
    },
    allCarsWithCount: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => () => {
      return cubaApp.queryWithCount("scr$Car", "allCars", {}, fetchOpts);
    },
    ecoCars: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (
      params: queries_Car_ecoCars_params
    ) => {
      return cubaApp.query("scr$Car", "ecoCars", params, fetchOpts);
    },
    ecoCarsCount: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (
      params: queries_Car_ecoCars_params
    ) => {
      return cubaApp.queryCount("scr$Car", "ecoCars", params, fetchOpts);
    },
    ecoCarsWithCount: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (
      params: queries_Car_ecoCars_params
    ) => {
      return cubaApp.queryWithCount("scr$Car", "ecoCars", params, fetchOpts);
    },
    carsByType: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (
      params: queries_Car_carsByType_params
    ) => {
      return cubaApp.query("scr$Car", "carsByType", params, fetchOpts);
    },
    carsByTypeCount: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (
      params: queries_Car_carsByType_params
    ) => {
      return cubaApp.queryCount("scr$Car", "carsByType", params, fetchOpts);
    },
    carsByTypeWithCount: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (
      params: queries_Car_carsByType_params
    ) => {
      return cubaApp.queryWithCount("scr$Car", "carsByType", params, fetchOpts);
    }
  },
  FavoriteCar: {
    allCars: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (
      params: queries_FavoriteCar_allCars_params
    ) => {
      return cubaApp.query("scr$FavoriteCar", "allCars", params, fetchOpts);
    },
    allCarsCount: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (
      params: queries_FavoriteCar_allCars_params
    ) => {
      return cubaApp.queryCount(
        "scr$FavoriteCar",
        "allCars",
        params,
        fetchOpts
      );
    },
    allCarsWithCount: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (
      params: queries_FavoriteCar_allCars_params
    ) => {
      return cubaApp.queryWithCount(
        "scr$FavoriteCar",
        "allCars",
        params,
        fetchOpts
      );
    }
  }
};
