const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  const filePath = `file://${path.resolve('index.html')}`;
  console.log(`Navigating to ${filePath}`);
  
  await page.goto(filePath, { waitUntil: 'networkidle0' });
  
  const navStatus = await page.evaluate(() => {
    const nav = document.querySelector('nav');
    const aList = document.querySelectorAll('nav a');
    const computedStyle = window.getComputedStyle(nav);
    
    return {
      navExists: !!nav,
      display: computedStyle.display,
      classes: nav.className,
      links: Array.from(aList).map(a => ({
         href: a.getAttribute('href'),
         text: a.textContent.trim(),
         classes: a.className,
         display: window.getComputedStyle(a).display
      })),
      windowWidth: window.innerWidth,
      mobileMenuBtnVisible: window.getComputedStyle(document.getElementById('mobile-menu-btn')).display
    };
  });
  
  console.log(JSON.stringify(navStatus, null, 2));
  
  await page.screenshot({ path: 'debug_screenshot.png' });
  await browser.close();
})();
