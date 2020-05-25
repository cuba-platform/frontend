import {appGenerationOptions, CommonGenerationOptions, OptionsConfig} from "../../common/cli-options";
import {BaseGenerator} from "../../common/base-generator";
import {AppTemplateModel} from "../react-typescript/app";
import {StudioTemplateProperty} from "../../common/studio/studio-model";
import {AppAnswers, appGeneratorParams} from "../react-typescript/app/params";
import {ProjectModel} from "../../common/model/cuba-model";
import {ownVersion} from "../../cli";

export abstract class BaseTsAppGenerator<O extends CommonGenerationOptions> extends BaseGenerator<AppAnswers, AppTemplateModel, O> {

  conflicter!: { force: boolean }; // missing in typings
  modelPath?: string;

  constructor(args: string | string[], options: CommonGenerationOptions) {
    super(args, options);
    this.modelPath = this.options.model;
  }

  protected async _obtainAnswers() {
    if (!this.options.answers) {
      this.log(`Please provide rest client id and secret.\
        \nThis properties required for proper connection to rest service https://doc.cuba-platform.com/restapi-7.1/#rest_api_v2_ex_get_token.\
        \nThis options (rest.client.id, rest.client.secret) could be found in web-app.properties of CUBA web module.\
        \nIf no such properties exist in file (Studio version < 14), just skip questions and leave default answers (client/secret).`);
    }
    await super._obtainAnswers();
  }

  _getAvailableOptions(): OptionsConfig {
    return appGenerationOptions;
  }

  _getParams(): StudioTemplateProperty[] {
    return appGeneratorParams;
  }

}

export function createModel(cubaProjectModel: ProjectModel | undefined, answers: AppAnswers | undefined): AppTemplateModel {

  if (!answers) {
    throw new Error('Answers are not provided');
  }
  if (!cubaProjectModel) {
    throw new Error('Model is not provided');
  }

  const {restClientId, restClientSecret} = answers;
  const {project} = cubaProjectModel;

  return {
    ownVersion,
    title: project.name,
    project,
    basePath: project.modulePrefix + '-front',
    restClientId: restClientId ? restClientId : 'client',
    restClientSecret: restClientSecret ? normalizeSecret(restClientSecret) : 'secret'
  };
}

export function normalizeSecret(restClientSecret: string): string {
  return restClientSecret.replace(/{.*}/, '');
}
