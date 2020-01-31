const {login} = require("../common/login-to-scr");
const puppeteer = require("puppeteer");

describe('app-start', () => {

  let page;

  beforeAll(async () => {
    page = await (await puppeteer.launch()).newPage();
  });

  it('should check that app started', async () => {
    await page.goto('http://localhost:3000/#/');
    await expect(page.title()).resolves.toMatch('sample-car-rent');
  });

  it('should login in generated app', async () => {
    await login(page);
    const name = await page.$eval('main > div', el => el.innerHTML);
    await expect(name).toMatch('Welcome to sample-car-rent!');
  });

  afterAll(async done => {
    page.browser().close();
    done();
  });


});
