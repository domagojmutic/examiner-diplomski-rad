import {
    FastifyInstance,
    FastifyPluginAsync,
    FastifyPluginOptions,
} from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
    deleteExamQuestionSchema,
    deleteExamQuestionsSchema,
    deleteExamSchema,
    getExamsSchema,
    getExamSchema,
    patchExamQuestionsSchema,
    patchExamSchema,
    postExamsSchema,
    putExamQuestionsSchema,
    putExamSchema,
    postExamQuestionsSchema,
    getExamQuestionsSchema,
    getExamQuestionSchema,
    deleteExamTagSchema,
    deleteExamTagsSchema,
    getExamTagSchema,
    getExamTagsSchema,
    updateExamTagsSchema,
    getExamsTagsSchema,
} from "../../schemas/ExamSchemas";
import {
    deleteExamController,
    deleteExamQuestionController,
    deleteExamQuestionsController,
    getExamsController,
    getExamController,
    getExamQuestionsController,
    patchExamController,
    patchExamQuestionsController,
    postExamsController,
    putExamController,
    putExamQuestionsController,
    postExamQuestionsController,
    getExamQuestionController,
    deleteExamTagController,
    deleteExamTagsController,
    getExamTagController,
    getExamTagsController,
    replaceExamTagsController,
    updateExamTagsController,
    getExamsTagsController,
} from "../../controllers/ExamControllers";
import ExamInstanceRoutes from "./ExamInstanceRoutes";

const ExamRoutes: FastifyPluginAsync = async function routes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .get("/:id/tags/:tagText", getExamTagSchema, getExamTagController);
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .delete(
            "/:id/tags/:tagText",
            deleteExamTagSchema,
            deleteExamTagController
        );

    fastify
        .withTypeProvider<ZodTypeProvider>()
        .get("/:id/tags", getExamTagsSchema, getExamTagsController);

    fastify
        .withTypeProvider<ZodTypeProvider>()
        .post(
            "/:id/tags",
            updateExamTagsSchema,
            replaceExamTagsController
        );
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .put(
            "/:id/tags",
            updateExamTagsSchema,
            replaceExamTagsController
        );
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .patch(
            "/:id/tags",
            updateExamTagsSchema,
            updateExamTagsController
        );
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .delete(
            "/:id/tags",
            deleteExamTagsSchema,
            deleteExamTagsController
        );
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .get(
            "/:id/questions/:questionId",
            getExamQuestionSchema,
            getExamQuestionController
        );
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .delete(
            "/:id/questions/:questionId",
            deleteExamQuestionSchema,
            deleteExamQuestionController
        );

    fastify
        .withTypeProvider<ZodTypeProvider>()
        .get(
            "/:id/questions",
            getExamQuestionsSchema,
            getExamQuestionsController
        );
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .post(
            "/:id/questions",
            postExamQuestionsSchema,
            postExamQuestionsController
        );
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .put(
            "/:id/questions",
            putExamQuestionsSchema,
            putExamQuestionsController
        );
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .patch(
            "/:id/questions",
            patchExamQuestionsSchema,
            patchExamQuestionsController
        );
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .delete(
            "/:id/questions",
            deleteExamQuestionsSchema,
            deleteExamQuestionsController
        );

    fastify.register(ExamInstanceRoutes, { prefix: "/:id/instances" });
    
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .get("/:id", getExamSchema, getExamController);
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .put("/:id", putExamSchema, putExamController);
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .patch("/:id", patchExamSchema, patchExamController);
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .delete("/:id", deleteExamSchema, deleteExamController);

    fastify
        .withTypeProvider<ZodTypeProvider>()
        .get("/tags", getExamsTagsSchema, getExamsTagsController);

    fastify
        .withTypeProvider<ZodTypeProvider>()
        .get("/", getExamsSchema, getExamsController);
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .post("/", postExamsSchema, postExamsController);
};

export default ExamRoutes;
