import {CommonGenerationOptions} from "../../../common/cli-options";
import {YeomanGenerator} from "../../YeomanGenerator";

// TODO Similar to other stages, we need a default implementation of the `write` stage
// (i.e. the one that just writes the template and applies interpolations, without any special logic).
export const defaultWrite = <O extends CommonGenerationOptions, M>(
  templateModel: M, gen: YeomanGenerator, options?: O
) => {
  throw Error('not implemented yet');
};