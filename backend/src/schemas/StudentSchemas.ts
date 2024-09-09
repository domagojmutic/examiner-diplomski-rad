import { z } from "zod";
import { studentModel } from "../models/StudentModels";
import { idModel, successData, tagModel, tagsModel, wrapper } from "../models/Common";

// GET /students
export const getStudentsSchema = {
    schema: {
        response: {
            200: wrapper.merge(
                z.object({
                    data: studentModel.array().describe("List of students"),
                })
            ),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Students"],
        describe: "Get list of objects representing students",
    },
};

// POST /students
export const postStudentsSchema = {
    schema: {
        body: studentModel.omit({ id: true }),
        response: {
            200: wrapper.merge(
                z.object({
                    data: studentModel.describe("Created student"),
                })
            ),
            400: z.unknown(),
        },
        tags: ["Students"],
        describe: "Create new student from posted object",
    },
};

// GET /subjects/tags
export const getStudentsTagsSchema = {
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
        describe: "Get list of all students tags",
    },
};

// GET /students/:id
export const getStudentSchema = {
    schema: {
        response: {
            200: wrapper.merge(
                z.object({
                    data: studentModel.describe("Student object"),
                })
            ),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Students"],
        describe: "Get object representing student",
    },
};

// PUT /students/:id
export const putStudentSchema = {
    schema: {
        body: studentModel.omit({ id: true }),
        response: {
            200: wrapper.merge(
                z.object({
                    data: studentModel.describe("Updated student"),
                })
            ),
            400: z.unknown(),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Students"],
        describe: "Update student from posted object",
    },
};

// PATCH /students/:id
export const patchStudentSchema = {
    schema: {
        body: studentModel.omit({ id: true }).partial(),
        response: {
            200: wrapper.merge(
                z.object({
                    data: studentModel.describe("Updated student"),
                })
            ),
            400: z.unknown(),
            404: wrapper.merge(
                z.object({
                    data: z.null(),
                })
            ),
        },
        tags: ["Students"],
        describe: "Update parts of student from posted object",
    },
};

// DELETE /students/:id
export const deleteStudentSchema = {
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
        tags: ["Students"],
        describe: "Delete student",
    },
};

// GET /students/:id/tags
export const getStudentTagsSchema = {
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
        describe: "Get list of tags for a student",
    },
};

// POST, PUT, PATCH  /students/:id/tags
export const updateStudentTagsSchema = {
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
        tags: ["Students"],
        describe: "Add tags to question",
    },
};

// DELETE /students/:id/tags
export const deleteStudentTagsSchema = {
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
        tags: ["Students"],
        describe: "Remove all tags from student",
    },
};

// GET /students/:id/tags/:id
export const getStudentTagSchema = {
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
        tags: ["Students"],
        describe: "Get a tag for a student",
    },
};
// DELETE /students/:id/tags/:id
export const deleteStudentTagSchema = {
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
        tags: ["Students"],
        describe: "Remove a tag from student",
    },
};
