import { z } from "zod";
import { examModel } from "../models/ExamModels";
import { questionModel } from "../models/QuestionModels";
import {
    idModel,
    successData,
    tagModel,
    tagsModel,
    wrapper,
} from "../models/Common";
import { subjectModel } from "../models/SubjectModels";

// GET /exams
export const getExamsSchema = {
    schema: {
        response: {
            200: wrapper.merge(
                z.object({
                    data: examModel.array().describe("List of exams"),
                })
            ),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Exams"],
        describe: "Get list of objects representing exams",
    },
};

// POST /exams
export const postExamsSchema = {
    schema: {
        body: examModel.omit({ id: true }),
        response: {
            200: wrapper.merge(
                z.object({
                    data: examModel.describe("Created exam"),
                })
            ),
            400: z.unknown(),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Exams"],
        describe: "Create new exam from posted object",
    },
};

// GET /exams/tags
export const getExamsTagsSchema = {
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
        tags: ["Exams"],
        describe: "Get list of all subject tags",
    },
};

// GET /exams/:id
export const getExamSchema = {
    schema: {
        response: {
            200: wrapper.merge(
                z.object({
                    data: examModel.describe("Exam object"),
                })
            ),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Exams"],
        describe: "Get object representing exam",
    },
};

// PUT /exams/:id
export const putExamSchema = {
    schema: {
        body: examModel.omit({ id: true }),
        response: {
            200: wrapper.merge(
                z.object({
                    data: examModel.describe("Updated exam"),
                })
            ),
            400: z.unknown(),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Exams"],
        describe: "Update exam from posted object",
    },
};

// PATCH /exams/:id
export const patchExamSchema = {
    schema: {
        body: examModel.omit({ id: true }).partial(),
        response: {
            200: wrapper.merge(
                z.object({
                    data: examModel.describe("Updated exam"),
                })
            ),
            400: z.unknown(),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Exams"],
        describe: "Update parts of exam from posted object",
    },
};

// DELETE /exams/:id
export const deleteExamSchema = {
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
        tags: ["Exams"],
        describe: "Delete exams",
    },
};

// GET /exams/:id/questions
export const getExamQuestionsSchema = {
    schema: {
        response: {
            200: wrapper.merge(
                z.object({
                    data: questionModel.array().describe("Array of questions"),
                })
            ),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Exams"],
        describe: "Get list of questions for a exam",
    },
};
// POST /exams/:id/questions
export const postExamQuestionsSchema = {
    schema: {
        body: questionModel.omit({ id: true }),
        response: {
            200: wrapper.merge(
                z.object({
                    data: idModel.array().describe("Array of question Ids"),
                })
            ),
            400: z.unknown(),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Exams"],
        describe: "Create question and add id to exam questions list",
    },
};

// PATCH /exams/:id/questions
export const patchExamQuestionsSchema = {
    schema: {
        body: z.object({
            questionIds: idModel.array(),
        }),
        response: {
            200: wrapper.merge(
                z.object({
                    data: idModel.array().describe("Array of question Ids"),
                })
            ),
            400: z.unknown(),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Exams"],
        describe: "Add question ids to exam questions list",
    },
};

// PUT /exams/:id/questions
export const putExamQuestionsSchema = {
    schema: {
        body: z.object({
            questionIds: idModel.array(),
        }),
        response: {
            200: wrapper.merge(
                z.object({
                    data: idModel.array().describe("Array of question Ids"),
                })
            ),
            400: z.unknown(),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Exams"],
        describe: "Replace question ids for a exam",
    },
};

// DELETE /exams/:id/questions
export const deleteExamQuestionsSchema = {
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
        tags: ["Exams"],
        describe: "Delete all questions for a exam",
    },
};

// GET /exams/:id/questions/:id
export const getExamQuestionSchema = {
    schema: {
        response: {
            303: z.string(),
        },
        tags: ["Exams"],
    },
};

// DELETE /exams/:id/questions/:id
export const deleteExamQuestionSchema = {
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
        tags: ["Exams"],
        describe: "Remove question from exam questions list",
    },
};

//-----------------------------------------------------

// GET /exams/:id/subjects
export const getExamSubjectsSchema = {
    schema: {
        response: {
            200: wrapper.merge(
                z.object({
                    data: subjectModel.array().describe("List of subjects"),
                })
            ),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Exams"],
        describe: "Get subject list",
    },
};

// PUT /exams/:id/subjects
export const putExamSubjectsSchema = {
    schema: {
        body: idModel.array(),
        response: {
            200: wrapper.merge(
                z.object({
                    data: idModel.array().describe("List of subject ids"),
                })
            ),
            400: z.unknown(),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Exams"],
        describe: "Replace subject list",
    },
};

// PATCH /exams/:id/subjects
export const patchExamSubjectsSchema = {
    schema: {
        body: idModel.array(),
        response: {
            200: wrapper.merge(
                z.object({
                    data: idModel.array().describe("List of subject ids"),
                })
            ),
            400: z.unknown(),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Exams"],
        describe: "Add to subject list",
    },
};

// DELETE /exams/:id/subjects
export const deleteExamSubjectsSchema = {
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
        tags: ["Exams"],
        describe: "Delete subject list",
    },
};

// GET /exams/:id/subject/:subjectId
export const getExamSubjectSchema = {
    schema: {
        response: {
            303: wrapper.merge(
                z.object({
                    data: subjectModel.describe("Subjects"),
                })
            ),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Exams"],
        describe: "Get subject",
    },
};

// DELETE /exams/:id/subject/:subjectId
export const deleteExamSubjectSchema = {
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
        tags: ["Exams"],
        describe: "Get subject",
    },
};

//----------------------------------------------------------------

// GET /exams/:id/tags
export const getExamTagsSchema = {
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
        tags: ["Exams"],
        describe: "Get list of tags for a exam",
    },
};

// POST, PUT, PATCH  /exams/:id/tags
export const updateExamTagsSchema = {
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
        tags: ["Exams"],
        describe: "Add tags to question",
    },
};

// DELETE /exams/:id/tags
export const deleteExamTagsSchema = {
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
        tags: ["Exams"],
        describe: "Remove all tags from exam",
    },
};

// GET /exams/:id/tags/:id
export const getExamTagSchema = {
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
        tags: ["Exams"],
        describe: "Get a tag for a exam",
    },
};
// DELETE /exams/:id/tags/:id
export const deleteExamTagSchema = {
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
        tags: ["Exams"],
        describe: "Remove a tag from exam",
    },
};
