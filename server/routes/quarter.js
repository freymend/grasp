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
                tags: ["quarter"],
                response: {
                    200: { type: "array", items: { type: "string" } },
                },
                summary: "Get all the quarters stored in the database",
            },
        },
        async (request, reply) => {
            const { data, error } = await supabase
                .from("quarters")
                .select("quarter");
            if (error) {
                reply.status(500);
                return error;
            }
            return data.map((row) => row.quarter);
        },
    );
}

export default routes;
