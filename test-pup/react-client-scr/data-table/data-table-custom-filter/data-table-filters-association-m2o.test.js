const FilterActions = require('./FilterActions');

// TODO https://github.com/cuba-platform/frontend/issues/284
xdescribe('DataTable - filters, Association M2O', () => {
  let fa = new FilterActions();
  beforeAll(fa.beforeAll);
  beforeEach(fa.beforeEach);
  afterAll(fa.afterAll);

  it('Association M2O field - "equals" filter', async () => {
    await fa.applySelectFilter(18, 'associationM2Oattr', 'equals', 'f6a3afc1-2c68-437c-9654-baf0035e34d0');
    await fa.expectResults(18, ['ASSOCIATION-M2O-1'])
  })

  it('Association M2O field - "not equal" filter', async () => {
    await fa.applySelectFilter(18, 'associationM2Oattr', 'notEqual', 'f6a3afc1-2c68-437c-9654-baf0035e34d0');
    await fa.expectResults(18, ['ASSOCIATION-M2O-2'])
  })

  it('Association M2O field - "in" filter"', async () => {
    await fa.applySelectListFilter(18, 'associationM2Oattr', 'in', ['f6a3afc1-2c68-437c-9654-baf0035e34d0']);
    await fa.expectResults(18, ['ASSOCIATION-M2O-1']);
  });

  it('Association M2O field - "not in" filter"', async () => {
    await fa.applySelectListFilter(18, 'associationM2Oattr', 'notIn', ['f6a3afc1-2c68-437c-9654-baf0035e34d0']);
    await fa.expectResults(18, ['ASSOCIATION-M2O-2']);
  });

  it('Association M2O field - "is set" filter', async () => {
    await fa.applySelectFilter(18, 'associationM2Oattr', 'notEmpty', 'true');
    await fa.expectResults(18, ['ASSOCIATION-M2O-2', 'ASSOCIATION-M2O-1']);
  });

});