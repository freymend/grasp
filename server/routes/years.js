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
                tags: ["year"],
                response: {
                    200: { type: "array", items: { type: "number" } },
                },
                summary:
                    "Get all years stored in the database. Use this to populate the year filter in the frontend.",
            },
        },
        async (request, reply) => {
            const { data, error } = await supabase
                .from("years")
                .select("year")
                .order("year", { ascending: false });
            if (error) {
                reply.status(500);
                return error;
            }
            return data.map((row) => row.year);
        },
    );
}

export default routes;
