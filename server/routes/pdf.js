import { supabase } from "../db/index.js";

/**
 *
 * @param {import("fastify").FastifyInstance} fastify
 * @param {Object} _
 */
async function routes(fastify, _) {
    fastify.get(
        "/:pdf_key",
        {
            schema: {
                tags: ["pdf"],
                produces: ["application/pdf"],
                response: {
                    200: { type: "string", format: "byte" },
                },
                summary:
                    "Get a syllabus from the database. Note: the swagger UI does not support PDF previews. You can test this endpoint in the browser or with a tool like Postman.",
            },
        },
        async (request, reply) => {
            const { data, error } = await supabase.storage
                .from("courses_syllabuses_pdf")
                .download(request.params.pdf_key);

            if (error) {
                reply.status(500);
                return error;
            }
            const buffer = Buffer.from(await data.arrayBuffer());
            reply.header("content-length", buffer.length);
            reply.header("content-type", "application/pdf");
            reply.header(
                "content-disposition",
                "inline filename=course_syllabus.pdf",
            );
            return buffer;
        },
    );
}

export default routes;
