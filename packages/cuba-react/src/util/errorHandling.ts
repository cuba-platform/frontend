import {WrappedFormUtils} from 'antd/es/form/Form';

/**
 * To be used in (supposedly) unreachable code after exhaustive check of `argument`.
 *
 * @remarks
 * Will cause a compile-time error if `argument` was not exhaustively checked.
 * Will cause a runtime error if reached.
 *
 * @param argumentName
 * @param argument
 */
export function assertNever(argumentName: string, argument: never): never {
  throw new Error(`Unexpected ${argumentName}: ${argument}`);
}

/**
 * Clears antd form from previous server validation errors
 *
 * @param form
 */
export function clearErrorsFromPreviousSubmission<V>(form: WrappedFormUtils<V>): void {
  const currentValues: {[field: string]: any} = form.getFieldsValue();
  const fields: Record<string, any> = {};
  Object.keys(currentValues).forEach((fieldName: string) => {
    const value: any = currentValues[fieldName];
    fields[fieldName] = { value };
  });
  form.setFields(fields);
}

/**
 * Checks whether server response contains bean validation constraint violations info
 *
 * @param response
 */
export function checkConstraintViolations(response: any): Map<string, string[]> {
  const constraintViolations: Map<string, string[]> = new Map<string, string[]>();

  if (response instanceof Array) {
    response.forEach((item: any) => {
      if (item.message && item.path) {
        const fieldName: string = item.path;

        if (constraintViolations.has(fieldName)) {
          constraintViolations.get(fieldName)!.push(item.message);
        } else {
          constraintViolations.set(fieldName, [item.message]);
        }
      }
    });
  }

  return constraintViolations;
}

/**
 * Sets antd form errors based on bean validation constraint violations info
 *
 * @param constraintViolations
 * @param form
 */
export function constraintViolationsToFormFields<V>(
  constraintViolations: Map<string, string[]>,
  form: WrappedFormUtils<V>
): Record<string, { value: any, errors: Error[] }> {
  const fields: Record<string, any> = {};

  constraintViolations.forEach((errorMessages: string[], fieldName: string) => {
    const combinedErrorMessages: string =
      errorMessages.reduce((accumulator: string, current: string) => `${accumulator}, ${current}`);

    fields[fieldName] = {
      value: form.getFieldValue(fieldName),
      errors: [new Error(combinedErrorMessages)]
    }
  });

  return fields;
}
