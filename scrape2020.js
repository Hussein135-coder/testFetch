import * as cheerio from "cheerio";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const scrapeData = async (branch, city, stnumber) => {
  try {
    const url = `https://secondary2020.moed.gov.sy/${branch}/result.php?city=${city}&stdnum=${stnumber}`;
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract student information
    const result = {
      registrationNumber: $(".a-row:nth-child(1) .a-cell:nth-child(2).number")
        .text()
        .trim(),
      governorate: $(".a-row:nth-child(2) .a-cell:nth-child(2)").text().trim(),
      fullName: $(".a-row:nth-child(3) .a-cell:nth-child(2)").text().trim(),
      motherName: $(".a-row:nth-child(4) .a-cell:nth-child(2)").text().trim(),
      school: $(".a-row:nth-child(5) .a-cell:nth-child(2)").text().trim(),
      result: $(".a-row:nth-child(6) .a-cell:nth-child(2)").text().trim(),
      subjects: [],
    };

    // Extract subject marks
    const subjectMarks = [];
    $(".mark-table .a-cell").each((index, element) => {
      const name = $(element).find(".subject").text().trim();
      const mark = $(element).find(".mark").text().trim();
      const min = $(element).find(".xcus-inline:nth-child(1) ").text().trim();
      const max = $(element).find(".xcus-inline:nth-child(2) ").text().trim();

      result.subjects.push({
        name,
        mark,
        min,
        max,
      });
    });

    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};

async function routes(fastify, options) {
  fastify.post("/scrape2020", async (request, reply) => {
    const { branch, city, stnumber } = request.body;

    if (!branch || !city || !stnumber) {
      return { error: "Please provide branch, city, and stnumber" };
    }

    const data = await scrapeData(branch, city, stnumber);
    if (!data) {
      return { error: "Scraping failed" };
    }

    return { data };
  });
}
export default routes;
