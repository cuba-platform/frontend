import {CubaRestError} from '@cuba-platform/rest';

export const defaultMapCubaRestErrorToIntlId = (error: CubaRestError): string => {
  if (error.message === "Failed to fetch") {
    return "cubaRest.error.serverNotResponded";
  }

  switch (error?.response?.status) {
    case 400: return "cubaRest.error.badRequest";
    case 401: return "cubaRest.error.unauthorized";
    case 404: return "cubaRest.error.notFound";
    case 500: return "cubaRest.error.serverError";
    default: return "cubaRest.error.unknown";
  }
}

export const mapCubaRestErrorToIntlId = (localMapCubaRestErrorToIntlId: (error: CubaRestError) => string | void, error: CubaRestError): string => {
  console.error(error);

  const errorMassageId = localMapCubaRestErrorToIntlId(error)

  return errorMassageId || defaultMapCubaRestErrorToIntlId(error)
}

export const loginMapCubaRestErrorToIntlId = (error: CubaRestError): string => mapCubaRestErrorToIntlId(
  (error: CubaRestError): string | void => {
    switch (error?.response?.status) {
      case 400: return 'login.failed';
    }
  },
  error,
);
