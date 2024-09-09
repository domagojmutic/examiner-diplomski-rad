import { app } from "../app";
import { TagWithIdType, TagsType, tagWithIdModel } from "../models/Common";
import { examModel } from "../models/ExamModels";
import { questionModel } from "../models/QuestionModels";
import { studentModel } from "../models/StudentModels";
import { subjectModel } from "../models/SubjectModels";
import { getExam } from "./ExamServices";
import { getQuestion } from "./QuestionServices";
import { getStudent } from "./StudentServices";
import { getSubject } from "./SubjectServices";

const getTagsFor = async (
    type: "subject" | "student" | "exam" | "question",
    id: string
): Promise<TagsType | null | undefined> => {
    let filter;
    switch (type) {
        case "exam":
            filter = { examIds: [id] };
            break;
        case "subject":
            filter = { subjectIds: [id] };
            break;
        case "student":
            filter = { studentIds: [id] };
            break;
        case "question":
            filter = { questionIds: [id] };
            break;
    }
    const dbObject = await app.db.selectTags(type, filter);

    if (dbObject === null) return null;
    if (tagWithIdModel.array().parse(dbObject)) {
        return dbObject.map((o) => o.text);
    } else return undefined;
};

const getAllTagsFor = async (
    type: "subject" | "student" | "exam" | "question"
): Promise<TagsType | null | undefined> => {
    const dbObject = await app.db.selectTags(type);

    if (dbObject === null) return null;
    if (tagWithIdModel.array().parse(dbObject)) {
        return dbObject.map((o) => o.text);
    } else return undefined;
};

const replaceTagsFor = async (
    type: "subject" | "student" | "exam" | "question",
    id: string,
    tags: TagsType
) => {
    let updateFn;
    let model;
    let oldDbObject;
    switch (type) {
        case "exam":
            updateFn = app.db.updateExam.bind(app.db);
            model = examModel;
            oldDbObject = await getExam(id)
            break;
        case "subject":
            updateFn = app.db.updateSubject.bind(app.db);
            model = subjectModel;
            oldDbObject = await getSubject(id)
            break;
        case "student":
            updateFn = app.db.updateStudent.bind(app.db);
            model = studentModel;
            oldDbObject = await getStudent(id)
            break;
        case "question":
            updateFn = app.db.updateQuestion.bind(app.db);
            model = questionModel;
            oldDbObject = await getQuestion(id)
            break;
    }
    if(!oldDbObject) return null;
    //@ts-ignore
    const dbObject = await updateFn(id, { ...oldDbObject, tags: tags }, true);

    if (dbObject === null) return null;
    if (model.parse(dbObject)) {
        return dbObject;
    } else return undefined;
};

const updateTagsFor = async (
    type: "subject" | "student" | "exam" | "question",
    id: string,
    tags: TagsType
) => {
    let updateFn;
    let model;
    switch (type) {
        case "exam":
            updateFn = app.db.updateExam.bind(app.db);
            model = examModel;
            break;
        case "subject":
            updateFn = app.db.updateSubject.bind(app.db);
            model = subjectModel;
            break;
        case "student":
            updateFn = app.db.updateStudent.bind(app.db);
            model = studentModel;
            break;
        case "question":
            updateFn = app.db.updateQuestion.bind(app.db);
            model = questionModel;
            break;
    }
    const dbObject = await updateFn(id, { tags: tags }, false);

    if (dbObject === null) return null;
    if (model.parse(dbObject)) {
        return dbObject;
    } else return undefined;
};

const deleteTagsFor = async (
    type: "subject" | "student" | "exam" | "question",
    id: string
) => {
    let updateFn;
    let model;
    switch (type) {
        case "exam":
            updateFn = app.db.updateExam.bind(app.db);
            model = examModel;
            break;
        case "subject":
            updateFn = app.db.updateSubject.bind(app.db);
            model = subjectModel;
            break;
        case "student":
            updateFn = app.db.updateStudent.bind(app.db);
            model = studentModel;
            break;
        case "question":
            updateFn = app.db.updateQuestion.bind(app.db);
            model = questionModel;
            break;
    }
    const dbObject = await updateFn(id, { tags: [] }, true);

    if (dbObject === null) return null;
    if (model.parse(dbObject)) {
        return dbObject;
    } else return undefined;
};

export const getTagById = async (tagId: string) => {
    const dbObject = await app.db.selectTag(tagId, "id");
    if (dbObject === null) return null;
    if (tagWithIdModel.parse(dbObject)) {
        return dbObject;
    } else return undefined;
};

export const getTagByText = async (tagText: string) => {
    const dbObject = await app.db.selectTag(tagText, "text");
    if (dbObject === null) return null;
    if (tagWithIdModel.parse(dbObject)) {
        return dbObject;
    } else return undefined;
};

// Subject

export const getTagsForSubject = async (id: string) => {
    return await getTagsFor("subject", id);
};

export const getTagsForSubjects = async () => {
    return await getAllTagsFor("subject");
};

export const replaceTagsForSubject = async (id: string, tags: TagsType) => {
    return await replaceTagsFor("subject", id, tags);
};

export const updateTagsForSubject = async (id: string, tags: TagsType) => {
    return updateTagsFor("subject", id, tags);
};

export const deleteTagsForSubject = async (id: string) => {
    return await deleteTagsFor("subject", id);
};

export const deleteTagForSubject = async (subjectId: string, tagId: string) => {
    const dbObject = await app.db.unassignTag(tagId, "subject", subjectId);
    return dbObject;
};

// Student

export const getTagsForStudent = async (id: string) => {
    return await getTagsFor("student", id);
};

export const getTagsForStudents = async () => {
    return await getAllTagsFor("student");
};

export const replaceTagsForStudent = async (id: string, tags: TagsType) => {
    return await replaceTagsFor("student", id, tags);
};

export const updateTagsForStudent = async (id: string, tags: TagsType) => {
    return updateTagsFor("student", id, tags);
};

export const deleteTagsForStudent = async (id: string) => {
    return await deleteTagsFor("student", id);
};

export const deleteTagForStudent = async (studentId: string, tagId: string) => {
    const dbObject = await app.db.unassignTag(tagId, "student", studentId);
    return dbObject;
};

// Question

export const getTagsForQuestion = async (id: string) => {
    return await getTagsFor("question", id);
};

export const getTagsForQuestions = async () => {
    return await getAllTagsFor("question");
};

export const replaceTagsForQuestion = async (id: string, tags: TagsType) => {
    return await replaceTagsFor("question", id, tags);
};

export const updateTagsForQuestion = async (id: string, tags: TagsType) => {
    return updateTagsFor("question", id, tags);
};

export const deleteTagsForQuestion = async (id: string) => {
    return await deleteTagsFor("question", id);
};

export const deleteTagForQuestion = async (
    questionId: string,
    tagId: string
) => {
    const dbObject = await app.db.unassignTag(tagId, "question", questionId);
    return dbObject;
};

// Exam

export const getTagsForExam = async (id: string) => {
    return await getTagsFor("exam", id);
};

export const getTagsForExams = async () => {
    return await getAllTagsFor("exam");
};

export const replaceTagsForExam = async (id: string, tags: TagsType) => {
    return await replaceTagsFor("exam", id, tags);
};

export const updateTagsForExam = async (id: string, tags: TagsType) => {
    return updateTagsFor("exam", id, tags);
};

export const deleteTagsForExam = async (id: string) => {
    return await deleteTagsFor("exam", id);
};

export const deleteTagForExam = async (examId: string, tagId: string) => {
    const dbObject = await app.db.unassignTag(tagId, "exam", examId);
    return dbObject;
};
