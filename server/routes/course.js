import { supabase } from "../db/index.js";

/**
 *
 * @param {import("fastify").FastifyInstance} fastify
 * @param {Object} _
 */
async function routes(fastify, _) {
    fastify.get(
        "/",
        {
            schema: {
                response: {
                    200: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                course_major: { type: "string" },
                                course_number: { type: "string" },
                                course_title: { type: "string" },
                            },
                        },
                    },
                },
                summary: "Get all courses stored in the database",
            },
        },
        async (request, reply) => {
            const { data, error } = await supabase
                .from("courses")
                .select("course_major, course_number, course_title");
            if (error) {
                reply.status(500);
                return error;
            }
            return data;
        },
    );
}

export default routes;
