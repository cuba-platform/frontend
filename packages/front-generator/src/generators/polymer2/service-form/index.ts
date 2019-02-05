import {BaseGenerator} from "../../../common/generation";
import {PolymerElementOptions, polymerElementOptionsConfig} from "../../../common/cli-options";
import {ServiceFormAnswers, serviceFormParams} from "./params";
import {ServiceFormTemplateModel} from "./template-model";
import * as path from "path";
import {StudioTemplateProperty} from "../../../common/cuba-studio";
import {elementNameToClass} from "../../../common/utils";
import {RestParam} from "../../../common/model/cuba-model";
import {getRestParamFieldModel} from "../common/fields/rest-params";
import {getFieldHtml} from "../common/fields";

class ServiceFormGenerator extends BaseGenerator<ServiceFormAnswers, ServiceFormTemplateModel, PolymerElementOptions> {
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
      this.templatePath('service-form.html'),
      this.destinationPath(this.model.componentName + '.html'), this.model
    );
  }

  end() {
    this.log(`Service form has been successfully generated into ${this.destinationRoot()}`);
  }

  _getParams(): StudioTemplateProperty[] {
    return serviceFormParams;
  }

  _getAvailableOptions() {
    return polymerElementOptionsConfig;
  }
}

export function composeParamFields(params: RestParam[]): string[] {
  if (!params) {
    return [];
  }
  return params
    .map(p => getRestParamFieldModel(p, "serviceParams."))
    .map(m => getFieldHtml(m));
}

function answersToModel(answers: ServiceFormAnswers, dirShift: string | undefined): ServiceFormTemplateModel {
  const fields = composeParamFields(answers.serviceMethod.method.params);
  return {
    fields,
    componentName: answers.componentName,
    className: elementNameToClass(answers.componentName),
    relDirShift: dirShift || '',
    method: answers.serviceMethod.method,
    service: answers.serviceMethod.service
  };
}

export {
  ServiceFormGenerator as generator,
  polymerElementOptionsConfig as options,
  serviceFormParams as params
};