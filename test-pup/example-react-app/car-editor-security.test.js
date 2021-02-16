const {login} = require("../common/login-to-scr");
const puppeteer = require("puppeteer");

xdescribe('car editor security - mechanic', () => {

  let pageMech;
  let pageMan;
  let pageAdmin;

  beforeAll(async () => {
    pageAdmin = await (await puppeteer.launch()).newPage();
    pageMech = await (await puppeteer.launch()).newPage();
    pageMan = await (await puppeteer.launch()).newPage();
  });

  it('should check that security shows only allowed car fields on editor for mechanic', async () => {

    await login(pageMech, 'mechanic', '1');

    await pageMech.goto('http://localhost:3000/#/carManagement/3da61043-aaad-7e30-c7f5-c1f1328d3980');
    await pageMech.waitFor('div.ant-card-body');

    const fieldLabels = await pageMech.$$eval('div.ant-col.ant-form-item-label',
      elements => elements.map(el => el.innerText));

    expect(fieldLabels).toEqual(['Manufacturer', 'Model', 'Type', 'Mileage']);

    // Mileage input exists and it's disabled
    const disabledMileageInput = await pageMech.$$('input#mileage[disabled]');
    expect(disabledMileageInput.length).toEqual(1);
  });


  it('should check that security shows only allowed car fields on editor for manager', async () => {

    await login(pageMan, 'manager', '2');

    await pageMan.goto('http://localhost:3000/#/carManagement/3da61043-aaad-7e30-c7f5-c1f1328d3980');
    await pageMan.waitFor('div.ant-card-body');

    const fieldLabels = await pageMan.$$eval('div.ant-col.ant-form-item-label',
      elements => elements.map(el => el.innerText));

    expect(fieldLabels).toEqual(['Manufacturer', 'Model', 'Reg Number', 'Type']);
  });


  it('should check that security shows all car fields on editor for admin', async () => {
    await login(pageAdmin);

    await pageAdmin.goto('http://localhost:3000/#/carManagement/3da61043-aaad-7e30-c7f5-c1f1328d3980');
    await pageAdmin.waitFor('div.ant-card-body');

    const fieldLabels = await pageAdmin.$$eval('div.ant-col.ant-form-item-label',
      elements => elements.map(el => el.innerText));

    expect(fieldLabels).toEqual([
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
      'Photo']);
  });

  afterAll(async done => {
    await pageAdmin.browser().close();
    await pageMech.browser().close();
    await pageMan.browser().close();
    done();
  });

});