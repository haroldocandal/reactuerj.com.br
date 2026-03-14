const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto(`file://${__dirname}/index.html`, { waitUntil: 'networkidle0' });
  
  const navStatus = await page.evaluate(() => {
    return {
      navDesktop: window.getComputedStyle(document.querySelector('nav')).display,
      navMobileBtnDiv: window.getComputedStyle(document.querySelector('#mobile-menu-btn').parentElement).display,
      lucideMenuIcon: document.querySelector('#menu-icon-open').tagName,
      windowWidth: window.innerWidth
    };
  });
  
  console.log(JSON.stringify(navStatus, null, 2));
  await browser.close();
})();
