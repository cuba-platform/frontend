
exports.checkPaging = (rowSelector) => async (page, url, [cardsCount, buttonTitles]) => {
  await page.goto(`http://localhost:3000/#/${url}`);
  await page.reload();
  await page.waitFor(rowSelector);
  await page.waitFor('ul.ant-pagination li');

  const carCards = await page.$$(rowSelector);
  if (cardsCount != null) expect(carCards.length).toEqual(cardsCount);

  const pagingButtonCaptions = await page
    .$$eval('ul.ant-pagination li', els => els.map(el => el.getAttribute('title')));
  expect(pagingButtonCaptions).toEqual(buttonTitles);
};
