import {extractServerValidationErrors, ServerValidationErrors} from './util/errorHandling';

describe('extractServerValidationErrors', () => {
  it('extracts validation errors from server response', () => {
    const response = [
      {
        message: 'error A on field1',
        path: 'field1'
      },
      {
        message: 'error B on field2',
        path: 'field2'
      },
      {
        message: 'error C on field2',
        path: 'field2'
      },
      {
        message: 'global error A'
      },
      {
        message: 'global error B'
      },
    ];

    const errors: ServerValidationErrors = extractServerValidationErrors(response);

    expect(errors.globalErrors).toEqual(['global error A', 'global error B']);
    expect(errors.fieldErrors.get('field1')).toEqual(['error A on field1']);
    expect(errors.fieldErrors.get('field2')).toEqual(['error B on field2', 'error C on field2']);
  });
});
