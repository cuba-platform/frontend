const {login} = require("../../../common/login-to-scr");
const puppeteer = require("puppeteer");

// TODO Add "is not set" tests once https://github.com/cuba-platform/frontend/issues/124 is fixed

// TODO Modify "not in"/"not equal" tests once https://github.com/cuba-platform/frontend/issues/122 is fixed
// TODO (currently only String fields are correctly including empty values in the result)

// TODO Add "equals"/"not equal", "greater/less or equal", "in"/"not in" tests for date/time and time types
// TODO once https://github.com/cuba-platform/frontend/issues/123 is fixed

const inDiv = (text) => `<div>${text}</div>`;

class FilterActions {
  beforeAll = async () => {
    this.browser = await puppeteer.launch();
    this.page = await this.browser.newPage();
    await login(this.page, 'admin', 'admin');
  };

  beforeEach = async () => {
    await Promise.all([
      this.page.goto('http://localhost:3000/#/'),
      this.page.waitForNavigation()
    ]);
    await Promise.all([
      this.page.goto('http://localhost:3000/#/datatypesManagement3'),
      this.page.waitForNavigation()
    ]);
    await this.page.waitForSelector('.ant-table-tbody:not(:empty)'); // Wait until the data is loaded.
  };

  afterAll = async () => {
    await this.page.close();
    await this.browser.close();
  };

  /**
   *
   * @returns {!Promise<!Object|undefined>} a promise that resolves into a 2D array
   * (array of rows, row is an array of cells).
   * To get a cell use `table[rowIndex][columnIndex]`.
   */
  readTable = async () => {
    return this.page.$$eval('.ant-table-tbody > tr', rows => {
      return rows.map(row => {
        const cells = [...row.getElementsByTagName('td')].slice(1); // Slice away the selection column.
        return cells.map(cell => {
          return cell.innerHTML;
        });
      });
    });
  };

  openFilter = async (columnIndex) => {
    const filterSelector = `.ant-table-thead > tr > th:nth-child(${columnIndex + 2}) > i`;
    await this.page.$eval(filterSelector, e => e.click());
    await this.page.waitForSelector('.ant-dropdown:not(.ant-dropdown-hidden)');
  };

  typeTextIntoInput = async (selector, text) => {
    await this.page.waitForSelector(selector);
    await this.page.type(selector, text);
  };

  setInputValue = async (attr, value) => {
    const inputSelector = `#${attr}_input`;
    await this.typeTextIntoInput(inputSelector, value);
  };

  setSelectValue = async (attr, value) => {
    const inputSelector = `#${attr}_input`;
    // Open the dropdown.
    await this.page.$eval(inputSelector, element => element.click());
    const dropdownSelector = `.cuba-value-dropdown-${attr}`;
    const optionClassName = `cuba-filter-value-${value}`;
    const optionSelector = `${dropdownSelector} .${optionClassName}`;
    await this.page.$eval(optionSelector, element => element.click());
    await this.page.waitForSelector(`.cuba-value-dropdown-${attr}.ant-select-dropdown-hidden`);
  };

  setOperator = async (attr, operator) => {
    await this.page.$eval(`#${attr}_operatorsDropdown`, element => element.click()); // Opens dropdown.
    const dropdownSelector = `.cuba-operator-dropdown-${attr}`;
    const optionClassName = `cuba-operator-${operator}`;
    const optionSelector = `${dropdownSelector} .${optionClassName}`;
    await this.page.$eval(optionSelector, element => element.click());
    await this.page.waitForSelector(`.cuba-operator-dropdown-${attr}.ant-select-dropdown-hidden`);
  };

  applyFilter = async () => {
    const submitBtnSelector = '.ant-dropdown:not(.ant-dropdown-hidden) .cuba-table-filter > .footer > button[type="submit"]';
    await this.page.$eval(submitBtnSelector, e => e.click());
    await this.page.waitForSelector('.ant-spin'); // Wait to start loading.
    await this.page.waitForSelector('.ant-spin', {hidden: true}); // Wait to finish loading.
  };

  expectResults = async (columnIndex, resultsArray, areResultsWrappedInDivs = true) => {
    const table = await this.readTable();
    resultsArray.forEach((result, index) => {
      expect(table[index][columnIndex]).toEqual(areResultsWrappedInDivs ? inDiv(result) : result);
    });
    expect(table.length).toEqual(resultsArray.length);
  };

  // noinspection JSUnusedLocalSymbols
  $TAKE_DEBUG_SCREENSHOT = async () => {
    await this.page.screenshot({path: 'debug-screenshot.png', fullPage: true});
  };

  applyTextFilter = async (columnIndex, attr, operator, value) => {
    await this.openFilter(columnIndex);
    await this.setOperator(attr, operator);
    await this.setInputValue(attr, value);
    await this.applyFilter();
  };

  applySelectFilter = async (columnIndex, attr, operator, value) => {
    await this.openFilter(columnIndex);
    await this.setOperator(attr, operator);
    await this.setSelectValue(attr, value);
    await this.applyFilter();
  };

  addListItem = async (attr, value) => {
    await this.page.$eval('.cuba-list-editor-input', e => e.click()); // Clicking on "+ Add Item"
    const listInputSelector = '.filtercontrol.-complex-editor input';
    await this.typeTextIntoInput(listInputSelector, value);
    await this.page.keyboard.press('Enter');
    await this.page.waitForSelector('.cuba-list-editor-input'); // Wait until "+ Add Item" button appears again.
  };

  applyListFilter = async (columnIndex, attr, operator, values) => {
    await this.openFilter(columnIndex);
    await this.setOperator(attr, operator);
    for (const i in values) {
      // noinspection JSUnfilteredForInLoop
      await this.addListItem(attr, values[i]);
    }
    await this.applyFilter();
  };

  applyDateListFilter = async (columnIndex, attr, operator, values) => {
    await this.openFilter(columnIndex);
    await this.setOperator(attr, operator);
    for (const i in values) {
      // noinspection JSUnfilteredForInLoop
      await this.addDateListItem(attr, values[i]);
    }
    await this.applyFilter();
  };

  applySelectListFilter = async (columnIndex, attr, operator, values) => {
    await this.openFilter(columnIndex);
    await this.setOperator(attr, operator);
    for (const i in values) {
      // noinspection JSUnfilteredForInLoop
      await this.addSelectListItem(attr, values[i]);
    }
    await this.applyFilter();
  };

  addSelectListItem = async(attr, value) => {
    // Click "+ Add Item". Dropdown appears.
    await this.page.$eval('.cuba-list-editor-input', e => e.click());
    // Open dropdown
    const listInputSelector = '.filtercontrol.-complex-editor .ant-select-selection';
    await this.page.click(listInputSelector);
    // Click the right option
    const dropdownSelector = `.cuba-value-dropdown-${attr}`;
    const optionClassName = `cuba-filter-value-${value}`;
    const optionSelector = `${dropdownSelector} .${optionClassName}`;
    await this.page.$eval(optionSelector, element => element.click());
    // Wait until "+ Add Item" button appears again.
    await this.page.waitForSelector('.cuba-list-editor-input');
  };

  addDateListItem = async (attr, date) => {
    // Click "+ Add Item". Dropdown appears.
    await this.page.$eval('.cuba-list-editor-input', e => e.click());
    // Open DatePicker
    const listInputSelector = '.filtercontrol.-complex-editor .ant-calendar-picker-input';
    await this.page.$eval(listInputSelector, e => e.click());
    await this.page.waitForSelector('.ant-calendar-input', {hidden: false});
    await this.page.type('.ant-calendar-input', date);
    await this.page.waitForSelector('.ant-calendar-input', {hidden: true});
    await this.page.waitForSelector('.cuba-list-editor-input'); // Wait until "+ Add Item" button appears again.
  };

  setDate = async (attr, date) => {
    const dateInputSelector = `#${attr}_input > div > input`;
    await this.page.click(dateInputSelector);
    await this.page.waitForSelector('.ant-calendar-input', {hidden: false});
    await this.page.type('.ant-calendar-input', date);
    await this.page.keyboard.press('Enter');
    await this.page.waitForSelector('.ant-calendar-input', {hidden: true});
  };

  setTime = async (attr, time) => {
    const timeInputSelector = `input#${attr}_input`;
    await this.page.click(timeInputSelector);
    await this.page.waitForSelector('.ant-time-picker-panel-combobox', {hidden: false});
    await this.page.type('.ant-time-picker-panel-input', time);
    await this.page.keyboard.press('Escape');
    await this.page.waitForSelector('.ant-time-picker-panel-combobox', {hidden: true});
  };

  applyDateFilter = async (columnIndex, attr, operator, date) => {
    await this.openFilter(columnIndex);
    await this.setOperator(attr, operator);
    await this.setDate(attr, date);
    await this.applyFilter();
  };

  applyTimeFilter = async (columnIndex, attr, operator, time) => {
    await this.openFilter(columnIndex);
    await this.setOperator(attr, operator);
    await this.setTime(attr, time);
    await this.applyFilter();
  };

  applyDateTimeFilter = async (columnIndex, attr, operator, date, time) => {
    await this.openFilter(columnIndex);
    await this.setOperator(attr, operator);
    await this.setDate(attr, date);
    await this.setTime(attr, time);
    await this.applyFilter();
  };

}

module.exports = FilterActions;
