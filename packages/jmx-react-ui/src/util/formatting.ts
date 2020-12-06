import {MetaPropertyInfo, TemporalPropertyType} from '@cuba-platform/rest';
import {getDataTransferFormat, getDisplayFormat, isTemporalProperty} from '@cuba-platform/react-core';
import moment from 'moment';

export function toDisplayValue(value: any, propertyInfo: MetaPropertyInfo) {
  if (value != null && isTemporalProperty(propertyInfo)) {
    // Display format for temporal properties may be different from data transfer format
    const parsed = moment(value, getDataTransferFormat(propertyInfo.type as TemporalPropertyType));
    return parsed.format(getDisplayFormat(propertyInfo.type as TemporalPropertyType));
  } else {
    return value;
  }
}
