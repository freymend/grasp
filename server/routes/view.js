import { supabase } from "../db/index.js";

/**
 *
 * @param {import("fastify").FastifyInstance} fastify
 * @param {Object} _
 */
async function routes(fastify, _) {
    fastify.get(
        "/years",
        {
            schema: {
                response: {
                    200: { type: "array", items: { type: "number" } },
                },
                summary: "Get all years stored in the database",
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
    fastify.get(
        "/professors",
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
    fastify.get(
        "/courses",
        {
            schema: {
                response: {
                    200: {
                        type: "array",
                        items: {
                            type: "objects",
                            properties: {
                                course_number: { type: "number" },
                                course_title: { type: "string" },
                                course_major: { type: "string" },
                                course_description: { type: "string" },
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
                .select(
                    "course_number, course_title, course_major, course_description",
                );
            if (error) {
                reply.status(500);
                return error;
            }
            return data;
        },
    );
}

export default routes;
