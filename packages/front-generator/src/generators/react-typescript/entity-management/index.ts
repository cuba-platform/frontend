import {
  entityManagementGeneratorParams, EntityManagementListType,
} from "./params";
// noinspection ES6PreferShortImport
import {
  ComponentOptions, componentOptionsConfig,
  OptionsConfig,
} from "../../../common/cli-options";
import * as path from "path";
// noinspection ES6PreferShortImport
import {StudioTemplateProperty} from "../../../common/studio/studio-model";
import {
  writeReactTSEntityManagement,
  EntityManagementAnswers,
  EntityManagementTemplateModel,
  additionalPrompts
} from "./shared";
import * as entityManagementEn from './entity-management-en.json';
import * as entityManagementFr from './entity-management-fr.json';
import * as entityManagementRu from './entity-management-ru.json';
import * as entityManagementZhCn from './entity-management-zh-cn.json';
// noinspection ES6PreferShortImport
import { BaseGenerator } from "../../../common/base-generator";
// noinspection ES6PreferShortImport
import { throwError } from "../../../common/utils";

type Answers = EntityManagementAnswers<EntityManagementListType>;
type TemplateModel = EntityManagementTemplateModel<EntityManagementListType>

export class ReactEntityManagementGenerator extends BaseGenerator<Answers, TemplateModel, ComponentOptions> {

  constructor(args: string | string[], options: ComponentOptions) {
    super(args, options);
    this.sourceRoot(path.join(__dirname, 'template'));
  }

  // noinspection JSUnusedGlobalSymbols
  async prompting() {
    await this._obtainAnswers(); // Calls this._additionalPrompts
  }

  async _additionalPrompts(answers: EntityManagementAnswers<EntityManagementListType>): Promise<EntityManagementAnswers<EntityManagementListType>> {
    if (this.cubaProjectModel == null) {
      throwError(this, 'Additional prompt failed: cannot find project model');
    }

    return additionalPrompts(this, answers, this.cubaProjectModel);
  }

  // noinspection JSUnusedGlobalSymbols
  writing() {
    writeReactTSEntityManagement<EntityManagementListType, Answers, ComponentOptions>(
      this,
      {
        en: entityManagementEn,
        fr: entityManagementFr,
        ru: entityManagementRu,
        'zh-cn': entityManagementZhCn,
      },
      this.cubaProjectModel
    );
  }

  end() {
    this.log(`Entity list have been successfully generated into ${this.destinationRoot()}`);
  }

  _getParams(): StudioTemplateProperty[] {
    return entityManagementGeneratorParams;
  }

  _getAvailableOptions(): OptionsConfig {
    return componentOptionsConfig;
  }
}

const description = 'CRUD (list + editor) screens for specified entity';

export {
  ReactEntityManagementGenerator as generator,
  componentOptionsConfig as options,
  entityManagementGeneratorParams as params,
  description
};
