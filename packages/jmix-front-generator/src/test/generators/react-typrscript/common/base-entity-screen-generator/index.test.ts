import { expect } from "chai";
import {stringIdAnswersToModel, getEntityFromAnswers, stringIdPrompts} from '../../../../../generators/react-typescript/common/base-entity-screen-generator';
import {MappingType, Entity} from '../../../../../common/model/cuba-model';
import {StudioTemplateProperty, StudioTemplatePropertyType} from '../../../../../common/studio/studio-model';
import {ComponentOptions} from '../../../../../common/cli-options';
import { expectRejectedPromise } from "../../../../common/test-utils";
import sinon = require("sinon");
import {BaseGenerator} from '../../../../../common/base-generator';

const projectModel = require('../../../../fixtures/project-model--scr.json');
const projectModelNoIdAttr = require('../../../../fixtures/project-model--scr-no-id-attr.json');
const stringIdAnswers = require('../../../../fixtures/answers/string-id-management-table.json');
const stringIdAnswersExplicitIdName = require('../../../../fixtures/answers/string-id-management-table-explicit-id-name.json');
const stringIdAnswersNoIdName = require('../../../../fixtures/answers/string-id-management-table-no-id-name.json');
const stringIdAnswersUnexistentIdName = require('../../../../fixtures/answers/string-id-management-table-unexistent-id-name.json');
const intIdAnswers = require('../../../../fixtures/answers/int-id-management-table.json');

const listAttrsStringId = [
  {
    "name": "description",
    "type": {
      "packageName": "java.lang",
      "className": "String",
      "fqn": "java.lang.String",
      "label": "String"
    },
    "mappingType": "DATATYPE" as MappingType,
    "readOnly": false,
    "column": "DESCRIPTION",
    "mandatory": false,
    "unique": false,
    "length": 255,
    "transient": false
  }
];

const editAttrsStringId = [
  {
    "name": "description",
    "type": {
      "packageName": "java.lang",
      "className": "String",
      "fqn": "java.lang.String",
      "label": "String"
    },
    "mappingType": "DATATYPE" as MappingType,
    "readOnly": false,
    "column": "DESCRIPTION",
    "mandatory": false,
    "unique": false,
    "length": 255,
    "transient": false
  },
  {
    "name": "productCode",
    "type": {
      "packageName": "java.lang",
      "className": "String",
      "fqn": "java.lang.String",
      "label": "String"
    },
    "mappingType": "DATATYPE" as MappingType,
    "readOnly": false,
    "column": "PRODUCT_CODE",
    "mandatory": false,
    "unique": false,
    "length": 10,
    "transient": false
  },
];

const listAttrsIntId = listAttrsStringId.slice();
const editAttrsIntId = listAttrsIntId.slice();

const editAttrsImpostorId = [
  {
    "name": "id",
    "type": {
      "packageName": "java.lang",
      "className": "String",
      "fqn": "java.lang.String",
      "label": "String"
    },
    "mappingType": "DATATYPE" as MappingType,
    "readOnly": false,
    "column": "DESCRIPTION",
    "mandatory": false,
    "unique": false,
    "length": 255,
    "transient": false
  },
  {
    "name": "description",
    "type": {
      "packageName": "java.lang",
      "className": "String",
      "fqn": "java.lang.String",
      "label": "String"
    },
    "mappingType": "DATATYPE" as MappingType,
    "readOnly": false,
    "column": "DESCRIPTION",
    "mandatory": false,
    "unique": false,
    "length": 255,
    "transient": false
  }
];

const listIdPositionQuestion: StudioTemplateProperty = {
  code: 'listIdAttrPos',
  caption: 'Position of the ID attribute in the List component ' +
      '(e.g. enter 1 for the ID to appear as the first row/column).',
  propertyType: StudioTemplatePropertyType.INTEGER,
  required: true
};

const listShowIdQuestions: StudioTemplateProperty[] = [
  {
    code: 'listShowIdAttr',
    caption: 'Show ID attribute in the List component?',
    propertyType: StudioTemplatePropertyType.BOOLEAN,
    required: true
  }
];

const editIdPositionQuestion: StudioTemplateProperty = {
  code: 'editIdAttrPos',
  caption: 'Position of the ID attribute in the Edit component ' +
    '(e.g. enter 1 for the ID to appear as the first field of the form).',
  propertyType: StudioTemplatePropertyType.INTEGER,
  required: true
};

class TestEntityScreenGenerator extends BaseGenerator<any, any, any> {
  constructor(args: string | string[], options: ComponentOptions) {
    super(args, options);
  }

  entity: any;

  writing(): void {}
}

describe('BaseEntityScreenGenerator', () => {
  let gen: TestEntityScreenGenerator;

  beforeEach(() => {
    gen = new TestEntityScreenGenerator([], {});
  });

  it('getEntityFromAnswers() - no entity name', async () => {
    return expectRejectedPromise(
      async () => getEntityFromAnswers({entity: {}} as any, projectModel),
      'Additional prompt failed: cannot find entity name'
    );
  });

  it('getEntityFromAnswers() - unexisting entity name', async () => {
    return expectRejectedPromise(
      async () => getEntityFromAnswers({entity: {name: 'Unexisting entity name'}} as any, projectModel),
      'Additional prompt failed: cannot find entity'
    );
  });

  it('getEntityFromAnswers() - entity found', async () => {
    const entity = await getEntityFromAnswers({entity: {name: 'scr$Car'}} as any, projectModel);
    expect(entity.name).to.equal('scr$Car');
    expect(entity.fqn).to.equal('com.company.scr.entity.Car');
  });

  it('stringIdPrompts() - not a String ID entity', async () => {
    const entity = projectModel.entities.find((e: any) => e.name === 'scr_IntegerIdTestEntity');
    sinon.stub(gen, 'prompt').callsFake(createPromptFake());
    const answers = await stringIdPrompts(gen, entity, projectModel, listShowIdQuestions, listIdPositionQuestion);
    expect(answers).to.deep.equal({});
  });

  it('stringIdPrompts() - String ID entity, no ID attribute name in project model (older Studio)', async () => {
    const entity = projectModelNoIdAttr.entities.find((e: any) => e.name === 'scr_StringIdTestEntity');
    sinon.stub(gen, 'prompt').callsFake(createPromptFake());
    const answers = await stringIdPrompts(gen, entity,projectModel, listShowIdQuestions, listIdPositionQuestion);
    expect(answers.idAttrName).to.equal('test_identifier');
  });

  it('stringIdPrompts() - String ID entity with ID attribute name in project model', async () => {
    const entity = projectModel.entities.find((e: any) => e.name === 'scr_StringIdTestEntity');
    sinon.stub(gen, 'prompt').callsFake(createPromptFake());
    const answers = await stringIdPrompts(gen, entity,projectModel, listShowIdQuestions, listIdPositionQuestion);
    // tslint:disable-next-line:no-unused-expression
    expect(answers.idAttrName).to.be.undefined;
  });

  it('stringIdPrompts() - String ID entity, questions about showing ID', async () => {
    const entity = projectModel.entities.find((e: any) => e.name === 'scr_StringIdTestEntity');
    sinon.stub(gen, 'prompt').callsFake(createPromptFake());
    const answers = await stringIdPrompts(gen, entity, projectModel, listShowIdQuestions, listIdPositionQuestion);
    expect(answers.listShowIdAttr).to.equal(true);
    expect(answers.listIdAttrPos).to.equal(42);
    // tslint:disable-next-line:no-unused-expression
    expect(answers.editIdAttrPos).to.be.undefined;

    // @ts-ignore unwrap the spy
    gen.prompt.restore();
    sinon.stub(gen, 'prompt').callsFake(createPromptFake({
      listShowIdAttr: false
    }));
    const answers2 = await stringIdPrompts(gen, entity,projectModel, listShowIdQuestions, listIdPositionQuestion);
    expect(answers2.listShowIdAttr).to.equal(false);
    expect(answers2.listIdAttrPos).to.equal(undefined);
    // tslint:disable-next-line:no-unused-expression
    expect(answers.editIdAttrPos).to.be.undefined;
  });

  it('_stringIdPrompts() - String ID entity, with Edit component', async () => {
    const entity = projectModel.entities.find((e: any) => e.name === 'scr_StringIdTestEntity');
    sinon.stub(gen, 'prompt').callsFake(createPromptFake());
    const answers = await stringIdPrompts(gen, entity,projectModel, listShowIdQuestions, listIdPositionQuestion, editIdPositionQuestion);
    expect(answers.editIdAttrPos).to.equal(42);
  });
});

describe('stringIdAnswersToModel()', () => {
  it('should return correct result for a String ID entity', () => {
    const entity = projectModel.entities.find((e: any) => e.name === 'scr_StringIdTestEntity');

    const { stringIdName, listAttributes, editAttributes } = stringIdAnswersToModel(
      stringIdAnswers,
      projectModel,
      entity,
      listAttrsStringId,
      editAttrsStringId
    );

    expect(stringIdName).to.equal('identifier');
    expect(listAttributes[1].name).to.equal('identifier');
    expect(editAttributes[1].name).to.equal('identifier');
  });

  it('should return correct result for a String ID entity ' +
    'when ID attribute name is not in project model', () => {

    const entity = projectModel.entities.find((e: any) => e.name === 'scr_StringIdTestEntity');

    const { stringIdName, listAttributes, editAttributes } = stringIdAnswersToModel(
      stringIdAnswersExplicitIdName,
      projectModel,
      entity,
      listAttrsStringId,
      editAttrsStringId
    );

    expect(stringIdName).to.equal('identifier');
    expect(listAttributes[1].name).to.equal('identifier');
    expect(editAttributes[1].name).to.equal('identifier');
  });

  it('should return correct result for an entity that is not a String ID entity', () => {
    const entity = projectModel.entities.find((e: any) => e.name === 'scr_IntegerIdTestEntity');

    const { stringIdName, listAttributes, editAttributes } = stringIdAnswersToModel(
      intIdAnswers,
      projectModel,
      entity,
      listAttrsIntId,
      editAttrsIntId
    );

    // tslint:disable-next-line:no-unused-expression
    expect(stringIdName).to.be.undefined;
    expect(listAttributes.length).to.equal(1);
    expect(listAttributes[0].name).to.equal('description');
    expect(editAttributes.length).to.equal(1);
    expect(editAttributes[0].name).to.equal('description');
  });

  it('should throw if String ID name is neither in the project model nor in the answers', () => {
    const entity = projectModel.entities.find((e: any) => e.name === 'scr_StringIdTestEntity');

    expect(() => stringIdAnswersToModel(
      stringIdAnswersNoIdName,
      projectModel,
      entity,
      listAttrsStringId,
      editAttrsStringId
    )).to.throw('Could not find the stringIdName');
  });

  it('should throw if ID attribute does not exist', () => {
    const entity = projectModel.entities.find((e: any) => e.name === 'scr_StringIdTestEntity');

    expect(() => stringIdAnswersToModel(
      stringIdAnswersUnexistentIdName,
      projectModel,
      entity,
      listAttrsStringId,
      editAttrsStringId
    )).to.throw('Unable to find ID attribute. Expected the ID attribute to be named "dientifire".');
  });

  it('should return correct result for a String ID entity that has a non-ID attribute named `id`', () => {
    const entity = projectModel.entities.find((e: any) => e.name === 'scr_StringIdTestEntity');

    const { editAttributes } = stringIdAnswersToModel(
      stringIdAnswers,
      projectModel,
      entity,
      listAttrsStringId,
      editAttrsImpostorId
    );

    expect(editAttributes.length).to.equal(2);
    expect(editAttributes[1].name).to.equal('identifier');
  });
});

function createPromptFake(result: any = {}) {
  return (questions: any) => {
    const answers: any = {};
    questions.forEach((question: any) => {
      switch (question.name) {
        case 'idAttrName':
          answers.idAttrName = result.idAttrName ?? 'test_identifier';
          break;
        case 'listShowIdAttr':
          answers.listShowIdAttr = result.listShowIdAttr ?? true;
          break;
        case 'listIdAttrPos':
          answers.listIdAttrPos = result.listIdAttrPos ?? 42;
          break;
        case 'editIdAttrPos':
          answers.editIdAttrPos = result.editIdAttrPos ?? 42;
          break;
      }
    });
    return Promise.resolve(answers)
  };
}

