import {
    FastifyInstance,
    FastifyPluginAsync,
    FastifyPluginOptions,
} from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
    deleteQuestionTagController,
    getQuestionTagsController,
    deleteQuestionTagsController,
    getQuestionController,
    putQuestionController,
    patchQuestionController,
    deleteQuestionController,
    postQuestionsController,
    getQuestionsController,
    replaceQuestionTagsController,
    updateQuestionTagsController,
    getQuestionTagController,
    getQuestionsTagsController,
} from "../../controllers/QuestionControllers";
import {
    deleteQuestionTagSchema,
    deleteQuestionTagsSchema,
    getQuestionSchema,
    putQuestionSchema,
    patchQuestionSchema,
    deleteQuestionSchema,
    getQuestionTagsSchema,
    getQuestionsSchema,
    postQuestionsSchema,
    updateQuestionTagsSchema,
    getQuestionTagSchema,
    getQuestionsTagsSchema,
} from "../../schemas/QuestionSchemas";

const QuestionRoutes: FastifyPluginAsync = async function routes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .get("/:id/tags/:tagText", getQuestionTagSchema, getQuestionTagController);
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .delete(
            "/:id/tags/:tagText",
            deleteQuestionTagSchema,
            deleteQuestionTagController
        );

    fastify
        .withTypeProvider<ZodTypeProvider>()
        .get("/:id/tags", getQuestionTagsSchema, getQuestionTagsController);

    fastify
        .withTypeProvider<ZodTypeProvider>()
        .post(
            "/:id/tags",
            updateQuestionTagsSchema,
            replaceQuestionTagsController
        );
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .put(
            "/:id/tags",
            updateQuestionTagsSchema,
            replaceQuestionTagsController
        );
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .patch(
            "/:id/tags",
            updateQuestionTagsSchema,
            updateQuestionTagsController
        );
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .delete(
            "/:id/tags",
            deleteQuestionTagsSchema,
            deleteQuestionTagsController
        );

    fastify
        .withTypeProvider<ZodTypeProvider>()
        .get("/:id", getQuestionSchema, getQuestionController);
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .put("/:id", putQuestionSchema, putQuestionController);
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .patch("/:id", patchQuestionSchema, patchQuestionController);
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .delete("/:id", deleteQuestionSchema, deleteQuestionController);

        fastify
        .withTypeProvider<ZodTypeProvider>()
        .get("/tags", getQuestionsTagsSchema, getQuestionsTagsController);

        
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .get("/", getQuestionsSchema, getQuestionsController);
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .post("/", postQuestionsSchema, postQuestionsController);
};

export default QuestionRoutes;
