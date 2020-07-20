const FilterActions = require('./FilterActions');

// TODO https://github.com/cuba-platform/frontend/issues/284
xdescribe('DataTable - filters, OffsetDateTime', () => {
  let fa = new FilterActions();
  beforeAll(fa.beforeAll);
  beforeEach(fa.beforeEach);
  afterAll(fa.afterAll);

  it('OffsetDateTime field - "greater than" filter', async () => {
    await fa.applyDateTimeFilter(11, 'offsetDateTimeAttr', 'greater', '2020-02-02', '01:00:00');
    await fa.expectResults(11, ['2020-03-03 03:03:03', '2020-02-02 22:22:22']);
  });

  it('OffsetDateTime field - "less than" filter', async () => {
    await fa.applyDateTimeFilter(11, 'offsetDateTimeAttr', 'less', '2020-02-02', '01:00:00');
    await fa.expectResults(11, ['2020-01-01 11:11:11']);
  });

  it('OffsetDateTime field - "is set" filter', async () => {
    await fa.applySelectFilter(11, 'offsetDateTimeAttr', 'notEmpty', 'true');
    await fa.expectResults(11, ['2020-03-03 03:03:03', '2020-02-02 22:22:22', '2020-01-01 11:11:11']);
  });

});