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
      examNumber: $('div.a-row:contains("رقم الاكتتاب") div:last-child')
        .text()
        .trim(),
      motherName: $('div.a-row:contains("اسم الأم") div:last-child')
        .text()
        .trim(),
      fullName: $('div.a-row:contains("الاسم الكامل") div:last-child')
        .text()
        .trim(),
      city: $('div.a-row:contains("المحافظة") div:last-child').text().trim(),
      school: $('div.a-row:contains("المدرسة") div:last-child').text().trim(),
      result: $('div.a-row:contains("النتيجة") div:last-child').text().trim(),
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
