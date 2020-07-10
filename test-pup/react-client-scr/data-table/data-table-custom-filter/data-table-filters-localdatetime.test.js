const FilterActions = require('./FilterActions');

describe('DataTable - filters, LocalDateTime', () => {
  let fa = new FilterActions();
  beforeAll(fa.beforeAll);
  beforeEach(fa.beforeEach);
  afterAll(fa.afterAll);

  it('LocalDateTime field - "greater than" filter', async () => {
    await fa.applyDateTimeFilter(10, 'localDateTimeAttr', 'greater', '2020-02-02', '01:00:00');
    await fa.expectResults(10, ['2020-03-03 03:03:03', '2020-02-02 22:22:22']);
  });

  it('LocalDateTime field - "less than" filter', async () => {
    await fa.applyDateTimeFilter(10, 'localDateTimeAttr', 'less', '2020-02-02', '01:00:00');
    await fa.expectResults(10, ['2020-01-01 11:11:11']);
  });

  it('LocalDateTime field - "is set" filter', async () => {
    await fa.applySelectFilter(10, 'localDateTimeAttr', 'notEmpty', 'true');
    await fa.expectResults(10, ['2020-03-03 03:03:03', '2020-02-02 22:22:22', '2020-01-01 11:11:11']);
  });

});