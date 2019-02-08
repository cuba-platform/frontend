import {collectClients, generate} from "../init";
import * as assert from "assert";
import {createEntityClass} from "../common/model/entities-generation";
import {Entity, ProjectModel} from "../common/model/cuba-model";
import * as path from "path";

const projectModel: ProjectModel = require('../../test/projectModel2.json');
const modelPath =  require.resolve('../../test/projectModel.json');
const answers = require('../../test/answers.js');
const tmpGenerationDir = path.join(process.cwd(), '.tmp');

describe('generator', function () {
  it('collectGenerators' , async function() {
    const generators = collectClients();
    assert(Array.isArray(generators));
    console.log(generators.reduce((p, gen) => p+= gen.name + '\n', ''));
  });

  it('generates Polymer client', function () {
    return generate('polymer2', 'app', {
      model: modelPath,
      dest: path.join(tmpGenerationDir, 'polymer2-app'),
      debug: true
    });
  });

  it ('generates React client', function () {
    return generate('react-typescript', 'app', {
      model: modelPath,
      dest: path.join(tmpGenerationDir, 'react-client'),
      debug: true
    });
  })
});

describe('generate entity', function() {
  it(createEntityClass.name, function() {
    const classTsNode = createEntityClass((projectModel.entities as Entity[])[0], projectModel);
    assert(classTsNode != null);
  });
});