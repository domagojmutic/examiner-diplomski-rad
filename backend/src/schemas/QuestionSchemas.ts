import { z } from "zod";
import { questionModel } from "../models/QuestionModels";
import { idModel, successData, tagModel, tagsModel, wrapper } from "../models/Common";

// GET /questions
export const getQuestionsSchema = {
    schema: {
        response: {
            200: wrapper.merge(
                z.object({
                    data: questionModel.array().describe("List of questions"),
                })
            ),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Questions"],
        describe: "Get list of objects representing questions",
    },
};

// POST /questions
export const postQuestionsSchema = {
    schema: {
        body: questionModel.omit({ id: true }),
        response: {
            200: wrapper.merge(
                z.object({
                    data: questionModel.describe("Created question"),
                })
            ),
            400: z.unknown(),
        },
        tags: ["Questions"],
        describe: "Create new question from posted object",
    },
};

// GET /questions/tags
export const getQuestionsTagsSchema = {
    schema: {
        response: {
            200: wrapper.merge(
                z.object({
                    data: tagsModel.describe("List of tags"),
                })
            ),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Students"],
        describe: "Get list of all questions tags",
    },
};

// GET /questions/:id
export const getQuestionSchema = {
    schema: {
        response: {
            200: wrapper.merge(
                z.object({
                    data: questionModel.describe("Question object"),
                })
            ),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Questions"],
        describe: "Get object representing question",
    },
};

// PUT /questions/:id
export const putQuestionSchema = {
    schema: {
        body: questionModel.omit({ id: true }),
        response: {
            200: wrapper.merge(
                z.object({
                    data: questionModel.describe("Updated question"),
                })
            ),
            400: z.unknown(),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Questions"],
        describe: "Update question from posted object",
    },
};

// PATCH /questions/:id
export const patchQuestionSchema = {
    schema: {
        body: questionModel.omit({ id: true }).partial(),
        response: {
            200: wrapper.merge(
                z.object({
                    data: questionModel.describe("Updated question"),
                })
            ),
            400: z.unknown(),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Questions"],
        describe: "Update parts of question from posted object",
    },
};

// DELETE /questions/:id
export const deleteQuestionSchema = {
    schema: {
        response: {
            200: wrapper.merge(
                z.object({
                    data: successData.describe("Success status"),
                })
            ),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Questions"],
        describe: "Delete question",
    },
};

// GET /questions/:id/tags
export const getQuestionTagsSchema = {
    schema: {
        response: {
            200: wrapper.merge(
                z.object({
                    data: tagsModel.describe("List of tags"),
                })
            ),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Questions"],
        describe: "Get list of tags for a question",
    },
};

// POST, PUT, PATCH  /questions/:id/tags
export const updateQuestionTagsSchema = {
    schema: {
        body: z.object({ tags: tagsModel }),
        response: {
            200: wrapper.merge(
                z.object({
                    data: tagsModel.describe("List of tags"),
                })
            ),
            400: z.unknown(),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Questions"],
        describe: "Add tags to question",
    },
};

// DELETE /questions/:id/tags
export const deleteQuestionTagsSchema = {
    schema: {
        response: {
            200: wrapper.merge(
                z.object({
                    data: successData.describe("Success status"),
                })
            ),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Questions"],
        describe: "Remove all tags from question",
    },
};

// GET /questions/:id/tags/:id
export const getQuestionTagSchema = {
    schema: {
        response: {
            200: wrapper.merge(
                z.object({
                    data: tagModel,
                })
            ),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Questions"],
        describe: "Get a tag for a question",
    },
};
// DELETE /questions/:id/tags/:id
export const deleteQuestionTagSchema = {
    schema: {
        response: {
            200: wrapper.merge(
                z.object({
                    data: successData.describe("Success status"),
                })
            ),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Questions"],
        describe: "Remove a tag from question",
    },
};
