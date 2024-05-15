const fetchUrl = async (url) => {
  try {
    const data = await fetch(url);
    const html = await data.text();
    return html;
  } catch (error) {
    console.log(error);
    return "Error";
  }
};
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
async function routes(fastify, options) {
  fastify.post("/fetchurl", async (request, reply) => {
    const url = request.body.url;
    const data = await fetchUrl(url);
    return { html: data };
  });
}

export default routes;
