const { scrape } = require("./scrape.js");

module.exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { value, websites } = body;

    console.time("Time")
    const data = await scrape(value, websites);
    console.log(data);
    console.timeEnd("Time")
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.log("Error at index.js", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }
};
