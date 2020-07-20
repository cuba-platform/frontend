const FilterActions = require('./FilterActions');

// TODO https://github.com/cuba-platform/frontend/issues/284
xdescribe('DataTable - filters, OffsetTime', () => {
  let fa = new FilterActions();
  beforeAll(fa.beforeAll);
  beforeEach(fa.beforeEach);
  afterAll(fa.afterAll);

  it('OffsetTime field - "greater than" filter', async () => {
    await fa.applyTimeFilter(14, 'offsetTimeAttr', 'greater', '10:00:00');
    await fa.expectResults(14, ['22:22:22', '11:11:11']);
  });

  it('OffsetTime field - "less than" filter', async () => {
    await fa.applyTimeFilter(14, 'offsetTimeAttr', 'less', '10:00:00');
    await fa.expectResults(14, ['03:03:03']);
  });

  it('OffsetTime field - "is set" filter', async () => {
    await fa.applySelectFilter(14, 'offsetTimeAttr', 'notEmpty', 'true');
    await fa.expectResults(14, ['03:03:03', '22:22:22', '11:11:11']);
  });

});