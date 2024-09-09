import {
    FastifyInstance,
    FastifyPluginAsync,
    FastifyPluginOptions,
} from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
    deleteSubjectQuestionSchema,
    deleteSubjectQuestionsSchema,
    deleteSubjectSchema,
    getSubjectsSchema,
    getSubjectSchema,
    patchSubjectQuestionsSchema,
    patchSubjectSchema,
    postSubjectsSchema,
    putSubjectQuestionsSchema,
    putSubjectSchema,
    postSubjectQuestionsSchema,
    getSubjectQuestionsSchema,
    getSubjectQuestionSchema,
    deleteSubjectTagSchema,
    deleteSubjectTagsSchema,
    getSubjectTagSchema,
    getSubjectTagsSchema,
    updateSubjectTagsSchema,
    getSubjectsTagsSchema,
    deleteSubjectExamSchema,
    deleteSubjectExamsSchema,
    getSubjectExamSchema,
    getSubjectExamsSchema,
    postSubjectExamsSchema,
} from "../../schemas/SubjectSchemas";
import {
    deleteSubjectController,
    deleteSubjectQuestionController,
    deleteSubjectQuestionsController,
    getSubjectsController,
    getSubjectController,
    getSubjectQuestionsController,
    patchSubjectController,
    patchSubjectQuestionsController,
    postSubjectsController,
    putSubjectController,
    putSubjectQuestionsController,
    postSubjectQuestionsController,
    getSubjectQuestionController,
    deleteSubjectTagController,
    deleteSubjectTagsController,
    getSubjectTagController,
    getSubjectTagsController,
    replaceSubjectTagsController,
    updateSubjectTagsController,
    getSubjectsTagsController,
    deleteSubjectExamController,
    deleteSubjectExamsController,
    getSubjectExamController,
    getSubjectExamsController,
    postSubjectExamsController,
} from "../../controllers/SubjectControllers";

const SubjectRoutes: FastifyPluginAsync = async function routes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .get(
            "/:id/tags/:tagText",
            getSubjectTagSchema,
            getSubjectTagController
        );
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .delete(
            "/:id/tags/:tagText",
            deleteSubjectTagSchema,
            deleteSubjectTagController
        );

    fastify
        .withTypeProvider<ZodTypeProvider>()
        .get("/:id/tags", getSubjectTagsSchema, getSubjectTagsController);

    fastify
        .withTypeProvider<ZodTypeProvider>()
        .post(
            "/:id/tags",
            updateSubjectTagsSchema,
            replaceSubjectTagsController
        );
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .put(
            "/:id/tags",
            updateSubjectTagsSchema,
            replaceSubjectTagsController
        );
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .patch(
            "/:id/tags",
            updateSubjectTagsSchema,
            updateSubjectTagsController
        );
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .delete(
            "/:id/tags",
            deleteSubjectTagsSchema,
            deleteSubjectTagsController
        );

    fastify
        .withTypeProvider<ZodTypeProvider>()
        .get(
            "/:id/exams/:examId",
            getSubjectExamSchema,
            getSubjectExamController
        );
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .delete(
            "/:id/exams/:examId",
            deleteSubjectExamSchema,
            deleteSubjectExamController
        );

    fastify
        .withTypeProvider<ZodTypeProvider>()
        .get("/:id/exams", getSubjectExamsSchema, getSubjectExamsController);
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .post("/:id/exams", postSubjectExamsSchema, postSubjectExamsController);
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .delete(
            "/:id/exams",
            deleteSubjectExamsSchema,
            deleteSubjectExamsController
        );

    fastify
        .withTypeProvider<ZodTypeProvider>()
        .get(
            "/:id/questions/:questionId",
            getSubjectQuestionSchema,
            getSubjectQuestionController
        );
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .delete(
            "/:id/questions/:questionId",
            deleteSubjectQuestionSchema,
            deleteSubjectQuestionController
        );

    fastify
        .withTypeProvider<ZodTypeProvider>()
        .get(
            "/:id/questions",
            getSubjectQuestionsSchema,
            getSubjectQuestionsController
        );
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .post(
            "/:id/questions",
            postSubjectQuestionsSchema,
            postSubjectQuestionsController
        );
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .put(
            "/:id/questions",
            putSubjectQuestionsSchema,
            putSubjectQuestionsController
        );
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .patch(
            "/:id/questions",
            patchSubjectQuestionsSchema,
            patchSubjectQuestionsController
        );
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .delete(
            "/:id/questions",
            deleteSubjectQuestionsSchema,
            deleteSubjectQuestionsController
        );

    fastify
        .withTypeProvider<ZodTypeProvider>()
        .get("/:id", getSubjectSchema, getSubjectController);
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .put("/:id", putSubjectSchema, putSubjectController);
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .patch("/:id", patchSubjectSchema, patchSubjectController);
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .delete("/:id", deleteSubjectSchema, deleteSubjectController);

    fastify
        .withTypeProvider<ZodTypeProvider>()
        .get("/tags", getSubjectsTagsSchema, getSubjectsTagsController);

    fastify
        .withTypeProvider<ZodTypeProvider>()
        .get("/", getSubjectsSchema, getSubjectsController);
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .post("/", postSubjectsSchema, postSubjectsController);
};

export default SubjectRoutes;
