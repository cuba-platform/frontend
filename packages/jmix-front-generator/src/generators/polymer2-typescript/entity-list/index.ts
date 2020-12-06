import {OptionsConfig, PolymerElementOptions, polymerElementOptionsConfig} from "../../../common/cli-options";
import {EntityListAnswers, entityListParams} from "../../polymer2/entity-list/params";
import {EntityListTemplateModel} from "../../polymer2/entity-list/template-model";
import * as path from "path";
import {BaseGenerator} from "../../../common/base-generator";
import {StudioTemplateProperty} from "../../../common/studio/studio-model";
import {entityListAnswersToModel} from "../../polymer2/entity-list";
import {TSPolymerElementModel} from "../common";

type TemplateModel = EntityListTemplateModel & TSPolymerElementModel;

class EntityListTSGenerator extends BaseGenerator<EntityListAnswers, TemplateModel, PolymerElementOptions> {

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
    this.model = {
      ...entityListAnswersToModel(this.answers, this.options.dirShift),
      projectNamespace: this.cubaProjectModel!.project.namespace
    };
    this.fs.copyTpl(
      this.templatePath('entity-list.html'),
      this.destinationPath(this.model.componentName + '.html'), this.model
    );
    this.fs.copyTpl(
      this.templatePath('entity-list.ts'),
      this.destinationPath(this.model.componentName + '.ts'), this.model
    );
  }

  end() {
    this.log(`Entity list have been successfully generated into ${this.destinationRoot()}`);
  }

  _getParams(): StudioTemplateProperty[] {
    return entityListParams;
  }

  _getAvailableOptions(): OptionsConfig {
    return polymerElementOptionsConfig;
  }
}

export {
  EntityListTSGenerator as generator,
  entityListParams as params,
  polymerElementOptionsConfig as options
}