import {BaseGenerator} from "../../common/base-generator";
import {CommonGenerationOptions, commonGenerationOptionsConfig, OptionsConfig} from "../../common/cli-options";
import {StudioProjectInfo} from "../../common/studio/studio-integration";
import {expect} from "chai";
import {StudioTemplateProperty, StudioTemplatePropertyType} from "../../common/studio/studio-model";
import {Entity} from "../../common/model/cuba-model";
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


const model= require.resolve('../fixtures/mpg-projectModel.json');
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

  writing() {}
}

describe('BaseGenerator', function () {
  it('should prompt or parse', async function () {
    const opts = {
      dest: '.',
      env: new YeomanEnvironment,
      resolved: '.',
      model,
      answers: Buffer.from(JSON.stringify(answers)).toString('base64')
    };

    const gen = new TestGenerator([], opts);

    expect(gen.answers).is.undefined;
    await gen._promptOrParse();
    expect(gen.answers).not.empty;
  });
});