import {EntityEditAnswers, entityEditParams} from "../../polymer2/entity-edit/params";
import {PolymerElementOptions, polymerElementOptionsConfig} from "../../../common/cli-options";
import * as path from "path";
import {BaseGenerator} from "../../../common/generation";
import {EntityEditTemplateModel} from "../../polymer2/entity-edit/template-model";
import {StudioTemplateProperty} from "../../../common/studio/studio-model";
import {entityEditAnswersToModel} from "../../polymer2/entity-edit";
import {TSPolymerElementModel} from "../common";

type TemplateModel = EntityEditTemplateModel & TSPolymerElementModel;


class EntityEditTSGenerator extends BaseGenerator<EntityEditAnswers, TemplateModel, PolymerElementOptions> {

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
      ...entityEditAnswersToModel(this.answers, this.options.dirShift),
      projectNamespace: this.cubaProjectModel!.project.namespace
    };
    this.fs.copyTpl(
      this.templatePath('entity-edit.html'),
      this.destinationPath(this.model.componentName + '.html'), this.model
    );
    this.fs.copyTpl(
      this.templatePath('entity-edit.ts'),
      this.destinationPath(this.model.componentName + '.ts'), this.model
    );
  }

  end() {
    this.log(`Entity edit has been successfully generated into ${this.destinationRoot()}`);
  }

  _getParams(): StudioTemplateProperty[] {
    return entityEditParams
  }

  _getAvailableOptions() {
    return polymerElementOptionsConfig;
  }
}

export {
  EntityEditTSGenerator as generator,
  entityEditParams as params,
  polymerElementOptionsConfig as options,
}