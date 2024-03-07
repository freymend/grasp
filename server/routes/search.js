import { supabase } from "../db/index.js";

/**
 *
 * @param {import("fastify").FastifyInstance} fastify
 * @param {Object} _
 */
async function routes(fastify, _) {
    fastify.get(
        "/:query",
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
}

export default routes;
