import { z } from "zod";
import {
    examInstanceAnswerModel,
    examInstanceModel,
} from "../models/ExamModels";
import { idModel, successData, wrapper } from "../models/Common";
import { studentModel } from "../models/StudentModels";

// GET /exams/:id/instances
export const getExamInstancesSchema = {
    schema: {
        response: {
            200: wrapper.merge(
                z.object({
                    data: examInstanceModel
                        .array()
                        .describe("List of exam instances"),
                })
            ),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Exams"],
        describe: "Get list of objects representing exam instances",
    },
};

// POST /exams/:id/instances
export const postExamInstancesSchema = {
    schema: {
        body: examInstanceModel.omit({ id: true, seed: true }),
        response: {
            200: wrapper.merge(
                z.object({
                    data: examInstanceModel.describe("Created exam instance"),
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
        describe: "Create new exam instance from posted object",
    },
};

// DELETE /exams/:id/instances
export const deleteExamInstancesSchema = {
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
        describe: "Delete exam instances",
    },
};

// GET /exams/:id/instances/:instanceId.pdf
export const getExamInstancePDFSchema = {
    schema: {
        response: {
            200: z.any(),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Exams"],
        describe: "Get exam instance pdf file",
    },
};

// GET /exams/:id/instances/:instanceId/students/:studentId.pdf
export const getExamInstanceStudentPDFSchema = {
    schema: {
        response: {
            200: z.any(),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Exams"],
        describe: "Get student sheet pdf for exam instance",
    },
};

// GET /exams/:id/instances/:instanceId/students.pdf
export const getExamInstanceStudentsPDFSchema = {
    schema: {
        response: {
            200: z.any(),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Exams"],
        describe: "Get all student sheets pdf for exam instance",
    },
};

// GET /exams/:id/instances/:instanceId
export const getExamInstanceSchema = {
    schema: {
        response: {
            200: wrapper.merge(
                z.object({
                    data: examInstanceModel.describe("Exam instance object"),
                })
            ),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Exams"],
        describe: "Get object representing exam instance",
    },
};

// DELETE /exams/:id/instances/:instanceId
export const deleteExamInstanceSchema = {
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
        describe: "Delete exam instance",
    },
};

// GET /exams/:id/instances/:instanceId/answers
export const getExamInstanceAnswersSchema = {
    schema: {
        response: {
            200: wrapper.merge(
                z.object({
                    data: examInstanceAnswerModel
                        .array()
                        .describe("Array of exam instance answers"),
                })
            ),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Exams"],
    },
};
// DELETE /exams/:id/instances/:instanceId/answers
export const deleteExamInstanceAnswersSchema = {
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
        describe: "Remove all exam instance answers for a exam instance",
    },
};

// GET /exams/:id/instances/:instanceId/students
export const getExamInstanceStudentsSchema = {
    schema: {
        response: {
            200: wrapper.merge(
                z.object({
                    data: studentModel.array().describe("Array of students"),
                })
            ),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Exams"],
        describe: "Get list of students for a exam instance",
    },
};

// POST /exams/:id/instances/:instanceId/students
export const postExamInstanceStudentsSchema = {
    schema: {
        body: studentModel.omit({ id: true }),
        response: {
            200: wrapper.merge(
                z.object({
                    data: idModel.array().describe("Array of student Ids"),
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
        describe: "Create student and add id to exam instance students list",
    },
};

// PATCH /exams/:id/instances/:instanceId/students
export const patchExamInstanceStudentsSchema = {
    schema: {
        body: z.object({
            studentIds: idModel.array(),
        }),
        response: {
            200: wrapper.merge(
                z.object({
                    data: idModel.array().describe("Array of student Ids"),
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
        describe: "Add student ids to exam instance students list",
    },
};

// PUT /exams/:id/instances/:instanceId/students
export const putExamInstanceStudentsSchema = {
    schema: {
        body: z.object({
            studentIds: idModel.array(),
        }),
        response: {
            200: wrapper.merge(
                z.object({
                    data: idModel.array().describe("Array of student Ids"),
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
        describe: "Replace student ids for a exam instance",
    },
};

// DELETE /exams/:id/instances/:instanceId/students
export const deleteExamInstanceStudentsSchema = {
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
        describe: "Delete all students for a exam",
    },
};

// GET /exams/:id/instances/:instanceId/students/:studentId
export const getExamInstanceStudentSchema = {
    schema: {
        response: {
            303: z.string(),
        },
        tags: ["Exams"],
    },
};

// DELETE /exams/:id/instances/:instanceId/students/:studentId
export const deleteExamInstanceStudentSchema = {
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
        describe: "Remove student from exam instance students list",
    },
};

// GET /exams/:id/instances/:instanceId/students/:studentId/answers
export const getExamInstanceStudentAnswersSchema = {
    schema: {
        response: {
            200: wrapper.merge(
                z.object({
                    data: examInstanceAnswerModel
                        .array()
                        .describe("Array of exam instance answers"),
                })
            ),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Exams"],
    },
};
// POST /exams/:id/instances/:instanceId/students/:studentId/answers
export const postExamInstanceStudentAnswersSchema = {
    schema: {
        body: examInstanceAnswerModel,
        response: {
            200: wrapper.merge(
                z.object({
                    data: examInstanceAnswerModel.describe(
                        "Created exam instance answer"
                    ),
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
        describe: "Create exam instance answer",
    },
};
// DELETE /exams/:id/instances/:instanceId/students/:studentId/answers
export const deleteExamInstanceStudentAnswersSchema = {
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
        describe: "Remove all exam instance answers for a student",
    },
};

// GET /exams/:id/instances/:instanceId/students/:studentId/answers/:scanNumber
export const getExamInstanceStudentAnswerSchema = {
    schema: {
        response: {
            200: wrapper.merge(
                z.object({
                    data: examInstanceAnswerModel.describe(
                        "Exam instance answers"
                    ),
                })
            ),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Exams"],
    },
};
// PUT /exams/:id/instances/:instanceId/students/:studentId/answers/:scanNumber
export const putExamInstanceStudentAnswersSchema = {
    schema: {
        body: examInstanceAnswerModel,
        response: {
            200: wrapper.merge(
                z.object({
                    data: examInstanceAnswerModel.describe(
                        "Edit exam instance answer"
                    ),
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
        describe: "Edited exam instance answer",
    },
};
// DELETE /exams/:id/instances/:instanceId/students/:studentId/answers/:scanNumber
export const deleteExamInstanceStudentAnswerSchema = {
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
        describe: "Remove exam instance answer",
    },
};
