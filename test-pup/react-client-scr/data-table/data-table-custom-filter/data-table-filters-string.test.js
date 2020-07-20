const FilterActions = require('./FilterActions');

// TODO https://github.com/cuba-platform/frontend/issues/284
xdescribe('DataTable - filters, String', () => {
  let fa = new FilterActions();
  beforeAll(fa.beforeAll);
  beforeEach(fa.beforeEach);
  afterAll(fa.afterAll);

  it('String field - "contains" filter', async () => {
    await fa.applyTextFilter(7, 'stringAttr', 'contains', 'or');
    await fa.expectResults(7, ['dolor sit amet', 'Lorem Ipsum']);
  });

  it('String field - "equals" filter', async () => {
    await fa.applyTextFilter(7, 'stringAttr', 'equals', 'Lorem Ipsum');
    await fa.expectResults(7, ['Lorem Ipsum']);
  });

  it('String field - "in" filter', async () => {
    await fa.applyListFilter(7, 'stringAttr', 'in', ['Lorem Ipsum']);
    await fa.expectResults(7, ['Lorem Ipsum']);
  });

  it('String field - "not in" filter', async () => {
    await fa.applyListFilter(7, 'stringAttr', 'notIn', ['Lorem Ipsum']);
    await fa.expectResults(7, ['', 'dolor sit amet']);
  });

  it('String field - "not equals" filter', async () => {
    await fa.applyTextFilter(7, 'stringAttr', 'notEqual', 'Lorem Ipsum');
    await fa.expectResults(7, ['', 'dolor sit amet']);
  });

  it('String field - "does not contain" filter', async () => {
    await fa.applyTextFilter(7, 'stringAttr', 'doesNotContain', 'or');
    await fa.expectResults(7, ['']);
  });

  it('String field - "is set" filter', async () => {
    await fa.applySelectFilter(7, 'stringAttr', 'notEmpty', 'true');
    await fa.expectResults(7, ['', 'dolor sit amet', 'Lorem Ipsum']);
  });

  it('String field - "starts with" filter', async () => {
    await fa.applyTextFilter(7, 'stringAttr', 'startsWith', 'Lo');
    await fa.expectResults(7, ['Lorem Ipsum']);
  });

  it('String field - "ends with" filter', async () => {
    await fa.applyTextFilter(7, 'stringAttr', 'endsWith', 'um');
    await fa.expectResults(7, ['Lorem Ipsum']);
  });

});