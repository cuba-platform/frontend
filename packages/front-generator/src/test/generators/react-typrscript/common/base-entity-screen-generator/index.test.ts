import { expect } from "chai";
import {stringIdAnswersToModel, BaseEntityScreenGenerator} from '../../../../../generators/react-typescript/common/base-entity-screen-generator';
import {MappingType, Entity} from '../../../../../common/model/cuba-model';
import {StudioTemplateProperty, StudioTemplatePropertyType} from '../../../../../common/studio/studio-model';
import {ComponentOptions} from '../../../../../common/cli-options';
import { expectRejectedPromise } from "../../../../common/test-utils";
import sinon = require("sinon");

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

class TestEntityScreenGenerator extends BaseEntityScreenGenerator<any, any, any> {
  constructor(args: string | string[], options: ComponentOptions) {
    super(args, options);
  }

  entity: any;

  protected _getListIdPositionQuestion(): StudioTemplateProperty {
    return   {
      code: 'listIdAttrPos',
      caption: 'Position of the ID attribute in the List component ' +
        '(e.g. enter 1 for the ID to appear as the first row/column).',
      propertyType: StudioTemplatePropertyType.INTEGER,
      required: true
    };
  }

  protected _getListShowIdQuestions(): StudioTemplateProperty[] {
    return [
      {
        code: 'listShowIdAttr',
        caption: 'Show ID attribute in the List component?',
        propertyType: StudioTemplatePropertyType.BOOLEAN,
        required: true
      }
    ]
  }

  writing(): void {}

  __setModel(model: any) {
    this.cubaProjectModel = model;
  }

  async _getEntityFromAnswers(answers: any): Promise<any> {
    return super._getEntityFromAnswers(answers);
  }

  async _stringIdPrompts(answers: any, entity: Entity): Promise<Partial<any>> {
    return super._stringIdPrompts(answers, entity);
  }
}

class TestEntityScreenGeneratorWithEdit extends TestEntityScreenGenerator {
  constructor(args: string | string[], options: ComponentOptions) {
    super(args, options);
  }

  protected _getEditIdPositionQuestion() {
    return {
      code: 'editIdAttrPos',
      caption: 'Position of the ID attribute in the Edit component ' +
        '(e.g. enter 1 for the ID to appear as the first field of the form).',
      propertyType: StudioTemplatePropertyType.INTEGER,
      required: true
    };
  }
}

describe('BaseEntityScreenGenerator', () => {
  let gen: TestEntityScreenGenerator;

  beforeEach(() => {
    gen = new TestEntityScreenGenerator([], {});
  });

  it('_getEntityFromAnswers() - no project model', async () => {
    return expectRejectedPromise(
      async () => gen._getEntityFromAnswers({}),
      'Additional prompt failed: cannot find project model'
    );
  });

  it('_getEntityFromAnswers() - no entity name', async () => {
    gen.__setModel(projectModel);
    return expectRejectedPromise(
      async () => gen._getEntityFromAnswers({entity: {}}),
      'Additional prompt failed: cannot find entity name'
    );
  });

  it('_getEntityFromAnswers() - unexisting entity name', async () => {
    gen.__setModel(projectModel);
    return expectRejectedPromise(
      async () => gen._getEntityFromAnswers({entity: {name: 'Unexisting entity name'}}),
      'Additional prompt failed: cannot find entity'
    );
  });

  it('_getEntityFromAnswers() - entity found', async () => {
    gen.__setModel(projectModel);
    const entity = await gen._getEntityFromAnswers({entity: {name: 'scr$Car'}});
    expect(entity.name).to.equal('scr$Car');
    expect(entity.fqn).to.equal('com.company.scr.entity.Car');
  });

  it('_stringIdPrompts() -  no project model', async () => {
    const entity = projectModel.entities.find((e: any) => e.name === 'scr_StringIdTestEntity');;
    return expectRejectedPromise(
      async () => gen._stringIdPrompts({}, entity),
      'Additional prompt failed: cannot find project model'
    );
  });

  it('_stringIdPrompts() - not a String ID entity', async () => {
    const entity = projectModel.entities.find((e: any) => e.name === 'scr_IntegerIdTestEntity');
    gen.__setModel(projectModel);
    const answers = await gen._stringIdPrompts({}, entity);
    expect(answers).to.deep.equal({});
  });

  it('_stringIdPrompts() - String ID entity, no ID attribute name in project model (older Studio)', async () => {
    const entity = projectModelNoIdAttr.entities.find((e: any) => e.name === 'scr_StringIdTestEntity');
    gen.__setModel(projectModelNoIdAttr);
    sinon.stub(gen, 'prompt').callsFake(createPromptFake());
    const answers = await gen._stringIdPrompts({entity: {}}, entity);
    expect(answers.idAttrName).to.equal('test_identifier');
  });

  it('_stringIdPrompts() - String ID entity with ID attribute name in project model', async () => {
    const entity = projectModel.entities.find((e: any) => e.name === 'scr_StringIdTestEntity');
    gen.__setModel(projectModel);
    sinon.stub(gen, 'prompt').callsFake(createPromptFake());
    const answers = await gen._stringIdPrompts({entity: {idAttributeName: 'projectModelIdName'}}, entity);
    // tslint:disable-next-line:no-unused-expression
    expect(answers.idAttrName).to.be.undefined;
  });

  it('_stringIdPrompts() - String ID entity, questions about showing ID', async () => {
    const entity = projectModel.entities.find((e: any) => e.name === 'scr_StringIdTestEntity');
    gen.__setModel(projectModel);
    sinon.stub(gen, 'prompt').callsFake(createPromptFake());
    const answers = await gen._stringIdPrompts({entity: {}}, entity);
    expect(answers.listShowIdAttr).to.equal(true);
    expect(answers.listIdAttrPos).to.equal(42);
    // tslint:disable-next-line:no-unused-expression
    expect(answers.editIdAttrPos).to.be.undefined;

    // @ts-ignore unwrap the spy
    gen.prompt.restore();
    sinon.stub(gen, 'prompt').callsFake(createPromptFake({
      listShowIdAttr: false
    }));
    const answers2 = await gen._stringIdPrompts({entity: {}}, entity);
    expect(answers2.listShowIdAttr).to.equal(false);
    expect(answers2.listIdAttrPos).to.equal(undefined);
    // tslint:disable-next-line:no-unused-expression
    expect(answers.editIdAttrPos).to.be.undefined;
  });

  it('_stringIdPrompts() - String ID entity, with Edit component', async () => {
    const entity = projectModel.entities.find((e: any) => e.name === 'scr_StringIdTestEntity');
    const gen2 = new TestEntityScreenGeneratorWithEdit([], {});
    gen2.__setModel(projectModel);
    sinon.stub(gen2, 'prompt').callsFake(createPromptFake());
    const answers = await gen2._stringIdPrompts({entity: {}}, entity);
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

