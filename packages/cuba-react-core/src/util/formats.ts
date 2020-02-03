import {TemporalPropertyType} from '@cuba-platform/rest';

export const defaultDateFormat = 'YYYY-MM-DD';
export const defaultTimeFormat = 'HH:mm:ss';

export const defaultDateTimeDataTransferFormat = 'YYYY-MM-DD HH:mm:ss.SSS';
export const defaultDateTimeDisplayFormat = 'YYYY-MM-DD HH:mm:ss';
export const offsetDateTimeDataTransferFormat = 'YYYY-MM-DD HH:mm:ss.SSS ZZ';
export const offsetDateTimeDisplayFormat = 'YYYY-MM-DD HH:mm:ss';

export const offsetTimeDataTransferFormat = 'HH:mm:ss ZZ';
export const offsetTimeDisplayFormat = 'HH:mm:ss';

export const dataTransferFormats: Record<TemporalPropertyType, string> = {
  date: defaultDateFormat,
  time: defaultTimeFormat,
  dateTime: defaultDateTimeDataTransferFormat,
  localDate: defaultDateFormat,
  localTime: defaultTimeFormat,
  localDateTime: defaultDateTimeDataTransferFormat,
  offsetDateTime: offsetDateTimeDataTransferFormat,
  offsetTime: offsetTimeDataTransferFormat
};

export const displayFormats: Record<TemporalPropertyType, string> = {
  date: defaultDateFormat,
  time: defaultTimeFormat,
  dateTime: defaultDateTimeDisplayFormat,
  localDate: defaultDateFormat,
  localTime: defaultTimeFormat,
  localDateTime: defaultDateTimeDisplayFormat,
  offsetDateTime: offsetDateTimeDisplayFormat,
  offsetTime: offsetTimeDisplayFormat
};

export function getDataTransferFormat(type: TemporalPropertyType): string {
  return dataTransferFormats[type];
}

export function getDisplayFormat(type: TemporalPropertyType): string {
  return displayFormats[type];
}
