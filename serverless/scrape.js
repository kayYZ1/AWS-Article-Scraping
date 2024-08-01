const chromium = require("@sparticuz/chromium");
const { default: puppeteer } = require("puppeteer-core");
const {
  scrapeForbes,
  scrapePolityka,
  scrapeWPolityce,
} = require("./functions");

async function scrape(searchValue, websites) {
  const browser = await puppeteer.launch({
    args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });

  const scrapeAndConcatenate = async (sources, searchValue, browser) => {
    const results = await Promise.all(sources.map(source => source(searchValue, browser)));
    return results.flat();
  };

  try {
    let articles = [];
    const sourceMap = {
      "Forbes": scrapeForbes,
      "Polityka": scrapePolityka,
      "wPolityce": scrapeWPolityce
    };

    if (websites.length === 2) {
      if (websites.includes("Forbes") && websites.includes("Polityka")) {
        articles = await scrapeAndConcatenate([scrapeForbes, scrapePolityka], searchValue, browser);
      } else if (websites.includes("wPolityce") && websites.includes("Polityka")) {
        articles = await scrapeAndConcatenate([scrapeWPolityce, scrapePolityka], searchValue, browser);
      } else {
        articles = await scrapeAndConcatenate([scrapeForbes, scrapeWPolityce], searchValue, browser);
      }
    } else if (websites.length === 1) {
      articles = await scrapeAndConcatenate([sourceMap[websites[0]]], searchValue, browser);
    } else {
      articles = await scrapeAndConcatenate([scrapeWPolityce, scrapePolityka, scrapeForbes], searchValue, browser);
    }

    return articles.length ? articles : [];
  } finally {
    await browser.close();
  }
}

module.exports = { scrape };
