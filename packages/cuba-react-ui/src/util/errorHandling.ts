import { WrappedFormUtils } from '@ant-design/compatible/es/form/Form';

/**
 * Clears errors in antd form fields
 *
 * @param form
 */
export function clearFieldErrors<V>(form: WrappedFormUtils<V>): void {
  const currentValues: {[field: string]: any} = form.getFieldsValue();
  const fields: Record<string, any> = {};
  Object.keys(currentValues).forEach((fieldName: string) => {
    const value: any = currentValues[fieldName];
    fields[fieldName] = { value };
  });
  form.setFields(fields);
}

export type ServerValidationErrors = {
  globalErrors: string[],
  fieldErrors: Map<string, string[]>,
};

/**
 * Extracts validation errors info from server response
 *
 * @param response
 */
export function extractServerValidationErrors(response: any): ServerValidationErrors {
  const fieldErrors: Map<string, string[]> = new Map<string, string[]>();
  const globalErrors: string[] = [];

  if (response instanceof Array) {
    response.forEach((error: any) => {
      if (error.message) {
        const fieldName: string = error.path;

        if (fieldName && fieldName.length > 0) {
          if (fieldErrors.has(fieldName)) {
            fieldErrors.get(fieldName)!.push(error.message);
          } else {
            fieldErrors.set(fieldName, [error.message]);
          }
        } else {
          globalErrors.push(error.message);
        }
      }
    });
  }

  return { globalErrors, fieldErrors };
}

/**
 * Constructs antd form fields object containing given errors
 *
 * @param fieldErrors
 * @param form
 */
export function constructFieldsWithErrors<V>(
  fieldErrors: Map<string, string[]>,
  form: WrappedFormUtils<V>
): Record<string, { value: any, errors: Error[] }> {
  const fields: Record<string, any> = {};

  fieldErrors.forEach((errorMessages: string[], fieldName: string) => {
    const combinedErrorMessages: string =
      errorMessages.reduce((accumulator: string, current: string) => `${accumulator}, ${current}`);

    fields[fieldName] = {
      value: form.getFieldValue(fieldName),
      errors: [new Error(combinedErrorMessages)]
    }
  });

  return fields;
}
