import {determineLastNextXInterval, determinePredefinedInterval} from './DataTableIntervalFunctions';
import moment from 'moment-timezone';

describe('Should return correct interval', () => {
  const originalNow = Date.now;

  beforeAll(() => {
    Date.now = () => 1568994300000; // 20.09.2019 15:45:00
    moment.tz.setDefault('UTC');
  });

  afterAll(() => {
    Date.now = originalNow;
    moment.tz.setDefault();
  });

  // DAYS

  it('for last 5 days excluding current', () => {
    const interval = determineLastNextXInterval('last', 5, 'days', false);
    expect(interval.minDate).toEqual('2019-09-15 00:00:00.000');
    expect(interval.maxDate).toEqual('2019-09-19 23:59:59.000');
  });

  it('for last 5 days including current', () => {
    const interval = determineLastNextXInterval('last', 5, 'days', true);
    expect(interval.minDate).toEqual('2019-09-16 00:00:00.000');
    expect(interval.maxDate).toEqual('2019-09-20 23:59:59.000');
  });

  it('for last 0 days including current', () => {
    const interval = determineLastNextXInterval('last', 0, 'days', true);
    expect(interval.minDate).toEqual('2019-09-21 00:00:00.000');
    expect(interval.maxDate).toEqual('2019-09-20 23:59:59.000');
  });

  it('for next 5 days excluding current', () => {
    const interval = determineLastNextXInterval('next', 5, 'days', false);
    expect(interval.minDate).toEqual('2019-09-21 00:00:00.000');
    expect(interval.maxDate).toEqual('2019-09-25 23:59:59.000');
  });

  it('for next 5 days including current', () => {
    const interval = determineLastNextXInterval('next', 5, 'days', true);
    expect(interval.minDate).toEqual('2019-09-20 00:00:00.000');
    expect(interval.maxDate).toEqual('2019-09-24 23:59:59.000');
  });

  // HOURS

  it('for last 5 hours excluding current', () => {
    const interval = determineLastNextXInterval('last', 5, 'hours', false);
    expect(interval.minDate).toEqual('2019-09-20 10:00:00.000');
    expect(interval.maxDate).toEqual('2019-09-20 14:59:59.000');
  });

  it('for last 5 hours including current', () => {
    const interval = determineLastNextXInterval('last', 5, 'hours', true);
    expect(interval.minDate).toEqual('2019-09-20 11:00:00.000');
    expect(interval.maxDate).toEqual('2019-09-20 15:59:59.000');
  });

  it('for last 0 hours including current', () => {
    const interval = determineLastNextXInterval('last', 0, 'hours', true);
    expect(interval.minDate).toEqual('2019-09-20 16:00:00.000');
    expect(interval.maxDate).toEqual('2019-09-20 15:59:59.000');
  });

  it('for next 5 hours excluding current', () => {
    const interval = determineLastNextXInterval('next', 5, 'hours', false);
    expect(interval.minDate).toEqual('2019-09-20 16:00:00.000');
    expect(interval.maxDate).toEqual('2019-09-20 20:59:59.000');
  });

  it('for next 5 hours including current', () => {
    const interval = determineLastNextXInterval('next', 5, 'hours', true);
    expect(interval.minDate).toEqual('2019-09-20 15:00:00.000');
    expect(interval.maxDate).toEqual('2019-09-20 19:59:59.000');
  });

  // MINUTES

  it('for last 5 minutes excluding current', () => {
    const interval = determineLastNextXInterval('last', 5, 'minutes', false);
    expect(interval.minDate).toEqual('2019-09-20 15:40:00.000');
    expect(interval.maxDate).toEqual('2019-09-20 15:44:59.000');
  });

  it('for last 5 minutes including current', () => {
    const interval = determineLastNextXInterval('last', 5, 'minutes', true);
    expect(interval.minDate).toEqual('2019-09-20 15:41:00.000');
    expect(interval.maxDate).toEqual('2019-09-20 15:45:59.000');
  });

  it('for last 0 minutes including current', () => {
    const interval = determineLastNextXInterval('last', 0, 'minutes', true);
    expect(interval.minDate).toEqual('2019-09-20 15:46:00.000');
    expect(interval.maxDate).toEqual('2019-09-20 15:45:59.000');
  });

  it('for next 5 minutes excluding current', () => {
    const interval = determineLastNextXInterval('next', 5, 'minutes', false);
    expect(interval.minDate).toEqual('2019-09-20 15:46:00.000');
    expect(interval.maxDate).toEqual('2019-09-20 15:50:59.000');
  });

  it('for next 5 minutes including current', () => {
    const interval = determineLastNextXInterval('next', 5, 'minutes', true);
    expect(interval.minDate).toEqual('2019-09-20 15:45:00.000');
    expect(interval.maxDate).toEqual('2019-09-20 15:49:59.000');
  });

  // MONTHS

  it('for last 1 months excluding current', () => {
    const interval = determineLastNextXInterval('last', 1, 'months', false);
    expect(interval.minDate).toEqual('2019-08-01 00:00:00.000');
    expect(interval.maxDate).toEqual('2019-08-31 23:59:59.000');
  });

  it('for last 3 months excluding current', () => {
    const interval = determineLastNextXInterval('last', 3, 'months', false);
    expect(interval.minDate).toEqual('2019-06-01 00:00:00.000');
    expect(interval.maxDate).toEqual('2019-08-31 23:59:59.000');
  });

  it('for last 1 months including current', () => {
    const interval = determineLastNextXInterval('last', 1, 'months', true);
    expect(interval.minDate).toEqual('2019-09-01 00:00:00.000');
    expect(interval.maxDate).toEqual('2019-09-30 23:59:59.000');
  });

  it('for last 0 months including current', () => {
    const interval = determineLastNextXInterval('last', 0, 'months', true);
    expect(interval.minDate).toEqual('2019-10-01 00:00:00.000');
    expect(interval.maxDate).toEqual('2019-09-30 23:59:59.000');
  });

  it('for next 1 months excluding current', () => {
    const interval = determineLastNextXInterval('next', 1, 'months', false);
    expect(interval.minDate).toEqual('2019-10-01 00:00:00.000');
    expect(interval.maxDate).toEqual('2019-10-31 23:59:59.000');
  });

  it('for next 1 months including current', () => {
    const interval = determineLastNextXInterval('next', 1, 'months', true);
    expect(interval.minDate).toEqual('2019-09-01 00:00:00.000');
    expect(interval.maxDate).toEqual('2019-09-30 23:59:59.000');
  });

  // PREDEFINED

  it('for predefined option "today"', () => {
    const interval = determinePredefinedInterval('today');
    expect(interval.minDate).toEqual('2019-09-20 00:00:00.000');
    expect(interval.maxDate).toEqual('2019-09-20 23:59:59.000');
  });

  it('for predefined option "yesterday"', () => {
    const interval = determinePredefinedInterval('yesterday');
    expect(interval.minDate).toEqual('2019-09-19 00:00:00.000');
    expect(interval.maxDate).toEqual('2019-09-19 23:59:59.000');
  });

  it('for predefined option "tomorrow"', () => {
    const interval = determinePredefinedInterval('tomorrow');
    expect(interval.minDate).toEqual('2019-09-21 00:00:00.000');
    expect(interval.maxDate).toEqual('2019-09-21 23:59:59.000');
  });

  it('for predefined option "last month"', () => {
    const interval = determinePredefinedInterval('lastMonth');
    expect(interval.minDate).toEqual('2019-08-01 00:00:00.000');
    expect(interval.maxDate).toEqual('2019-08-31 23:59:59.000');
  });

  it('for predefined option "this month"', () => {
    const interval = determinePredefinedInterval('thisMonth');
    expect(interval.minDate).toEqual('2019-09-01 00:00:00.000');
    expect(interval.maxDate).toEqual('2019-09-30 23:59:59.000');
  });

  it('for predefined option "next month"', () => {
    const interval = determinePredefinedInterval('nextMonth');
    expect(interval.minDate).toEqual('2019-10-01 00:00:00.000');
    expect(interval.maxDate).toEqual('2019-10-31 23:59:59.000');
  });

});
