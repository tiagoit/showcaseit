const puppeteer = require('puppeteer');
var uuidv1 = require('uuid/v1');

const screenshot = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const fileName = `${uuidv1()}.png` 

  await page.setViewport({
    width: 1280,
    height: 800,
  });
  await page.goto(url);
  await page.screenshot({
    path: fileName,
    fullPage: true,
  });

  await browser.close();
  return fileName;
};

module.exports = screenshot;
