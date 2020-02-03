const {login} = require("../common/login-to-scr");
const puppeteer = require("puppeteer");

describe('car editor security', () => {

  const expectFieldLabels = [
    'Manufacturer',
    'Model',
    'Reg Number',
    'Purchase Date',
    'Manufacture date',
    'Wheel On Right',
    'Type',
    'Eco Rank',
    'Max Passengers',
    'Price',
    'Mileage',
    'Garage',
    'Technical Certificate',
    'Photo'];

  it('should check that security shows all car fields on editor for admin', async () => {
    const page = await (await puppeteer.launch()).newPage();
    await login(page);

    await page.goto('http://localhost:3000/#/carManagement/3da61043-aaad-7e30-c7f5-c1f1328d3980');
    await page.waitFor('div.ant-card-body');

    const fieldLabels = await page.$$eval('div.ant-col.ant-form-item-label',
      elements => elements.map(el => el.innerText));

    expect(fieldLabels).toEqual(expectFieldLabels);

    page.browser().close();
  });

  it('should check that security shows all car fields on editor for mechanic', async () => {
    const page = await (await puppeteer.launch()).newPage();
    await login(page, 'mechanic', '1');

    await page.goto('http://localhost:3000/#/carManagement/3da61043-aaad-7e30-c7f5-c1f1328d3980');
    await page.waitFor('div.ant-card-body');

    const fieldLabels = await page.$$eval('div.ant-col.ant-form-item-label',
      elements => elements.map(el => el.innerText));

    expect(fieldLabels).toEqual(expectFieldLabels);

    page.browser().close();
  });

  it('should check that security shows all car fields on editor for manager', async () => {
    const page = await (await puppeteer.launch()).newPage();
    await login(page, 'manager', '2');

    await page.goto('http://localhost:3000/#/carManagement/3da61043-aaad-7e30-c7f5-c1f1328d3980');
    await page.waitFor('div.ant-card-body');

    const fieldLabels = await page.$$eval('div.ant-col.ant-form-item-label',
      elements => elements.map(el => el.innerText));

    expect(fieldLabels).toEqual(expectFieldLabels);

    page.browser().close();
  });

});