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
                                first_name: { type: "string" },
                                last_name: { type: "string" },
                                middle_initial: { type: "string" },
                            },
                        },
                    },
                },
                summary: "Get all professors stored in the database",
            },
        },
        async (request, reply) => {
            const { data, error } = await supabase
                .from("professors")
                .select("first_name, last_name, middle_initial");
            if (error) {
                reply.status(500);
                return error;
            }
            return data;
        },
    );
}

export default routes;
