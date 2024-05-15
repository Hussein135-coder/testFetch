import Fastify from "fastify";
import fetchUrl from "./fetchUrl.js";
const fastify = Fastify({
  logger: true,
});

// Declare a route
fastify.get("/", async function (request, reply) {
  reply.send({ hello: "world" });
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();

fastify.register(fetchUrl);

// app.get("/", async (req, res) => {
//   const html = await fetchUrl("https://2024.moed.gov.sy/interlude/");
//   res.json({ html });
// });

// app.listen(port, () => {
//   console.log(`Listening on port ${port}...`);
// });
