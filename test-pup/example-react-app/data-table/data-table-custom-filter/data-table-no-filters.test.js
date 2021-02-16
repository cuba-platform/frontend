const FilterActions = require('./FilterActions');

// TODO https://github.com/cuba-platform/frontend/issues/284
xdescribe('DataTable - no filters', () => {
  let fa = new FilterActions();
  beforeAll(fa.beforeAll);
  beforeEach(fa.beforeEach);
  afterAll(fa.afterAll);

  it('No filters applied', async () => {
    await fa.expectResults(0, ['0', '-8273729824.34', '9131354156.12', '']);
  });

});