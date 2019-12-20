describe('app-start', () => {

  beforeAll(async () => {
    await page.goto('http://localhost:3000/#/');
  });

  it('should check that app started', async () => {
    await page.goto('http://localhost:3000/#/');
    await expect(page.title()).resolves.toMatch('scr');
  });

  it('should login in generated app', async () => {
    await page.waitFor('#input_login');
    await page.type('#input_login', 'mechanic');

    await page.waitFor('#input_password');
    await page.type('#input_password', '1');

    await page.click('div.login-form button[type="submit"]');

    await page.waitFor('main > div');
    const name = await page.$eval('main > div', el => el.innerHTML);
    await expect(name).toMatch('Welcome to scr!');
  });
});
