import {SdkAllGenerator} from '../../sdk/sdk-generator';
import {appGenerationOptions, CommonGenerationOptions} from '../../../common/cli-options';
import * as path from "path";
import {appGeneratorParams} from "../../react-typescript/app/params";
import {BaseTsAppGenerator, createModel} from "../../common/BaseTsAppGenerator";

class ReactNativeAppGenerator extends BaseTsAppGenerator<CommonGenerationOptions> {

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

}

export const generator = ReactNativeAppGenerator;
export const options = appGenerationOptions;
export const params = appGeneratorParams;
