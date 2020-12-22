import * as path from "path";
import {exportProjectModel, getOpenedCubaProjects, normalizeSecret} from "../common/studio/studio-integration";
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
        expect(projects && projects[0].locationHash === 'd50df17f')
        :console.log(JSON.stringify(projects));
      })
  });

  it('should normalize secret', () => {
    let secret = normalizeSecret('{noop}bf37f38be32f307c4fc5b2c1517cac2984ea46eaf6856dfa56cfe92212ee26c9');
    expect(secret).eq('bf37f38be32f307c4fc5b2c1517cac2984ea46eaf6856dfa56cfe92212ee26c9');

    secret = normalizeSecret('{}bf37f38be32f307c4fc5b2c1517cac2984ea46eaf6856dfa56cfe92212ee26c9');
    expect(secret).eq('bf37f38be32f307c4fc5b2c1517cac2984ea46eaf6856dfa56cfe92212ee26c9');

    secret = normalizeSecret('{21879*&*^7ydtwuydtwqy}bf37f38be32f307c4fc5b2c1517cac2984ea46eaf6856dfa56cfe92212ee26c9');
    expect(secret).eq('bf37f38be32f307c4fc5b2c1517cac2984ea46eaf6856dfa56cfe92212ee26c9');

    secret = normalizeSecret('bf37f38be32f307c4fc5b2c1517cac2984ea46eaf6856dfa56cfe92212ee26c9');
    expect(secret).eq('bf37f38be32f307c4fc5b2c1517cac2984ea46eaf6856dfa56cfe92212ee26c9');
  });
});
