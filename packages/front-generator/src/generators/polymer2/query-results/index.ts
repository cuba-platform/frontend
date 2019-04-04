import {BaseGenerator} from "../../../common/generation";
import {QueryResultAnswers, queryResultParams} from "./params";
import {StudioTemplateProperty} from "../../../common/studio/studio-model";
import {PolymerElementOptions, polymerElementOptionsConfig} from "../../../common/cli-options";
import {QueryResultsTemplateModel} from "./template-model";
import * as path from "path";
import {elementNameToClass} from "../../../common/utils";
import {RestParam} from "../../../common/model/cuba-model";
import {getRestParamFieldModel} from "../common/fields/rest-params";
import {getFieldHtml} from "../common/fields";

class QueryResultsGenerator extends BaseGenerator<QueryResultAnswers, QueryResultsTemplateModel, PolymerElementOptions> {

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
      this.templatePath('query-result-list.html'),
      this.destinationPath(this.model.componentName + '.html'), this.model
    );
  }

  end() {
    this.log(`Query results has been successfully generated into ${this.destinationRoot()}`);
  }

  _getParams(): StudioTemplateProperty[] {
    return queryResultParams;
  }

  _getAvailableOptions() {
    return polymerElementOptionsConfig;
  }
}

function composeParamFields(params: RestParam[]): string[] {
  if (!params) {
    return [];
  }
  return params
    .map(p => getRestParamFieldModel(p, "serviceParams."))
    .map(m => getFieldHtml(m));
}

function answersToModel(answers: QueryResultAnswers, dirShift: string | undefined): QueryResultsTemplateModel {
  const fields = composeParamFields(answers.query.params);
  return {
    fields,
    componentName: answers.componentName,
    className: elementNameToClass(answers.componentName),
    relDirShift: dirShift || '',
    query: answers.query
  };
}

export {
  QueryResultsGenerator as generator,
  polymerElementOptionsConfig as options,
  queryResultParams as params
};