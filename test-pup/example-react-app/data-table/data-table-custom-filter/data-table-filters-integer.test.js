const FilterActions = require('./FilterActions');

// TODO https://github.com/cuba-platform/frontend/issues/284
xdescribe('DataTable - filters, Integer', () => {
  let fa = new FilterActions();
  beforeAll(fa.beforeAll);
  beforeEach(fa.beforeEach);
  afterAll(fa.afterAll);

  it('Integer field - "equals" filter', async () => {
    await fa.applyTextFilter(5, 'integerAttr', 'equals', '304221');
    await fa.expectResults(5, ['304221']);
  });

  it('Integer field - "greater than" filter', async () => {
    await fa.applyTextFilter(5, 'integerAttr', 'greater', '0');
    await fa.expectResults(5, ['304221', '10482']);
  });

  it('Integer field - "greater than or equal" filter', async () => {
    await fa.applyTextFilter(5, 'integerAttr', 'greaterOrEqual', '0');
    await fa.expectResults(5, ['0', '304221', '10482']);
  });

  it('Integer field - "less than" filter', async () => {
    await fa.applyTextFilter(5, 'integerAttr', 'less', '10482');
    await fa.expectResults(5, ['0']);
  });

  it('Integer field - "less than or equal" filter', async () => {
    await fa.applyTextFilter(5, 'integerAttr', 'lessOrEqual', '10482');
    await fa.expectResults(5, ['0', '10482']);
  });

  it('Integer field - "not equal" filter', async () => {
    await fa.applyTextFilter(5, 'integerAttr', 'notEqual', '0');
    await fa.expectResults(5, ['304221', '10482']);
  });

  it('Integer field - "is set" filter', async () => {
    await fa.applySelectFilter(5, 'integerAttr', 'notEmpty', 'true');
    await fa.expectResults(5, ['0', '304221', '10482']);
  });

  it('Integer field - "in" filter', async () => {
    await fa.applyListFilter(5, 'integerAttr', 'in', ['304221', '10482']);
    await fa.expectResults(5, ['304221', '10482']);
  });

  it('Integer field - "not in" filter', async () => {
    await fa.applyListFilter(5, 'integerAttr', 'notIn', ['304221', '10482']);
    await fa.expectResults(5, ['0']);
  });

});