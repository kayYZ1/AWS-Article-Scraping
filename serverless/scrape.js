const chromium = require("@sparticuz/chromium");
const { default: puppeteer } = require("puppeteer-core");
const {
  scrapeForbes,
  scrapePolityka,
  scrapeWPolityce,
} = require("./functions");

async function scrape(searchValue, websites) {
  //AWS
  const browser = await puppeteer.launch({
    args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });

  //Locally
  /*const browser = await puppeteer.launch({
    headless: "new",
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome",
  });*/

  let wPolityce, polityka, forbes, articles;

  if (websites.length === 2) {
    if (websites.includes("Forbes") && websites.includes("Polityka")) {
      forbes = await scrapeForbes(searchValue, browser);
      polityka = await scrapePolityka(searchValue, browser);

      articles = polityka.concat(forbes);
      return articles ? articles : [];
    } else if (
      websites.includes("wPolityce") &&
      websites.includes("Polityka")
    ) {
      wPolityce = await scrapeWPolityce(searchValue, browser);
      polityka = await scrapePolityka(searchValue, browser);

      articles = wPolityce.concat(polityka);
      return articles ? articles : [];
    } else {
      forbes = await scrapeForbes(searchValue, browser);
      wPolityce = await scrapeWPolityce(searchValue, browser);

      articles = wPolityce.concat(forbes);
      return articles ? articles : [];
    }
  } else if (websites.length === 1) {
    if (websites.includes("Forbes")) {
      forbes = await scrapeForbes(searchValue, browser);
      return forbes ? forbes : [];
    } else if (websites.includes("Polityka")) {
      polityka = await scrapePolityka(searchValue, browser);
      return polityka ? polityka : [];
    } else {
      wPolityce = await scrapeWPolityce(searchValue, browser);
      return wPolityce ? wPolityce : [];
    }
  } else {
    wPolityce = await scrapeWPolityce(searchValue, browser);
    polityka = await scrapePolityka(searchValue, browser);
    forbes = await scrapeForbes(searchValue, browser);

    articles = wPolityce.concat(polityka, forbes);
    return articles;
  }
}

module.exports = { scrape };
