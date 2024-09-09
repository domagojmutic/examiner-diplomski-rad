import { z } from "zod";
import { subjectModel } from "../models/SubjectModels";
import { questionModel } from "../models/QuestionModels";
import {
    idModel,
    successData,
    tagModel,
    tagsModel,
    wrapper,
} from "../models/Common";
import { examModel } from "../models/ExamModels";

// GET /subjects
export const getSubjectsSchema = {
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
        tags: ["Subjects"],
        describe: "Get list of objects representing subjects",
    },
};

// POST /subjects
export const postSubjectsSchema = {
    schema: {
        body: subjectModel.omit({ id: true }),
        response: {
            200: wrapper.merge(
                z.object({
                    data: subjectModel.describe("Created subject"),
                })
            ),
            400: z.unknown(),
        },
        tags: ["Subjects"],
        describe: "Create new subject from posted object",
    },
};

// GET /subjects/tags
export const getSubjectsTagsSchema = {
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
        tags: ["Subjects"],
        describe: "Get list of all subject tags",
    },
};

// GET /subjects/:id
export const getSubjectSchema = {
    schema: {
        response: {
            200: wrapper.merge(
                z.object({
                    data: subjectModel.describe("Subject object"),
                })
            ),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Subjects"],
        describe: "Get object representing subject",
    },
};

// PUT /subjects/:id
export const putSubjectSchema = {
    schema: {
        body: subjectModel.omit({ id: true }),
        response: {
            200: wrapper.merge(
                z.object({
                    data: subjectModel.describe("Updated subject"),
                })
            ),
            400: z.unknown(),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Subjects"],
        describe: "Update subject from posted object",
    },
};

// PATCH /subjects/:id
export const patchSubjectSchema = {
    schema: {
        body: subjectModel.omit({ id: true }).partial(),
        response: {
            200: wrapper.merge(
                z.object({
                    data: subjectModel.describe("Updated subject"),
                })
            ),
            400: z.unknown(),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Subjects"],
        describe: "Update parts of subject from posted object",
    },
};

// DELETE /subjects/:id
export const deleteSubjectSchema = {
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
        tags: ["Subjects"],
        describe: "Delete subjects",
    },
};

// GET /subjects/:id/questions
export const getSubjectQuestionsSchema = {
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
        tags: ["Subjects"],
        describe: "Get list of questions for a subject",
    },
};
// POST /subjects/:id/questions
export const postSubjectQuestionsSchema = {
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
        tags: ["Subjects"],
        describe: "Create question and add id to subject questions list",
    },
};

// PATCH /subjects/:id/questions
export const patchSubjectQuestionsSchema = {
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
        tags: ["Subjects"],
        describe: "Add question ids to subject questions list",
    },
};

// PUT /subjects/:id/questions
export const putSubjectQuestionsSchema = {
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
        tags: ["Subjects"],
        describe: "Replace question ids for a subject",
    },
};

// DELETE /subjects/:id/questions
export const deleteSubjectQuestionsSchema = {
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
        tags: ["Subjects"],
        describe: "Delete all questions for a subject",
    },
};

// GET /subjects/:id/questions/:id
export const getSubjectQuestionSchema = {
    schema: {
        response: {
            303: z.string(),
        },
        tags: ["Subjects"],
    },
};

// DELETE /subjects/:id/questions/:id
export const deleteSubjectQuestionSchema = {
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
        tags: ["Subjects"],
        describe: "Remove question from subject questions list",
    },
};

// GET /subjects/:id/exams
export const getSubjectExamsSchema = {
    schema: {
        response: {
            200: wrapper.merge(
                z.object({
                    data: examModel.array().describe("Array of exams"),
                })
            ),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Subjects"],
        describe: "Get list of exams for a subject",
    },
};
// POST /subjects/:id/exams
export const postSubjectExamsSchema = {
    schema: {
        body: examModel.omit({ id: true }),
        response: {
            200: wrapper.merge(
                z.object({
                    data: examModel.array().describe("Array of exams"),
                })
            ),
            400: z.unknown(),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Subjects"],
        describe: "Create exam and set subject id of exam to subject id",
    },
};

// DELETE /subjects/:id/questions
export const deleteSubjectExamsSchema = {
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
        tags: ["Subjects"],
        describe: "Delete all exams for a subject",
    },
};

// GET /subjects/:id/exams/:id
export const getSubjectExamSchema = {
    schema: {
        response: {
            303: z.string(),
        },
        tags: ["Subjects"],
    },
};

// DELETE /subjects/:id/exams/:id
export const deleteSubjectExamSchema = {
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
        tags: ["Subjects"],
        describe: "Remove question from subject questions list",
    },
};

// GET /subjects/:id/tags
export const getSubjectTagsSchema = {
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
        tags: ["Subjects"],
        describe: "Get list of tags for a subject",
    },
};

// POST, PUT, PATCH  /subjects/:id/tags
export const updateSubjectTagsSchema = {
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
        tags: ["Subjects"],
        describe: "Add tags to question",
    },
};

// DELETE /subjects/:id/tags
export const deleteSubjectTagsSchema = {
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
        tags: ["Subjects"],
        describe: "Remove all tags from subject",
    },
};

// GET /subjects/:id/tags/:id
export const getSubjectTagSchema = {
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
        tags: ["Subjects"],
        describe: "Get a tag for a subject",
    },
};
// DELETE /subjects/:id/tags/:id
export const deleteSubjectTagSchema = {
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
        tags: ["Subjects"],
        describe: "Remove a tag from subject",
    },
};
