import {
    FastifyInstance,
    FastifyPluginAsync,
    FastifyPluginOptions,
} from "fastify";
import SubjectRoutes from "./api/SubjectRoutes";
import QuestionRoutes from "./api/QuestionRoutes";
import StudentRoutes from "./api/StudentRoutes";
import { getStatusMessage } from "../util/statusCodeMap";
import { ZodError } from "zod";
import { errorCause } from "../databases/IDatabase";
import ExamRoutes from "./api/ExamRoutes";

const ApiRoutes: FastifyPluginAsync = async function routes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {
    fastify.addHook("preSerialization", async (request, reply, payload) => {
        return {
            statusCode: reply.statusCode,
            statusMessage: getStatusMessage(reply.statusCode),
            data:
                reply.statusCode < 300 ||
                Object.keys(payload as {} | []).length > 0
                    ? payload
                    : null,
        };
    });
    fastify.addHook("onSend", async (request, reply, payload) => {
    });
    fastify.addHook("preHandler", (req, reply, done) => {
        if (req.body) {
            req.log.info({ body: req.body }, "parsed body");
        }
        done();
    });

    fastify.setErrorHandler((error, request, reply) => {
        reply.log.error(error, "error");
        if (error.name === "ResponseValidationError") {
            return reply.status(500).send({ message: error.message });
        }
        if (error.name === "ZodError") {
            const msgObject = (error as unknown as ZodError).flatten();
            let msgString = msgObject.formErrors.join(", ");
            if (msgObject.formErrors.length > 0) msgString = msgString + ". ";
            Object.entries(msgObject.fieldErrors).forEach(([key, value]) => {
                if (value && value?.length > 0)
                    msgString =
                        msgString + key + " - " + value.join(", ") + ". ";
            });

            return reply
                .status(error.statusCode || 400)
                .send({ message: msgString.trim() });
        }
        if (error.cause === errorCause.userError) {
            return reply
                .status(error.statusCode ? error.statusCode : 400)
                .send({ message: error.message });
        }
        if (error.cause === errorCause.notFoundError) {
            return reply
                .status(error.statusCode ? error.statusCode : 404)
                .send({});
        }
        if (error.cause === errorCause.databaseError) {
            return reply
                .status(error.statusCode ? error.statusCode : 500)
                .send({ message: error.message });
        }
        if (error.cause === errorCause.notImplementedError) {
            return reply
                .status(error.statusCode ? error.statusCode : 501)
                .send({ message: error.message });
        }
        return reply.status(500).send(error);
    });

    fastify.register(SubjectRoutes, { prefix: "/subjects" });
    fastify.register(ExamRoutes, { prefix: "/exams" });
    fastify.register(QuestionRoutes, { prefix: "/questions" });
    fastify.register(StudentRoutes, { prefix: "/students" });
};

export default ApiRoutes;
