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
                tags: ["course"],
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
                tags: ["course"],
                params: {
                    course_major: { type: "string" },
                    course_number: { type: "string" },
                    course_title: { type: "string" },
                },
                response: {
                    200: {
                        type: "object",
                        properties: {
                            course_major: { type: "string" },
                            course_number: { type: "string" },
                            course_title: { type: "string" },
                            course_description: { type: "string" },
                            offered: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        year: { type: "number" },
                                        quarter: { type: "string" },
                                        professor: { type: "string" },
                                        pdf: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                    500: {
                        type: "object",
                        properties: {
                            error: { type: "string" },
                        },
                    },
                },
                summary:
                    "Get all the times a course has been offered and the professors who taught it.",
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
                offered: (
                    await Promise.all(
                        data.map(async (row) => {
                            const { data, error } = await supabase.storage
                                .from("courses_syllabuses_pdf")
                                .list(
                                    `${course_major}_${course_number}_${course_title.replaceAll(" ", "-")}`,
                                    {
                                        search: `${row.year}_${row.quarter}_${row.first_name}_${row.last_name}`,
                                    },
                                );
                            if (data[0] === undefined) {
                                return {
                                    year: row.year,
                                    quarter: row.quarter,
                                    professor: `${row.first_name} ${row.last_name}`,
                                };
                            }

                            const pdf_key = `${course_major}_${course_number}_${course_title.replaceAll(" ", "-")}/${data[0]?.name}`;
                            return {
                                year: row.year,
                                quarter: row.quarter,
                                professor: `${row.first_name} ${row.last_name}`,
                                pdf: pdf_key,
                            };
                        }),
                    )
                ).sort(
                    (a, b) =>
                        b.year - a.year ||
                        quarterOrder[b.quarter] - quarterOrder[a.quarter],
                ),
            };
        },
    );
}

export default routes;
