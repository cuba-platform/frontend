import { FormInstance } from 'antd/es/form';
import { NamePath } from 'antd/es/form/interface';

type FieldData = {
  name: NamePath,
  [key: string]: any
};

/**
 * Clears errors in antd form fields
 *
 * @param formInstance
 */
export function clearFieldErrors(formInstance: FormInstance): void {
  const currentValues: {[field: string]: any} = formInstance.getFieldsValue();
  const fields: FieldData[] = [];
  Object.keys(currentValues).forEach((name: string) => {
    const value: any = currentValues[name];
    fields.push({
      value,
      name,
      errors: []
    });
  });
  formInstance.setFields(fields);
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
 * @param formInstance
 */
export function constructFieldsWithErrors(
  fieldErrors: Map<string, string[]>,
  formInstance: FormInstance
): FieldData[] {
  const fields: FieldData[] = [];

  fieldErrors.forEach((errorMessages: string[], fieldName: string) => {
    fields.push({
      name: fieldName,
      value: formInstance.getFieldValue(fieldName),
      errors: errorMessages
    });
  });

  return fields;
}
