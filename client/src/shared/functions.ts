import { IArticle } from "./interfaces";

const forbes = "https://www.forbes.pl";
const polityka = "https://www.polityka.pl";
const wPolityce = "//wpolityce.pl";

export const fetchAdditionalWebsites = (websites: string[]) => {
  //Use case exampe: Forbes and Polityka are fetched and we want to add wPolityce.
  if (websites.length === 3) {
    if (websites[0] === "Forbes") {
      if (websites[1] === "Polityka") {
        websites.splice(websites.indexOf("Forbes"), 1);
        websites.splice(websites.indexOf("Polityka"), 1);
        return websites;
      } else {
        websites.splice(websites.indexOf("Forbes"), 1);
        websites.splice(websites.indexOf("wPolityce"), 1);
        return websites;
      }
    } else if (websites[0] === "Polityka") {
      if (websites[1] === "Forbes") {
        websites.splice(websites.indexOf("Polityka"), 1);
        websites.splice(websites.indexOf("Forbes"), 1);
        return websites;
      } else {
        websites.splice(websites.indexOf("Polityka"), 1);
        websites.splice(websites.indexOf("wPolityce"), 1);
        return websites;
      }
    } else {
      if (websites[1] === "Forbes") {
        websites.splice(websites.indexOf("wPolityce"), 1);
        websites.splice(websites.indexOf("Forbes"), 1);
        return websites;
      } else {
        websites.splice(websites.indexOf("wPolityce"), 1);
        websites.splice(websites.indexOf("Polityka"), 1);
        return websites;
      }
    }
  }
  //Use case example: Polityka is fetched and we want to add Forbes
  else if (websites.length === 2) {
    if (websites[0] === "Forbes") {
      websites.splice(websites.indexOf("Forbes"), 1);
      return websites;
    } else if (websites[0] === "Polityka") {
      websites.splice(websites.indexOf("Polityka"), 1);
      return websites;
    } else {
      websites.splice(websites.indexOf("wPolityce"), 1);
      return websites;
    }
  }
  //Other cases
  else {
    return websites;
  }
};

export const removeFilter = (option: string, articles: IArticle[] | null) => {
  if (option === "Forbes") {
    return articles?.filter((article) => !article.link.includes(forbes));
  } else if (option === "Polityka") {
    return articles?.filter((article) => !article.link.includes(polityka));
  } else {
    return articles?.filter(
      (article) =>
        !article.link.includes(wPolityce) &&
        !article.link.includes("https://wgospodarce.pl/")
    );
  }
};

export const articleFilterByDate = (
  option: string,
  articles: IArticle[] | null
) => {
  if (option == "dateDesc") {
    return articles?.sort((a: IArticle, b: IArticle) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } else {
    return articles?.sort((a: IArticle, b: IArticle) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }
};

export const cutDescription = (description: string) => {
  let result: string;
  const arr = description.split(" ");
  if (arr.length > 40) {
    const arrSlice = arr.slice(0, 40);
    arrSlice.push("[...]");
    result = arrSlice.join(" ");
    return result;
  } else {
    return description;
  }
};
