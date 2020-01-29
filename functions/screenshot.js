const puppeteer = require('puppeteer');

const screenshot = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({
    width: 1280,
    height: 800,
  });
  // 'https://codesnacks.net/'
  await page.goto(url);
  await page.screenshot({
    path: 'codesnacks.png',
    fullPage: true,
  });

  await browser.close();
};

exports = screenshot;
