import { FastifyReply, FastifyRequest } from "fastify";
import * as ExamInstanceServices from "../services/ExamInstanceServices";
import * as StudentServices from "../services/StudentServices";
import { ExamInstanceAnswerType, ExamInstanceType } from "../models/ExamModels";
import { IdType } from "../models/Common";
import { StudentType } from "../models/StudentModels";

// GET /exams/:id/instances
export const getExamInstancesController = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const examInstances = await ExamInstanceServices.getExamInstances(id);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ examInstances: examInstances }, "examInstances");

    if (examInstances && Array.isArray(examInstances)) {
        if (examInstances.length > 0)
            return reply.status(200).send(examInstances);
        else if (examInstances.length === 0) return reply.status(404).send([]);
    } else if (examInstances === null) return reply.status(404).send([]);

    return reply.status(500).send({});
};

// POST /exams/:id/instances
export const postExamInstancesController = async (
    request: FastifyRequest<{ Body: Omit<ExamInstanceType, "id" | "seed"> }>,
    reply: FastifyReply
) => {
    const newExamInstance = {
        ...request.body,
        seed: (Math.random() * 2 ** 32) >>> 0,
    };
    const dbExamInstance = await ExamInstanceServices.createExamInstance(
        newExamInstance
    );

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ exam: dbExamInstance }, "dbExamInstance");

    if (dbExamInstance) {
        return reply.status(200).send(dbExamInstance);
    }

    return reply.status(500).send({});
};

// DELETE /exams/:id/instances
export const deleteExamInstancesController = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const success = await ExamInstanceServices.deleteExamInstances(id);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ success: success }, "success status");

    if (success !== undefined) {
        if (success === null) return reply.status(404).send({});
        else return reply.status(200).send({ success });
    }
    return reply.status(500).send({});
};

// GET /exams/:id/instances/:instanceId.pdf
export const getExamInstancePDFController = async (
    request: FastifyRequest<{
        Params: { id: string; instanceId: string; group: string };
    }>,
    reply: FastifyReply
) => {
    const { id, instanceId, group } = request.params;

    const file = await ExamInstanceServices.createExamInstancePDF(
        id,
        instanceId,
        group
    );

    reply.send(file);
};

// GET /exams/:id/instances/:instanceId/students/studentId.pdf
export const getExamInstanceStudentPDFController = async (
    request: FastifyRequest<{
        Params: { id: string; instanceId: string; studentId: string };
    }>,
    reply: FastifyReply
) => {
    const { id, instanceId, studentId } = request.params;

    const file = await ExamInstanceServices.createExamInstanceStudentPDF(
        id,
        instanceId,
        studentId
    );

    reply.send(file);
};

// GET /exams/:id/instances/:instanceId/students.pdf
export const getExamInstanceStudentsPDFController = async (
    request: FastifyRequest<{ Params: { id: string; instanceId: string } }>,
    reply: FastifyReply
) => {
    const { id, instanceId } = request.params;

    const file = await ExamInstanceServices.createExamInstanceStudentsPDF(
        id,
        instanceId
    );

    reply.send(file);
};

// GET /exams/:id/instances/:instanceId
export const getExamInstanceController = async (
    request: FastifyRequest<{ Params: { id: string; instanceId: string } }>,
    reply: FastifyReply
) => {
    const { id, instanceId } = request.params;
    const dbExamInstance = await ExamInstanceServices.getExamInstance(
        instanceId
    );

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ exam: dbExamInstance }, "dbExamInstance");

    if (dbExamInstance) {
        if (dbExamInstance.examId !== id) return reply.status(400).send({});
        return reply.status(200).send(dbExamInstance);
    } else if (dbExamInstance === null) return reply.status(404).send({});

    return reply.status(500).send({});
};

// DELETE /exams/:id/instances/:instanceId
export const deleteExamInstanceController = async (
    request: FastifyRequest<{ Params: { id: string; instanceId: string } }>,
    reply: FastifyReply
) => {
    const { id, instanceId } = request.params;
    const success = await ExamInstanceServices.deleteExamInstance(instanceId);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ success: success }, "success status");

    if (success !== undefined) {
        if (success === null) return reply.status(404).send({});
        else return reply.status(200).send({ success });
    }
    return reply.status(500).send({});
};

// GET /exams/:id/instances/:instanceId/answers
export const getExamInstanceAnswersController = async (
    request: FastifyRequest<{ Params: { id: string; instanceId: string } }>,
    reply: FastifyReply
) => {
    const { id, instanceId } = request.params;
    const dbExamInstanceAnswers =
        await ExamInstanceServices.getExamInstanceAnswers(instanceId);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ exam: dbExamInstanceAnswers }, "dbExamInstanceAnswers");

    if (dbExamInstanceAnswers && Array.isArray(dbExamInstanceAnswers)) {
        return reply.status(200).send(dbExamInstanceAnswers);
    } else if (dbExamInstanceAnswers === null)
        return reply.status(404).send({});

    return reply.status(500).send({});
};

// DELETE /exams/:id/instances/:instanceId/answers
export const deleteExamInstanceAnswersController = async (
    request: FastifyRequest<{ Params: { id: string; instanceId: string } }>,
    reply: FastifyReply
) => {
    const { id, instanceId } = request.params;
    const success = await ExamInstanceServices.deleteExamInstanceAnswers(
        instanceId
    );

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ success: success }, "success status");

    if (success !== undefined) {
        if (success === null) return reply.status(404).send({});
        else return reply.status(200).send({ success });
    }
    return reply.status(500).send({});
};

// GET /exams/:id/instances/:instanceId/students
export const getExamInstanceStudentsController = async (
    request: FastifyRequest<{ Params: { id: string; instanceId: string } }>,
    reply: FastifyReply
) => {
    const { id, instanceId } = request.params;
    const dbStudents = await ExamInstanceServices.getExamInstanceStudents(
        instanceId
    );

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ students: dbStudents }, "dbStudents");

    if (dbStudents && Array.isArray(dbStudents)) {
        return reply.status(200).send(dbStudents);
    } else if (dbStudents === null) return reply.status(404).send([]);

    return reply.status(500).send({});
};

// POST /exams/:id/instances/:instanceId/students
export const postExamInstanceStudentsController = async (
    request: FastifyRequest<{
        Body: Omit<StudentType, "id">;
        Params: { id: string; instanceId: string };
    }>,
    reply: FastifyReply
) => {
    const { id, instanceId } = request.params;
    const newStudent = request.body;
    const dbStudent = await StudentServices.createStudent(newStudent);

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ student: dbStudent }, "dbStudent");

    if (!dbStudent) {
        return reply.status(500).send({});
    }

    const dbExam = await ExamInstanceServices.updateExamInstanceStudents(
        instanceId,
        [dbStudent.id]
    );

    if (dbExam) return reply.status(200).send(dbExam.studentIds);
    if (dbExam === null) return reply.status(404).send([]);

    return reply.status(500).send({});
};

// PATCH /exams/:id/instances/:instanceId/students
export const patchExamInstanceStudentsController = async (
    request: FastifyRequest<{
        Body: { studentIds: IdType[] };
        Params: { id: string; instanceId: string };
    }>,
    reply: FastifyReply
) => {
    const { id, instanceId } = request.params;
    const { studentIds } = request.body;
    const dbExamInstance =
        await ExamInstanceServices.updateExamInstanceStudents(
            instanceId,
            studentIds
        );

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ exam: dbExamInstance }, "dbExamInstance");

    if (dbExamInstance)
        return reply.status(200).send(dbExamInstance.studentIds);
    if (dbExamInstance === null) return reply.status(404).send([]);

    return reply.status(500).send({});
};

// PUT /exams/:id/instances/:instanceId/students
export const putExamInstanceStudentsController = async (
    request: FastifyRequest<{
        Body: { studentIds: IdType[] };
        Params: { id: string; instanceId: string };
    }>,
    reply: FastifyReply
) => {
    const { id, instanceId } = request.params;
    const { studentIds } = request.body;
    const dbExamInstance =
        await ExamInstanceServices.replaceExamInstanceStudents(
            instanceId,
            studentIds
        );

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ exam: dbExamInstance }, "dbExamInstance");

    if (dbExamInstance)
        return reply.status(200).send(dbExamInstance.studentIds);
    if (dbExamInstance === null) return reply.status(404).send([]);

    return reply.status(500).send({});
};

// DELETE /exams/:id/instances/:instanceId/students
export const deleteExamInstanceStudentsController = async (
    request: FastifyRequest<{ Params: { id: string; instanceId: string } }>,
    reply: FastifyReply
) => {
    const { id, instanceId } = request.params;
    const dbExam = await ExamInstanceServices.deleteExamInstanceStudents(
        instanceId
    );

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ exam: dbExam }, "dbExam");

    if (dbExam)
        return reply
            .status(200)
            .send({ success: dbExam.studentIds.length === 0 });
    if (dbExam === null) return reply.status(404).send([]);

    return reply.status(500).send({});
};

// GET /exams/:id/instances/:instanceId/students/:studentId
export const getExamInstanceStudentController = async (
    request: FastifyRequest<{
        Params: { id: string; instanceId: string; studentId: string };
    }>,
    reply: FastifyReply
) => {
    return reply.redirect(303, `/api/students/${request.params.studentId}`);
};

// DELETE /exams/:id/instances/:instanceId/students/:studentId
export const deleteExamInstanceStudentController = async (
    request: FastifyRequest<{
        Params: { id: string; instanceId: string; studentId: string };
    }>,
    reply: FastifyReply
) => {
    const { id, instanceId, studentId } = request.params;
    const success = await ExamInstanceServices.deleteExamInstanceStudent(
        instanceId,
        studentId
    );

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ success: success }, "success");

    if (success === null) return reply.status(404).send([]);
    else if (success !== undefined) return reply.status(200).send({ success });

    return reply.status(500).send({});
};

// GET /exams/:id/instances/:instanceId/students/:studentId/answers
export const getExamInstanceStudentAnswersController = async (
    request: FastifyRequest<{
        Params: { id: string; instanceId: string; studentId: string };
    }>,
    reply: FastifyReply
) => {
    const { id, instanceId, studentId } = request.params;
    const dbExamInstanceAnswers =
        await ExamInstanceServices.getExamInstanceStudentAnswers(
            instanceId,
            studentId
        );

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ exam: dbExamInstanceAnswers }, "dbExamInstanceAnswers");

    if (dbExamInstanceAnswers && Array.isArray(dbExamInstanceAnswers)) {
        return reply.status(200).send(dbExamInstanceAnswers);
    } else if (dbExamInstanceAnswers === null)
        return reply.status(404).send({});

    return reply.status(500).send({});
};

// POST /exams/:id/instances/:instanceId/students/:studentId/answers
export const postExamInstanceStudentAnswersController = async (
    request: FastifyRequest<{
        Body: ExamInstanceAnswerType;
        Params: { id: string; instanceId: string; studentId: string };
    }>,
    reply: FastifyReply
) => {
    const { id, instanceId, studentId } = request.params;
    const newExamInstanceAnswer = request.body;
    const dbExamInstanceAnswer =
        await ExamInstanceServices.createExamInstanceStudentAnswer(
            instanceId,
            studentId,
            newExamInstanceAnswer
        );

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug(
        { student: dbExamInstanceAnswer },
        "dbExamInstanceAnswer"
    );

    if (dbExamInstanceAnswer)
        return reply.status(200).send(dbExamInstanceAnswer);
    if (dbExamInstanceAnswer === null) return reply.status(404).send([]);

    return reply.status(500).send({});
};
// DELETE /exams/:id/instances/:instanceId/students/:studentId/answers
export const deleteExamInstanceStudentAnswersController = async (
    request: FastifyRequest<{
        Params: { id: string; instanceId: string; studentId: string };
    }>,
    reply: FastifyReply
) => {
    const { id, instanceId, studentId } = request.params;
    const success = await ExamInstanceServices.deleteExamInstanceStudentAnswers(
        instanceId,
        studentId
    );

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ success: success }, "success");

    if (success === null) return reply.status(404).send([]);
    else if (success !== undefined) return reply.status(200).send({ success });

    return reply.status(500).send({});
};

// GET /exams/:id/instances/:instanceId/students/:studentId/answers/:scanNumber
export const getExamInstanceStudentAnswerController = async (
    request: FastifyRequest<{
        Params: {
            id: string;
            instanceId: string;
            studentId: string;
            scanNumber: string;
        };
    }>,
    reply: FastifyReply
) => {
    const { id, instanceId, studentId, scanNumber } = request.params;
    const dbExamInstanceAnswers =
        await ExamInstanceServices.getExamInstanceStudentAnswer(
            instanceId,
            studentId,
            parseInt(scanNumber)
        );

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ exam: dbExamInstanceAnswers }, "dbExamInstanceAnswers");

    if (dbExamInstanceAnswers) {
        return reply.status(200).send(dbExamInstanceAnswers);
    } else if (dbExamInstanceAnswers === null)
        return reply.status(404).send({});

    return reply.status(500).send({});
};

// PUT /exams/:id/instances/:instanceId/students/:studentId/answers/:scanNumber
export const putExamInstanceStudentAnswerController = async (
    request: FastifyRequest<{
        Body: ExamInstanceAnswerType;
        Params: {
            id: string;
            instanceId: string;
            studentId: string;
            scanNumber: string;
        };
    }>,
    reply: FastifyReply
) => {
    const { id, instanceId, studentId, scanNumber } = request.params;
    const newExamInstanceAnswer = request.body;
    const dbExamInstanceAnswer =
        await ExamInstanceServices.updateExamInstanceStudentAnswer(
            instanceId,
            studentId,
            parseInt(scanNumber),
            newExamInstanceAnswer
        );

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug(
        { student: dbExamInstanceAnswer },
        "dbExamInstanceAnswer"
    );

    if (dbExamInstanceAnswer)
        return reply.status(200).send(dbExamInstanceAnswer);
    if (dbExamInstanceAnswer === null) return reply.status(404).send([]);

    return reply.status(500).send({});
};
// DELETE /exams/:id/instances/:instanceId/students/:studentId/answers/:scanNumber
export const deleteExamInstanceStudentAnswerController = async (
    request: FastifyRequest<{
        Params: {
            id: string;
            instanceId: string;
            studentId: string;
            scanNumber: string;
        };
    }>,
    reply: FastifyReply
) => {
    const { id, instanceId, studentId, scanNumber } = request.params;
    const success = await ExamInstanceServices.deleteExamInstanceStudentAnswer(
        instanceId,
        studentId,
        parseInt(scanNumber)
    );

    request.log.debug({ body: request.body }, "request body");
    request.log.debug({ params: request.params }, "request params");
    request.log.debug({ success: success }, "success");

    if (success === null) return reply.status(404).send([]);
    else if (success !== undefined) return reply.status(200).send({ success });

    return reply.status(500).send({});
};
