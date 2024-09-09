import { FastifyReply, FastifyRequest, RouteHandlerMethod } from "fastify";
import * as SubjectServices from "../services/SubjectServices";
import * as QuestionServices from "../services/QuestionServices";
import * as ExamServices from "../services/ExamServices";
import * as TagServices from "../services/TagServices";
import { SubjectType } from "../models/SubjectModels";
import { QuestionType } from "../models/QuestionModels";
import { IdType, TagsType } from "../models/Common";
import { ExamType } from "../models/ExamModels";

// GET /subjects
export const getSubjectsController = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const subjects = await SubjectServices.getSubjects();

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ subjects: subjects }, "subjects");

    if (subjects && Array.isArray(subjects)) {
        if (subjects.length > 0) return reply.status(200).send(subjects);
        else if (subjects.length === 0) return reply.status(404).send([]);
    } else if (subjects === null) return reply.status(404).send([]);

    return reply.status(500).send({});
};

// POST /subjects
export const postSubjectsController = async (
    request: FastifyRequest<{ Body: Omit<SubjectType, "id"> }>,
    reply: FastifyReply
) => {
    const newSubject = request.body;
    const dbSubject = await SubjectServices.createSubject(newSubject);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ subject: dbSubject }, "subject");

    if (dbSubject) return reply.status(200).send(dbSubject);

    return reply.status(500).send({});
};

// GET /subjects/tags
export const getSubjectsTagsController = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const dbTags = await TagServices.getTagsForSubjects();

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

// GET /subjects/:id
export const getSubjectController = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const subject = await SubjectServices.getSubject(id);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ subject: subject }, "subject");

    if (subject) {
        return reply.status(200).send(subject);
    } else if (subject === null) return reply.status(404).send({});

    return reply.status(500).send({});
};

// PUT /subjects/:id
export const putSubjectController = async (
    request: FastifyRequest<{
        Body: Omit<SubjectType, "id">;
        Params: { id: string };
    }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const newSubject = request.body;
    const dbSubject = await SubjectServices.replaceSubject(id, newSubject);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ subject: dbSubject }, "subject");

    if (dbSubject) return reply.status(200).send(dbSubject);
    if (dbSubject === null) return reply.status(404).send({});

    return reply.status(500).send({});
};

// PATCH /subjects/:id
export const patchSubjectController = async (
    request: FastifyRequest<{
        Body: Partial<Omit<SubjectType, "id">>;
        Params: { id: string };
    }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const newSubject = request.body;
    const dbSubject = await SubjectServices.updateSubject(id, newSubject);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ subject: dbSubject }, "subject");

    if (dbSubject) return reply.status(200).send(dbSubject);
    if (dbSubject === null) return reply.status(404).send({});

    return reply.status(500).send({});
};

// DELETE /subjects/:id
export const deleteSubjectController = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const success = await SubjectServices.deleteSubject(id);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ success: success }, "success status");

    if (success !== undefined) {
        if (success === null) return reply.status(404).send({});
        else return reply.status(200).send({ success });
    }
    return reply.status(500).send({});
};

// GET /subjects/:id/questions
export const getSubjectQuestionsController = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const questions = await QuestionServices.getQuestionsForSubject(id);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ questions: questions }, "questions");

    if (questions && Array.isArray(questions)) {
        return reply.status(200).send(questions);
    } else if (questions === null) return reply.status(404).send([]);

    return reply.status(500).send({});
};

// POST /subjects/:id/questions
export const postSubjectQuestionsController = async (
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

    if (dbQuestion) {
        const dbSubject = await SubjectServices.updateSubjectQuestions(id, [
            dbQuestion.id,
        ]);
        request.log.debug({ subject: dbSubject }, "subject");

        if (dbSubject === null) return reply.status(404).send([]);
        if (dbSubject) return reply.status(200).send(dbSubject.questionIds);
    }

    return reply.status(500).send({});
};

// PATCH /subjects/:id/questions
export const patchSubjectQuestionsController = async (
    request: FastifyRequest<{
        Body: { questionIds: IdType[] };
        Params: { id: string };
    }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const { questionIds } = request.body;
    const dbSubject = await SubjectServices.updateSubjectQuestions(
        id,
        questionIds
    );

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ subject: dbSubject }, "subject");

    if (dbSubject) return reply.status(200).send(dbSubject.questionIds);
    if (dbSubject === null) return reply.status(404).send([]);

    return reply.status(500).send({});
};

// PUT /subjects/:id/questions
export const putSubjectQuestionsController = async (
    request: FastifyRequest<{
        Body: { questionIds: IdType[] };
        Params: { id: string };
    }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const { questionIds } = request.body;
    const dbSubject = await SubjectServices.replaceSubjectQuestions(
        id,
        questionIds
    );

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ subject: dbSubject }, "subject");

    if (dbSubject) return reply.status(200).send(dbSubject.questionIds);
    if (dbSubject === null) return reply.status(404).send([]);

    return reply.status(500).send({});
};

// DELETE /subjects/:id/questions
export const deleteSubjectQuestionsController = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const dbSubject = await SubjectServices.deleteSubjectQuestions(id);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ subject: dbSubject }, "subject");

    if (dbSubject)
        return reply.status(200).send(dbSubject.questionIds.length === 0);
    if (dbSubject === null) return reply.status(404).send([]);

    return reply.status(500).send({});
};

// GET /subjects/:id/questions/:id
export const getSubjectQuestionController = async (
    request: FastifyRequest<{ Params: { id: string; questionId: string } }>,
    reply: FastifyReply
) => {
    return reply.redirect(303, `/api/questions/${request.params.questionId}`);
};

// DELETE /subjects/:id/questions/:id
export const deleteSubjectQuestionController = async (
    request: FastifyRequest<{ Params: { id: string; questionId: string } }>,
    reply: FastifyReply
) => {
    const { id, questionId } = request.params;
    const success = await SubjectServices.deleteSubjectQuestion(id, questionId);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ success: success }, "success");

    if (success === null) return reply.status(404).send([]);
    else if (success !== undefined) return reply.status(200).send({ success });

    return reply.status(500).send({});
};

// GET /subjects/:id/exams
export const getSubjectExamsController = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const exams = await ExamServices.getExamsForSubject(id);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ questions: exams }, "exams");

    if (exams && Array.isArray(exams)) {
        return reply.status(200).send(exams);
    } else if (exams === null) return reply.status(404).send([]);

    return reply.status(500).send({});
};

// POST /subjects/:id/exams
export const postSubjectExamsController = async (
    request: FastifyRequest<{
        Body: Omit<ExamType, "id">;
        Params: { id: string };
    }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const newExam = request.body;
    newExam.subjectIds = [id];
    const dbExam = await ExamServices.createExam(newExam);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ newExam: dbExam }, "exam");

    if (dbExam) {
        const exams = await ExamServices.getExamsForSubject(id);

        request.log.debug({ body: request.body }, "request body");
        request.log.debug({ params: request.params }, "request params");
        request.log.debug({ questions: exams }, "exams");

        if (exams && Array.isArray(exams)) {
            return reply.status(200).send(exams);
        } else if (exams === null) return reply.status(404).send([]);
    }

    return reply.status(500).send({});
};

// DELETE /subjects/:id/exams
export const deleteSubjectExamsController = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const exams = await ExamServices.getExamsForSubject(id);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ exams: exams }, "exams");

    if (exams) {
        let success: boolean | null = null;
        exams.forEach(async (exam) => {
            success =
                success ||
                !!(await ExamServices.updateExam(exam.id, {
                    subjectIds:
                        exam.subjectIds?.filter((sid) => sid !== id) || [],
                }));
        });

        if (success === null) return reply.status(404).send([]);
        else if (success !== undefined)
            return reply.status(200).send({ success });
    }
    if (exams === null) return reply.status(404).send([]);

    return reply.status(500).send({});
};

// GET /subjects/:id/exams/:id
export const getSubjectExamController = async (
    request: FastifyRequest<{ Params: { id: string; examId: string } }>,
    reply: FastifyReply
) => {
    return reply.redirect(303, `/api/exams/${request.params.examId}`);
};

// DELETE /subjects/:id/exams/:id
export const deleteSubjectExamController = async (
    request: FastifyRequest<{ Params: { id: string; examId: string } }>,
    reply: FastifyReply
) => {
    const { id, examId } = request.params;
    const dbExam = await ExamServices.getExam(examId);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ dbExam: dbExam }, "dbExam");

    if (dbExam === null) return reply.status(404).send([]);
    else if (dbExam !== undefined) {
        const newExam = await ExamServices.updateExam(examId, {
            subjectIds: dbExam.subjectIds?.filter((sid) => sid !== id) || [],
        });
        if (newExam) {
            return reply.status(200).send(newExam);
        } else if (newExam === null) return reply.status(404).send({});
    }

    return reply.status(500).send({});
};

// GET /subjects/:id/tags
export const getSubjectTagsController = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const dbTags = await TagServices.getTagsForSubject(id);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ tags: dbTags }, "dbTags");

    if (dbTags) {
        return reply.status(200).send(dbTags);
    } else if (dbTags === null) return reply.status(404).send({});

    return reply.status(500).send({});
};

// POST, PUT /subjects/:id/tags
export const replaceSubjectTagsController = async (
    request: FastifyRequest<{
        Body: { tags: TagsType };
        Params: { id: string };
    }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const { tags } = request.body;
    const dbSubject = await TagServices.replaceTagsForSubject(id, tags);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ subject: dbSubject }, "dbSubject");

    if (dbSubject) return reply.status(200).send(dbSubject.tags);
    if (dbSubject === null) return reply.status(404).send({});

    return reply.status(500).send({});
};

// PATCH /subjects/:id/tags
export const updateSubjectTagsController = async (
    request: FastifyRequest<{
        Body: { tags: TagsType };
        Params: { id: string };
    }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const { tags } = request.body;
    const dbSubject = await TagServices.updateTagsForSubject(id, tags);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ subject: dbSubject }, "dbSubject");

    if (dbSubject) return reply.status(200).send(dbSubject.tags);
    if (dbSubject === null) return reply.status(404).send({});

    return reply.status(500).send({});
};

// DELETE /subjects/:id/tags
export const deleteSubjectTagsController = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const dbSubject = await TagServices.deleteTagsForSubject(id);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ subject: dbSubject }, "dbSubject");

    if (dbSubject) return reply.status(200).send(dbSubject.tags.length === 0);
    if (dbSubject === null) return reply.status(404).send({});

    return reply.status(500).send({});
};

// GET /subjects/:id/tags/:tagText
export const getSubjectTagController = async (
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

// DELETE /subjects/:id/tags/:tagText
export const deleteSubjectTagController = async (
    request: FastifyRequest<{ Params: { id: string; tagText: string } }>,
    reply: FastifyReply
) => {
    const { id, tagText } = request.params;
    const dbTag = await TagServices.getTagByText(tagText);
    if (!dbTag) return reply.status(404).send({});

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ tag: dbTag }, "dbTag");

    const success = await TagServices.deleteTagForSubject(id, dbTag.id);

    request.log.debug({ success: success }, "success");

    if (success === null) return reply.status(404).send({});
    if (success !== undefined) return reply.status(200).send({ success });

    return reply.status(500).send({});
};
