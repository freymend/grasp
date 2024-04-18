import { supabase } from "../db/index.js";

const quarterOrder = {
    AUT: 3,
    WTR: 2,
    SPR: 1,
    SUM: 0,
};

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
    fastify.get(
        "/:course_major/:course_number/:course_title",
        {
            schema: {
                params: {
                    course_major: { type: "string" },
                    course_number: { type: "string" },
                    course_title: { type: "string" },
                },
                response: {
                    // 200: {
                    //     type: "array",
                    //     items: { type: "number" },
                    // },
                    500: {
                        type: "object",
                        properties: {
                            error: { type: "string" },
                        },
                    },
                },
                summary:
                    "Get all years for a specific course. Use this to populate the years filter in the frontend.",
            },
        },
        async (request, reply) => {
            const course_number = request.params.course_number;
            const course_major = request.params.course_major.toLowerCase();
            const course_title = request.params.course_title.toLowerCase();

            const { data, error } = await supabase
                .from("view_course")
                .select("*")
                .eq("course_number", course_number)
                .eq("course_major", course_major)
                .eq("course_title", course_title);

            if (error) {
                reply.status(500);
                return error;
            }
            return {
                course_major: course_major,
                course_number: course_number,
                course_title: course_title,
                course_description: data[0].course_description,
                offered: data
                    .map((row) => ({
                        year: row.year,
                        quarter: row.quarter,
                        professor: `${row.first_name} ${row.last_name}`,
                    }))
                    .sort(
                        (a, b) =>
                            b.year - a.year ||
                            quarterOrder[b.quarter] - quarterOrder[a.quarter],
                    ),
            };
        },
    );
}

export default routes;