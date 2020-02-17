import moment, {Moment} from 'moment';
import {TemporalInterval, DataTableIntervalEditorMode, PredefinedIntervalOption, TimeUnit} from './DataTableIntervalEditor';
import {PropertyType} from '@cuba-platform/rest';
import {getDataTransferFormat} from '@cuba-platform/react-core';

/**
 * Creates a {@link TemporalInterval} based on input in form of "last|next number of time units including|excluding current".
 * For example, "last 5 days including current day".
 *
 * @param mode 'last' or 'next', will throw an error if a different value is encountered
 * @param numberOfUnits
 * @param timeUnit see {@link TimeUnit}
 * @param includeCurrent
 * @param propertyType
 */
export function determineLastNextXInterval(
  mode: DataTableIntervalEditorMode,
  numberOfUnits: number,
  timeUnit: TimeUnit,
  includeCurrent: boolean,
  propertyType: PropertyType
): TemporalInterval {
  let minDate: Moment;
  let maxDate: Moment;

  if (mode === 'last') {
    maxDate = moment()
      .subtract((includeCurrent ? 0 : 1), timeUnit)
      .endOf(timeUnit);
    minDate = moment()
      .subtract(numberOfUnits - (includeCurrent ? 1 : 0), timeUnit)
      .startOf(timeUnit);
  } else if (mode === 'next') {
    minDate = moment()
      .add((includeCurrent ? 0 : 1), timeUnit)
      .startOf(timeUnit);
    maxDate = moment()
      .add(numberOfUnits + (includeCurrent ? -1 : 0), timeUnit)
      .endOf(timeUnit);
  } else {
    throw new Error(`Expected 'last' or 'next' mode, encountered '${mode}' mode`);
  }

  return {
    minDate: formatDate(minDate, propertyType),
    maxDate: formatDate(maxDate, propertyType)
  };
}

/**
 * Creates a {@link TemporalInterval} that corresponds to a given {@link PredefinedIntervalOption}
 *
 * @param option see {@link PredefinedIntervalOption}
 * @param propertyType
 */
export function determinePredefinedInterval(option: PredefinedIntervalOption, propertyType: PropertyType): TemporalInterval {
  let minDate: Moment;
  let maxDate: Moment;

  switch (option) {
    case 'today':
      minDate = moment().startOf('day');
      maxDate = moment().endOf('day');
      break;
    case 'yesterday':
      minDate = moment().subtract(1, 'days').startOf('day');
      maxDate = moment().subtract(1, 'days').endOf('day');
      break;
    case 'tomorrow':
      minDate = moment().add(1, 'days').startOf('day');
      maxDate = moment().add(1, 'days').endOf('day');
      break;
    case 'lastMonth':
      minDate = moment().subtract(1, 'months').startOf('month');
      maxDate = moment().subtract(1, 'months').endOf('month');
      break;
    case 'thisMonth':
      minDate = moment().startOf('month');
      maxDate = moment().endOf('month');
      break;
    case 'nextMonth':
      minDate = moment().add(1, 'months').startOf('month');
      maxDate = moment().add(1, 'months').endOf('month');
      break;
    default:
      throw new Error('Unexpected PredefinedIntervalOption' + option);
  }

  return {
    minDate: formatDate(minDate, propertyType),
    maxDate: formatDate(maxDate, propertyType)
  };
}

export function formatDate(date: Moment, propertyType: PropertyType): string {
  return date.format(getDataTransferFormat(propertyType));
}
