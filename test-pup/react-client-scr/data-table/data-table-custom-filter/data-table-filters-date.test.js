const FilterActions = require('./FilterActions');

// TODO https://github.com/cuba-platform/frontend/issues/284
xdescribe('DataTable - filters, Date', () => {
  let fa = new FilterActions();
  beforeAll(fa.beforeAll);
  beforeEach(fa.beforeEach);
  afterAll(fa.afterAll);

  it('Date field - "equals" filter', async () => {
    await fa.applyDateFilter(2, 'dateAttr', 'equals', '2020-02-02');
    await fa.expectResults(2, ['2020-02-02']);
  });

  it('Date field - "greater than" filter', async () => {
    await fa.applyDateFilter(2, 'dateAttr', 'greater', '2020-02-02');
    await fa.expectResults(2, ['2020-03-03']);
  });

  it('Date field - "greater than or equal" filter', async () => {
    await fa.applyDateFilter(2, 'dateAttr', 'greaterOrEqual', '2020-02-02');
    await fa.expectResults(2, ['2020-03-03', '2020-02-02']);
  });

  it('Date field - "less than" filter', async () => {
    await fa.applyDateFilter(2, 'dateAttr', 'less', '2020-02-02');
    await fa.expectResults(2, ['2020-01-01']);
  });

  it('Date field - "less than or equal" filter', async () => {
    await fa.applyDateFilter(2, 'dateAttr', 'lessOrEqual', '2020-02-02');
    await fa.expectResults(2, ['2020-02-02', '2020-01-01']);
  });

  it('Date field - "not equal" filter', async () => {
    await fa.applyDateFilter(2, 'dateAttr', 'notEqual', '2020-02-02');
    await fa.expectResults(2, ['2020-03-03', '2020-01-01']);
  });

  it('Date field - "in" filter', async () => {
    await fa.applyDateListFilter(2, 'dateAttr', 'in', ['2020-02-02', '2020-01-01']);
    await fa.expectResults(2, ['2020-02-02', '2020-01-01']);
  });

  it('Date field - "not in" filter', async () => {
    await fa.applyDateListFilter(2, 'dateAttr', 'notIn', ['2020-02-02', '2020-01-01']);
    await fa.expectResults(2, ['2020-03-03']);
  });

  it('Date field - "is set" filter', async () => {
    await fa.applySelectFilter(2, 'dateAttr', 'notEmpty', 'true');
    await fa.expectResults(2, ['2020-03-03', '2020-02-02', '2020-01-01']);
  });

});