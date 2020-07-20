const FilterActions = require('./FilterActions');

// TODO https://github.com/cuba-platform/frontend/issues/284
xdescribe('DataTable - filters, BigDecimal field', () => {
  let fa = new FilterActions();
  beforeAll(fa.beforeAll);
  beforeEach(fa.beforeEach);
  afterAll(fa.afterAll);

  it('BigDecimal field - "equals" filter', async () => {
    await fa.applyTextFilter(0, 'bigDecimalAttr', 'equals', '9131354156.12');
    await fa.expectResults(0, ['9131354156.12']);
  });

  it('BigDecimal field - "greater than" filter', async () => {
    await fa.applyTextFilter(0, 'bigDecimalAttr', 'greater', '0');
    await fa.expectResults(0, ['9131354156.12']);
  });

  it('BigDecimal field - "greater than or equal" filter', async () => {
    await fa.applyTextFilter(0, 'bigDecimalAttr', 'greaterOrEqual', '0');
    await fa.expectResults(0, ['0', '9131354156.12']);
  });

  it('BigDecimal field - "less than" filter', async () => {
    await fa.applyTextFilter(0, 'bigDecimalAttr', 'less', '0');
    await fa.expectResults(0, ['-8273729824.34']);
  });

  it('BigDecimal field - "less than or equal" filter', async () => {
    await fa.applyTextFilter(0, 'bigDecimalAttr', 'lessOrEqual', '0');
    await fa.expectResults(0, ['0', '-8273729824.34']);
  });

  it('BigDecimal field - "not equal" filter', async () => {
    await fa.applyTextFilter(0, 'bigDecimalAttr', 'notEqual', '0');
    await fa.expectResults(0, ['-8273729824.34', '9131354156.12']);
  });

  it('BigDecimal field - "is set" filter', async () => {
    await fa.applySelectFilter(0, 'bigDecimalAttr', 'notEmpty', 'true');
    await fa.expectResults(0, ['0', '-8273729824.34', '9131354156.12']);
  });

  it('BigDecimal field - "in" filter', async () => {
    await fa.applyListFilter(0, 'bigDecimalAttr', 'in', ['-8273729824.34', '9131354156.12']);
    await fa.expectResults(0, ['-8273729824.34', '9131354156.12']);
  });

  it('BigDecimal field - "not in" filter', async () => {
    await fa.applyListFilter(0, 'bigDecimalAttr', 'notIn', ['-8273729824.34', '9131354156.12']);
    await fa.expectResults(0, ['0']);
  });
});