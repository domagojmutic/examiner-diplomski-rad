import { app } from "../app";
import { IdType } from "../models/Common";
import { ExamType, examModel } from "../models/ExamModels";
import { subjectModel } from "../models/SubjectModels";
import {
    create,
    deleteDB,
    get,
    getAll,
    replace,
    update,
} from "./GenericServices";

export const getExams = async (): Promise<ExamType[] | null | undefined> => {
    return await getAll("exam");
};

export const getExam = async (
    id: IdType
): Promise<ExamType | null | undefined> => {
    return await get("exam", id);
};

export const createExam = async (newExam: Omit<ExamType, "id">) => {
    return await create<ExamType>("exam", newExam);
};

export const replaceExam = async (
    id: IdType,
    newExam: Omit<ExamType, "id">
) => {
    return await replace<ExamType>("exam", id, newExam);
};

export const updateExam = async (
    id: IdType,
    newExam: Partial<Omit<ExamType, "id">>
) => {
    return await update<ExamType>("exam", id, newExam);
};

export const deleteExam = async (id: IdType) => {
    return await deleteDB("exam", id);
};

export const updateExamQuestions = async (
    examId: IdType,
    questionIds: IdType[]
) => {
    const dbObject = await app.db.updateExam(
        examId,
        { questionIds: questionIds },
        false
    );

    if (dbObject === null) return null;
    if (examModel.parse(dbObject)) {
        return dbObject;
    } else return undefined;
};

export const replaceExamQuestions = async (
    id: IdType,
    questionIds: IdType[]
) => {
    const oldDbObject = await getExam(id);
    const dbObject = await app.db.updateExam(
        id,
        { ...oldDbObject, questionIds: questionIds },
        true
    );

    if (dbObject === null) return null;
    if (examModel.parse(dbObject)) {
        return dbObject;
    } else return undefined;
};

export const deleteExamQuestions = async (examId: IdType) => {
    const oldDbObject = await getExam(examId);
    const dbObject = await app.db.updateExam(
        examId,
        { ...oldDbObject, questionIds: [] },
        true
    );

    if (dbObject === null) return null;
    if (examModel.parse(dbObject)) {
        return dbObject;
    } else return undefined;
};

export const deleteExamQuestion = async (
    examId: IdType,
    questionId: IdType
) => {
    const dbObject = await app.db.selectExam(examId);
    if (dbObject === null) return null;

    const questionIds = dbObject.questionIds.filter(
        (qId) => qId !== questionId
    );
    const dbObjectUpdated = await app.db.updateExam(
        examId,
        { ...dbObject, questionIds: questionIds },
        true
    );

    if (
        dbObjectUpdated &&
        questionIds.length === dbObjectUpdated.questionIds.length &&
        questionIds.every((qId) => dbObjectUpdated.questionIds.includes(qId))
    )
        return true;
    else return false;
};

export const getExamsForSubject = async (
    subjectId: IdType
): Promise<ExamType[] | null | undefined> => {
    const dbObject = await app.db.selectExams({ subjectIds: [subjectId] });

    if (dbObject === null) return null;
    if (examModel.array().parse(dbObject)) {
        return dbObject;
    } else return undefined;
};

export const getSubjectsForExam = async (examId: IdType) => {
    const dbObject = await app.db.selectExam(examId);

    if (dbObject === null) return null;
    if (!examModel.parse(dbObject)) return undefined;

    const subjectIds = dbObject.subjectIds || [];
    const dbSubjects = await app.db.selectSubjects({ subjectIds: subjectIds });

    if (dbSubjects === null) return null;
    if (subjectModel.array().parse(dbSubjects)) {
        return dbSubjects;
    } else return undefined;
};

export const updateExamSubjects = async (
    examId: IdType,
    subjectIds: IdType[]
) => {
    const dbObject = await app.db.updateExam(
        examId,
        { subjectIds: subjectIds },
        false
    );

    if (dbObject === null) return null;
    if (examModel.parse(dbObject)) {
        return dbObject;
    } else return undefined;
};

export const replaceExamSubjects = async (
    examId: IdType,
    subjectIds: IdType[]
) => {
    const oldDbObject = await getExam(examId);
    const dbObject = await app.db.updateExam(
        examId,
        { ...oldDbObject, subjectIds: subjectIds },
        true
    );

    if (dbObject === null) return null;
    if (examModel.parse(dbObject)) {
        return dbObject;
    } else return undefined;
};

export const deleteExamSubjects = async (examId: IdType) => {
    const oldDbObject = await getExam(examId);
    const dbObject = await app.db.updateExam(
        examId,
        { ...oldDbObject, subjectIds: [] },
        true
    );

    if (dbObject === null) return null;
    if (examModel.parse(dbObject)) {
        return dbObject;
    } else return undefined;
};

export const deleteExamSubject = async (examId: IdType, subjectId: IdType) => {
    const dbObject = await app.db.selectExam(examId);
    if (dbObject === null) return null;

    if (!dbObject.subjectIds) return false;

    const subjectIds = dbObject.subjectIds.filter((sId) => sId !== subjectId);
    const dbObjectUpdated = await app.db.updateExam(
        examId,
        { ...dbObject, subjectIds: subjectIds },
        true
    );

    if (
        dbObjectUpdated &&
        subjectIds.length === dbObjectUpdated.questionIds.length &&
        (subjectIds.length === 0 ||
            subjectIds.every((sId) =>
                dbObjectUpdated.subjectIds!.includes(sId)
            ))
    )
        return true;
    else return false;
};
