const {login} = require("../common/login-to-scr");
const puppeteer = require("puppeteer");

describe('car browse components for mechanic', () => {

  let page;

  beforeAll(async () => {
    page = await (await puppeteer.launch()).newPage();
    await login(page,'mechanic', '1');
  });

  it('should check that car cards are loaded for mechanic', async () => {

    await page.goto('http://localhost:3000/#/carManagement');
    await page.waitFor('div.ant-card');
    const carCards = await page.$$('div.ant-card');
    expect(carCards.length).toEqual(8);

    const carCaptions = await page.$$eval('div.ant-card-head > div > div', els => els.map(el => el.innerHTML));

    expect(carCaptions).toEqual([
      'VAZ - 2121',
      'ZAZ - 968M',
      'GAZ - 2410',
      'AZLK - 2141',
      'bmw - X0',
      'Porshe - 911',
      'Tesla - Model Y',
      'Mercedes - ']);
  });

  it('should check that car list is loaded for mechanic', async () => {

    await page.goto('http://localhost:3000/#/carManagement2');
    await page.waitFor('div.ant-list');
    const carListItems = await page.$$('li.ant-list-item');
    expect(carListItems.length).toEqual(8);

    const carManufacturers = await page.$$eval('div.ant-list li > div > div:nth-child(1)'
      , elements => elements.map(el => el.innerText.split(':')[1]));

    expect(carManufacturers).toEqual([
      ' VAZ',
      ' ZAZ',
      ' GAZ',
      ' AZLK',
      ' bmw',
      ' Porshe',
      ' Tesla',
      ' Mercedes']);
  });

  afterAll(async done => {
    page.browser().close();
    done();
  });

});
