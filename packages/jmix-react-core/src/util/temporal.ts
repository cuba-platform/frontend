import { Moment } from "moment";

/**
 *
 * @param momentInstance
 *
 * @returns a clone of provided Moment instance with milliseconds set to zero,
 * or `undefined` if a nullish value was provided.
 */
export function stripMilliseconds<
  P extends Moment | null | undefined,
  R = P extends Moment ? Moment : undefined
>(momentInstance: P): R {
  return momentInstance?.clone().milliseconds(0) as unknown as R;
}