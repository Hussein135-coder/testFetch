import * as cheerio from "cheerio";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const scrapeData = async (branch, city, stnumber) => {
  try {
    const url = `https://2023.moed.gov.sy/sec-ch1/12th/resultpage.php?branch=${branch}&city=${city}&stnumber=${stnumber}`;
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const result = {
      examNumber: $('div.info-row:contains("رقم الاكتتاب") div:last-child')
        .text()
        .trim(),
      certificate: $('div.info-row:contains("الشهادة") div:last-child')
        .text()
        .trim(),
      motherName: $('div.info-row:contains("اسم الأم") div:last-child')
        .text()
        .trim(),
      fullName: $('div.info-row:contains("الاسم الكامل") div:last-child')
        .text()
        .trim(),
      city: $('div.info-row:contains("المحافظة") div:last-child').text().trim(),
      school: $('div.info-row:contains("المدرسة") div:last-child')
        .text()
        .trim(),
      result: $('div.info-row:contains("النتيجة") div:last-child')
        .text()
        .trim(),
      subjects: [],
    };
    // Extract subjects and marks
    $("div.per-subject").each((i, elem) => {
      const name = $(elem).find("div.subject-title").text().trim();
      const mark = $(elem)
        .find("div.subject-mark span:last-child")
        .text()
        .trim();
      const min = $(elem)
        .find("div.min-max div.min span:last-child")
        .text()
        .trim();
      const max = $(elem)
        .find("div.min-max div.max span:last-child")
        .text()
        .trim();
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
  fastify.post("/scrape2024", async (request, reply) => {
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
