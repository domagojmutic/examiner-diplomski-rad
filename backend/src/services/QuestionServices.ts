import { app } from "../app";
import { IdType } from "../models/Common";
import { QuestionType, questionModel } from "../models/QuestionModels";
import {
    create,
    deleteDB,
    get,
    getAll,
    replace,
    update,
} from "./GenericServices";

export const getQuestions = async () => {
    return await getAll("question");
};

export const getQuestion = async (id: IdType): Promise<QuestionType | null | undefined> => {
    return await get("question", id);
};

export const createQuestion = async (
    newQuestion: Omit<QuestionType, "id">
): Promise<QuestionType | undefined> => {
    return await create<QuestionType>("question", newQuestion);
};

export const replaceQuestion = async (
    id: IdType,
    newQuestion: Omit<QuestionType, "id">
): Promise<QuestionType | undefined | null> => {
    return await replace<QuestionType>("question", id, newQuestion);
};

export const updateQuestion = async (
    id: IdType,
    newQuestion: Partial<Omit<QuestionType, "id">>
): Promise<QuestionType | undefined | null> => {
    return await update<QuestionType>("question", id, newQuestion);
};

export const deleteQuestion = async (id: IdType) => {
    return await deleteDB("question", id);
};

export const getQuestionsForSubject = async (
    subjectId: IdType
): Promise<QuestionType[] | null | undefined> => {
    const dbObject = await app.db.selectQuestions({ subjectIds: [subjectId] });

    if (dbObject === null) return null;
    if (questionModel.array().parse(dbObject)) {
        return dbObject;
    } else return undefined;
};

export const getQuestionsForExam = async (examId: IdType) => {
    const dbObject = await app.db.selectQuestions({ examIds: [examId] });

    if (dbObject === null) return null;
    if (questionModel.array().parse(dbObject)) {
        return dbObject;
    } else return undefined;
};
