const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://www.amazon.com/s?i=computers-intl-ship&bbn=16225007011&rh=n%3A16225007011%2Cn%3A11036071&page=8&qid=1711985137&ref=sr_pg_8', {
        waitUntil: "load"
    });
    const is_disabled = await page.$('.s-pagination-item.s-pagination-next.s-pagination-disabled') !== null;
    console.log(is_disabled)
    await browser.close();
})();