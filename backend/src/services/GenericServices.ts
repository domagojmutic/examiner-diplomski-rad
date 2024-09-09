import { SubjectType, subjectModel } from "../models/SubjectModels";
import { app } from "../app";
import { IdType } from "../models/Common";
import { QuestionType, questionModel } from "../models/QuestionModels";
import { StudentType, studentModel } from "../models/StudentModels";
import { ExamType, examModel } from "../models/ExamModels";
import z from "zod";

export const getAll = async <T>(
    type: "subject" | "student" | "question" | "exam"
): Promise<T[] | null | undefined> => {
    let select;
    let model;
    switch (type) {
        case "exam":
            select = app.db.selectExams.bind(app.db);
            model = examModel;
            break;
        case "subject":
            select = app.db.selectSubjects.bind(app.db);
            model = subjectModel;
            break;
        case "student":
            select = app.db.selectStudents.bind(app.db);
            model = studentModel;
            break;
        case "question":
            select = app.db.selectQuestions.bind(app.db);
            model = questionModel;
            break;
    }

    const dbObject = (await select()) as T[];

    if (dbObject === null) return null;
    if (model.array().parse(dbObject)) {
        return dbObject;
    } else return undefined;
};

export const get = async <T>(
    type: "subject" | "student" | "question" | "exam",
    id: IdType
): Promise<T | null | undefined> => {
    let select;
    let model;
    switch (type) {
        case "exam":
            select = app.db.selectExam.bind(app.db);
            model = examModel;
            break;
        case "subject":
            select = app.db.selectSubject.bind(app.db);
            model = subjectModel;
            break;
        case "student":
            select = app.db.selectStudent.bind(app.db);
            model = studentModel;
            break;
        case "question":
            select = app.db.selectQuestion.bind(app.db);
            model = questionModel;
            break;
    }

    const dbObject = (await select(id)) as T;

    if (dbObject === null) return null;
    if (model.parse(dbObject)) {
        return dbObject;
    } else return undefined;
};

export const create = async <
    T extends ExamType | SubjectType | StudentType | QuestionType
>(
    type: "subject" | "student" | "question" | "exam",
    newObject: Omit<T, "id">
): Promise<T | undefined> => {
    let insert;
    let model: z.AnyZodObject;
    switch (type) {
        case "exam":
            insert = app.db.insertExam.bind(app.db);
            model = examModel;
            break;
        case "subject":
            insert = app.db.insertSubject.bind(app.db);
            model = subjectModel;
            break;
        case "student":
            insert = app.db.insertStudent.bind(app.db);
            model = studentModel;
            break;
        case "question":
            insert = app.db.insertQuestion.bind(app.db);
            model = questionModel;
            break;
    }

    if (model.omit({ id: true }).parse(newObject)) {
        //@ts-ignore
        const dbObject = (await insert(newObject)) as T;

        if (model.parse(dbObject)) {
            return dbObject;
        } else return undefined;
    } else return undefined;
};

export const replace = async <
    T extends ExamType | SubjectType | StudentType | QuestionType
>(
    type: "subject" | "student" | "question" | "exam",
    id: IdType,
    newObject: Omit<T, "id">
): Promise<T | null | undefined> => {
    let update;
    let model: z.AnyZodObject;
    switch (type) {
        case "exam":
            update = app.db.updateExam.bind(app.db);
            model = examModel;
            break;
        case "subject":
            update = app.db.updateSubject.bind(app.db);
            model = subjectModel;
            break;
        case "student":
            update = app.db.updateStudent.bind(app.db);
            model = studentModel;
            break;
        case "question":
            update = app.db.updateQuestion.bind(app.db);
            model = questionModel;
            break;
    }

    if (model.omit({ id: true }).parse(newObject)) {
        const dbObject = (await update(id, newObject, true)) as T;

        if (dbObject === null) return null;
        if (model.parse(dbObject)) {
            return dbObject;
        } else return undefined;
    } else return undefined;
};

export const update = async <
    T extends ExamType | SubjectType | StudentType | QuestionType
>(
    type: "subject" | "student" | "question" | "exam",
    id: IdType,
    newObject: Partial<T>
): Promise<T | null | undefined> => {
    let update;
    let model: z.AnyZodObject;
    switch (type) {
        case "exam":
            update = app.db.updateExam.bind(app.db);
            model = examModel;
            break;
        case "subject":
            update = app.db.updateSubject.bind(app.db);
            model = subjectModel;
            break;
        case "student":
            update = app.db.updateStudent.bind(app.db);
            model = studentModel;
            break;
        case "question":
            update = app.db.updateQuestion.bind(app.db);
            model = questionModel;
            break;
    }

    if (model.partial().parse(newObject)) {
        const dbObject = (await update(id, newObject, false)) as T;

        if (dbObject === null) return null;
        if (model.parse(dbObject)) {
            return dbObject;
        } else return undefined;
    } else return undefined;
};

export const deleteDB = async (
    type: "subject" | "student" | "question" | "exam",
    id: IdType
): Promise<boolean | null | undefined> => {
    let deleteAction;
    switch (type) {
        case "exam":
            deleteAction = app.db.deleteExam.bind(app.db);
            break;
        case "subject":
            deleteAction = app.db.deleteSubject.bind(app.db).bind(app.db);
            break;
        case "student":
            deleteAction = app.db.deleteStudent.bind(app.db);
            break;
        case "question":
            deleteAction = app.db.deleteQuestion.bind(app.db);
            break;
    }
    const dbResult = await deleteAction(id);

    if (dbResult === null) return null;
    if (dbResult !== undefined) {
        return dbResult;
    } else return undefined;
};
