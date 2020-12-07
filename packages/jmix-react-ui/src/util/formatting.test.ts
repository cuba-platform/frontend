import {toDisplayValue} from './formatting';
import {
  MetaPropertyInfo,
  PropertyType
} from '@haulmont/jmix-rest';
import moment from 'moment-timezone';

const mockPropertyInfo: MetaPropertyInfo = {
  attributeType: 'DATATYPE',
  cardinality: 'NONE',
  description: '',
  isTransient: false,
  mandatory: false,
  name: '',
  readOnly: false,
  type: ''
};

function createMockPropertyInfo(type: PropertyType): MetaPropertyInfo {
  return {...mockPropertyInfo, type}
}

function expectMsStripped(type: PropertyType): void {
  expectFormat(type, '2020-02-02 02:02:02.222', '2020-02-02 02:02:02')
}

function expectFormat(type: PropertyType, input: string | number | boolean, output: string | number | boolean = input): void {
  const formatted = toDisplayValue(input, createMockPropertyInfo(type));
  expect(formatted).toEqual(output);
}

describe('toDisplayValue()', () => {
  beforeAll(() => {
    moment.tz.setDefault('Africa/Harare'); // +02:00
  });

  afterAll(() => {
    moment.tz.setDefault();
  });

  it('changes format of DateTime', () => {
    expectMsStripped('dateTime');
  });

  it('changes format of LocalDateTime', () => {
    expectMsStripped('localDateTime');
  });

  it('changes format of OffsetDateTime', () => {
    expectFormat('offsetDateTime', '2020-02-02 02:02:02.222 +0200', '2020-02-02 02:02:02')
  });

  it('changes format of OffsetTime', () => {
    expectFormat('offsetTime', '01:02:03 +0200', '01:02:03');
  });

  it('does not change format of OffsetTime', () => {
    expectFormat('time', '01:02:03');
  });

  it('does not change format of Date', () => {
    expectFormat('date', '2020-01-02');
  });

  it('does not change format of Time', () => {
    expectFormat('time', '01:02:03');
  });

  it('does not change format of LocalDate', () => {
    expectFormat('localDate', '2020-01-02');
  });

  it('does not change format of LocalTime', () => {
    expectFormat('localTime', '01:02:03');
  });

  it('does not change format of Date', () => {
    expectFormat('date', '2020-01-02');
  });

  it('does not change format of non-temporal fields', () => {
    expectFormat('int', 42);
    expectFormat('double', 4.2);
    expectFormat('string', 'Lorem ipsum');
    expectFormat('uuid', '00000000-0000-0000-0000-000000000000');
    expectFormat('byteArray', 'Ynl0ZUFycmF5');
    expectFormat('boolean', true);
  });
});
