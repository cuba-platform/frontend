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
