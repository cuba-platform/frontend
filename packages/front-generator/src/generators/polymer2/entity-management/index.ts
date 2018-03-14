import {BaseGenerator, NonInteractiveGenerator} from "../../../common/generation";
import {StudioTemplateProperty} from "../../../common/cuba-studio";
import {entityManagementGeneratorParams} from "./params";
import {commonGenerationOptionsConfig, OptionsConfig} from "../../../common/cli-options";

class Polymer2EntityManagementGenerator extends BaseGenerator implements NonInteractiveGenerator {


  _getOptions(): OptionsConfig {
    return commonGenerationOptionsConfig;
  }

  _getParams(): StudioTemplateProperty[] {
    return entityManagementGeneratorParams;
  }

}

export {
  Polymer2EntityManagementGenerator as generator,
  commonGenerationOptionsConfig as options,
  entityManagementGeneratorParams as params
};