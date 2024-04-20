const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors"); // Import the cors middleware

const app = express();

// Enable CORS for all routes
app.use(cors());

app.get("/scrape", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
    await page.goto(
      "https://www.amazon.com/s?i=specialty-aps&bbn=16225007011&rh=n%3A16225007011%2Cn%3A11036071&ref=nav_em__nav_desktop_sa_intl_servers_0_2_6_13"
    );

    let items = [];
    let isBtnDisabled = false;
    while (!isBtnDisabled) {
      await page.waitForSelector('[data-cel-widget="search_result_1"]');

      const productsHandles = await page.$$(
        "div.s-main-slot.s-result-list.s-search-results.sg-row > .s-result-item "
      );

      for (const productHandle of productsHandles) {
        let title = "Null";
        let price = "Null";
        let image = "Null";
        try {
          title = await page.evaluate(
            (el) => el.querySelector("h2 > a > span").textContent,
            productHandle
          );
        } catch (error) {}
        try {
          price = await page.evaluate(
            (el) => el.querySelector(".a-price > .a-offscreen").textContent,
            productHandle
          );
        } catch (error) {}
        try {
          image = await page.evaluate(
            (el) => el.querySelector(".s-image").getAttribute("src"),
            productHandle
          );
        } catch (error) {}
        if (title !== "Null") {
          items.push({ title, price, image });
        }
      }

      try {
        await page.waitForSelector(
          "a.s-pagination-item.s-pagination-next.s-pagination-button.s-pagination-separator",
          { visible: true, timeout: 5000 }
        );
        await Promise.all([
          page.click(
            "a.s-pagination-item.s-pagination-next.s-pagination-button.s-pagination-separator"
          ),
          page.waitForNavigation({ waitUntil: "networkidle2" }),
        ]);
      } catch (error) {
        isBtnDisabled = true;
      }
    }

    await browser.close();

    res.json(items);
  } catch (error) {
    
    console.error('Error scraping items:', error);
    res.status(500).json({ error: 'An error occurred while scraping items.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
