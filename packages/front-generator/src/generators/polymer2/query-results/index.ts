import {BaseGenerator, NonInteractiveGenerator} from "../../../common/generation";
import {queryResultParams} from "./params";
import {StudioTemplateProperty} from "../../../common/cuba-studio";
import {commonGenerationOptionsConfig, OptionsConfig} from "../../../common/cli-options";

class QueryResultsGenerator extends BaseGenerator implements NonInteractiveGenerator {


  _getOptions(): OptionsConfig {
    return commonGenerationOptionsConfig;
  }

  _getParams(): StudioTemplateProperty[] {
    return queryResultParams;
  }
}

export {
  QueryResultsGenerator as generator,
  commonGenerationOptionsConfig as options,
  queryResultParams as params
};