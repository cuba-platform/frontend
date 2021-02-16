const FilterActions = require('./FilterActions');

// TODO https://github.com/cuba-platform/frontend/issues/284
xdescribe('DataTable - filters, DateTime', () => {
  let fa = new FilterActions();
  beforeAll(fa.beforeAll);
  beforeEach(fa.beforeEach);
  afterAll(fa.afterAll);

  it('DateTime field - "greater than" filter', async () => {
    await fa.applyDateTimeFilter(3, 'dateTimeAttr', 'greater', '2020-02-02', '01:00:00');
    await fa.expectResults(3, ['2020-03-03 03:03:03', '2020-02-02 22:22:22']);
  });

  it('DateTime field - "greater than" filter 2', async () => {
    await fa.applyDateTimeFilter(3, 'dateTimeAttr', 'greater', '2020-02-02', '23:00:00');
    await fa.expectResults(3, ['2020-03-03 03:03:03']);
  });

  it('DateTime field - "less than" filter', async () => {
    await fa.applyDateTimeFilter(3, 'dateTimeAttr', 'less', '2020-02-02', '01:00:00');
    await fa.expectResults(3, ['2020-01-01 11:11:11']);
  });

  it('DateTime field - "is set" filter', async () => {
    await fa.applySelectFilter(3, 'dateTimeAttr', 'notEmpty', 'true');
    await fa.expectResults(3, ['2020-03-03 03:03:03', '2020-02-02 22:22:22', '2020-01-01 11:11:11']);
  });

});