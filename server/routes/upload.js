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
            const { data, error } = await supabase.storage
                .from("waiting_courses_syllabuses_pdf")
                .upload(
                    `${request.body.course_major.value}_${request.body.course_number.value}_${request.body.course_title.value}/${request.body.year.value}_${request.body.quarter.value}_${request.body.professor.value}_${randomUUID()}.pdf`.replaceAll(
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
