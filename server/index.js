import Fastify from "fastify";
import { supabase } from "./db/index.js";

export const app = Fastify({
    logger: true,
});

app.get("/", async (request, reply) => {
    return "Hello World";
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
            summary: "Search for courses. ",
        },
    },
    async (request, reply) => {
        // @ts-ignore
        const { query } = request.params;
        const { data, error } = await supabase
            .from("courses")
            .select("course_major, course_number, course_title")
            .textSearch("major_number_title", query);
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
