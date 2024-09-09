import { FastifyReply, FastifyRequest, RouteHandlerMethod } from "fastify";
import * as ExamServices from "../services/ExamServices";
import * as QuestionServices from "../services/QuestionServices";
import * as SubjectServices from "../services/SubjectServices";
import * as TagServices from "../services/TagServices";
import { ExamType } from "../models/ExamModels";
import { QuestionType } from "../models/QuestionModels";
import { IdType, TagsType } from "../models/Common";

// GET /exams
export const getExamsController = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const exams = await ExamServices.getExams();

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ exams: exams }, "exams");

    if (exams && Array.isArray(exams)) {
        if (exams.length > 0) return reply.status(200).send(exams);
        else if (exams.length === 0) return reply.status(404).send([]);
    } else if (exams === null) return reply.status(404).send([]);

    return reply.status(500).send({});
};

// POST /exams
export const postExamsController = async (
    request: FastifyRequest<{ Body: Omit<ExamType, "id"> }>,
    reply: FastifyReply
) => {
    const newExam = request.body;
    const dbExam = await ExamServices.createExam(newExam);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ exam: dbExam }, "dbExam");

    if (dbExam) {
        return reply.status(200).send(dbExam);
    }

    return reply.status(500).send({});
};

// GET /exams/tags
export const getExamsTagsController = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const dbTags = await TagServices.getTagsForExams();

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

// GET /exams/:id
export const getExamController = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const dbExam = await ExamServices.getExam(id);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ exam: dbExam }, "dbExam");

    if (dbExam) {
        return reply.status(200).send(dbExam);
    } else if (dbExam === null) return reply.status(404).send({});

    return reply.status(500).send({});
};

// PUT /exams/:id
export const putExamController = async (
    request: FastifyRequest<{
        Body: Omit<ExamType, "id">;
        Params: { id: string };
    }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const newExam = request.body;
    const dbExam = await ExamServices.replaceExam(id, newExam);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ exam: dbExam }, "dbExam");

    if (dbExam) {
        return reply.status(200).send(dbExam);
    } else if (dbExam === null) return reply.status(404).send({});

    return reply.status(500).send({});
};

// PATCH /exams/:id
export const patchExamController = async (
    request: FastifyRequest<{
        Body: Partial<Omit<ExamType, "id">>;
        Params: { id: string };
    }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const newExam = request.body;
    const dbExam = await ExamServices.updateExam(id, newExam);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ exam: dbExam }, "dbExam");

    if (dbExam) {
        return reply.status(200).send(dbExam);
    } else if (dbExam === null) return reply.status(404).send({});

    return reply.status(500).send({});
};

// DELETE /exams/:id
export const deleteExamController = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const success = await ExamServices.deleteExam(id);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ success: success }, "success status");

    if (success !== undefined) {
        if (success === null) return reply.status(404).send({});
        else return reply.status(200).send({ success });
    }
    return reply.status(500).send({});
};

// GET /exams/:id/questions
export const getExamQuestionsController = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const questions = await QuestionServices.getQuestionsForExam(id);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ questions: questions }, "questions");

    if (questions && Array.isArray(questions)) {
        return reply.status(200).send(questions);
    } else if (questions === null) return reply.status(404).send([]);

    return reply.status(500).send({});
};

// POST /exams/:id/questions
export const postExamQuestionsController = async (
    request: FastifyRequest<{
        Body: Omit<QuestionType, "id">;
        Params: { id: string };
    }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const newQuestion = request.body;
    const dbQuestion = await QuestionServices.createQuestion(newQuestion);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ newQuestion: dbQuestion }, "question");

    if (!dbQuestion) {
        return reply.status(500).send({});
    }

    const dbExam = await ExamServices.updateExamQuestions(id, [dbQuestion.id]);

    if (dbExam) {
        if (dbExam.subjectIds) {
            await Promise.all(
                dbExam.subjectIds.map(async (subjectId) => {
                    const dbSubject =
                        await SubjectServices.updateSubjectQuestions(
                            subjectId,
                            [dbQuestion.id]
                        );
                    request.log.debug({ subject: dbSubject }, "subject");
                })
            );
        }

        return reply.status(200).send(dbExam.questionIds);
    }
    if (dbExam === null) return reply.status(404).send([]);

    return reply.status(500).send({});
};

// PATCH /exams/:id/questions
export const patchExamQuestionsController = async (
    request: FastifyRequest<{
        Body: { questionIds: IdType[] };
        Params: { id: string };
    }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const { questionIds } = request.body;
    const dbExam = await ExamServices.updateExamQuestions(id, questionIds);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ exam: dbExam }, "dbExam");

    if (dbExam) return reply.status(200).send(dbExam.questionIds);
    if (dbExam === null) return reply.status(404).send([]);

    return reply.status(500).send({});
};

// PUT /exams/:id/questions
export const putExamQuestionsController = async (
    request: FastifyRequest<{
        Body: { questionIds: IdType[] };
        Params: { id: string };
    }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const { questionIds } = request.body;
    const dbExam = await ExamServices.replaceExamQuestions(id, questionIds);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ exam: dbExam }, "dbExam");

    if (dbExam) return reply.status(200).send(dbExam.questionIds);
    if (dbExam === null) return reply.status(404).send([]);

    return reply.status(500).send({});
};

// DELETE /exams/:id/questions
export const deleteExamQuestionsController = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const dbExam = await ExamServices.deleteExamQuestions(id);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ exam: dbExam }, "dbExam");

    if (dbExam)
        return reply
            .status(200)
            .send({ success: dbExam.questionIds.length === 0 });
    if (dbExam === null) return reply.status(404).send([]);

    return reply.status(500).send({});
};

// GET /exams/:id/questions/:questionId
export const getExamQuestionController = async (
    request: FastifyRequest<{ Params: { id: string; questionId: string } }>,
    reply: FastifyReply
) => {
    return reply.redirect(303, `/api/questions/${request.params.questionId}`);
};

// DELETE /exams/:id/questions/:questionId
export const deleteExamQuestionController = async (
    request: FastifyRequest<{ Params: { id: string; questionId: string } }>,
    reply: FastifyReply
) => {
    const { id, questionId } = request.params;
    const success = await ExamServices.deleteExamQuestion(id, questionId);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ success: success }, "success");

    if (success === null) return reply.status(404).send([]);
    else if (success !== undefined) return reply.status(200).send({ success });

    return reply.status(500).send({});
};

// GET /exams/:id/subjects
export const getExamSubjectsController = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const dbSubjects = await ExamServices.getSubjectsForExam(id);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ subjects: dbSubjects }, "dbSubjects");

    if (dbSubjects && Array.isArray(dbSubjects)) {
        return reply.status(200).send(dbSubjects);
    } else if (dbSubjects === null) return reply.status(404).send([]);

    return reply.status(500).send({});
};

// PATCH /exams/:id/subjects
export const patchExamSubjectsController = async (
    request: FastifyRequest<{
        Body: { subjectIds: IdType[] };
        Params: { id: string };
    }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const { subjectIds } = request.body;
    const dbExam = await ExamServices.updateExamSubjects(id, subjectIds);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ exam: dbExam }, "dbExam");

    if (dbExam) return reply.status(200).send(dbExam.subjectIds);
    if (dbExam === null) return reply.status(404).send([]);

    return reply.status(500).send({});
};

// PUT /exams/:id/subjects
export const putExamSubjectsController = async (
    request: FastifyRequest<{
        Body: { subjectIds: IdType[] };
        Params: { id: string };
    }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const { subjectIds } = request.body;
    const dbExam = await ExamServices.replaceExamSubjects(id, subjectIds);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ exam: dbExam }, "dbExam");

    if (dbExam) return reply.status(200).send(dbExam.subjectIds);
    if (dbExam === null) return reply.status(404).send([]);

    return reply.status(500).send({});
};

// DELETE /exams/:id/subjects
export const deleteExamSubjectsController = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const dbExam = await ExamServices.deleteExamSubjects(id);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ exam: dbExam }, "dbExam");

    if (dbExam)
        return reply.status(200).send({
            success: dbExam.subjectIds ? dbExam.subjectIds.length === 0 : true,
        });
    if (dbExam === null) return reply.status(404).send([]);

    return reply.status(500).send({});
};

// GET /exams/:id/subjects/:subjectId
export const getExamSubjectController = async (
    request: FastifyRequest<{ Params: { id: string; subjectId: string } }>,
    reply: FastifyReply
) => {
    return reply.redirect(303, `/api/subjects/${request.params.subjectId}`);
};

// DELETE /exams/:id/subjects/:subjectId
export const deleteExamSubjectController = async (
    request: FastifyRequest<{ Params: { id: string; subjectId: string } }>,
    reply: FastifyReply
) => {
    const { id, subjectId } = request.params;
    const success = await ExamServices.deleteExamSubject(id, subjectId);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ success: success }, "success");

    if (success === null) return reply.status(404).send([]);
    return reply.status(200).send({ success });
};

// GET /exams/:id/tags
export const getExamTagsController = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const dbTags = await TagServices.getTagsForExam(id);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ tags: dbTags }, "dbTags");

    if (dbTags) {
        return reply.status(200).send(dbTags);
    } else if (dbTags === null) return reply.status(404).send({});

    return reply.status(500).send({});
};

// POST, PUT /exams/:id/tags
export const replaceExamTagsController = async (
    request: FastifyRequest<{
        Body: { tags: TagsType };
        Params: { id: string };
    }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const { tags } = request.body;
    const dbExam = await TagServices.replaceTagsForExam(id, tags);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ exam: dbExam }, "dbExam");

    if (dbExam) {
        return reply.status(200).send(dbExam.tags);
    } else if (dbExam === null) return reply.status(404).send({});

    return reply.status(500).send({});
};

// PATCH /exams/:id/tags
export const updateExamTagsController = async (
    request: FastifyRequest<{
        Body: { tags: TagsType };
        Params: { id: string };
    }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const { tags } = request.body;
    const dbExam = await TagServices.updateTagsForExam(id, tags);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ exam: dbExam }, "dbExam");

    if (dbExam) return reply.status(200).send(dbExam.tags);
    if (dbExam === null) return reply.status(404).send({});

    return reply.status(500).send({});
};

// DELETE /exams/:id/tags
export const deleteExamTagsController = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const dbExam = await TagServices.deleteTagsForExam(id);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ exam: dbExam }, "dbExam");

    if (dbExam)
        return reply.status(200).send({ success: dbExam.tags.length === 0 });
    if (dbExam === null) return reply.status(404).send({});

    return reply.status(500).send({});
};

// GET /exams/:id/tags/:id
export const getExamTagController = async (
    request: FastifyRequest<{ Params: { id: string; tagText: string } }>,
    reply: FastifyReply
) => {
    const { id, tagText } = request.params;
    const dbTag = await TagServices.getTagById(tagText);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ tag: dbTag }, "dbTag");

    if (dbTag) {
        return reply.status(200).send(dbTag);
    } else if (dbTag === null) return reply.status(404).send({});

    return reply.status(500).send({});
};

// DELETE /exams/:id/tags/:id
export const deleteExamTagController = async (
    request: FastifyRequest<{ Params: { id: string; tagText: string } }>,
    reply: FastifyReply
) => {
    const { id, tagText } = request.params;
    const dbTag = await TagServices.getTagByText(tagText);
    if (!dbTag) return reply.status(404).send({});

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ tag: dbTag }, "dbTag");

    const success = await TagServices.deleteTagForExam(id, dbTag.id);

    request.log.debug({ success: success }, "success");

    if (success === null) return reply.status(404).send({});
    if (success !== undefined) return reply.status(200).send({ success });

    return reply.status(500).send({});
};
