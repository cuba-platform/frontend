const FilterActions = require('./FilterActions');

// TODO https://github.com/cuba-platform/frontend/issues/284
xdescribe('DataTable - filters, LocalDate', () => {
  let fa = new FilterActions();
  beforeAll(fa.beforeAll);
  beforeEach(fa.beforeEach);
  afterAll(fa.afterAll);

  it('LocalDate field - "equals" filter', async () => {
    await fa.applyDateFilter(12, 'localDateAttr', 'equals', '2020-02-02');
    await fa.expectResults(12, ['2020-02-02']);
  });

  it('LocalDate field - "greater than" filter', async () => {
    await fa.applyDateFilter(12, 'localDateAttr', 'greater', '2020-02-02');
    await fa.expectResults(12, ['2020-03-03']);
  });

  it('LocalDate field - "greater than or equal" filter', async () => {
    await fa.applyDateFilter(12, 'localDateAttr', 'greaterOrEqual', '2020-02-02');
    await fa.expectResults(12, ['2020-03-03', '2020-02-02']);
  });

  it('LocalDate field - "less than" filter', async () => {
    await fa.applyDateFilter(12, 'localDateAttr', 'less', '2020-02-02');
    await fa.expectResults(12, ['2020-01-01']);
  });

  it('LocalDate field - "less than or equal" filter', async () => {
    await fa.applyDateFilter(12, 'localDateAttr', 'lessOrEqual', '2020-02-02');
    await fa.expectResults(12, ['2020-02-02', '2020-01-01']);
  });

  it('LocalDate field - "not equal" filter', async () => {
    await fa.applyDateFilter(12, 'localDateAttr', 'notEqual', '2020-02-02');
    await fa.expectResults(12, ['2020-03-03', '2020-01-01']);
  });

  it('LocalDate field - "in" filter', async () => {
    await fa.applyDateListFilter(12, 'localDateAttr', 'in', ['2020-02-02', '2020-01-01']);
    await fa.expectResults(12, ['2020-02-02', '2020-01-01']);
  });

  it('LocalDate field - "not in" filter', async () => {
    await fa.applyDateListFilter(12, 'localDateAttr', 'notIn', ['2020-02-02', '2020-01-01']);
    await fa.expectResults(12, ['2020-03-03']);
  });

  it('LocalDate field - "is set" filter', async () => {
    await fa.applySelectFilter(12, 'localDateAttr', 'notEmpty', 'true');
    await fa.expectResults(12, ['2020-03-03', '2020-02-02', '2020-01-01']);
  });

});