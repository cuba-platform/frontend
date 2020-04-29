exports.login = async (page, login = 'admin', password = 'admin') => {
  await page.goto('http://localhost:3000/#/');
  await page.waitFor('#input_login');
  await page.type('#input_login', login);

  await page.waitFor('#input_password');
  await page.type('#input_password', password);

  await page.click('div.login-form button[type="submit"]');
  await page.waitFor('main > div');
};

exports.logout = async (page) => {
  await page.waitFor('#button_logout');
  await page.click('#button_logout');

  await page.waitFor('div.ant-modal-content', {visible: true});
  await page.waitFor('div.ant-modal-content > div > div > div.ant-modal-confirm-btns > button.ant-btn.ant-btn-primary', {visible: true});
  await page.click('div.ant-modal-content > div > div > div.ant-modal-confirm-btns > button.ant-btn.ant-btn-primary');
  await page.waitFor('div.login-form');

  // todo we have issue here - antd modal won't disappear after confirmation button is pressed
};


