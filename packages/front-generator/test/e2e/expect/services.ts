import { CubaApp, FetchOptions } from "@cuba-platform/rest";

import { Car } from "./entities/mpg$Car";

import { CarType } from "./enums/enums";

export type mpg_FavoriteService_addFavorite_params =
  | {
      carId: string;
      notes: string;
    }
  | {
      car: Car;
      notes: string;
    }
  | {
      favInfo: any;
    };

export type mpg_FavoriteService_getFavoritesByType_params = {
  carType: CarType;
};

export var restServices = {
  mpg_FavoriteService: {
    addFavorite: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (
      params: mpg_FavoriteService_addFavorite_params
    ) => {
      return cubaApp.invokeService(
        "mpg_FavoriteService",
        "addFavorite",
        params,
        fetchOpts
      );
    },
    getFavorites: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => () => {
      return cubaApp.invokeService(
        "mpg_FavoriteService",
        "getFavorites",
        {},
        fetchOpts
      );
    },
    getFavoritesByType: (cubaApp: CubaApp, fetchOpts?: FetchOptions) => (
      params: mpg_FavoriteService_getFavoritesByType_params
    ) => {
      return cubaApp.invokeService(
        "mpg_FavoriteService",
        "getFavoritesByType",
        params,
        fetchOpts
      );
    }
  }
};