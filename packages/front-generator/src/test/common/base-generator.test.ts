import {BaseGenerator, refineAnswers} from "../../common/base-generator";
import {CommonGenerationOptions, commonGenerationOptionsConfig, OptionsConfig} from "../../common/cli-options";
import {
  ERR_STUDIO_NOT_CONNECTED,
  getOpenedCubaProjects,
  StudioProjectInfo
} from "../../common/studio/studio-integration";
import {expect} from "chai";
import {StudioTemplateProperty, StudioTemplatePropertyType} from "../../common/studio/studio-model";
import {Entity, ProjectModel} from "../../common/model/cuba-model";
import * as Generator from "yeoman-generator";
import YeomanEnvironment = require("yeoman-environment");

interface Answers {
  projectInfo: StudioProjectInfo;
}

const generatorParams: StudioTemplateProperty[] = [
  {
    caption: "Entity",
    code: "entity",
    propertyType: StudioTemplatePropertyType.ENTITY,
    required: true
  },
  {
    caption: "Component class name",
    code: "componentName",
    propertyType: StudioTemplatePropertyType.POLYMER_COMPONENT_NAME,
    defaultValue: "Cards",
    required: true
  },
  {
    caption: "Entity view",
    code: "entityView",
    propertyType: StudioTemplatePropertyType.VIEW,
    relatedProperty: "entity",
    required: true
  }
];


const model = require.resolve('../fixtures/mpg-projectModel.json');
const answers = require('../fixtures/answers.json');

const optsConfig: OptionsConfig = {
  ...commonGenerationOptionsConfig,
  answers: {
    alias: 'a',
    description: 'fulfilled params for generator to avoid interactive input in serialized JSON string',
    type: String
  }
};


class TestGenerator extends BaseGenerator<Answers, {}, CommonGenerationOptions> {

  constructor(args: string | string[], options: CommonGenerationOptions) {
    super(args, options);
  }

  async _promptOrParse() {
    return await super._promptOrParse();
  }

  _getAvailableOptions(): OptionsConfig {
    return optsConfig;
  }

  _getParams(): StudioTemplateProperty[] {
    return generatorParams;
  }

  async _obtainAnswers() {
    await super._obtainAnswers();
  }

  async _obtainCubaProjectModel(): Promise<void> {
    return super._obtainCubaProjectModel();
  }

  prompt(questions: Generator.Questions): Promise<Answers> {
    // mock prompt answers
    return Promise.resolve({projectInfo: 'projectInfo'} as any);
  }

  writing() {
  }
}

const opts = {
  dest: '.',
  env: new YeomanEnvironment,
  resolved: '.',
  model,
};

describe('BaseGenerator', () => {
  it('should prompt or parse', async () => {

    const gen = new TestGenerator([], {
      ...opts,
      answers: Buffer.from(JSON.stringify(answers)).toString('base64')
    });

    expect(gen.answers).is.undefined;
    await gen._promptOrParse();
    expect(gen.answers).not.empty;
  });

  it('should obtain answers', async () => {
    const gen = new TestGenerator([], opts);
    expect(gen.answers).is.undefined;
    await gen._obtainAnswers();
    expect(gen.answers!.projectInfo).eq('projectInfo');
  });

  it('should fail on obtain project model if no cuba connection', async () => {

    const openedProjects = await getOpenedCubaProjects();
    if (openedProjects !== null) {
      return;
    }

    const gen = new TestGenerator([], {...opts, model: undefined});
    try {
      await gen._obtainCubaProjectModel()
    } catch (e) {
      expect(e.message).eq(ERR_STUDIO_NOT_CONNECTED);
    }
  });

  it('should refine answers', () => {

    const projectModel: ProjectModel = {
      entities: [],
      enums: [],
      project: {locales: [], modulePrefix: "", name: "", namespace: ""},
      restQueries: [],
      restServices: [],
      views: []
    };

    let refined = refineAnswers(projectModel, [], {intAnswer: 1.1});
    expect(refined).eql({intAnswer: 1.1});

    const generatorParams: StudioTemplateProperty[] = [
      {
        caption: "Answer type integer",
        code: "intAnswer",
        propertyType: StudioTemplatePropertyType.INTEGER,
        required: true
      },
    ];
    refined = refineAnswers(projectModel, generatorParams, {intAnswer: 1});
    expect(refined).eql({intAnswer: 1});

    refined = refineAnswers(projectModel, generatorParams, {intAnswer: 0});
    expect(refined).eql({intAnswer: 0});

    expect(() => refineAnswers(projectModel, generatorParams, {intAnswer: 1.1}))
      .to.throw(`Question with code 'intAnswer' has INTEGER type and can't contain '1.1' as answer`);

    expect(() => refineAnswers(projectModel, generatorParams, {intAnswer: 'not-an-int'}))
      .to.throw(`Question with code 'intAnswer' has INTEGER type and can't contain 'not-an-int' as answer`);

    expect(() => refineAnswers(projectModel, generatorParams, {intAnswer: undefined}))
      .to.throw(`Question with code 'intAnswer' has INTEGER type and can't contain 'undefined' as answer`);
  });
});