const FilterActions = require('./FilterActions');

// TODO https://github.com/cuba-platform/frontend/issues/284
xdescribe('DataTable - filters, Composition O2O', () => {
  let fa = new FilterActions();
  beforeAll(fa.beforeAll);
  beforeEach(fa.beforeEach);
  afterAll(fa.afterAll);

  it('Composition O2O field - "equals" filter', async () => {
    await fa.applySelectFilter(19, 'compositionO2Oattr', 'equals', '76b5eb8c-522c-40ab-bd00-c761353684b3');
    await fa.expectResults(19, ['COMPOSITION-O2O-1'])
  })

  it('Composition O2O field - "not equal" filter', async () => {
    await fa.applySelectFilter(19, 'compositionO2Oattr', 'notEqual', '76b5eb8c-522c-40ab-bd00-c761353684b3');
    await fa.expectResults(19, ['COMPOSITION-O2O-2'])
  })

  it('Composition O2O field - "in" filter"', async () => {
    await fa.applySelectListFilter(19, 'compositionO2Oattr', 'in', ['76b5eb8c-522c-40ab-bd00-c761353684b3']);
    await fa.expectResults(19, ['COMPOSITION-O2O-1']);
  });

  it('Composition O2O field - "not in" filter"', async () => {
    await fa.applySelectListFilter(19, 'compositionO2Oattr', 'notIn', ['76b5eb8c-522c-40ab-bd00-c761353684b3']);
    await fa.expectResults(19, ['COMPOSITION-O2O-2']);
  });

  it('Composition O2O field - "is set" filter', async () => {
    await fa.applySelectFilter(19, 'compositionO2Oattr', 'notEmpty', 'true');
    await fa.expectResults(19, ['COMPOSITION-O2O-2', 'COMPOSITION-O2O-1']);
  });

});