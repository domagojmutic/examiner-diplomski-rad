import { FastifyReply, FastifyRequest } from "fastify";
import * as QuestionServices from "../services/QuestionServices";
import * as TagServices from "../services/TagServices";
import { QuestionType } from "../models/QuestionModels";
import { TagsType } from "../models/Common";

// GET /questions
export const getQuestionsController = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const dbQuestions = await QuestionServices.getQuestions();

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ questions: dbQuestions }, "dbQuestions");

    if (dbQuestions && Array.isArray(dbQuestions)) {
        if (dbQuestions.length > 0) return reply.status(200).send(dbQuestions);
        else if (dbQuestions.length === 0) return reply.status(404).send([]);
    } else if (dbQuestions === null) return reply.status(404).send([]);

    return reply.status(500).send({});
};

// POST /questions
export const postQuestionsController = async (
    request: FastifyRequest<{ Body: Omit<QuestionType, "id"> }>,
    reply: FastifyReply
) => {
    const newQuestion = request.body;
    const dbQuestion = await QuestionServices.createQuestion(newQuestion);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ question: dbQuestion }, "dbQuestion");

    if (dbQuestion) return reply.status(200).send(dbQuestion);

    return reply.status(500).send({});
};

// GET /questions/tags
export const getQuestionsTagsController = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const dbTags = await TagServices.getTagsForQuestions();

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ tags: dbTags }, "dbTags");

    if (dbTags && Array.isArray(dbTags)) {
        if (dbTags.length > 0) return reply.status(200).send(dbTags);
        else if (dbTags.length === 0) return reply.status(404).send([]);
    }
    if (dbTags === null) return reply.status(404).send([]);

    return reply.status(500).send({});
};

// GET /questions/:id
export const getQuestionController = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const dbQuestion = await QuestionServices.getQuestion(id);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ question: dbQuestion }, "dbQuestion");

    if (dbQuestion) {
        return reply.status(200).send(dbQuestion);
    } else if (dbQuestion === null) return reply.status(404).send({});

    return reply.status(500).send({});
};

// PUT /questions/:id
export const putQuestionController = async (
    request: FastifyRequest<{
        Body: Omit<QuestionType, "id">;
        Params: { id: string };
    }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const newQuestion = request.body;
    const dbQuestion = await QuestionServices.replaceQuestion(id, newQuestion);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ question: dbQuestion }, "dbQuestion");

    if (dbQuestion) return reply.status(200).send(dbQuestion);
    if (dbQuestion === null) return reply.status(404).send({});

    return reply.status(500).send({});
};

// PATCH /questions/:id
export const patchQuestionController = async (
    request: FastifyRequest<{
        Body: Partial<Omit<QuestionType, "id">>;
        Params: { id: string };
    }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const newQuestion = request.body;
    const dbQuestion = await QuestionServices.updateQuestion(id, newQuestion);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ question: dbQuestion }, "dbQuestion");

    if (dbQuestion) return reply.status(200).send(dbQuestion);
    if (dbQuestion === null) return reply.status(404).send({});

    return reply.status(500).send({});
};

// DELETE /questions/:id
export const deleteQuestionController = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const success = await QuestionServices.deleteQuestion(id);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ success: success }, "success status");

    if (success !== undefined) {
        if (success === null) return reply.status(404).send({});
        else return reply.status(200).send({ success });
    }
    return reply.status(500).send({});
};

// GET /questions/:id/tags
export const getQuestionTagsController = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const dbTags = await TagServices.getTagsForQuestion(id);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ tags: dbTags }, "dbTags");

    if (dbTags) {
        return reply.status(200).send(dbTags);
    } else if (dbTags === null) return reply.status(404).send({});

    return reply.status(500).send({});
};

// POST, PUT /questions/:id/tags
export const replaceQuestionTagsController = async (
    request: FastifyRequest<{
        Body: { tags: TagsType };
        Params: { id: string };
    }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const { tags } = request.body;
    const dbQuestion = await TagServices.replaceTagsForQuestion(id, tags);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ question: dbQuestion }, "dbQuestion");

    if (dbQuestion) return reply.status(200).send(dbQuestion.tags);
    if (dbQuestion === null) return reply.status(404).send({});

    return reply.status(500).send({});
};

// PATCH /questions/:id/tags
export const updateQuestionTagsController = async (
    request: FastifyRequest<{
        Body: { tags: TagsType };
        Params: { id: string };
    }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const { tags } = request.body;
    const dbQuestion = await TagServices.updateTagsForQuestion(id, tags);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ question: dbQuestion }, "dbQuestion");

    if (dbQuestion) {
        return reply.status(200).send(dbQuestion.tags.length === 0);
    }
    if (dbQuestion === null) return reply.status(404).send({});

    return reply.status(500).send({});
};

// DELETE /questions/:id/tags
export const deleteQuestionTagsController = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const dbQuestion = await TagServices.deleteTagsForQuestion(id);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ question: dbQuestion }, "dbQuestion");

    if (dbQuestion) return reply.status(200).send(dbQuestion.tags.length === 0);
    if (dbQuestion === null) return reply.status(404).send({});

    return reply.status(500).send({});
};

// GET /questions/:id/tags/:tagText
export const getQuestionTagController = async (
    request: FastifyRequest<{ Params: { id: string; tagText: string } }>,
    reply: FastifyReply
) => {
    const { id, tagText } = request.params;
    const dbTag = await TagServices.getTagByText(tagText);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ tag: dbTag }, "dbTag");

    if (dbTag) return reply.status(200).send(dbTag);
    if (dbTag === null) return reply.status(404).send({});

    return reply.status(500).send({});
};

// DELETE /questions/:id/tags/:id
export const deleteQuestionTagController = async (
    request: FastifyRequest<{ Params: { id: string; tagText: string } }>,
    reply: FastifyReply
) => {
    const { id, tagText } = request.params;
    const dbTag = await TagServices.getTagByText(tagText);
    if (!dbTag) return reply.status(404).send({});

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ tag: dbTag }, "dbTag");

    const success = await TagServices.deleteTagForQuestion(id, dbTag.id);

    request.log.debug({ success: success }, "success");

    if (success === null) return reply.status(404).send({});
    if (success !== undefined) return reply.status(200).send(true);

    return reply.status(500).send({});
};
