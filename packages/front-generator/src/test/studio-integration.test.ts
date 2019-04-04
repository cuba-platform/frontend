import * as path from "path";
import {exportProjectModel, getOpenedCubaProjects} from "../common/studio/studio-integration";

describe('studio-integration', function() {

  it('exports model', function(done) {
    this.timeout(20000);

    const dest = path.join(process.cwd(), '.tmp', 'projectModel.json');

    exportProjectModel("1cc13342", dest)
      .then(() => done())
      .catch(() => done('Failed to export project model'))

  });


  it ('prints cuba projects', function (done) {
    getOpenedCubaProjects()
      .then((projects) => {
        console.log(JSON.stringify(projects));
        done()
      })
      .catch(() => {
        done('Failed to print opened projects')
      })
  })
});