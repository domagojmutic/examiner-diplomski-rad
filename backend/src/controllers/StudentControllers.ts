import { FastifyReply, FastifyRequest } from "fastify";
import * as StudentServices from "../services/StudentServices";
import * as TagServices from "../services/TagServices";
import { StudentType } from "../models/StudentModels";
import { TagsType } from "../models/Common";

// GET /students
export const getStudentsController = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const students = await StudentServices.getStudents();

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ students: students }, "students");

    if (students && Array.isArray(students)) {
        if (students.length > 0) return reply.status(200).send(students);
        else if (students.length === 0) return reply.status(404).send([]);
    } else if (students === null) return reply.status(404).send([]);

    return reply.status(500).send({});
};

// POST /students
export const postStudentsController = async (
    request: FastifyRequest<{ Body: Omit<StudentType, "id"> }>,
    reply: FastifyReply
) => {
    const newStudent = request.body;
    const dbStudent = await StudentServices.createStudent(newStudent);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ student: dbStudent }, "dbStudent");

    if (dbStudent) {
        return reply.status(200).send(dbStudent);
    }

    return reply.status(500).send({});
};

// GET /students/tags
export const getStudentsTagsController = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const dbTags = await TagServices.getTagsForStudents();

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

// GET /students/:id
export const getStudentController = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const student = await StudentServices.getStudent(id);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ student: student }, "student");

    if (student) {
        return reply.status(200).send(student);
    } else if (student === null) return reply.status(404).send({});

    return reply.status(500).send({});
};

// PUT /students/:id
export const putStudentController = async (
    request: FastifyRequest<{
        Body: Omit<StudentType, "id">;
        Params: { id: string };
    }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const newStudent = request.body;
    const dbStudent = await StudentServices.replaceStudent(id, newStudent);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ student: dbStudent }, "dbStudent");

    if (dbStudent) {
        return reply.status(200).send(dbStudent);
    } else if (dbStudent === null) return reply.status(404).send({});

    return reply.status(500).send({});
};

// PATCH /students/:id
export const patchStudentController = async (
    request: FastifyRequest<{
        Body: Partial<Omit<StudentType, "id">>;
        Params: { id: string };
    }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const newStudent = request.body;
    const dbStudent = await StudentServices.updateStudent(id, newStudent);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ student: dbStudent }, "dbStudent");

    if (dbStudent) {
        return reply.status(200).send(dbStudent);
    } else if (dbStudent === null) return reply.status(404).send({});

    return reply.status(500).send({});
};

// DELETE /students/:id
export const deleteStudentController = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const success = await StudentServices.deleteStudent(id);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ success: success }, "success status");

    if (success !== undefined) {
        if (success === null) return reply.status(404).send({});
        else return reply.status(200).send({ success });
    }
    return reply.status(500).send({});
};

// GET /students/:id/tags
export const getStudentTagsController = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const dbTags = await TagServices.getTagsForStudent(id);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ tags: dbTags }, "dbTags");

    if (dbTags) {
        return reply.status(200).send(dbTags);
    } else if (dbTags === null) return reply.status(404).send({});

    return reply.status(500).send({});
};

// POST, PUT /students/:id/tags
export const replaceStudentTagsController = async (
    request: FastifyRequest<{
        Body: { tags: TagsType };
        Params: { id: string };
    }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const { tags } = request.body;
    const dbStudent = await TagServices.replaceTagsForStudent(id, tags);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ student: dbStudent }, "dbStudent");

    if (dbStudent) {
        return reply.status(200).send(dbStudent.tags);
    } else if (dbStudent === null) return reply.status(404).send({});

    return reply.status(500).send({});
};

// PATCH /students/:id/tags
export const updateStudentTagsController = async (
    request: FastifyRequest<{
        Body: { tags: TagsType };
        Params: { id: string };
    }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const { tags } = request.body;
    const dbStudent = await TagServices.updateTagsForStudent(id, tags);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ student: dbStudent }, "dbStudent");

    if (dbStudent) {
        return reply.status(200).send(dbStudent.tags);
    } else if (dbStudent === null) return reply.status(404).send({});

    return reply.status(500).send({});
};

// DELETE /students/:id/tags
export const deleteStudentTagsController = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const dbStudent = await TagServices.deleteTagsForStudent(id);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ student: dbStudent }, "dbStudent");

    if (dbStudent) return reply.status(200).send(dbStudent.tags.length === 0);
    if (dbStudent === null) return reply.status(404).send({});

    return reply.status(500).send({});
};

// GET /students/:id/tags/:id
export const getStudentTagController = async (
    request: FastifyRequest<{ Params: { id: string; tagText: string } }>,
    reply: FastifyReply
) => {
    const { id, tagText } = request.params;
    const dbTag = await TagServices.getTagByText(tagText);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ tag: dbTag }, "dbTag");

    if (dbTag) {
        return reply.status(200).send(dbTag);
    } else if (dbTag === null) return reply.status(404).send({});

    return reply.status(500).send({});
};

// DELETE /students/:id/tags/:id
export const deleteStudentTagController = async (
    request: FastifyRequest<{ Params: { id: string; tagText: string } }>,
    reply: FastifyReply
) => {
    const { id, tagText } = request.params;
    const dbTag = await TagServices.getTagByText(tagText);
    if (!dbTag) return reply.status(404).send({});

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ tag: dbTag }, "dbTag");

    const success = await TagServices.deleteTagForStudent(id, dbTag.id);

    request.log.debug({ success: success }, "success");

    if (success === null) return reply.status(404).send({});
    if (success !== undefined) return reply.status(200).send(true);

    return reply.status(500).send({});
};
