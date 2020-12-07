import {PropertyType} from '@haulmont/jmix-rest';
import {getCubaAppConfig} from '../app/CubaAppProvider';
import { Moment } from 'moment';

export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';
export const DEFAULT_TIME_FORMAT = 'HH:mm:ss';

export const DEFAULT_DATE_TIME_DATA_TRANSFER_FORMAT = 'YYYY-MM-DD HH:mm:ss.SSS';
export const DEFAULT_DATE_TIME_DISPLAY_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const OFFSET_DATE_TIME_DATE_TRANSFER_FORMAT = 'YYYY-MM-DD HH:mm:ss.SSS ZZ';
export const OFFSET_DATE_TIME_DISPLAY_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export const OFFSET_TIME_DATA_TRANSFER_FORMAT = 'HH:mm:ss ZZ';
export const OFFSET_TIME_DISPLAY_FORMAT = 'HH:mm:ss';

export const defaultDataTransferFormats: Partial<Record<PropertyType, string>> = {
  date: DEFAULT_DATE_FORMAT,
  time: DEFAULT_TIME_FORMAT,
  dateTime: DEFAULT_DATE_TIME_DATA_TRANSFER_FORMAT,
  localDate: DEFAULT_DATE_FORMAT,
  localTime: DEFAULT_TIME_FORMAT,
  localDateTime: DEFAULT_DATE_TIME_DATA_TRANSFER_FORMAT,
  offsetDateTime: OFFSET_DATE_TIME_DATE_TRANSFER_FORMAT,
  offsetTime: OFFSET_TIME_DATA_TRANSFER_FORMAT
};

export const defaultDisplayFormats: Partial<Record<PropertyType, string>> = {
  date: DEFAULT_DATE_FORMAT,
  time: DEFAULT_TIME_FORMAT,
  dateTime: DEFAULT_DATE_TIME_DISPLAY_FORMAT,
  localDate: DEFAULT_DATE_FORMAT,
  localTime: DEFAULT_TIME_FORMAT,
  localDateTime: DEFAULT_DATE_TIME_DISPLAY_FORMAT,
  offsetDateTime: OFFSET_DATE_TIME_DISPLAY_FORMAT,
  offsetTime: OFFSET_TIME_DISPLAY_FORMAT
};

export function getDataTransferFormat(type: PropertyType): string | undefined {
  return getCubaAppConfig()?.dataTransferFormats?.[type] || defaultDataTransferFormats[type];
}

export function applyDataTransferFormat(value: Moment, type: PropertyType): string {
  return value.format(getDataTransferFormat(type));
}

export function getDisplayFormat(type: PropertyType): string | undefined {
  return getCubaAppConfig()?.displayFormats?.[type] || defaultDisplayFormats[type];
}

export function applyDisplayFormat(value: Moment, type: PropertyType): string {
  return value.format(getDisplayFormat(type));
}
