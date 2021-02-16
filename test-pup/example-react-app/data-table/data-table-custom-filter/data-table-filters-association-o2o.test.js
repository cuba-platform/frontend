const FilterActions = require('./FilterActions');

// TODO https://github.com/cuba-platform/frontend/issues/284
xdescribe('DataTable - filters, Association O2O', () => {
  let fa = new FilterActions();
  beforeAll(fa.beforeAll);
  beforeEach(fa.beforeEach);
  afterAll(fa.afterAll);

  it('Association O2O field - "equals" filter', async () => {
    await fa.applySelectFilter(17, 'associationO2Oattr', 'equals', '1a8f4cd6-bc3a-46ef-8816-dda6ad484137');
    await fa.expectResults(17, ['ASSOCIATION-O2O-1'])
  })

  it('Association O2O field - "not equal" filter', async () => {
    await fa.applySelectFilter(17, 'associationO2Oattr', 'notEqual', '1a8f4cd6-bc3a-46ef-8816-dda6ad484137');
    await fa.expectResults(17, ['ASSOCIATION-O2O-2'])
  })

  it('Association O2O field - "in" filter"', async () => {
    await fa.applySelectListFilter(17, 'associationO2Oattr', 'in', ['1a8f4cd6-bc3a-46ef-8816-dda6ad484137']);
    await fa.expectResults(17, ['ASSOCIATION-O2O-1']);
  });

  it('Association O2O field - "not in" filter"', async () => {
    await fa.applySelectListFilter(17, 'associationO2Oattr', 'notIn', ['1a8f4cd6-bc3a-46ef-8816-dda6ad484137']);
    await fa.expectResults(17, ['ASSOCIATION-O2O-2']);
  });

  it('Association O2O field - "is set" filter', async () => {
    await fa.applySelectFilter(17, 'associationO2Oattr', 'notEmpty', 'true');
    await fa.expectResults(17, ['ASSOCIATION-O2O-2', 'ASSOCIATION-O2O-1']);
  });

});