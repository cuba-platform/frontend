import {EntityCardsAnswers, entityCardsParams, listIdPositionQuestion, listShowIdQuestions} from "./params";
import {
  ComponentOptions, componentOptionsConfig,
  OptionsConfig,
} from "../../../common/cli-options";
import {StudioTemplateProperty} from "../../../common/studio/studio-model";
import * as path from "path";
import {EntityCardsTemplateModel} from "./template-model";
import {elementNameToClass, normalizeRelativePath, unCapitalizeFirst} from "../../../common/utils";
import {addToMenu} from "../common/menu";
import {writeComponentI18nMessages} from '../common/i18n';
import {createEntityTemplateModel, getDisplayedAttributes, ScreenType} from "../common/entity";
import {EntityTemplateModel} from "../common/template-model";
import {ProjectModel} from "../../../common/model/cuba-model";
import {BaseEntityScreenGenerator, stringIdAnswersToModel} from '../common/base-entity-screen-generator';


class EntityCardsGenerator extends BaseEntityScreenGenerator<EntityCardsAnswers, EntityCardsTemplateModel, ComponentOptions> {

  constructor(args: string | string[], options: ComponentOptions) {
    super(args, options);
    this.sourceRoot(path.join(__dirname, 'template'));
  }

  // noinspection JSUnusedGlobalSymbols
  async prompting() {
    this.conflicter.force = true;
    await this._obtainAnswers();
  }

  // noinspection JSUnusedGlobalSymbols
  writing() {
    this.log(`Generating to ${this.destinationPath()}`);
    if (!this.answers) {
      throw new Error('Answers not provided');
    }
    if (!this.cubaProjectModel) {
      throw new Error('CUBA project model is not provided');
    }
    const entity: EntityTemplateModel = createEntityTemplateModel(this.answers.entity, this.cubaProjectModel);
    this.model = entityCardsAnswersToModel(this.answers, this.options.dirShift, entity, this.cubaProjectModel);
    this.fs.copyTpl(
      this.templatePath('EntityCards.tsx.ejs'),
      this.destinationPath(this.model.className + '.tsx.ejs'), this.model
    );

    writeComponentI18nMessages(
      this.fs, this.model.className, this.options.dirShift, this.cubaProjectModel?.project?.locales
    );

    if (!addToMenu(this.fs, {
      componentFileName: this.model.className,
      componentClassName: this.model.className,
      caption: this.model.className,
      dirShift: this.options.dirShift,
      destRoot: this.destinationRoot(),
      menuLink: '/' + this.model.nameLiteral,
      pathPattern: '/' + this.model.nameLiteral
    })) {
      this.log('Unable to add component to menu: route registry not found');
    }
  }

  end() {
    this.log(`Entity cards have been successfully generated into ${this.destinationRoot()}`);
  }

  _getParams(): StudioTemplateProperty[] {
    return entityCardsParams;
  }

  _getAvailableOptions(): OptionsConfig {
    return componentOptionsConfig;
  }

  async _additionalPrompts(answers: EntityCardsAnswers): Promise<EntityCardsAnswers> {
    const entity = await this._getEntityFromAnswers(answers);
    const stringIdAnswers = await this._stringIdPrompts(answers, entity);
    return {...answers, ...stringIdAnswers};
  }

  protected _getListShowIdQuestions(): StudioTemplateProperty[] {
    return listShowIdQuestions;
  }

  protected _getListIdPositionQuestion(): StudioTemplateProperty {
    return listIdPositionQuestion;
  }
}

export function entityCardsAnswersToModel(
  answers: EntityCardsAnswers, dirShift: string | undefined, entity: EntityTemplateModel, projectModel: ProjectModel
): EntityCardsTemplateModel {
  const className = elementNameToClass(answers.componentName);

  const { stringIdName, listAttributes: attributes } = stringIdAnswersToModel(
    answers,
    projectModel,
    entity,
    getDisplayedAttributes(answers.entityView.allProperties, entity, projectModel, ScreenType.BROWSER)
  );

  return {
    componentName: answers.componentName,
    className,
    nameLiteral: unCapitalizeFirst(className),
    relDirShift: normalizeRelativePath(dirShift),
    entity: answers.entity,
    view: answers.entityView,
    attributes,
    stringIdName
  }
}

const description = 'Read-only list of entities displayed as cards';

export {
  EntityCardsGenerator as generator,
  componentOptionsConfig as options,
  entityCardsParams as params,
  description
}
