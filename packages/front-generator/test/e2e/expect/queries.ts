import { CubaApp, FetchOptions } from "@cuba-platform/rest";

import { Car } from "./entities/mpg$Car";

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
      return cubaApp.query("mpg$Car", "allCars", {}, fetchOpts);
    },
    allCarsCount: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => () => {
      return cubaApp.queryCount("mpg$Car", "allCars", {}, fetchOpts);
    },
    allCarsWithCount: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => () => {
      return cubaApp.queryWithCount("mpg$Car", "allCars", {}, fetchOpts);
    },
    ecoCars: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (
      params: queries_Car_ecoCars_params
    ) => {
      return cubaApp.query("mpg$Car", "ecoCars", params, fetchOpts);
    },
    ecoCarsCount: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (
      params: queries_Car_ecoCars_params
    ) => {
      return cubaApp.queryCount("mpg$Car", "ecoCars", params, fetchOpts);
    },
    ecoCarsWithCount: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (
      params: queries_Car_ecoCars_params
    ) => {
      return cubaApp.queryWithCount("mpg$Car", "ecoCars", params, fetchOpts);
    },
    carsByType: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (
      params: queries_Car_carsByType_params
    ) => {
      return cubaApp.query("mpg$Car", "carsByType", params, fetchOpts);
    },
    carsByTypeCount: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (
      params: queries_Car_carsByType_params
    ) => {
      return cubaApp.queryCount("mpg$Car", "carsByType", params, fetchOpts);
    },
    carsByTypeWithCount: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (
      params: queries_Car_carsByType_params
    ) => {
      return cubaApp.queryWithCount("mpg$Car", "carsByType", params, fetchOpts);
    }
  },
  FavoriteCar: {
    allCars: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (
      params: queries_FavoriteCar_allCars_params
    ) => {
      return cubaApp.query("mpg$FavoriteCar", "allCars", params, fetchOpts);
    },
    allCarsCount: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (
      params: queries_FavoriteCar_allCars_params
    ) => {
      return cubaApp.queryCount(
        "mpg$FavoriteCar",
        "allCars",
        params,
        fetchOpts
      );
    },
    allCarsWithCount: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (
      params: queries_FavoriteCar_allCars_params
    ) => {
      return cubaApp.queryWithCount(
        "mpg$FavoriteCar",
        "allCars",
        params,
        fetchOpts
      );
    }
  }
};
