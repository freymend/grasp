import Fastify from "fastify";

export const app = Fastify({
    logger: true,
});

app.get("/", async (request, reply) => {
    return "Hello World";
});

try {
    await app.listen({ port: 3000, host: "0.0.0.0" });
} catch (err) {
    app.log.error(err);
    process.exit(1);
}
