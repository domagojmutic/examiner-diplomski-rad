import { app, serverAddress } from "../app";
import { IdType } from "../models/Common";
import {
    ExamInstanceAnswerType,
    ExamInstanceType,
    examInstanceAnswerModel,
    examInstanceModel,
} from "../models/ExamModels";
import { studentModel } from "../models/StudentModels";
import { getExam } from "./ExamServices";
import puppeteer from "puppeteer";
import { getStudent } from "./StudentServices";

export const getExamInstances = async (
    examId: IdType
): Promise<ExamInstanceType[] | null | undefined> => {
    const dbObject = await app.db.selectExamInstances(examId);

    if (dbObject === null) return null;
    if (examInstanceModel.array().parse(dbObject)) {
        return dbObject;
    } else return undefined;
};

export const deleteExamInstances = async (examId: IdType) => {
    const dbResult = await app.db.deleteExamInstances(examId);

    if (dbResult === null) return null;
    if (dbResult !== undefined) {
        return dbResult;
    } else return undefined;
};

export const getExamInstance = async (
    id: IdType
): Promise<ExamInstanceType | null | undefined> => {
    const dbObject = await app.db.selectExamInstance(id);

    if (dbObject === null) return null;
    if (examInstanceModel.parse(dbObject)) {
        return dbObject;
    } else return undefined;
};

export const createExamInstance = async (
    newExamInstance: Omit<ExamInstanceType, "id">
) => {
    if (examInstanceModel.omit({ id: true }).parse(newExamInstance)) {
        const dbObject = await app.db.insertExamInstance(newExamInstance);

        if (examInstanceModel.parse(dbObject)) {
            return dbObject;
        } else return undefined;
    } else return undefined;
};

export const replaceExamInstance = async (
    id: IdType,
    newExamInstance: Omit<ExamInstanceType, "id">
) => {
    if (examInstanceModel.omit({ id: true }).parse(newExamInstance)) {
        const dbObject = await app.db.updateExamInstance(
            id,
            newExamInstance,
            true
        );

        if (examInstanceModel.parse(dbObject)) {
            return dbObject;
        } else return undefined;
    } else return undefined;
};

export const updateExamInstance = async (
    id: IdType,
    newExamInstance: Partial<Omit<ExamInstanceType, "id">>
) => {
    if (examInstanceModel.omit({ id: true }).parse(newExamInstance)) {
        const dbObject = await app.db.updateExamInstance(
            id,
            newExamInstance,
            true
        );

        if (examInstanceModel.parse(dbObject)) {
            return dbObject;
        } else return undefined;
    } else return undefined;
};

export const deleteExamInstance = async (id: IdType) => {
    const dbResult = await app.db.deleteExamInstance(id);

    if (dbResult === null) return null;
    if (dbResult !== undefined) {
        return dbResult;
    } else return undefined;
};

export const getExamInstanceStudents = async (examInstanceId: IdType) => {
    const dbObject = await app.db.selectExamInstance(examInstanceId);

    if (dbObject === null) return null;
    if (examInstanceModel.parse(dbObject)) {
        const studentIds = dbObject.studentIds;

        const dbStudentsObject = await app.db.selectStudents({ studentIds });

        if (dbStudentsObject === null) return null;
        if (studentModel.array().parse(dbStudentsObject)) {
            return dbStudentsObject;
        } else return undefined;
    } else return undefined;
};

export const updateExamInstanceStudents = async (
    examInstanceId: IdType,
    studentIds: IdType[]
) => {
    const dbObject = await app.db.updateExamInstance(
        examInstanceId,
        { studentIds: studentIds },
        false
    );

    if (dbObject === null) return null;
    if (examInstanceModel.parse(dbObject)) {
        return dbObject;
    } else return undefined;
};

export const replaceExamInstanceStudents = async (
    examInstanceId: IdType,
    studentIds: IdType[]
) => {
    const oldDbObject = await getExamInstance(examInstanceId);
    const dbObject = await app.db.updateExamInstance(
        examInstanceId,
        { ...oldDbObject, studentIds: studentIds },
        true
    );

    if (dbObject === null) return null;
    if (examInstanceModel.parse(dbObject)) {
        return dbObject;
    } else return undefined;
};

export const deleteExamInstanceStudents = async (examInstanceId: IdType) => {
    const oldDbObject = await getExamInstance(examInstanceId);
    const dbObject = await app.db.updateExamInstance(
        examInstanceId,
        { ...oldDbObject, studentIds: [] },
        true
    );

    if (dbObject === null) return null;
    if (examInstanceModel.parse(dbObject)) {
        return dbObject;
    } else return undefined;
};

export const deleteExamInstanceStudent = async (
    examInstanceId: IdType,
    studentId: IdType
) => {
    const dbObject = await app.db.selectExamInstance(examInstanceId);
    if (dbObject === null) return null;

    const studentIds = dbObject.studentIds.filter((sId) => sId !== studentId);
    const dbObjectUpdated = await app.db.updateExamInstance(
        examInstanceId,
        { ...dbObject, studentIds: studentIds },
        true
    );

    if (
        dbObjectUpdated &&
        studentIds.length === dbObjectUpdated.studentIds.length &&
        studentIds.every((sId) => dbObjectUpdated.studentIds.includes(sId))
    )
        return true;
    else return false;
};

export const createExamInstancePDF = async (
    examId: IdType,
    instanceId: IdType,
    group: string
) => {
    const examInstance = await getExamInstance(instanceId);
    if (!examInstance) return examInstance;

    const exam = await getExam(examInstance.examId);
    if (!exam) return exam;

    const browser = await puppeteer.launch({
        headless: true,
        acceptInsecureCerts: true,
    });
    const page = await browser.newPage();
    await page.goto(
        `${serverAddress}/template/index.html#/exams/${examId}/instances/${instanceId}/groups/${group}`,
        { waitUntil: "networkidle0" }
    );
    const pdf = await page.pdf({
        format: "A4",
        margin: { bottom: "10mm", left: "10mm", right: "10mm", top: "10mm" },
    });

    await browser.close();

    return pdf;
};

export const createExamInstanceStudentPDF = async (
    examId: IdType,
    instanceId: IdType,
    studentId: IdType
) => {
    const examInstance = await getExamInstance(instanceId);
    if (!examInstance) return examInstance;

    const exam = await getExam(examId);
    if (!exam) return exam;

    const student = await getStudent(studentId);
    if (!student) return student;

    const browser = await puppeteer.launch({
        headless: true,
        acceptInsecureCerts: true,
    });
    const page = await browser.newPage();
    await page.goto(
        `${serverAddress}/template/index.html#/exams/${examId}/instances/${instanceId}/sheets/${studentId}`,
        { waitUntil: "networkidle0" }
    );
    const pdf = await page.pdf({
        format: "A4",
        margin: { bottom: "10mm", left: "10mm", right: "10mm", top: "10mm" },
    });

    await browser.close();

    return pdf;
};

export const createExamInstanceStudentsPDF = async (
    examId: IdType,
    instanceId: IdType
) => {
    const examInstance = await getExamInstance(instanceId);
    if (!examInstance) return examInstance;

    const exam = await getExam(examId);
    if (!exam) return exam;

    const browser = await puppeteer.launch({
        headless: true,
        acceptInsecureCerts: true,
    });
    const page = await browser.newPage();
    await page.goto(
        `${serverAddress}/template/index.html#/exams/${examId}/instances/${instanceId}/sheets`,
        { waitUntil: "networkidle0" }
    );
    const pdf = await page.pdf({
        format: "A4",
        margin: { bottom: "10mm", left: "10mm", right: "10mm", top: "10mm" },
    });

    await browser.close();

    return pdf;
};

export const getExamInstanceAnswers = async (instanceId: string) => {
    const dbObject = await app.db.selectExamInstanceAnswers(instanceId);

    if (dbObject === null) return null;
    if (examInstanceAnswerModel.array().parse(dbObject)) {
        return dbObject;
    } else return undefined;
};

export const deleteExamInstanceAnswers = async (instanceId: string) => {
    const dbResult = await app.db.deleteExamInstanceAnswers(instanceId);

    if (dbResult === null) return null;
    if (dbResult !== undefined) {
        return dbResult;
    } else return undefined;
};

export const getExamInstanceStudentAnswers = async (
    instanceId: string,
    studentId: string
) => {
    const dbObject = await app.db.selectExamInstanceAnswers(
        instanceId,
        studentId
    );

    if (dbObject === null) return null;
    if (examInstanceAnswerModel.array().parse(dbObject)) {
        return dbObject;
    } else return undefined;
};

export const createExamInstanceStudentAnswer = async (
    instanceId: string,
    studentId: string,
    newExamInstanceAnswer: ExamInstanceAnswerType
) => {
    if (examInstanceAnswerModel.parse(newExamInstanceAnswer)) {
        const dbObject = await app.db.insertExamInstanceAnswer({
            ...newExamInstanceAnswer,
            examInstanceId: instanceId,
            studentId: studentId,
        });

        if (examInstanceAnswerModel.parse(dbObject)) {
            return dbObject;
        } else return undefined;
    } else return undefined;
};

export const deleteExamInstanceStudentAnswers = async (
    instanceId: string,
    studentId: string
) => {
    const dbResult = await app.db.deleteExamInstanceAnswers(
        instanceId,
        studentId
    );

    if (dbResult === null) return null;
    if (dbResult !== undefined) {
        return dbResult;
    } else return undefined;
};

export const getExamInstanceStudentAnswer = async (
    instanceId: string,
    studentId: string,
    scanNumber: number
) => {
    const dbObject = await app.db.selectExamInstanceAnswers(
        instanceId,
        studentId,
        scanNumber
    );

    if (dbObject === null) return null;
    if (
        examInstanceAnswerModel.array().parse(dbObject) &&
        examInstanceAnswerModel.parse(dbObject[0])
    ) {
        return dbObject[0];
    } else return undefined;
};

export const updateExamInstanceStudentAnswer = async (
    instanceId: string,
    studentId: string,
    scanNumber: number,
    newExamInstanceAnswer: ExamInstanceAnswerType
) => {
    if (examInstanceAnswerModel.parse(newExamInstanceAnswer)) {
        const dbObject = await app.db.updateExamInstanceAnswer(
            instanceId,
            studentId,
            scanNumber,
            {
                ...newExamInstanceAnswer,
                examInstanceId: instanceId,
                studentId: studentId,
                scanNumber: scanNumber,
            }
        );

        if (examInstanceAnswerModel.parse(dbObject)) {
            return dbObject;
        } else return undefined;
    } else return undefined;
};

export const deleteExamInstanceStudentAnswer = async (
    instanceId: string,
    studentId: string,
    scanNumber: number
) => {
    const dbResult = await app.db.deleteExamInstanceAnswers(
        instanceId,
        studentId,
        scanNumber
    );

    if (dbResult === null) return null;
    if (dbResult !== undefined) {
        return dbResult;
    } else return undefined;
};
