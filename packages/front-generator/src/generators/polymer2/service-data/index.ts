import {StudioTemplateProperty} from "../../../common/studio/studio-model";
import {BaseGenerator} from "../../../common/generation";
import {ServiceDataAnswers, serviceDataParams} from "./params";
import {PolymerElementOptions, polymerElementOptionsConfig} from "../../../common/cli-options";
import {ServiceDataTemplateModel} from "./template-model";
import * as path from "path";
import {elementNameToClass} from "../../../common/utils";
import {composeParamFields} from "../service-form";
import {RestService} from "../../../common/model/cuba-model";

class ServiceDataGenerator extends BaseGenerator<ServiceDataAnswers, ServiceDataTemplateModel, PolymerElementOptions> {

  constructor(args: string | string[], options: PolymerElementOptions) {
    super(args, options);
    this.sourceRoot(path.join(__dirname, 'template'));
  }

  // noinspection JSUnusedGlobalSymbols
  async prompting() {
    await this._promptOrParse();
  }

  // noinspection JSUnusedGlobalSymbols
  writing() {
    this.log(`Generating to ${this.destinationPath()}`);
    if (!this.answers) {
      throw new Error('Answers not provided');
    }
    this.model = answersToModel(this.answers, this.options.dirShift);
    this.fs.copyTpl(
      this.templatePath('service-data.html'),
      this.destinationPath(this.model.componentName + '.html'), this.model
    );
  }

  end() {
    this.log(`Service data has been successfully generated into ${this.destinationRoot()}`);
  }

  _getParams(): StudioTemplateProperty[] {
    return serviceDataParams;
  }

  _getAvailableOptions() {
    return polymerElementOptionsConfig;
  }
}

function answersToModel(answers: ServiceDataAnswers, dirShift: string | undefined): ServiceDataTemplateModel {
  return {
    fields: composeParamFields(answers.serviceMethod.method.params),
    componentName: answers.componentName,
    className: elementNameToClass(answers.componentName),
    relDirShift: dirShift || '',
    method: answers.serviceMethod.method,
    service: answers.serviceMethod.service
  };
}

export  {
  ServiceDataGenerator as generator,
  serviceDataParams as params,
  polymerElementOptionsConfig as options,
}