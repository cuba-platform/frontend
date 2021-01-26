import {OptionsConfig} from "../../../common/cli-options";
import {YeomanGenerator} from "../../YeomanGenerator";

export const defaultGetOptions = <O extends unknown>(optionsConfig: OptionsConfig, gen: YeomanGenerator): O => {
  // We are telling Yeoman to expect the options contained in optionsConfig
  Object.keys(optionsConfig).forEach(optionName => {
    gen.option(optionName, optionsConfig[optionName]);
  });

  // Now we can gen the values of these options from Yeoman
  return gen.options as O;
};