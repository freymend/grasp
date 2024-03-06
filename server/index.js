import Fastify from "fastify";
import { supabase } from "./db/index.js";

export const app = Fastify({
    logger: true,
});

await app.register(import("@fastify/swagger"));
await app.register(import("@fastify/swagger-ui"), {
    routePrefix: "/",
    uiConfig: {
        docExpansion: "full",
        deepLinking: false,
    },
    uiHooks: {
        onRequest: function (request, reply, next) {
            next();
        },
        preHandler: function (request, reply, next) {
            next();
        },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
        return swaggerObject;
    },
    transformSpecificationClone: true,
});

app.get(
    "/search/:query",
    {
        schema: {
            params: {
                query: { type: "string" },
            },
            response: {
                200: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            course_major: { type: "string" },
                            course_number: { type: "number" },
                            course_title: { type: "string" },
                        },
                    },
                },
                500: {
                    type: "object",
                    properties: {
                        message: { type: "string" },
                    },
                },
            },
            summary:
                "Search for UW INFO courses. The search is case-insensitive and matches any part of the course major, number, or title.",
        },
    },
    async (request, reply) => {
        // @ts-ignore
        const { query } = request.params;
        const { data, error } = await supabase
            .from("courses")
            .select("course_major, course_number, course_title")
            .ilike("major_number_title", `%${query}%`);
        if (error) {
            reply.status(500);
            return error;
        }

        return data;
    },
);

try {
    await app.listen({ port: 3000, host: "0.0.0.0" });
} catch (err) {
    app.log.error(err);
    process.exit(1);
}
