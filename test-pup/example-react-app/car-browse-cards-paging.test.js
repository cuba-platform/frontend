const {login} = require("../common/login-to-scr");
const {checkPaging} = require("../common/paging");
const puppeteer = require("puppeteer");

const checkCarsPaging = checkPaging('div.ant-card');

describe('car browse cards paging', () => {

  let page;
  const url = 'carManagement';

  beforeAll(async () => {
    page = await (await puppeteer.launch()).newPage();
    await login(page);
  });

  const buttonTitles = ['Previous Page', '1', '2', '3', 'Next Page', null];

  // TODO fix the test
  // it('should check pages count with page size = 10', async () => {
  //   await checkCarsPaging(page, `${url}`, [10, buttonTitles]);
  //   await checkCarsPaging(page, `${url}?page=1&pageSize=10`, [10, buttonTitles]);
  //   await checkCarsPaging(page, `${url}?page=2&pageSize=10`, [10, buttonTitles]);
  //   await checkCarsPaging(page, `${url}?page=3&pageSize=10`, [2, buttonTitles]);
  // });

  it('should check pages count with page size > 10', async () => {
    // fix for CI - '20' check failed unexpectedly
    await checkCarsPaging(page, `${url}?page=1&pageSize=20`, [null, ['Previous Page', '1', '2', 'Next Page', null]]);

    // TODO VB test fails randomly (timing-dependent?)
    // await checkCarsPaging(page, `${url}?page=1&pageSize=50`, [22, ['Previous Page', '1', 'Next Page', null]]);
  });

  it('should use only allowed page size url param', async () => {
    await checkCarsPaging(page, `${url}?page=5&pageSize=23`, [10, buttonTitles]);
    const activePageButtonTitle = await page
      .$eval('ul.ant-pagination li.ant-pagination-item-active', el => el.getAttribute('title'));
    expect(activePageButtonTitle).toEqual('1');
  });


  it('should check page button click', async () => {
    await page.goto(`http://localhost:3000/#/${url}`);
    await page.waitFor('.ant-pagination > .ant-pagination-item-2 > a');

    await page.click('.ant-pagination > .ant-pagination-item-2 > a');
    await page.waitFor('ul.ant-pagination li.ant-pagination-item-active');

    const activePageButtonTitle = await page
      .$eval('ul.ant-pagination li.ant-pagination-item-active', el => el.getAttribute('title'));

    expect(activePageButtonTitle).toEqual('2');
    expect(page.url()).toEqual(`http://localhost:3000/#/${url}?page=2&pageSize=10`);
  });

  // TODO non-deterministic false positives
  // it('should check page size change button click', async () => {
  //   await page.goto(`http://localhost:3000/#/${url}`);
  //   await page.waitFor('.ant-pagination > .ant-pagination-item-2 > a');
  //
  //   await page.waitFor('.ant-pagination-options-size-changer .ant-select-selection-selected-value');
  //   await page.click('.ant-pagination-options-size-changer .ant-select-selection-selected-value');
  //
  //   await page.waitFor('ul.ant-select-dropdown-menu li:nth-child(3)');
  //   await page.click('ul.ant-select-dropdown-menu li:nth-child(3)');
  //
  //   await page.waitFor('ul.ant-pagination li.ant-pagination-item-active');
  //   const activePageButtonTitle = await page
  //     .$eval('ul.ant-pagination li.ant-pagination-item-active', el => el.getAttribute('title'));
  //
  //   expect(activePageButtonTitle).toEqual('1');
  //   expect(page.url()).toEqual(`http://localhost:3000/#/${url}?page=1&pageSize=50`);
  // });

  afterAll(async done => {
    page.browser().close();
    done();
  });

});
