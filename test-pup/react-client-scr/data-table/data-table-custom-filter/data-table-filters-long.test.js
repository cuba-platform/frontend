const FilterActions = require('./FilterActions');

// TODO https://github.com/cuba-platform/frontend/issues/284
xdescribe('DataTable - filters, Long', () => {
  let fa = new FilterActions();
  beforeAll(fa.beforeAll);
  beforeEach(fa.beforeEach);
  afterAll(fa.afterAll);

  it('Long field - "equals" filter', async () => {
    await fa.applyTextFilter(6, 'longAttr', 'equals', '984299284249651');
    await fa.expectResults(6, ['984299284249651']);
  });

  it('Long field - "greater than" filter', async () => {
    await fa.applyTextFilter(6, 'longAttr', 'greater', '0');
    await fa.expectResults(6, ['984299284249651', '9223372036854776000']);
  });

  it('Long field - "greater than or equal" filter', async () => {
    await fa.applyTextFilter(6, 'longAttr', 'greaterOrEqual', '0');
    await fa.expectResults(6, ['0', '984299284249651', '9223372036854776000']);
  });

  it('Long field - "less than" filter', async () => {
    await fa.applyTextFilter(6, 'longAttr', 'less', '984299284249651');
    await fa.expectResults(6, ['0']);
  });

  it('Long field - "less than or equal" filter', async () => {
    await fa.applyTextFilter(6, 'longAttr', 'lessOrEqual', '984299284249651');
    await fa.expectResults(6, ['0', '984299284249651']);
  });

  it('Long field - "not equal" filter', async () => {
    await fa.applyTextFilter(6, 'longAttr', 'notEqual', '0');
    await fa.expectResults(6, ['984299284249651', '9223372036854776000']);
  });

  it('Long field - "is set" filter', async () => {
    await fa.applySelectFilter(6, 'longAttr', 'notEmpty', 'true');
    await fa.expectResults(6, ['0', '984299284249651', '9223372036854776000']);
  });

  it('Long field - "in" filter', async () => {
    await fa.applyListFilter(6, 'longAttr', 'in', ['984299284249651', '9223372036854776000']);
    await fa.expectResults(6, ['984299284249651', '9223372036854776000']);
  });

  it('Long field - "not in" filter', async () => {
    await fa.applyListFilter(6, 'longAttr', 'notIn', ['984299284249651', '9223372036854776000']);
    await fa.expectResults(6, ['0']);
  });

});