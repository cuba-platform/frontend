const {login} = require("../../common/login-to-scr");
const puppeteer = require("puppeteer");

// TODO Add "is not set" tests once https://github.com/cuba-platform/frontend/issues/124 is fixed

// TODO Modify "not in"/"not equal" tests once https://github.com/cuba-platform/frontend/issues/122 is fixed
// TODO (currently only String fields are correctly including empty values in the result)

// TODO Add "equals"/"not equal", "greater/less or equal", "in"/"not in" tests for date/time and time types
// TODO once https://github.com/cuba-platform/frontend/issues/123 is fixed

describe('DataTable - filters', () => {
  let browser;
  let page;

  const tableNotEmptySelector = '.ant-table-tbody:not(:empty)';

  /**
   *
   * @returns {!Promise<!Object|undefined>} a promise that resolves into a 2D array
   * (array of rows, row is an array of cells).
   * To get a cell use `table[rowIndex][columnIndex]`.
   */
  const readTable = async () => {
    return page.$$eval('.ant-table-tbody > tr', rows => {
      return rows.map(row => {
        const cells = [...row.getElementsByTagName('td')].slice(1); // Slice away the selection column.
        return cells.map(cell => {
          return cell.innerHTML;
        });
      });
    });
  };

  const openFilter = async (columnIndex) => {
    const filterSelector = `.ant-table-thead > tr > th:nth-child(${columnIndex + 2}) > i`;
    await page.$eval(filterSelector, e => e.click());
    await page.waitForSelector('.ant-dropdown:not(.ant-dropdown-hidden)');
  };

  const typeTextIntoInput = async (selector, text) => {
    await page.waitForSelector(selector);
    await page.type(selector, text);
  };

  const setInputValue = async (attr, value) => {
    const inputSelector = `#${attr}_input`;
    await typeTextIntoInput(inputSelector, value);
  };

  const setSelectValue = async (attr, value) => {
    const inputSelector = `#${attr}_input`;
    // Open the dropdown.
    await page.$eval(inputSelector, element => element.click());
    const dropdownSelector = `.cuba-value-dropdown-${attr}`;
    const optionClassName = `cuba-filter-value-${value}`;
    const optionSelector = `${dropdownSelector} .${optionClassName}`;
    await page.$eval(optionSelector, element => element.click());
    await page.waitForSelector(`.cuba-value-dropdown-${attr}.ant-select-dropdown-hidden`);
  };

  const setOperator = async (attr, operator) => {
    await page.$eval(`#${attr}_operatorsDropdown`, element => element.click()); // Opens dropdown.
    const dropdownSelector = `.cuba-operator-dropdown-${attr}`;
    const optionClassName = `cuba-operator-${operator}`;
    const optionSelector = `${dropdownSelector} .${optionClassName}`;
    await page.$eval(optionSelector, element => element.click());
    await page.waitForSelector(`.cuba-operator-dropdown-${attr}.ant-select-dropdown-hidden`);
  };

  const applyFilter = async () => {
    const submitBtnSelector = '.ant-dropdown:not(.ant-dropdown-hidden) .cuba-table-filter > .footer > button[type="submit"]';
    await page.$eval(submitBtnSelector, e => e.click());
    await page.waitForSelector('.ant-spin'); // Wait to start loading.
    await page.waitForSelector('.ant-spin', {hidden: true}); // Wait to finish loading.
  };

  const expectResults = async (columnIndex, resultsArray, areResultsWrappedInDivs = true) => {
    const table = await readTable();
    resultsArray.forEach((result, index) => {
      expect(table[index][columnIndex]).toEqual(areResultsWrappedInDivs ? inDiv(result) : result);
    });
    expect(table.length).toEqual(resultsArray.length);
  };

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await login(page, 'admin', 'admin');
  });

  beforeEach(async () => {
    await Promise.all([
      page.goto('http://localhost:3000/#/'),
      page.waitForNavigation()
    ]);
    await Promise.all([
      page.goto('http://localhost:3000/#/datatypesManagement3'),
      page.waitForNavigation()
    ]);
    await page.waitForSelector(tableNotEmptySelector); // Wait until the data is loaded.
  });

  afterAll(async () => {
    await page.close();
    await browser.close();
  });

  // noinspection JSUnusedLocalSymbols
  const $TAKE_DEBUG_SCREENSHOT = async () => {
    await page.screenshot({path: 'debug-screenshot.png', fullPage: true});
  };

  const applyTextFilter = async (columnIndex, attr, operator, value) => {
    await openFilter(columnIndex);
    await setOperator(attr, operator);
    await setInputValue(attr, value);
    await applyFilter();
  };

  const applySelectFilter = async (columnIndex, attr, operator, value) => {
    await openFilter(columnIndex);
    await setOperator(attr, operator);
    await setSelectValue(attr, value);
    await applyFilter();
  };

  const addListItem = async (attr, value) => {
    await page.$eval('.cuba-list-editor-input', e => e.click()); // Clicking on "+ Add Item"
    const listInputSelector = '.filtercontrol.-complex-editor input';
    await typeTextIntoInput(listInputSelector, value);
    await page.keyboard.press('Enter');
    await page.waitForSelector('.cuba-list-editor-input'); // Wait until "+ Add Item" button appears again.
  };

  const applyListFilter = async (columnIndex, attr, operator, values) => {
    await openFilter(columnIndex);
    await setOperator(attr, operator);
    for (const i in values) {
      await addListItem(attr, values[i]);
    }
    await applyFilter();
  };

  const applyDateListFilter = async (columnIndex, attr, operator, values) => {
    await openFilter(columnIndex);
    await setOperator(attr, operator);
    for (const i in values) {
      await addDateListItem(attr, values[i]);
    }
    await applyFilter();
  };

  const applySelectListFilter = async (columnIndex, attr, operator, values) => {
    await openFilter(columnIndex);
    await setOperator(attr, operator);
    for (const i in values) {
      await addSelectListItem(attr, values[i]);
    }
    await applyFilter();
  };

  const addSelectListItem = async(attr, value) => {
    // Click "+ Add Item". Dropdown appears.
    await page.$eval('.cuba-list-editor-input', e => e.click());
    // Open dropdown
    const listInputSelector = '.filtercontrol.-complex-editor .ant-select-selection';
    await page.click(listInputSelector);
    // Click the right option
    const dropdownSelector = `.cuba-value-dropdown-${attr}`;
    const optionClassName = `cuba-filter-value-${value}`;
    const optionSelector = `${dropdownSelector} .${optionClassName}`;
    await page.$eval(optionSelector, element => element.click());
    // Wait until "+ Add Item" button appears again.
    await page.waitForSelector('.cuba-list-editor-input');
  };

  const addDateListItem = async (attr, date) => {
    // Click "+ Add Item". Dropdown appears.
    await page.$eval('.cuba-list-editor-input', e => e.click());
    // Open DatePicker
    const listInputSelector = '.filtercontrol.-complex-editor .ant-calendar-picker-input';
    await page.$eval(listInputSelector, e => e.click());
    await page.waitForSelector('.ant-calendar-input', {hidden: false});
    await page.type('.ant-calendar-input', date);
    await page.waitForSelector('.ant-calendar-input', {hidden: true});
    await page.waitForSelector('.cuba-list-editor-input'); // Wait until "+ Add Item" button appears again.
  };

  const setDate = async (attr, date) => {
    const dateInputSelector = `#${attr}_input > div > input`;
    await page.click(dateInputSelector);
    await page.waitForSelector('.ant-calendar-input', {hidden: false});
    await page.type('.ant-calendar-input', date);
    await page.keyboard.press('Enter');
    await page.waitForSelector('.ant-calendar-input', {hidden: true});
  };

  const setTime = async (attr, time) => {
    const timeInputSelector = `input#${attr}_input`;
    await page.click(timeInputSelector);
    await page.waitForSelector('.ant-time-picker-panel-combobox', {hidden: false});
    await page.type('.ant-time-picker-panel-input', time);
    await page.keyboard.press('Escape');
    await page.waitForSelector('.ant-time-picker-panel-combobox', {hidden: true});
  };

  const applyDateFilter = async (columnIndex, attr, operator, date) => {
    await openFilter(columnIndex);
    await setOperator(attr, operator);
    await setDate(attr, date);
    await applyFilter();
  };

  const applyTimeFilter = async (columnIndex, attr, operator, time) => {
    await openFilter(columnIndex);
    await setOperator(attr, operator);
    await setTime(attr, time);
    await applyFilter();
  };

  const applyDateTimeFilter = async (columnIndex, attr, operator, date, time) => {
    await openFilter(columnIndex);
    await setOperator(attr, operator);
    await setDate(attr, date);
    await setTime(attr, time);
    await applyFilter();
  };

  it('No filters applied', async () => {
    await expectResults(0, ['0', '-8273729824.34', '9131354156.12', '']);
  });

  // BigDecimal

  it('BigDecimal field - "equals" filter', async () => {
    await applyTextFilter(0, 'bigDecimalAttr', 'equals', '9131354156.12');
    await expectResults(0, ['9131354156.12']);
  });

  it('BigDecimal field - "greater than" filter', async () => {
    await applyTextFilter(0, 'bigDecimalAttr', 'greater', '0');
    await expectResults(0, ['9131354156.12']);
  });

  it('BigDecimal field - "greater than or equal" filter', async () => {
    await applyTextFilter(0, 'bigDecimalAttr', 'greaterOrEqual', '0');
    await expectResults(0, ['0', '9131354156.12']);
  });

  it('BigDecimal field - "less than" filter', async () => {
    await applyTextFilter(0, 'bigDecimalAttr', 'less', '0');
    await expectResults(0, ['-8273729824.34']);
  });

  it('BigDecimal field - "less than or equal" filter', async () => {
    await applyTextFilter(0, 'bigDecimalAttr', 'lessOrEqual', '0');
    await expectResults(0, ['0', '-8273729824.34']);
  });

  it('BigDecimal field - "not equal" filter', async () => {
    await applyTextFilter(0, 'bigDecimalAttr', 'notEqual', '0');
    await expectResults(0, ['-8273729824.34', '9131354156.12']);
  });

  it('BigDecimal field - "is set" filter', async () => {
    await applySelectFilter(0, 'bigDecimalAttr', 'notEmpty', 'true');
    await expectResults(0, ['0', '-8273729824.34', '9131354156.12']);
  });

  it('BigDecimal field - "in" filter', async () => {
    await applyListFilter(0, 'bigDecimalAttr', 'in', ['-8273729824.34', '9131354156.12']);
    await expectResults(0, ['-8273729824.34', '9131354156.12']);
  });

  it('BigDecimal field - "not in" filter', async () => {
    await applyListFilter(0, 'bigDecimalAttr', 'notIn', ['-8273729824.34', '9131354156.12']);
    await expectResults(0, ['0']);
  });

  // Boolean

  it('Boolean field - "equals true" filter', async () => {
    await applySelectFilter(1, 'booleanAttr', 'equals', 'true');
    await expectResults(1, [checkboxOn], false);
  });

  it('Boolean field - "equals false" filter', async () => {
    await applySelectFilter(1, 'booleanAttr', 'equals', 'false');
    await expectResults(1, [checkboxOff], false);
  });

  it('Boolean field - "not equals true" filter', async () => {
    await applySelectFilter(1, 'booleanAttr', 'notEqual', 'true');
    await expectResults(1, [checkboxOff], false);
  });

  it('Boolean field - "not equals false" filter', async () => {
    await applySelectFilter(1, 'booleanAttr', 'notEqual', 'false');
    await expectResults(1, [checkboxOn], false);
  });

  it('Boolean field - "is set" filter', async () => {
    await applySelectFilter(1, 'booleanAttr', 'notEmpty', 'true');
    await expectResults(1, [checkboxOff, checkboxOn], false);
  });

  // Date

  it('Date field - "equals" filter', async () => {
    await applyDateFilter(2, 'dateAttr', 'equals', '2020-02-02');
    await expectResults(2, ['2020-02-02']);
  });

  it('Date field - "greater than" filter', async () => {
    await applyDateFilter(2, 'dateAttr', 'greater', '2020-02-02');
    await expectResults(2, ['2020-03-03']);
  });

  it('Date field - "greater than or equal" filter', async () => {
    await applyDateFilter(2, 'dateAttr', 'greaterOrEqual', '2020-02-02');
    await expectResults(2, ['2020-03-03', '2020-02-02']);
  });

  it('Date field - "less than" filter', async () => {
    await applyDateFilter(2, 'dateAttr', 'less', '2020-02-02');
    await expectResults(2, ['2020-01-01']);
  });

  it('Date field - "less than or equal" filter', async () => {
    await applyDateFilter(2, 'dateAttr', 'lessOrEqual', '2020-02-02');
    await expectResults(2, ['2020-02-02', '2020-01-01']);
  });

  it('Date field - "not equal" filter', async () => {
    await applyDateFilter(2, 'dateAttr', 'notEqual', '2020-02-02');
    await expectResults(2, ['2020-03-03', '2020-01-01']);
  });

  it('Date field - "in" filter', async () => {
    await applyDateListFilter(2, 'dateAttr', 'in', ['2020-02-02', '2020-01-01']);
    await expectResults(2, ['2020-02-02', '2020-01-01']);
  });

  it('Date field - "not in" filter', async () => {
    await applyDateListFilter(2, 'dateAttr', 'notIn', ['2020-02-02', '2020-01-01']);
    await expectResults(2, ['2020-03-03']);
  });

  it('Date field - "is set" filter', async () => {
    await applySelectFilter(2, 'dateAttr', 'notEmpty', 'true');
    await expectResults(2, ['2020-03-03', '2020-02-02', '2020-01-01']);
  });

  // DateTime

  it('DateTime field - "greater than" filter', async () => {
    await applyDateTimeFilter(3, 'dateTimeAttr', 'greater', '2020-02-02', '01:00:00');
    await expectResults(3, ['2020-03-03 03:03:03', '2020-02-02 22:22:22']);
  });

  it('DateTime field - "greater than" filter 2', async () => {
    await applyDateTimeFilter(3, 'dateTimeAttr', 'greater', '2020-02-02', '23:00:00');
    await expectResults(3, ['2020-03-03 03:03:03']);
  });

  it('DateTime field - "less than" filter', async () => {
    await applyDateTimeFilter(3, 'dateTimeAttr', 'less', '2020-02-02', '01:00:00');
    await expectResults(3, ['2020-01-01 11:11:11']);
  });

  it('DateTime field - "is set" filter', async () => {
    await applySelectFilter(3, 'dateTimeAttr', 'notEmpty', 'true');
    await expectResults(3, ['2020-03-03 03:03:03', '2020-02-02 22:22:22', '2020-01-01 11:11:11']);
  });

  // Double

  it('Double field - "equals" filter', async () => {
    await applyTextFilter(4, 'doubleAttr', 'equals', '8234.3462');
    await expectResults(4, ['8234.3462']);
  });

  it('Double field - "greater than" filter', async () => {
    await applyTextFilter(4, 'doubleAttr', 'greater', '0');
    await expectResults(4, ['8234.3462', '32.521']);
  });

  it('Double field - "greater than or equal" filter', async () => {
    await applyTextFilter(4, 'doubleAttr', 'greaterOrEqual', '0');
    await expectResults(4, ['0', '8234.3462', '32.521']);
  });

  it('Double field - "less than" filter', async () => {
    await applyTextFilter(4, 'doubleAttr', 'less', '32.521');
    await expectResults(4, ['0']);
  });

  it('Double field - "less than or equal" filter', async () => {
    await applyTextFilter(4, 'doubleAttr', 'lessOrEqual', '32.521');
    await expectResults(4, ['0', '32.521']);
  });

  it('Double field - "not equal" filter', async () => {
    await applyTextFilter(4, 'doubleAttr', 'notEqual', '0');
    await expectResults(4, ['8234.3462', '32.521']);
  });

  it('Double field - "is set" filter', async () => {
    await applySelectFilter(4, 'doubleAttr', 'notEmpty', 'true');
    await expectResults(4, ['0', '8234.3462', '32.521']);
  });

  it('Double field - "in" filter', async () => {
    await applyListFilter(4, 'doubleAttr', 'in', ['8234.3462', '32.521']);
    await expectResults(4, ['8234.3462', '32.521']);
  });

  it('Double field - "not in" filter', async () => {
    await applyListFilter(4, 'doubleAttr', 'notIn', ['8234.3462', '32.521']);
    await expectResults(4, ['0']);
  });

  // Integer

  it('Integer field - "equals" filter', async () => {
    await applyTextFilter(5, 'integerAttr', 'equals', '304221');
    await expectResults(5, ['304221']);
  });

  it('Integer field - "greater than" filter', async () => {
    await applyTextFilter(5, 'integerAttr', 'greater', '0');
    await expectResults(5, ['304221', '10482']);
  });

  it('Integer field - "greater than or equal" filter', async () => {
    await applyTextFilter(5, 'integerAttr', 'greaterOrEqual', '0');
    await expectResults(5, ['0', '304221', '10482']);
  });

  it('Integer field - "less than" filter', async () => {
    await applyTextFilter(5, 'integerAttr', 'less', '10482');
    await expectResults(5, ['0']);
  });

  it('Integer field - "less than or equal" filter', async () => {
    await applyTextFilter(5, 'integerAttr', 'lessOrEqual', '10482');
    await expectResults(5, ['0', '10482']);
  });

  it('Integer field - "not equal" filter', async () => {
    await applyTextFilter(5, 'integerAttr', 'notEqual', '0');
    await expectResults(5, ['304221', '10482']);
  });

  it('Integer field - "is set" filter', async () => {
    await applySelectFilter(5, 'integerAttr', 'notEmpty', 'true');
    await expectResults(5, ['0', '304221', '10482']);
  });

  it('Integer field - "in" filter', async () => {
    await applyListFilter(5, 'integerAttr', 'in', ['304221', '10482']);
    await expectResults(5, ['304221', '10482']);
  });

  it('Integer field - "not in" filter', async () => {
    await applyListFilter(5, 'integerAttr', 'notIn', ['304221', '10482']);
    await expectResults(5, ['0']);
  });

  // Long

  it('Long field - "equals" filter', async () => {
    await applyTextFilter(6, 'longAttr', 'equals', '984299284249651');
    await expectResults(6, ['984299284249651']);
  });

  it('Long field - "greater than" filter', async () => {
    await applyTextFilter(6, 'longAttr', 'greater', '0');
    await expectResults(6, ['984299284249651', '9223372036854776000']);
  });

  it('Long field - "greater than or equal" filter', async () => {
    await applyTextFilter(6, 'longAttr', 'greaterOrEqual', '0');
    await expectResults(6, ['0', '984299284249651', '9223372036854776000']);
  });

  it('Long field - "less than" filter', async () => {
    await applyTextFilter(6, 'longAttr', 'less', '984299284249651');
    await expectResults(6, ['0']);
  });

  it('Long field - "less than or equal" filter', async () => {
    await applyTextFilter(6, 'longAttr', 'lessOrEqual', '984299284249651');
    await expectResults(6, ['0', '984299284249651']);
  });

  it('Long field - "not equal" filter', async () => {
    await applyTextFilter(6, 'longAttr', 'notEqual', '0');
    await expectResults(6, ['984299284249651', '9223372036854776000']);
  });

  it('Long field - "is set" filter', async () => {
    await applySelectFilter(6, 'longAttr', 'notEmpty', 'true');
    await expectResults(6, ['0', '984299284249651', '9223372036854776000']);
  });

  it('Long field - "in" filter', async () => {
    await applyListFilter(6, 'longAttr', 'in', ['984299284249651', '9223372036854776000']);
    await expectResults(6, ['984299284249651', '9223372036854776000']);
  });

  it('Long field - "not in" filter', async () => {
    await applyListFilter(6, 'longAttr', 'notIn', ['984299284249651', '9223372036854776000']);
    await expectResults(6, ['0']);
  });

  // String

  it('String field - "contains" filter', async () => {
    await applyTextFilter(7, 'stringAttr', 'contains', 'or');
    await expectResults(7, ['dolor sit amet', 'Lorem Ipsum']);
  });

  it('String field - "equals" filter', async () => {
    await applyTextFilter(7, 'stringAttr', 'equals', 'Lorem Ipsum');
    await expectResults(7, ['Lorem Ipsum']);
  });

  it('String field - "in" filter', async () => {
    await applyListFilter(7, 'stringAttr', 'in', ['Lorem Ipsum']);
    await expectResults(7, ['Lorem Ipsum']);
  });

  it('String field - "not in" filter', async () => {
    await applyListFilter(7, 'stringAttr', 'notIn', ['Lorem Ipsum']);
    await expectResults(7, ['', 'dolor sit amet']);
  });

  it('String field - "not equals" filter', async () => {
    await applyTextFilter(7, 'stringAttr', 'notEqual', 'Lorem Ipsum');
    await expectResults(7, ['', 'dolor sit amet']);
  });

  it('String field - "does not contain" filter', async () => {
    await applyTextFilter(7, 'stringAttr', 'doesNotContain', 'or');
    await expectResults(7, ['']);
  });

  it('String field - "is set" filter', async () => {
    await applySelectFilter(7, 'stringAttr', 'notEmpty', 'true');
    await expectResults(7, ['', 'dolor sit amet', 'Lorem Ipsum']);
  });

  it('String field - "starts with" filter', async () => {
    await applyTextFilter(7, 'stringAttr', 'startsWith', 'Lo');
    await expectResults(7, ['Lorem Ipsum']);
  });

  it('String field - "ends with" filter', async () => {
    await applyTextFilter(7, 'stringAttr', 'endsWith', 'um');
    await expectResults(7, ['Lorem Ipsum']);
  });

  // Time

  it('Time field - "greater than" filter', async () => {
    await applyTimeFilter(8, 'timeAttr', 'greater', '10:00:00');
    await expectResults(8, ['22:22:22', '11:11:11']);
  });

  it('Time field - "less than" filter', async () => {
    await applyTimeFilter(8, 'timeAttr', 'less', '10:00:00');
    await expectResults(8, ['03:03:03']);
  });

  it('Time field - "is set" filter', async () => {
    await applySelectFilter(8, 'timeAttr', 'notEmpty', 'true');
    await expectResults(8, ['03:03:03', '22:22:22', '11:11:11']);
  });

  // UUID

  it('UUID field - "equals" filter', async () => {
    await applyTextFilter(9, 'uuidAttr', 'equals', 'db9faa31-dfa3-4b97-943c-ba268888cdc3');
    await expectResults(9, ['db9faa31-dfa3-4b97-943c-ba268888cdc3']);
  });

  it('UUID field - "not equal" filter', async () => {
    await applyTextFilter(9, 'uuidAttr', 'notEqual', 'db9faa31-dfa3-4b97-943c-ba268888cdc3');
    await expectResults(9, ['9b4188bf-c382-4b89-aedf-b6bcee6f2f76', 'c6a1cee6-f562-48a0-acbe-9625e0b278b1']);
  });

  it('UUID field - "in" filter', async () => {
    await applyListFilter(9, 'uuidAttr', 'in', ['db9faa31-dfa3-4b97-943c-ba268888cdc3', '9b4188bf-c382-4b89-aedf-b6bcee6f2f76']);
    await expectResults(9, ['db9faa31-dfa3-4b97-943c-ba268888cdc3', '9b4188bf-c382-4b89-aedf-b6bcee6f2f76']);
  });

  it('UUID field - "not in" filter', async () => {
    await applyListFilter(9, 'uuidAttr', 'notIn', ['db9faa31-dfa3-4b97-943c-ba268888cdc3', '9b4188bf-c382-4b89-aedf-b6bcee6f2f76']);
    await expectResults(9, ['c6a1cee6-f562-48a0-acbe-9625e0b278b1']);
  });

  it('UUID field - "is set" filter', async () => {
    await applySelectFilter(9, 'uuidAttr', 'notEmpty', 'true');
    await expectResults(9, ['db9faa31-dfa3-4b97-943c-ba268888cdc3', '9b4188bf-c382-4b89-aedf-b6bcee6f2f76', 'c6a1cee6-f562-48a0-acbe-9625e0b278b1']);
  });

  // LocalDateTime

  it('LocalDateTime field - "greater than" filter', async () => {
    await applyDateTimeFilter(10, 'localDateTimeAttr', 'greater', '2020-02-02', '01:00:00');
    await expectResults(10, ['2020-03-03 03:03:03', '2020-02-02 22:22:22']);
  });

  it('LocalDateTime field - "less than" filter', async () => {
    await applyDateTimeFilter(10, 'localDateTimeAttr', 'less', '2020-02-02', '01:00:00');
    await expectResults(10, ['2020-01-01 11:11:11']);
  });

  it('LocalDateTime field - "is set" filter', async () => {
    await applySelectFilter(10, 'localDateTimeAttr', 'notEmpty', 'true');
    await expectResults(10, ['2020-03-03 03:03:03', '2020-02-02 22:22:22', '2020-01-01 11:11:11']);
  });

  // OffsetDateTime

  it('OffsetDateTime field - "greater than" filter', async () => {
    await applyDateTimeFilter(11, 'offsetDateTimeAttr', 'greater', '2020-02-02', '01:00:00');
    await expectResults(11, ['2020-03-03 03:03:03', '2020-02-02 22:22:22']);
  });

  it('OffsetDateTime field - "less than" filter', async () => {
    await applyDateTimeFilter(11, 'offsetDateTimeAttr', 'less', '2020-02-02', '01:00:00');
    await expectResults(11, ['2020-01-01 11:11:11']);
  });

  it('OffsetDateTime field - "is set" filter', async () => {
    await applySelectFilter(11, 'offsetDateTimeAttr', 'notEmpty', 'true');
    await expectResults(11, ['2020-03-03 03:03:03', '2020-02-02 22:22:22', '2020-01-01 11:11:11']);
  });

  // LocalDate

  it('LocalDate field - "equals" filter', async () => {
    await applyDateFilter(12, 'localDateAttr', 'equals', '2020-02-02');
    await expectResults(12, ['2020-02-02']);
  });

  it('LocalDate field - "greater than" filter', async () => {
    await applyDateFilter(12, 'localDateAttr', 'greater', '2020-02-02');
    await expectResults(12, ['2020-03-03']);
  });

  it('LocalDate field - "greater than or equal" filter', async () => {
    await applyDateFilter(12, 'localDateAttr', 'greaterOrEqual', '2020-02-02');
    await expectResults(12, ['2020-03-03', '2020-02-02']);
  });

  it('LocalDate field - "less than" filter', async () => {
    await applyDateFilter(12, 'localDateAttr', 'less', '2020-02-02');
    await expectResults(12, ['2020-01-01']);
  });

  it('LocalDate field - "less than or equal" filter', async () => {
    await applyDateFilter(12, 'localDateAttr', 'lessOrEqual', '2020-02-02');
    await expectResults(12, ['2020-02-02', '2020-01-01']);
  });

  it('LocalDate field - "not equal" filter', async () => {
    await applyDateFilter(12, 'localDateAttr', 'notEqual', '2020-02-02');
    await expectResults(12, ['2020-03-03', '2020-01-01']);
  });

  it('LocalDate field - "in" filter', async () => {
    await applyDateListFilter(12, 'localDateAttr', 'in', ['2020-02-02', '2020-01-01']);
    await expectResults(12, ['2020-02-02', '2020-01-01']);
  });

  it('LocalDate field - "not in" filter', async () => {
    await applyDateListFilter(12, 'localDateAttr', 'notIn', ['2020-02-02', '2020-01-01']);
    await expectResults(12, ['2020-03-03']);
  });

  it('LocalDate field - "is set" filter', async () => {
    await applySelectFilter(12, 'localDateAttr', 'notEmpty', 'true');
    await expectResults(12, ['2020-03-03', '2020-02-02', '2020-01-01']);
  });

  // LocalTime

  it('LocalTime field - "greater than" filter', async () => {
    await applyTimeFilter(13, 'localTimeAttr', 'greater', '10:00:00');
    await expectResults(13, ['22:22:22', '11:11:11']);
  });

  it('LocalTime field - "less than" filter', async () => {
    await applyTimeFilter(13, 'localTimeAttr', 'less', '10:00:00');
    await expectResults(13, ['03:03:03']);
  });

  it('LocalTime field - "is set" filter', async () => {
    await applySelectFilter(13, 'localTimeAttr', 'notEmpty', 'true');
    await expectResults(13, ['03:03:03', '22:22:22', '11:11:11']);
  });

  // OffsetTime

  it('OffsetTime field - "greater than" filter', async () => {
    await applyTimeFilter(14, 'offsetTimeAttr', 'greater', '10:00:00');
    await expectResults(14, ['22:22:22', '11:11:11']);
  });

  it('OffsetTime field - "less than" filter', async () => {
    await applyTimeFilter(14, 'offsetTimeAttr', 'less', '10:00:00');
    await expectResults(14, ['03:03:03']);
  });

  it('OffsetTime field - "is set" filter', async () => {
    await applySelectFilter(14, 'offsetTimeAttr', 'notEmpty', 'true');
    await expectResults(14, ['03:03:03', '22:22:22', '11:11:11']);
  });

  // Association O2O

  it('Association O2O field - "equals" filter', async () => {
    await applySelectFilter(17, 'associationO2Oattr', 'equals', '1a8f4cd6-bc3a-46ef-8816-dda6ad484137');
    await expectResults(17, ['ASSOCIATION-O2O-1'])
  })

  it('Association O2O field - "not equal" filter', async () => {
    await applySelectFilter(17, 'associationO2Oattr', 'notEqual', '1a8f4cd6-bc3a-46ef-8816-dda6ad484137');
    await expectResults(17, ['ASSOCIATION-O2O-2'])
  })

  it('Association O2O field - "in" filter"', async () => {
    await applySelectListFilter(17, 'associationO2Oattr', 'in', ['1a8f4cd6-bc3a-46ef-8816-dda6ad484137']);
    await expectResults(17, ['ASSOCIATION-O2O-1']);
  });

  it('Association O2O field - "not in" filter"', async () => {
    await applySelectListFilter(17, 'associationO2Oattr', 'notIn', ['1a8f4cd6-bc3a-46ef-8816-dda6ad484137']);
    await expectResults(17, ['ASSOCIATION-O2O-2']);
  });

  it('Association O2O field - "is set" filter', async () => {
    await applySelectFilter(17, 'associationO2Oattr', 'notEmpty', 'true');
    await expectResults(17, ['ASSOCIATION-O2O-2', 'ASSOCIATION-O2O-1']);
  });

  // Association M2O

  it('Association M2O field - "equals" filter', async () => {
    await applySelectFilter(18, 'associationM2Oattr', 'equals', 'f6a3afc1-2c68-437c-9654-baf0035e34d0');
    await expectResults(18, ['ASSOCIATION-M2O-1'])
  })

  it('Association M2O field - "not equal" filter', async () => {
    await applySelectFilter(18, 'associationM2Oattr', 'notEqual', 'f6a3afc1-2c68-437c-9654-baf0035e34d0');
    await expectResults(18, ['ASSOCIATION-M2O-2'])
  })

  it('Association M2O field - "in" filter"', async () => {
    await applySelectListFilter(18, 'associationM2Oattr', 'in', ['f6a3afc1-2c68-437c-9654-baf0035e34d0']);
    await expectResults(18, ['ASSOCIATION-M2O-1']);
  });

  it('Association M2O field - "not in" filter"', async () => {
    await applySelectListFilter(18, 'associationM2Oattr', 'notIn', ['f6a3afc1-2c68-437c-9654-baf0035e34d0']);
    await expectResults(18, ['ASSOCIATION-M2O-2']);
  });

  it('Association M2O field - "is set" filter', async () => {
    await applySelectFilter(18, 'associationM2Oattr', 'notEmpty', 'true');
    await expectResults(18, ['ASSOCIATION-M2O-2', 'ASSOCIATION-M2O-1']);
  });

  // Composition O2O

  it('Composition O2O field - "equals" filter', async () => {
    await applySelectFilter(19, 'compositionO2Oattr', 'equals', '76b5eb8c-522c-40ab-bd00-c761353684b3');
    await expectResults(19, ['COMPOSITION-O2O-1'])
  })

  it('Composition O2O field - "not equal" filter', async () => {
    await applySelectFilter(19, 'compositionO2Oattr', 'notEqual', '76b5eb8c-522c-40ab-bd00-c761353684b3');
    await expectResults(19, ['COMPOSITION-O2O-2'])
  })

  it('Composition O2O field - "in" filter"', async () => {
    await applySelectListFilter(19, 'compositionO2Oattr', 'in', ['76b5eb8c-522c-40ab-bd00-c761353684b3']);
    await expectResults(19, ['COMPOSITION-O2O-1']);
  });

  it('Composition O2O field - "not in" filter"', async () => {
    await applySelectListFilter(19, 'compositionO2Oattr', 'notIn', ['76b5eb8c-522c-40ab-bd00-c761353684b3']);
    await expectResults(19, ['COMPOSITION-O2O-2']);
  });

  it('Composition O2O field - "is set" filter', async () => {
    await applySelectFilter(19, 'compositionO2Oattr', 'notEmpty', 'true');
    await expectResults(19, ['COMPOSITION-O2O-2', 'COMPOSITION-O2O-1']);
  });
});

const inDiv = (text) => `<div>${text}</div>`;

const checkboxOn = '<label class="ant-checkbox-wrapper ant-checkbox-wrapper-checked ant-checkbox-wrapper-disabled"><span class="ant-checkbox ant-checkbox-checked ant-checkbox-disabled"><input type="checkbox" disabled="" class="ant-checkbox-input" value="" checked=""><span class="ant-checkbox-inner"></span></span></label>';
const checkboxOff = '<label class="ant-checkbox-wrapper ant-checkbox-wrapper-disabled"><span class="ant-checkbox ant-checkbox-disabled"><input type="checkbox" disabled="" class="ant-checkbox-input" value=""><span class="ant-checkbox-inner"></span></span></label>';
