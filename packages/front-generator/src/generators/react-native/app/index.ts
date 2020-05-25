import {BaseGenerator} from '../../../common/base-generator';
import {SdkAllGenerator} from '../../sdk/sdk-generator';
import {appGenerationOptions, CommonGenerationOptions, OptionsConfig} from '../../../common/cli-options';
import * as path from "path";
import {AppAnswers, appGeneratorParams} from "../../react-typescript/app/params";
import {AppTemplateModel, createModel} from "../../react-typescript/app";
import {StudioTemplateProperty} from "../../../common/studio/studio-model";

class ReactNativeAppGenerator extends BaseGenerator<AppAnswers, AppTemplateModel, CommonGenerationOptions> {

  modelPath?: string;

  constructor(args: string | string[], options: CommonGenerationOptions) {
    super(args, options);
    this.sourceRoot(path.join(__dirname, 'template'));
    this.modelPath = this.options.model;
  }

  async prompting() {
    await this._obtainModelAndAnswers();
  }

  protected async _obtainAnswers() {
    // todo code duplication with react-ts generator
    if (!this.options.answers) {
      this.log(`Please provide rest client id and secret.\
        \nThis properties required for proper connection to rest service https://doc.cuba-platform.com/restapi-7.1/#rest_api_v2_ex_get_token.\
        \nThis options (rest.client.id, rest.client.secret) could be found in web-app.properties of CUBA web module.\
        \nIf no such properties exist in file (Studio version < 14), just skip questions and leave default answers (client/secret).`);
    }
    await super._obtainAnswers();
  }

  // noinspection JSUnusedGlobalSymbols - yeoman runs all methods from class
  writing() {
    // todo code duplication with react-ts generator
    this.log(`Generating to ${this.destinationPath()}`);

    if (!this.answers) {
      throw new Error('Answers are not provided');
    }
    if (!this.cubaProjectModel) {
      throw new Error('Model is not provided');
    }

    const {restClientId, restClientSecret} = this.answers;
    this.model = createModel(this.cubaProjectModel.project, restClientId, restClientSecret);

    this.fs.copyTpl(
      this.templatePath() + '/**',
      this.destinationPath(),
      this.model,
      undefined,
      { globOptions: { dot: true } } // copy all files including hidden (will not copy hidden directories)
    );

    const sdkDest = 'cuba';
    this.log(`Generating SDK model and services in ${sdkDest}`);

    const sdkOpts = {
      model: this.modelPath,
      dest: sdkDest
    };

    const generatorOpts = {
      Generator: SdkAllGenerator,
      path: require.resolve('../../sdk/sdk-generator')
    };

    this.composeWith(generatorOpts as any, sdkOpts);
  }

  end() {
    this.log(`CUBA React Native client has been successfully generated into ${this.destinationRoot()}`);
  }

  // todo code duplication with react-ts generator
  _getAvailableOptions(): OptionsConfig {
    return appGenerationOptions;
  }

  // todo code duplication with react-ts generator
  _getParams(): StudioTemplateProperty[] {
    return appGeneratorParams;
  }
}

export const generator = ReactNativeAppGenerator;
export const options = appGenerationOptions;
export const params = appGeneratorParams;
