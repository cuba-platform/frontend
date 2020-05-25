import {ProjectInfo} from "../../../common/model/cuba-model";
import {BaseGenerator} from "../../../common/base-generator";
import {appGenerationOptions, CommonGenerationOptions, OptionsConfig} from "../../../common/cli-options";
import * as path from "path";
import {ownVersion} from "../../../cli";
import {SdkAllGenerator} from "../../sdk/sdk-generator";
import {SUPPORTED_CLIENT_LOCALES} from '../common/i18n';
import {StudioTemplateProperty} from "../../../common/studio/studio-model";
import {AppAnswers, appGeneratorParams} from "./params";

export interface AppTemplateModel {
  title: string;
  basePath: string;
  project: ProjectInfo;
  ownVersion: string;
  restClientId: string;
  restClientSecret: string;
}

class ReactTSAppGenerator extends BaseGenerator<AppAnswers, AppTemplateModel, CommonGenerationOptions> {

  conflicter!: { force: boolean }; // missing in typings
  modelPath?: string;

  constructor(args: string | string[], commonOptions: CommonGenerationOptions) {
    super(args, commonOptions);
    this.sourceRoot(path.join(__dirname, 'template'));
    this.modelPath = this.options.model;
  }

  async prompting() {
    await this._obtainModelAndAnswers();
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

  // noinspection JSUnusedGlobalSymbols - yeoman runs all methods from class
  writing() {
    this.log(`Generating to ${this.destinationPath()}`);

    if (!this.answers) {
      throw new Error('Answers are not provided');
    }
    if (!this.cubaProjectModel) {
      throw new Error('Model is not provided');
    }

    const {restClientId, restClientSecret} = this.answers;
    this.model = createModel(this.cubaProjectModel.project, restClientId, restClientSecret);

    let clientLocales: string[];
    const modelHasLocalesInfo = (this.model.project.locales != null);
    if (!modelHasLocalesInfo) {
      // Could be if using an old Studio version that doesn't export locales.
      this.log('Project model does not contain project locales info. I18n messages will be added for all supported locales.');
      clientLocales = SUPPORTED_CLIENT_LOCALES;
    } else {
      const projectLocales = this.model.project.locales.map(locale => locale.code);
      clientLocales = projectLocales.filter(locale => SUPPORTED_CLIENT_LOCALES.includes(locale));
      if (clientLocales.length === 0) {
        this.log('WARNING. None of the project locales are supported by Frontend Generator.'
          + ` Project locales: ${JSON.stringify(projectLocales)}. Supported locales: ${JSON.stringify(SUPPORTED_CLIENT_LOCALES)}.`);
      }
    }
    clientLocales.forEach(locale => {
      this.fs.copy(
        this.templatePath() + `/i18n-message-packs/${locale}.json`,
        this.destinationPath(`src/i18n/${locale}.json`)
      );
    });

    this.fs.copyTpl(this.templatePath() + '/public/**', this.destinationPath('public'), this.model);
    this.fs.copyTpl(this.templatePath() + '/src/**', this.destinationPath('src'), {
      ...this.model,
      isLocaleUsed: (locale: string) => {
        // If project model doesn't contain locales info (could be if old Studio is used)
        // then we add all supported locales.
        return !modelHasLocalesInfo || clientLocales.includes(locale);
      },
      clientLocales
    });
    this.fs.copyTpl(this.templatePath() + '/*.*', this.destinationPath(), this.model);
    this.fs.copyTpl(this.templatePath('.env.production.local'), this.destinationPath('.env.production.local'), this.model);
    this.fs.copyTpl(this.templatePath('.env.development.local'), this.destinationPath('.env.development.local'), this.model);
    this.fs.copy(this.templatePath('_gitignore'), this.destinationPath('.gitignore'));
    this.fs.copy(this.templatePath('_editorconfig'), this.destinationPath('.editorconfig'));
  }

  // noinspection JSUnusedGlobalSymbols - yeoman runs all methods from class
  async generateSdk() {
    const sdkDest = 'src/cuba';
    this.log(`Generate SDK model and services to ${sdkDest}`);

    const sdkOpts = {
      model: this.modelPath,
      dest: sdkDest
    };

    const generatorOpts = {
      Generator: SdkAllGenerator,
      path: require.resolve('../../sdk/sdk-generator')
    };

    // todo type not match
    await this.composeWith(generatorOpts as any, sdkOpts);
  }

  end() {
    this.log(`CUBA React client has been successfully generated into ${this.destinationRoot()}`);
  }

  _getAvailableOptions(): OptionsConfig {
    return appGenerationOptions;
  }

  _getParams(): StudioTemplateProperty[] {
    return appGeneratorParams;
  }
}

// todo move to AppBase generator
export function createModel(project: ProjectInfo, restClientId: string, restClientSecret: string): AppTemplateModel {
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

export const generator = ReactTSAppGenerator;
export const options = appGenerationOptions;
export const params = appGeneratorParams;
