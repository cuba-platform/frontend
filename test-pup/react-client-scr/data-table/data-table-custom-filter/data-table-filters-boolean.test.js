const FilterActions = require('./FilterActions');

// TODO https://github.com/cuba-platform/frontend/issues/284
xdescribe('DataTable - filters, Boolean', () => {
  let fa = new FilterActions();
  beforeAll(fa.beforeAll);
  beforeEach(fa.beforeEach);
  afterAll(fa.afterAll);

  it('Boolean field - "equals true" filter', async () => {
    await fa.applySelectFilter(1, 'booleanAttr', 'equals', 'true');
    await fa.expectResults(1, [checkboxOn], false);
  });

  it('Boolean field - "equals false" filter', async () => {
    await fa.applySelectFilter(1, 'booleanAttr', 'equals', 'false');
    await fa.expectResults(1, [checkboxOff], false);
  });

  it('Boolean field - "not equals true" filter', async () => {
    await fa.applySelectFilter(1, 'booleanAttr', 'notEqual', 'true');
    await fa.expectResults(1, [checkboxOff], false);
  });

  it('Boolean field - "not equals false" filter', async () => {
    await fa.applySelectFilter(1, 'booleanAttr', 'notEqual', 'false');
    await fa.expectResults(1, [checkboxOn], false);
  });

  it('Boolean field - "is set" filter', async () => {
    await fa.applySelectFilter(1, 'booleanAttr', 'notEmpty', 'true');
    await fa.expectResults(1, [checkboxOff, checkboxOn], false);
  });

});

const checkboxOn = '<label class="ant-checkbox-wrapper ant-checkbox-wrapper-checked ant-checkbox-wrapper-disabled"><span class="ant-checkbox ant-checkbox-checked ant-checkbox-disabled"><input type="checkbox" disabled="" class="ant-checkbox-input" value="" checked=""><span class="ant-checkbox-inner"></span></span></label>';
const checkboxOff = '<label class="ant-checkbox-wrapper ant-checkbox-wrapper-disabled"><span class="ant-checkbox ant-checkbox-disabled"><input type="checkbox" disabled="" class="ant-checkbox-input" value=""><span class="ant-checkbox-inner"></span></span></label>';
