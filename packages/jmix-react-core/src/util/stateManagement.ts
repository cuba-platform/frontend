import { IReactionPublic, IReactionOptions, reaction } from "mobx";
import { useEffect } from "react";

/**
 * A simple convenience hook that creates a reaction with provided `expression`, `effect` and `options`.
 * Reaction will be created only once (will not be disposed/recreated between renders).
 * Reaction will be automatically disposed when the component is unmounted.
 * If this reaction creates other reactions, those reactions will NOT be disposed.
 * In that case create a reaction manually inside a `useEffect` hook as described in
 * {@link https://mobx-react.js.org/recipes-effects | mobx-react documentation }.
 *
 * @param expression
 * @param effect
 * @param options
 */
export const useReaction = <T extends unknown>(
  expression: (reactionObject: IReactionPublic) => T,
  effect: (expressionResult: T, reactionObject: IReactionPublic) => void,
  options?: IReactionOptions
) => {
  useEffect(
    () => {
      return reaction(expression, effect, options);
    },
    // https://mobx-react.js.org/recipes-effects recommends passing an empty dependencies array,
    // which ensures that the reaction is created only once, but that will result in an eslint warning.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
};
