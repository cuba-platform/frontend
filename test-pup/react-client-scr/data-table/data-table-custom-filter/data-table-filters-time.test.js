const FilterActions = require('./FilterActions');

// TODO https://github.com/cuba-platform/frontend/issues/284
xdescribe('DataTable - filters, Time', () => {
  let fa = new FilterActions();
  beforeAll(fa.beforeAll);
  beforeEach(fa.beforeEach);
  afterAll(fa.afterAll);

  it('Time field - "greater than" filter', async () => {
    await fa.applyTimeFilter(8, 'timeAttr', 'greater', '10:00:00');
    await fa.expectResults(8, ['22:22:22', '11:11:11']);
  });

  it('Time field - "less than" filter', async () => {
    await fa.applyTimeFilter(8, 'timeAttr', 'less', '10:00:00');
    await fa.expectResults(8, ['03:03:03']);
  });

  it('Time field - "is set" filter', async () => {
    await fa.applySelectFilter(8, 'timeAttr', 'notEmpty', 'true');
    await fa.expectResults(8, ['03:03:03', '22:22:22', '11:11:11']);
  });

});