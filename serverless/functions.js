const scrapeForbes = async (searchValue, browser) => {
  try {
    const page = await browser.newPage();
    await page.setRequestInterception(true);

    page.on("request", (request) => {
      if (
        ["image", "stylesheet", "font"].indexOf(request.resourceType()) !== -1
      ) {
        request.abort();
      } else {
        request.continue();
      }
    });

    await page.goto(`https://www.forbes.pl/szukaj?q=${searchValue}`, {
      waitUntil: "domcontentloaded",
    });

    await page.waitForSelector(".searchResults", { visible: true });

    const articles = await page.evaluate((searchValue) => {
      const articles = document.querySelectorAll(".searchResults");
      return Array.from(articles).map((article) => {
        const articleLink = article.querySelector("li > a");
        if (articleLink) {
          const titleElement = articleLink.querySelector("h2");
          const title = titleElement.textContent;

          const descriptionElement = articleLink.querySelector("p");
          const description = descriptionElement.textContent;

          const len = searchValue.length;
          const searchValueImproved = searchValue.substring(0, len - 2);

          if (
            title.indexOf(searchValueImproved) > -1 ||
            description.indexOf(searchValueImproved) > -1
          ) {
            //Date format
            const dateElement = articleLink.querySelector("span");

            let date;
            if (dateElement) {
              const dateValue = dateElement.textContent;
              const [day, month, year] = dateValue.split(".");
              const newDate = new Date(+year, +month - 1, +day);
              date = newDate.toLocaleDateString("en-US");
            } else {
              date = "Date error.";
            }

            const imageElement = articleLink.querySelector("picture > img");
            const image = imageElement
              ? imageElement.getAttribute("src")
              : "https://bibliotekant.pl/wp-content/uploads/2021/04/placeholder-image.png";

            const link = articleLink.getAttribute("href");

            return {
              link,
              title,
              description,
              image,
              date,
            };
          } else {
            return null;
          }
        } else {
          return null;
        }
      });
    }, searchValue);

    await page.close();

    const articlesFiltered = articles.filter((article) => article !== null);
    return articlesFiltered;
  } catch (error) {
    console.log("Error at Forbes scrape, ", error.message);
  }
};

const scrapePolityka = async (searchValue, browser) => {
  try {
    const page = await browser.newPage();
    await page.setRequestInterception(true);

    page.on("request", (request) => {
      if (
        ["image", "stylesheet", "font"].indexOf(request.resourceType()) !== -1
      ) {
        request.abort();
      } else {
        request.continue();
      }
    });
    await page.goto(`https://www.polityka.pl/search?phrase=${searchValue}`, {
      waitUntil: "domcontentloaded",
    });

    await page.waitForSelector(".cg_search_result");

    const articles = await page.evaluate((searchValue) => {
      const articles = document.querySelectorAll(".cg_search_result > ul > li");
      if (articles) {
        return Array.from(articles).map((article) => {
          const articleLink = article.querySelector("a");
          const descriptionElement = articleLink.querySelector(
            ".cg_search_result_desc"
          );
          const title = descriptionElement.querySelector("h3").textContent;
          const description = descriptionElement.querySelector("p").textContent;

          const len = searchValue.length;
          const searchValueImproved = searchValue.substring(0, len - 2);

          if (
            title.indexOf(searchValueImproved) > -1 ||
            description.indexOf(searchValueImproved) > -1
          ) {
            const imageElement = articleLink.querySelector(".defer-image");
            const image = imageElement
              ? imageElement.getAttribute("data-src")
              : "https://bibliotekant.pl/wp-content/uploads/2021/04/placeholder-image.png";
            const link = articleLink.getAttribute("href");

            const dateElement = articleLink.querySelector(
              ".cg_search_result_article_data > .cg_date"
            );
            //Date format
            let date;
            if (dateElement) {
              const dateValue = dateElement.textContent.trim();
              const [day, month, year] = dateValue.split(".");
              const newDate = new Date(+year, +month - 1, +day);
              date = newDate.toLocaleDateString("en-US");
            } else {
              date = "Date error.";
            }

            return { link, title, description, image, date };
          } else return null;
        });
      } else {
        return null;
      }
    }, searchValue);

    await page.close();

    const articlesFiltered = articles.filter((article) => article !== null);
    return articlesFiltered;
  } catch (error) {
    console.log("Error in Polityka scrape, ", error.message);
  }
};

const scrapeWPolityce = async (searchValue, browser) => {
  try {
    const page = await browser.newPage();
    await page.setRequestInterception(true);

    page.on("request", (request) => {
      if (
        ["image", "stylesheet", "font"].indexOf(request.resourceType()) !== -1
      ) {
        request.abort();
      } else {
        request.continue();
      }
    });
    await page.goto(`https://wpolityce.pl/szukaj?q=${searchValue}`, {
      waitUntil: "domcontentloaded",
    });

    await page.waitForSelector(".search__results");

    const articles = await page.evaluate((searchValue) => {
      const articles = document.querySelectorAll(".publication-listed__single");
      if (articles) {
        return Array.from(articles).map((article) => {
          const titleElement = article.querySelector(
            ".publication-listed__title > a"
          );
          const descriptionElement = article.querySelector(
            ".publication-listed__details-container > p"
          );
          const title = titleElement.textContent;
          const description = descriptionElement.textContent;

          const len = searchValue.length;
          const searchValueImproved = searchValue.substring(0, len - 2);

          if (
            title.indexOf(searchValueImproved) > -1 ||
            description.indexOf(searchValueImproved) > -1
          ) {
            const imageElement = article.querySelector(
              ".publication-listed__details-container > div > picture > img"
            );
            const link = titleElement.getAttribute("href");
            const image = imageElement.getAttribute("src");

            //Date format
            const dateElement = article.querySelector(
              ".meta-info-list > li > time"
            );
            let date;
            if (dateElement) {
              const dateValue = dateElement
                .getAttribute("title")
                .trim()
                .slice(0, 10);
              const [year, month, day] = dateValue.split("-");
              const newDate = new Date(+year, +month - 1, +day);
              date = newDate.toLocaleDateString("en-US");
            } else {
              date = "Date error.";
            }

            return { link, title, description, image, date };
          } else return null;
        });
      } else {
        return null;
      }
    }, searchValue);

    await page.close();
    const articlesFiltered = articles.filter((article) => article !== null);
    return articlesFiltered;
  } catch (error) {
    console.log("Error in wPolityce scrape", error.message);
  }
};

module.exports = { scrapeForbes, scrapePolityka, scrapeWPolityce };
