import { supabase } from "../db/index.js";

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
                consumes: ["multipart/form-data"],
                body: {
                    type: "object",
                    properties: {
                        course_major: { type: "string" },
                        course_number: { type: "number" },
                        course_title: { type: "string" },
                        professor: { type: "string" },
                        quarter: { type: "string" },
                        pdf: { type: "object" },
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
            // const json = await request.file();
            const pdf = await request.body.pdf.toBuffer();

            console.log(await request.body.pdf.toBuffer());

            const { data, error } = await supabase.storage
                .from("test_pdf")
                .upload("test.pdf", await pdf, {
                    contentType: "application/pdf",
                });

            if (error) {
                reply.code(500);
                return { message: error.message };
            }
            return "success";
        },
    );
}

export default routes;
