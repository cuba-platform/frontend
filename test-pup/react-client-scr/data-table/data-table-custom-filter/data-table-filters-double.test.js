const FilterActions = require('./FilterActions');

// TODO https://github.com/cuba-platform/frontend/issues/284
xdescribe('DataTable - filters, Double', () => {
  let fa = new FilterActions();
  beforeAll(fa.beforeAll);
  beforeEach(fa.beforeEach);
  afterAll(fa.afterAll);

  it('Double field - "equals" filter', async () => {
    await fa.applyTextFilter(4, 'doubleAttr', 'equals', '8234.3462');
    await fa.expectResults(4, ['8234.3462']);
  });

  it('Double field - "greater than" filter', async () => {
    await fa.applyTextFilter(4, 'doubleAttr', 'greater', '0');
    await fa.expectResults(4, ['8234.3462', '32.521']);
  });

  it('Double field - "greater than or equal" filter', async () => {
    await fa.applyTextFilter(4, 'doubleAttr', 'greaterOrEqual', '0');
    await fa.expectResults(4, ['0', '8234.3462', '32.521']);
  });

  it('Double field - "less than" filter', async () => {
    await fa.applyTextFilter(4, 'doubleAttr', 'less', '32.521');
    await fa.expectResults(4, ['0']);
  });

  it('Double field - "less than or equal" filter', async () => {
    await fa.applyTextFilter(4, 'doubleAttr', 'lessOrEqual', '32.521');
    await fa.expectResults(4, ['0', '32.521']);
  });

  it('Double field - "not equal" filter', async () => {
    await fa.applyTextFilter(4, 'doubleAttr', 'notEqual', '0');
    await fa.expectResults(4, ['8234.3462', '32.521']);
  });

  it('Double field - "is set" filter', async () => {
    await fa.applySelectFilter(4, 'doubleAttr', 'notEmpty', 'true');
    await fa.expectResults(4, ['0', '8234.3462', '32.521']);
  });

  it('Double field - "in" filter', async () => {
    await fa.applyListFilter(4, 'doubleAttr', 'in', ['8234.3462', '32.521']);
    await fa.expectResults(4, ['8234.3462', '32.521']);
  });

  it('Double field - "not in" filter', async () => {
    await fa.applyListFilter(4, 'doubleAttr', 'notIn', ['8234.3462', '32.521']);
    await fa.expectResults(4, ['0']);
  });

});