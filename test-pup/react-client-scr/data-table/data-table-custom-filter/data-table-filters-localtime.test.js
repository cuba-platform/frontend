const FilterActions = require('./FilterActions');

// TODO https://github.com/cuba-platform/frontend/issues/284
xdescribe('DataTable - filters, LocalTime', () => {
  let fa = new FilterActions();
  beforeAll(fa.beforeAll);
  beforeEach(fa.beforeEach);
  afterAll(fa.afterAll);

  it('LocalTime field - "greater than" filter', async () => {
    await fa.applyTimeFilter(13, 'localTimeAttr', 'greater', '10:00:00');
    await fa.expectResults(13, ['22:22:22', '11:11:11']);
  });

  it('LocalTime field - "less than" filter', async () => {
    await fa.applyTimeFilter(13, 'localTimeAttr', 'less', '10:00:00');
    await fa.expectResults(13, ['03:03:03']);
  });

  it('LocalTime field - "is set" filter', async () => {
    await fa.applySelectFilter(13, 'localTimeAttr', 'notEmpty', 'true');
    await fa.expectResults(13, ['03:03:03', '22:22:22', '11:11:11']);
  });

});