const FilterActions = require('./FilterActions');

// TODO https://github.com/cuba-platform/frontend/issues/284
xdescribe('DataTable - filters, UUID', () => {
  let fa = new FilterActions();
  beforeAll(fa.beforeAll);
  beforeEach(fa.beforeEach);
  afterAll(fa.afterAll);

  it('UUID field - "equals" filter', async () => {
    await fa.applyTextFilter(9, 'uuidAttr', 'equals', 'db9faa31-dfa3-4b97-943c-ba268888cdc3');
    await fa.expectResults(9, ['db9faa31-dfa3-4b97-943c-ba268888cdc3']);
  });

  it('UUID field - "not equal" filter', async () => {
    await fa.applyTextFilter(9, 'uuidAttr', 'notEqual', 'db9faa31-dfa3-4b97-943c-ba268888cdc3');
    await fa.expectResults(9, ['9b4188bf-c382-4b89-aedf-b6bcee6f2f76', 'c6a1cee6-f562-48a0-acbe-9625e0b278b1']);
  });

  it('UUID field - "in" filter', async () => {
    await fa.applyListFilter(9, 'uuidAttr', 'in', ['db9faa31-dfa3-4b97-943c-ba268888cdc3', '9b4188bf-c382-4b89-aedf-b6bcee6f2f76']);
    await fa.expectResults(9, ['db9faa31-dfa3-4b97-943c-ba268888cdc3', '9b4188bf-c382-4b89-aedf-b6bcee6f2f76']);
  });

  it('UUID field - "not in" filter', async () => {
    await fa.applyListFilter(9, 'uuidAttr', 'notIn', ['db9faa31-dfa3-4b97-943c-ba268888cdc3', '9b4188bf-c382-4b89-aedf-b6bcee6f2f76']);
    await fa.expectResults(9, ['c6a1cee6-f562-48a0-acbe-9625e0b278b1']);
  });

  it('UUID field - "is set" filter', async () => {
    await fa.applySelectFilter(9, 'uuidAttr', 'notEmpty', 'true');
    await fa.expectResults(9, ['db9faa31-dfa3-4b97-943c-ba268888cdc3', '9b4188bf-c382-4b89-aedf-b6bcee6f2f76', 'c6a1cee6-f562-48a0-acbe-9625e0b278b1']);
  });

});