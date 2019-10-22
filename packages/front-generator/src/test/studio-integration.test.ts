import * as path from "path";
import {exportProjectModel, getOpenedCubaProjects} from "../common/studio/studio-integration";
import {expect} from "chai";
import nock = require('nock');
import * as fs from 'fs';


describe('studio-integration', function () {

  //to check integration with real run studio set CI_MODE = false
  const CI_MODE = true;

  before(() => {
    //mock request to studio on CI
    if (CI_MODE) {

      nock('http://localhost:48561')
        .get(/\?printCubaProjects.*/)
        .reply(200,
          [{'name': 'model-playground', 'path': '/model-playground', 'locationHash': 'd50df17f'}])
        .get(/\?exportModelProjectDest.*/)
        .reply(200, '')

    }
  });

  it('exports model', function () {
    this.timeout(20000);

    //todo move dest to src/test/generated/studio
    const dest = path.join(process.cwd(), '.tmp/projectModel.json');
    !CI_MODE && fs.truncateSync(dest);

    exportProjectModel("d50df17f", dest)
      .then(() => {
        !CI_MODE && expect(fs.statSync(dest).size).greaterThan(0)
      })
  });


  it('prints cuba projects', function () {
    getOpenedCubaProjects()
      .then((projects) => {
        CI_MODE ?
        expect(projects[0].locationHash === 'd50df17f')
        :console.log(JSON.stringify(projects));
      })
  })
});
