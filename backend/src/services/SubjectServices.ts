import { SubjectType, subjectModel } from "../models/SubjectModels";
import { app } from "../app";
import { IdType } from "../models/Common";
import {
    create,
    deleteDB,
    get,
    getAll,
    replace,
    update,
} from "./GenericServices";

export const getSubjects = async (): Promise<
    SubjectType[] | null | undefined
> => {
    return await getAll("subject");
};

export const getSubject = async (
    id: IdType
): Promise<SubjectType | null | undefined> => {
    return await get("subject", id);
};

export const createSubject = async (
    newSubject: Omit<SubjectType, "id">
): Promise<SubjectType | undefined> => {
    return await create<SubjectType>("subject", newSubject);
};

export const replaceSubject = async (
    id: IdType,
    newSubject: Omit<SubjectType, "id">
): Promise<SubjectType | null | undefined> => {
    return await replace<SubjectType>("subject", id, newSubject);
};

export const updateSubject = async (
    id: IdType,
    newSubject: Partial<SubjectType>
): Promise<SubjectType | null | undefined> => {
    return await update<SubjectType>("subject", id, newSubject);
};

export const deleteSubject = async (
    id: IdType
): Promise<boolean | null | undefined> => {
    return await deleteDB("subject", id);
};

export const replaceSubjectQuestions = async (
    id: IdType,
    questionIds: IdType[]
) => {
    const oldDbObject = await getSubject(id);
    const dbObject = await app.db.updateSubject(
        id,
        { ...oldDbObject, questionIds: questionIds },
        true
    );

    if (dbObject === null) return null;
    if (subjectModel.parse(dbObject)) {
        return dbObject;
    } else return undefined;
};

export const updateSubjectQuestions = async (
    id: IdType,
    questionIds: IdType[]
) => {
    const dbObject = await app.db.updateSubject(
        id,
        { questionIds: questionIds },
        false
    );

    if (dbObject === null) return null;
    if (subjectModel.parse(dbObject)) {
        return dbObject;
    } else return undefined;
};

export const deleteSubjectQuestions = async (id: IdType) => {
    const oldDbObject = await getSubject(id);
    const dbObject = await app.db.updateSubject(
        id,
        { ...oldDbObject, questionIds: [] },
        true
    );

    if (dbObject === null) return null;
    if (subjectModel.parse(dbObject)) {
        return dbObject;
    } else return undefined;
};

export const deleteSubjectQuestion = async (id: IdType, questionId: IdType) => {
    const dbObject = await app.db.selectSubject(id);
    if (dbObject === null) return null;

    const questionIds = dbObject.questionIds.filter(
        (qId) => qId !== questionId
    );
    const dbObjectUpdated = await app.db.updateSubject(
        id,
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
