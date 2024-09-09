import {
    FastifyInstance,
    FastifyPluginAsync,
    FastifyPluginOptions,
    FastifyRequest,
} from "fastify";
import multer from "fastify-multer";

interface MulterFastifyRequest extends FastifyRequest {
    file?: {
        buffer: Buffer;
        encoding: string;
        fieldname: string;
        mimetype: string;
        originalname: string;
        size: number;
        filename: string;
    };
}

const upload = multer({ dest: "uploads/" });

const UploadRoutes: FastifyPluginAsync = async function routes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {
    fastify.post(
        "/exams/response",
        { preHandler: upload.single("file") },
        async function (request: MulterFastifyRequest, reply) {
            if (request.file) {
                const data = fastify.analyzeSheets.execute(
                    request.file.filename
                );
                return reply.code(202).send();
            }
            return reply.code(400).send();
        }
    );
};

export default UploadRoutes;
