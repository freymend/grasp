import { supabase } from "../db/index.js";
import { randomUUID } from "crypto";

/**
 *
 * @param {import("fastify").FastifyInstance} fastify
 * @param {Object} _
 */
async function routes(fastify, _) {
    fastify.post(
        "/",
        {
            schema: {
                tags: ["upload"],
                consumes: ["multipart/form-data"],
                body: {
                    type: "object",
                    properties: {
                        course_major: {
                            properties: { value: { type: "string" } },
                        },
                        course_number: {
                            properties: { value: { type: "number" } },
                        },
                        course_title: {
                            properties: { value: { type: "string" } },
                        },
                        professor: {
                            properties: { value: { type: "string" } },
                        },
                        quarter: { properties: { value: { type: "string" } } },
                        year: { properties: { value: { type: "number" } } },
                        pdf: { isFile: true },
                    },
                },
                response: {
                    200: {
                        type: "string",
                    },
                    500: {
                        type: "object",
                        properties: {
                            message: { type: "string" },
                        },
                    },
                },
                summary:
                    "Upload a syllabus to the database. The syllabus is a PDF file.",
            },
        },
        async (request, reply) => {
            const course_major = request.body.course_major.value.toLowerCase();
            const course_number = request.body.course_number.value;
            const course_title = request.body.course_title.value.toLowerCase();
            const professor = request.body.professor.value.toLowerCase();
            const quarter = request.body.quarter.value;
            const year = request.body.year.value;

            const { data, error } = await supabase.storage
                .from("waiting_courses_syllabuses_pdf")
                .upload(
                    `${course_major}_${course_number}_${course_title}/${year}_${quarter}_${professor}_${randomUUID()}.pdf`.replaceAll(
                        " ",
                        "-",
                    ),
                    await request.body.pdf.toBuffer(),
                    {
                        contentType: "application/pdf",
                    },
                );

            if (error) {
                reply.code(500);
                return { message: error.message };
            }
            return `Successfully uploaded ${request.body.pdf.filename}!`;
        },
    );
}

export default routes;
