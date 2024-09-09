import {
    FastifyInstance,
    FastifyPluginAsync,
    FastifyPluginOptions,
} from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
    getExamInstanceStudentController,
    deleteExamInstanceStudentController,
    getExamInstanceStudentsController,
    postExamInstanceStudentsController,
    putExamInstanceStudentsController,
    patchExamInstanceStudentsController,
    deleteExamInstanceStudentsController,
    getExamInstanceController,
    deleteExamInstanceController,
    getExamInstancesController,
    postExamInstancesController,
    deleteExamInstancesController,
    getExamInstancePDFController,
    getExamInstanceStudentPDFController,
    getExamInstanceStudentsPDFController,
    deleteExamInstanceAnswersController,
    deleteExamInstanceStudentAnswerController,
    deleteExamInstanceStudentAnswersController,
    getExamInstanceAnswersController,
    getExamInstanceStudentAnswersController,
    getExamInstanceStudentAnswerController,
    putExamInstanceStudentAnswerController,
    postExamInstanceStudentAnswersController,
} from "../../controllers/ExamInstanceControllers";
import {
    getExamInstanceStudentSchema,
    deleteExamInstanceStudentSchema,
    getExamInstanceStudentsSchema,
    postExamInstanceStudentsSchema,
    putExamInstanceStudentsSchema,
    patchExamInstanceStudentsSchema,
    deleteExamInstanceStudentsSchema,
    getExamInstanceSchema,
    deleteExamInstanceSchema,
    getExamInstancesSchema,
    postExamInstancesSchema,
    deleteExamInstancesSchema,
    getExamInstancePDFSchema,
    getExamInstanceStudentPDFSchema,
    getExamInstanceStudentsPDFSchema,
    deleteExamInstanceAnswersSchema,
    deleteExamInstanceStudentAnswerSchema,
    deleteExamInstanceStudentAnswersSchema,
    getExamInstanceAnswersSchema,
    getExamInstanceStudentAnswerSchema,
    getExamInstanceStudentAnswersSchema,
    putExamInstanceStudentAnswersSchema,
    postExamInstanceStudentAnswersSchema,
} from "../../schemas/ExamInstanceSchemas";

const ExamInstanceRoutes: FastifyPluginAsync = async function routes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .get(
            "/:instanceId/students/:studentId/answers/:scanNumber",
            getExamInstanceStudentAnswerSchema,
            getExamInstanceStudentAnswerController
        );
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .put(
            "/:instanceId/students/:studentId/answers/:scanNumber",
            putExamInstanceStudentAnswersSchema,
            putExamInstanceStudentAnswerController
        );
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .delete(
            "/:instanceId/students/:studentId/answers/:scanNumber",
            deleteExamInstanceStudentAnswerSchema,
            deleteExamInstanceStudentAnswerController
        );

    fastify
        .withTypeProvider<ZodTypeProvider>()
        .get(
            "/:instanceId/students/:studentId/answers",
            getExamInstanceStudentAnswersSchema,
            getExamInstanceStudentAnswersController
        );
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .post(
            "/:instanceId/students/:studentId/answers",
            postExamInstanceStudentAnswersSchema,
            postExamInstanceStudentAnswersController
        );
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .delete(
            "/:instanceId/students/:studentId/answers",
            deleteExamInstanceStudentAnswersSchema,
            deleteExamInstanceStudentAnswersController
        );

    fastify
        .withTypeProvider<ZodTypeProvider>()
        .get(
            "/:instanceId/students/:studentId.pdf",
            getExamInstanceStudentPDFSchema,
            getExamInstanceStudentPDFController
        );

    fastify
        .withTypeProvider<ZodTypeProvider>()
        .get(
            "/:instanceId/students/:studentId",
            getExamInstanceStudentSchema,
            getExamInstanceStudentController
        );
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .delete(
            "/:instanceId/students/:studentId",
            deleteExamInstanceStudentSchema,
            deleteExamInstanceStudentController
        );

    fastify
        .withTypeProvider<ZodTypeProvider>()
        .get(
            "/:instanceId/students.pdf",
            getExamInstanceStudentsPDFSchema,
            getExamInstanceStudentsPDFController
        );

    fastify
        .withTypeProvider<ZodTypeProvider>()
        .get(
            "/:instanceId/students",
            getExamInstanceStudentsSchema,
            getExamInstanceStudentsController
        );
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .post(
            "/:instanceId/students",
            postExamInstanceStudentsSchema,
            postExamInstanceStudentsController
        );
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .put(
            "/:instanceId/students",
            putExamInstanceStudentsSchema,
            putExamInstanceStudentsController
        );
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .patch(
            "/:instanceId/students",
            patchExamInstanceStudentsSchema,
            patchExamInstanceStudentsController
        );
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .delete(
            "/:instanceId/students",
            deleteExamInstanceStudentsSchema,
            deleteExamInstanceStudentsController
        );

    fastify
        .withTypeProvider<ZodTypeProvider>()
        .get(
            "/:instanceId-:group.pdf",
            getExamInstancePDFSchema,
            getExamInstancePDFController
        );

    fastify
        .withTypeProvider<ZodTypeProvider>()
        .get(
            "/:instanceId/answers",
            getExamInstanceAnswersSchema,
            getExamInstanceAnswersController
        );
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .delete(
            "/:instanceId/answers",
            deleteExamInstanceAnswersSchema,
            deleteExamInstanceAnswersController
        );

    fastify
        .withTypeProvider<ZodTypeProvider>()
        .get("/:instanceId", getExamInstanceSchema, getExamInstanceController);
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .delete(
            "/:instanceId",
            deleteExamInstanceSchema,
            deleteExamInstanceController
        );

    fastify
        .withTypeProvider<ZodTypeProvider>()
        .get("/", getExamInstancesSchema, getExamInstancesController);
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .post("/", postExamInstancesSchema, postExamInstancesController);
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .delete("/", deleteExamInstancesSchema, deleteExamInstancesController);
};

export default ExamInstanceRoutes;
