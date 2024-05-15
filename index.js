import Fastify from "fastify";
import fetchUrl from "./fetchUrl.js";
import scrape2024 from "./scrape2024.js";
import scrape2020 from "./scrape2020.js";

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
fastify.register(scrape2024);
fastify.register(scrape2020);
