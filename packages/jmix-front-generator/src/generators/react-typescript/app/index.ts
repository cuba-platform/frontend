// noinspection ES6PreferShortImport
import {BaseGenerator} from "../../../common/base-generator";
// noinspection ES6PreferShortImport
import {CommonGenerationOptions, commonGenerationOptionsConfig} from "../../../common/cli-options";
import * as path from "path";
import {promptForProjectModel, ReactTSAppAnswers, ReactTSAppTemplateModel, prepareProjectModel, generateSdk, writeReactTSApp} from "./shared";

class ReactTSAppGenerator extends BaseGenerator<ReactTSAppAnswers, ReactTSAppTemplateModel, CommonGenerationOptions> {

  conflicter!: { force: boolean }; // missing in typings

  constructor(args: string | string[], commonOptions: CommonGenerationOptions) {
    super(args, commonOptions);
    this.sourceRoot(path.join(__dirname, 'template'));
  }

  // noinspection JSUnusedGlobalSymbols - yeoman runs all methods from class
  async prompting() {
    const {cubaProjectModel, force, answers} = await promptForProjectModel(this, this.modelFilePath);
    this.cubaProjectModel = cubaProjectModel ?? this.cubaProjectModel;
    this.answers = answers ?? this.answers;
    this.conflicter.force = force ?? this.conflicter.force;
  }

  // noinspection JSUnusedGlobalSymbols - yeoman runs all methods from class
  async prepareModel() {
    const {model, modelFilePath, cubaProjectModel} = await prepareProjectModel(this, this.cubaProjectModel);
    this.model = model ?? this.model;
    this.modelFilePath = modelFilePath ?? this.modelFilePath;
    this.cubaProjectModel = cubaProjectModel ?? this.cubaProjectModel;
  }

  // noinspection JSUnusedGlobalSymbols - yeoman runs all methods from class
  writing() {
    writeReactTSApp(this);
  }

  // noinspection JSUnusedGlobalSymbols - yeoman runs all methods from class
  async generateSdk() {
    await generateSdk(this, require.resolve('../../sdk/sdk-generator'), this.modelFilePath);
  }

  end() {
    this.log(`React client has been successfully generated into ${this.destinationRoot()}`);
  }
}

export const generator = ReactTSAppGenerator;
export const options = commonGenerationOptionsConfig;
export const params = [];
