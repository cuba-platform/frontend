import {ProjectInfo} from "../../../common/model/cuba-model";
import {appGenerationOptions, CommonGenerationOptions} from "../../../common/cli-options";
import * as path from "path";
import {SdkAllGenerator} from "../../sdk/sdk-generator";
import {SUPPORTED_CLIENT_LOCALES} from '../common/i18n';
import {appGeneratorParams} from "./params";
import {BaseTsAppGenerator, createModel} from "../../common/BaseTsAppGenerator";

export interface AppTemplateModel {
  title: string;
  basePath: string;
  project: ProjectInfo;
  ownVersion: string;
  restClientId: string;
  restClientSecret: string;
}

class ReactTSAppGenerator extends BaseTsAppGenerator<CommonGenerationOptions> {

  constructor(args: string | string[], options: CommonGenerationOptions) {
    super(args, options);
    this.sourceRoot(path.join(__dirname, 'template'));
  }

  async prompting() {
    await this._obtainModelAndAnswers();
  }

  // noinspection JSUnusedGlobalSymbols - yeoman runs all methods from class
  writing() {
    this.log(`Generating to ${this.destinationPath()}`);
    this.model = createModel(this.cubaProjectModel, this.answers);

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

}


export const generator = ReactTSAppGenerator;
export const options = appGenerationOptions;
export const params = appGeneratorParams;
