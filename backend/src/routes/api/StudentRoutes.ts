import {
    FastifyInstance,
    FastifyPluginAsync,
    FastifyPluginOptions,
} from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
    deleteStudentTagController,
    getStudentTagsController,
    deleteStudentTagsController,
    getStudentController,
    putStudentController,
    patchStudentController,
    deleteStudentController,
    postStudentsController,
    getStudentsController,
    replaceStudentTagsController,
    updateStudentTagsController,
    getStudentTagController,
    getStudentsTagsController,
} from "../../controllers/StudentControllers";
import {
    deleteStudentTagSchema,
    deleteStudentTagsSchema,
    getStudentSchema,
    putStudentSchema,
    patchStudentSchema,
    deleteStudentSchema,
    getStudentTagsSchema,
    getStudentsSchema,
    postStudentsSchema,
    updateStudentTagsSchema,
    getStudentTagSchema,
    getStudentsTagsSchema,
} from "../../schemas/StudentSchemas";

const StudentRoutes: FastifyPluginAsync = async function routes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .get("/:id/tags/:tagText", getStudentTagSchema, getStudentTagController);
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .delete(
            "/:id/tags/:tagText",
            deleteStudentTagSchema,
            deleteStudentTagController
        );

    fastify
        .withTypeProvider<ZodTypeProvider>()
        .get("/:id/tags", getStudentTagsSchema, getStudentTagsController);

    fastify
        .withTypeProvider<ZodTypeProvider>()
        .post(
            "/:id/tags",
            updateStudentTagsSchema,
            replaceStudentTagsController
        );
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .put(
            "/:id/tags",
            updateStudentTagsSchema,
            replaceStudentTagsController
        );
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .patch(
            "/:id/tags",
            updateStudentTagsSchema,
            updateStudentTagsController
        );
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .delete(
            "/:id/tags",
            deleteStudentTagsSchema,
            deleteStudentTagsController
        );

    fastify
        .withTypeProvider<ZodTypeProvider>()
        .get("/:id", getStudentSchema, getStudentController);
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .put("/:id", putStudentSchema, putStudentController);
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .patch("/:id", patchStudentSchema, patchStudentController);
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .delete("/:id", deleteStudentSchema, deleteStudentController);

    fastify
    .withTypeProvider<ZodTypeProvider>()
    .get("/tags", getStudentsTagsSchema, getStudentsTagsController);

    fastify
        .withTypeProvider<ZodTypeProvider>()
        .get("/", getStudentsSchema, getStudentsController);
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .post("/", postStudentsSchema, postStudentsController);
};

export default StudentRoutes;
