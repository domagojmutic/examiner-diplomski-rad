import { createId } from "@paralleldrive/cuid2";
import _ from "lodash";
import Database, { Database as DatabaseType, Statement } from "better-sqlite3";
import IDatabase, {
    Exam,
    ExamInstance,
    ExamInstanceAnswer,
    Question,
    Student,
    Subject,
    Tag,
    errorCause,
} from "./IDatabase";
import {
    dbExam,
    dbExamInstance,
    dbExamInstanceAnswer,
    dbQuestion,
    dbStudent,
    dbSubject,
    dbTag,
} from "./IModels";

export default class DB implements IDatabase {
    private database: DatabaseType;

    // Subject
    private stmtSelectSubjects!: Statement<
        [],
        dbSubject & { questionIds: string; tags: string }
    >;
    private stmtSelectSubjectsById!: Statement<
        [{ 1: string }],
        dbSubject & { questionIds: string; tags: string }
    >;
    private stmtSelectSubjectsByTagText!: Statement<
        [string],
        dbSubject & { questionIds: string; tags: string }
    >;
    private stmtSelectSubject!: Statement<
        [{ 1: string }],
        dbSubject & { questionIds: string; tags: string }
    >;
    private stmtInsertSubject!: Statement<dbSubject>;
    private stmtUpdateSubject!: Statement<dbSubject>;
    private stmtDeleteSubject!: Statement<[string]>;

    private transInsertSubject;
    private transUpdateSubject;

    // Question
    private stmtSelectQuestions!: Statement<[], dbQuestion & { tags: string }>;
    private stmtSelectQuestionsBySubject!: Statement<
        [string],
        dbQuestion & { tags: string }
    >;
    private stmtSelectQuestionsByExam!: Statement<
        [string],
        dbQuestion & { tags: string }
    >;
    private stmtSelectQuestionsByTagText!: Statement<
        [string],
        dbQuestion & { tags: string }
    >;
    private stmtSelectQuestionsById!: Statement<
        [string],
        dbQuestion & { tags: string }
    >;
    private stmtSelectQuestion!: Statement<
        [string],
        dbQuestion & { tags: string }
    >;
    private stmtInsertQuestion!: Statement<dbQuestion>;
    private stmtUpdateQuestion!: Statement<dbQuestion>;
    private stmtDeleteQuestion!: Statement<[string]>;

    private transInsertQuestion;
    private transUpdateQuestion;

    // Exam
    private stmtSelectExams!: Statement<
        [],
        dbExam & { questionIds: string; tags: string }
    >;
    private stmtSelectExamsBySubject!: Statement<
        [{ 1: string }],
        dbExam & { questionIds: string; tags: string }
    >;
    private stmtSelectExamsById!: Statement<
        [{ 1: string }],
        dbExam & { questionIds: string; tags: string }
    >;
    private stmtSelectExamsByTagText!: Statement<
        [string],
        dbExam & { questionIds: string; tags: string }
    >;
    private stmtSelectExam!: Statement<
        [{ 1: string }],
        dbExam & { questionIds: string; tags: string }
    >;
    private stmtInsertExam!: Statement<dbExam>;
    private stmtUpdateExam!: Statement<dbExam>;
    private stmtDeleteExam!: Statement<[string]>;
    private stmtInsertExamQuestion!: Statement<[string, string]>;
    private stmtDeleteExamQuestion!: Statement<[string, string]>;

    private transInsertExam;
    private transUpdateExam;

    // Student
    private stmtSelectStudents!: Statement<[], dbStudent & { tags: string }>;
    private stmtSelectStudentsByTagText!: Statement<
        [string],
        dbStudent & { tags: string }
    >;
    private stmtSelectStudentsById!: Statement<
        [string],
        dbStudent & { tags: string }
    >;
    private stmtSelectStudentsByStudentId!: Statement<
        [string],
        dbStudent & { tags: string }
    >;
    private stmtSelectStudent!: Statement<
        [string],
        dbStudent & { tags: string }
    >;
    private stmtInsertStudent!: Statement<dbStudent>;
    private stmtUpdateStudent!: Statement<dbStudent>;
    private stmtDeleteStudent!: Statement<[string]>;

    private transInsertStudent;
    private transUpdateStudent;

    // Tag
    private stmtSelectTags!: Statement<[], dbTag>;
    private stmtSelectTagsByTagText!: Statement<[string], dbTag>;
    private stmtSelectQuestionTags!: Statement<[], dbTag>;
    private stmtSelectQuestionTagsByIds!: Statement<[string], dbTag>;
    private stmtSelectSubjectTags!: Statement<[], dbTag>;
    private stmtSelectSubjectTagsByIds!: Statement<[string], dbTag>;
    private stmtSelectStudentTags!: Statement<[], dbTag>;
    private stmtSelectStudentTagsByIds!: Statement<[string], dbTag>;
    private stmtSelectExamTags!: Statement<[], dbTag>;
    private stmtSelectExamTagsByIds!: Statement<[string], dbTag>;
    private stmtSelectTag!: Statement<[string], dbTag>;
    private stmtSelectTagText!: Statement<[string], dbTag>;
    private stmtInsertTag!: Statement<dbTag>;
    private stmtUpdateTag!: Statement<dbTag>;
    private stmtDeleteTag!: Statement<[string]>;
    private stmtAssignTagQuestion!: Statement<[string, string]>;
    private stmtAssignTagExam!: Statement<[string, string]>;
    private stmtAssignTagSubject!: Statement<[string, string]>;
    private stmtAssignTagStudent!: Statement<[string, string]>;
    private stmtUnassignTagQuestion!: Statement<[string, string]>;
    private stmtUnassignTagExam!: Statement<[string, string]>;
    private stmtUnassignTagSubject!: Statement<[string, string]>;
    private stmtUnassignTagStudent!: Statement<[string, string]>;

    constructor() {
        this.database = new Database("database.db", {
            nativeBinding:
                "./plugins/database/sqlite/build/better_sqlite3.node",
        });
        this.database.pragma("journal_mode = WAL");
        this.database.pragma("foreign_keys = ON");

        this.database.exec(`--sql
        CREATE TABLE IF NOT EXISTS subjects
        (
            name TEXT NOT NULL,
            id TEXT NOT NULL,
            PRIMARY KEY (id)
        );

        CREATE TABLE IF NOT EXISTS questions
        (
            id TEXT NOT NULL,
            text TEXT NOT NULL,
            type TEXT NOT NULL,
            questionObject BLOB,
            answerObject BLOB,
            subjectId TEXT,
            PRIMARY KEY (id),
            FOREIGN KEY (subjectId) REFERENCES subjects(id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS exams
        (
            id TEXT NOT NULL,
            name TEXT,
            subjectId TEXT,
            configs BLOB,
            PRIMARY KEY (id),
            FOREIGN KEY (subjectId) REFERENCES subjects(id) ON DELETE SET NULL
        );
        
        CREATE TABLE IF NOT EXISTS students
        (
            id TEXT NOT NULL,
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            studentId TEXT UNIQUE,
            PRIMARY KEY (id)
        );

        CREATE TABLE IF NOT EXISTS tags
        (
            id TEXT NOT NULL,
            text TEXT NOT NULL UNIQUE,
            PRIMARY KEY (id)
        );
        
        CREATE TABLE IF NOT EXISTS examQuestions
        (
            examId TEXT NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
            questionId TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
            PRIMARY KEY (examId, questionId)
        );

        CREATE TABLE IF NOT EXISTS subjectTags
        (
            tagId TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
            subjectId TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
            PRIMARY KEY (subjectId, tagId)
        );

        CREATE TABLE IF NOT EXISTS questionTags
        (
            questionId TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
            tagId TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
            PRIMARY KEY (questionId, tagId)
        );
        
        CREATE TABLE IF NOT EXISTS examTags
        (
            examId TEXT NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
            tagId TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
            PRIMARY KEY (examId, tagId)
        );
        
        CREATE TABLE IF NOT EXISTS studentTags
        (
            studentId TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
            tagId TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
            PRIMARY KEY (studentId, tagId)
        );

        CREATE TABLE IF NOT EXISTS examInstances
        (
            id TEXT NOT NULL,
            examId TEXT NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
            seed INTEGER,
            generated TEXT,
            groups TEXT,
            PRIMARY KEY (id)
        );
        
        CREATE TABLE IF NOT EXISTS examInstanceStudents
        (
            studentId TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
            examInstanceId TEXT NOT NULL REFERENCES examInstances(id) ON DELETE CASCADE,
            PRIMARY KEY (studentId, examInstanceId)
        );

        CREATE TABLE IF NOT EXISTS examInstanceAnswers
        (
            studentId TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
            examInstanceId TEXT NOT NULL REFERENCES examInstances(id) ON DELETE CASCADE,
            answerObject TEXT NOT NULL,
            scanNumber INTEGER NOT NULL,
            PRIMARY KEY (studentId, examInstanceId, scanNumber)
        );
        
        `);

        this.defineSubjectsStatements();
        this.defineQuestionsStatements();
        this.defineTagsStatements();
        this.defineExamsStatements();
        this.defineStudentsStatements();
        this.defineExamInstancesStatements();
        this.defineExamInstanceAnswersStatements();

        this.transInsertSubject = this.database.transaction(
            (subject: Omit<Subject, "id">) => {
                const dbObject = { ...subject, id: createId() };
                const res = this.stmtInsertSubject.run(dbObject);

                if (res.changes < 1)
                    throw Error("Insertion in DB failed! Aborting.");

                subject.questionIds.forEach((questionId) => {
                    const success = this.connectSubjectAndQuestionSync(
                        dbObject.id,
                        questionId,
                        false
                    );
                    if (!success)
                        throw Error("Unable to update question.", {
                            cause: errorCause.userError,
                        });
                });

                subject.tags.forEach((tag) => {
                    const tagObj = this.insertTagSync({ text: tag });
                    const success = this.assignTagSync(
                        tagObj.id,
                        "subject",
                        dbObject.id
                    );
                    if (!success)
                        throw Error("Unable to connect tag and subject");
                });

                return this.selectSubjectSync(dbObject.id);
            }
        );

        this.transUpdateSubject = this.database.transaction(
            (
                subject: dbSubject & { questionIds: string[]; tags: string[] },
                replace: boolean = false
            ) => {
                const res = this.stmtUpdateSubject.run(subject);

                if (res.changes < 1)
                    throw Error("Insertion in DB failed! Aborting.");

                if (replace) {
                    const oldDbObject = this.selectSubjectSync(subject.id)!;

                    oldDbObject.questionIds.forEach((questionId) => {
                        const success = this.disconnectSubjectAndQuestionSync(
                            subject.id,
                            questionId,
                            false
                        );
                        if (success === null)
                            throw Error("Question not found.", {
                                cause: errorCause.notFoundError,
                            });
                        if (!success) throw Error("Unable to update question.");
                    });

                    oldDbObject.tags.forEach((tag) => {
                        const tagObj = this.selectTagSync(tag, "text");
                        if (tagObj) {
                            const success = this.unassignTagSync(
                                tagObj.id,
                                "subject",
                                oldDbObject.id
                            );
                            if (!success === null)
                                throw Error(
                                    "Unable to disconnect tag and subject."
                                );
                        } else
                            throw Error("Tag not found.", {
                                cause: errorCause.notFoundError,
                            });
                    });
                }

                subject.questionIds.forEach((questionId) => {
                    const success = this.connectSubjectAndQuestionSync(
                        subject.id,
                        questionId,
                        false
                    );
                    if (success === null)
                        throw Error("Question not found.", {
                            cause: errorCause.notFoundError,
                        });
                    if (!success) throw Error("Unable to update question.");
                });

                subject.tags.forEach((tag) => {
                    const tagObj = this.insertTagSync({ text: tag });
                    const success = this.assignTagSync(
                        tagObj.id,
                        "subject",
                        subject.id
                    );
                    if (!success)
                        throw Error("Unable to connect tag and subject");
                });

                const newDbObject = this.selectSubjectSync(subject.id);
                if (newDbObject === null) return null;
                else if (newDbObject) return newDbObject;
            }
        );

        this.transInsertQuestion = this.database.transaction(
            (question: Omit<Question, "id">) => {
                const dbObject = {
                    ...question,
                    questionObject: JSON.stringify(question.questionObject),
                    answerObject: JSON.stringify(question.answerObject),
                    id: createId(),
                    subjectId: null,
                };
                const res = this.stmtInsertQuestion.run(dbObject);

                question.tags.forEach((tag) => {
                    const tagObj = this.insertTagSync({ text: tag });
                    const success = this.assignTagSync(
                        tagObj.id,
                        "question",
                        dbObject.id
                    );
                    if (!success)
                        throw Error("Unable to connect tag and question");
                });

                if (res.changes < 1)
                    throw Error("Insertion in DB failed! Aborting.");

                return this.selectQuestionSync(dbObject.id);
            }
        );

        this.transUpdateQuestion = this.database.transaction(
            (
                question: dbQuestion & { tags: string[] },
                replace: boolean = false
            ) => {
                const res = this.stmtUpdateQuestion.run(question);

                if (replace) {
                    const oldDbObject = this.selectQuestionSync(question.id)!;

                    oldDbObject.tags.forEach((tag) => {
                        const tagObj = this.selectTagSync(tag, "text");
                        if (tagObj) {
                            const success = this.unassignTagSync(
                                tagObj.id,
                                "question",
                                oldDbObject.id
                            );
                            if (!success === null)
                                throw Error(
                                    "Unable to disconnect tag and question."
                                );
                        } else
                            throw Error("Tag not found.", {
                                cause: errorCause.notFoundError,
                            });
                    });
                }

                question.tags.forEach((tag) => {
                    const tagObj = this.insertTagSync({ text: tag });
                    const success = this.assignTagSync(
                        tagObj.id,
                        "question",
                        question.id
                    );
                    if (!success)
                        throw Error("Unable to connect tag and question");
                });

                if (res.changes < 1)
                    throw Error("Insertion in DB failed! Aborting.");

                const newDbObject = this.selectQuestionSync(question.id);
                if (newDbObject === null) return null;
                else if (newDbObject) return newDbObject;
            }
        );

        this.transInsertExam = this.database.transaction(
            (exam: Omit<Exam, "id">) => {
                const dbObject = {
                    ...exam,
                    subjectId: exam.subjectIds ? exam.subjectIds[0] : null,
                    configs: JSON.stringify(exam.configs || {}),
                    id: createId(),
                };
                const res = this.stmtInsertExam.run(dbObject);

                if (res.changes < 1)
                    throw Error("Insertion in DB failed! Aborting.");

                exam.questionIds.forEach((questionId) => {
                    const success = this.connectExamAndQuestionSync(
                        dbObject.id,
                        questionId,
                        false
                    );
                    if (!success)
                        throw Error("Unable to connect question with exam.", {
                            cause: errorCause.userError,
                        });
                });

                exam.tags.forEach((tag) => {
                    const tagObj = this.insertTagSync({ text: tag });
                    const success = this.assignTagSync(
                        tagObj.id,
                        "exam",
                        dbObject.id
                    );
                    if (!success) throw Error("Unable to connect tag and exam");
                });

                return this.selectExamSync(dbObject.id);
            }
        );

        this.transUpdateExam = this.database.transaction(
            (
                exam: dbExam & {
                    questionIds: string[];
                    tags: string[];
                    subjectIds: string[] | null | undefined;
                },
                replace: boolean = false
            ) => {
                exam.subjectId = exam.subjectIds?.[0] || null;
                const res = this.stmtUpdateExam.run(exam);

                if (res.changes < 1)
                    throw Error("Insertion in DB failed! Aborting.");

                if (replace) {
                    const oldDbObject = this.selectExamSync(exam.id)!;

                    oldDbObject.questionIds.forEach((questionId) => {
                        const success = this.disconnectExamAndQuestionSync(
                            exam.id,
                            questionId,
                            false
                        );
                        if (success === null)
                            throw Error("Question not found.", {
                                cause: errorCause.notFoundError,
                            });
                        if (!success)
                            throw Error(
                                "Unable to disconnect question and exam."
                            );
                    });

                    oldDbObject.tags.forEach((tag) => {
                        const tagObj = this.selectTagSync(tag, "text");
                        if (tagObj) {
                            const success = this.unassignTagSync(
                                tagObj.id,
                                "exam",
                                oldDbObject.id
                            );
                            if (!success === null)
                                throw Error(
                                    "Unable to disconnect tag and exam."
                                );
                        } else
                            throw Error("Tag not found.", {
                                cause: errorCause.notFoundError,
                            });
                    });
                }

                exam.questionIds.forEach((questionId) => {
                    const success = this.connectExamAndQuestionSync(
                        exam.id,
                        questionId,
                        false
                    );
                    if (success === null)
                        throw Error("Question not found.", {
                            cause: errorCause.notFoundError,
                        });
                    if (!success)
                        throw Error("Unable to connect question and exam.");
                });

                exam.tags.forEach((tag) => {
                    const tagObj = this.insertTagSync({ text: tag });
                    const success = this.assignTagSync(
                        tagObj.id,
                        "exam",
                        exam.id
                    );
                    if (!success) throw Error("Unable to connect tag and exam");
                });

                return this.selectExamSync(exam.id);
            }
        );

        this.transInsertExamInstance = this.database.transaction(
            (examInstance: Omit<ExamInstance, "id">) => {
                const dbObject = {
                    ...examInstance,
                    groups: JSON.stringify(examInstance.groups),
                    id: createId(),
                };
                const res = this.stmtInsertExamInstance.run(dbObject);

                if (res.changes < 1)
                    throw Error("Insertion in DB failed! Aborting.");

                examInstance.studentIds.forEach((studentId) => {
                    const success = this.connectExamInstanceAndStudentSync(
                        dbObject.id,
                        studentId,
                        false
                    );
                    if (!success)
                        throw Error(
                            "Unable to connect student with exam instance.",
                            {
                                cause: errorCause.userError,
                            }
                        );
                });

                return this.selectExamInstanceSync(dbObject.id);
            }
        );

        this.transUpdateExamInstance = this.database.transaction(
            (
                examInstance: dbExamInstance & {
                    studentIds: string[] | null | undefined;
                },
                replace: boolean = false
            ) => {
                const res = this.stmtUpdateExamInstance.run(examInstance);

                if (res.changes < 1)
                    throw Error("Insertion in DB failed! Aborting.");

                if (replace) {
                    const oldDbObject = this.selectExamInstanceSync(
                        examInstance.id
                    )!;

                    oldDbObject.studentIds.forEach((studentId) => {
                        const success =
                            this.disconnectExamInstanceAndStudentSync(
                                examInstance.id,
                                studentId,
                                false
                            );
                        if (success === null)
                            throw Error("Question not found.", {
                                cause: errorCause.notFoundError,
                            });
                        if (!success)
                            throw Error(
                                "Unable to disconnect student and exam instance."
                            );
                    });
                }

                examInstance.studentIds?.forEach((studentId) => {
                    const success = this.connectExamInstanceAndStudentSync(
                        examInstance.id,
                        studentId,
                        false
                    );
                    if (success === null)
                        throw Error("Student or exam instance not found.", {
                            cause: errorCause.notFoundError,
                        });
                    if (!success)
                        throw Error(
                            "Unable to connect student and exam instance."
                        );
                });

                return this.selectExamInstanceSync(examInstance.id);
            }
        );

        this.transInsertStudent = this.database.transaction(
            (student: Omit<Student, "id">) => {
                const dbObject = {
                    ...student,
                    id: createId(),
                };
                const res = this.stmtInsertStudent.run(dbObject);

                student.tags.forEach((tag) => {
                    const tagObj = this.insertTagSync({ text: tag });
                    const success = this.assignTagSync(
                        tagObj.id,
                        "student",
                        dbObject.id
                    );
                    if (!success)
                        throw Error("Unable to connect tag and student");
                });

                if (res.changes < 1)
                    throw Error("Insertion in DB failed! Aborting.");

                return this.selectStudentSync(dbObject.id);
            }
        );

        this.transUpdateStudent = this.database.transaction(
            (
                student: dbStudent & { tags: string[] },
                replace: boolean = false
            ) => {
                const res = this.stmtUpdateStudent.run(student);

                if (replace) {
                    const oldDbObject = this.selectStudentSync(student.id)!;
                    oldDbObject.tags.forEach((tag) => {
                        const tagObj = this.selectTagSync(tag, "text");
                        if (tagObj) {
                            const success = this.unassignTagSync(
                                tagObj.id,
                                "student",
                                oldDbObject.id
                            );
                            if (!success === null)
                                throw Error(
                                    "Unable to disconnect tag and student."
                                );
                        } else
                            throw Error("Tag not found.", {
                                cause: errorCause.notFoundError,
                            });
                    });
                }

                student.tags.forEach((tag) => {
                    const tagObj = this.insertTagSync({ text: tag });
                    const success = this.assignTagSync(
                        tagObj.id,
                        "student",
                        student.id
                    );
                    if (!success)
                        throw Error("Unable to connect tag and student");
                });

                if (res.changes < 1)
                    throw Error("Insertion in DB failed! Aborting.");

                return this.selectStudentSync(student.id);
            }
        );
    }

    //MARK: ---------- Tags ----------

    private defineTagsStatements() {
        this.stmtSelectTags = this.database.prepare<[], dbTag>(
            "SELECT DISTINCT tags.id as id, tags.text as text FROM tags"
        );
        this.stmtSelectTagsByTagText = this.database.prepare<[string], dbTag>(
            `SELECT DISTINCT tags.id as id, tags.text as text 
                FROM tags
                WHERE tags.text LIKE (SELECT value FROM json_each(?) WHERE tags.text LIKE value)`
        );
        this.stmtSelectQuestionTags = this.database.prepare<[], dbTag>(
            "SELECT DISTINCT tags.id as id, tags.text as text FROM tags JOIN questionTags ON tags.id = questionTags.tagId"
        );
        this.stmtSelectQuestionTagsByIds = this.database.prepare<[], dbTag>(
            "SELECT DISTINCT tags.id as id, tags.text as text FROM tags JOIN questionTags ON tags.id = questionTags.tagId WHERE questionTags.questionId IN (SELECT value FROM json_each(?))"
        );
        this.stmtSelectSubjectTags = this.database.prepare<[], dbTag>(
            "SELECT DISTINCT tags.id as id, tags.text as text FROM tags JOIN subjectTags ON tags.id = subjectTags.tagId"
        );
        this.stmtSelectSubjectTagsByIds = this.database.prepare<[], dbTag>(
            "SELECT DISTINCT tags.id as id, tags.text as text FROM tags JOIN subjectTags ON tags.id = subjectTags.tagId WHERE subjectTags.subjectId IN (SELECT value FROM json_each(?))"
        );
        this.stmtSelectExamTags = this.database.prepare<[], dbTag>(
            "SELECT DISTINCT tags.id as id, tags.text as text FROM tags JOIN examTags ON tags.id = examTags.tagId"
        );
        this.stmtSelectExamTagsByIds = this.database.prepare<[], dbTag>(
            "SELECT DISTINCT tags.id as id, tags.text as text FROM tags JOIN examTags ON tags.id = examTags.tagId WHERE examTags.examId IN (SELECT value FROM json_each(?))"
        );
        this.stmtSelectStudentTags = this.database.prepare<[], dbTag>(
            "SELECT DISTINCT tags.id as id, tags.text as text FROM tags JOIN studentTags ON tags.id = studentTags.tagId"
        );
        this.stmtSelectStudentTagsByIds = this.database.prepare<[], dbTag>(
            "SELECT DISTINCT tags.id as id, tags.text as text FROM tags JOIN studentTags ON tags.id = studentTags.tagId WHERE studentTags.studentId IN (SELECT value FROM json_each(?))"
        );
        this.stmtSelectTag = this.database.prepare<[string], dbTag>(
            "SELECT tags.id as id, tags.text as text FROM tags WHERE tags.id = ?"
        );
        this.stmtSelectTagText = this.database.prepare<[string], dbTag>(
            "SELECT tags.id as id, tags.text as text FROM tags WHERE tags.text = ?"
        );
        this.stmtInsertTag = this.database.prepare<dbTag>(
            "INSERT INTO tags (id, text) VALUES ($id, $text)"
        );
        this.stmtUpdateTag = this.database.prepare<dbTag>(
            "UPDATE tags SET text = $text WHERE id = $id"
        );
        this.stmtDeleteTag = this.database.prepare<[string]>(
            "DELETE FROM tags WHERE id = ?"
        );
        this.stmtAssignTagQuestion = this.database.prepare<[string, string]>(
            "INSERT INTO questionTags (tagId, questionId) VALUES (?, ?) ON CONFLICT(tagId, questionId) DO NOTHING"
        );
        this.stmtAssignTagSubject = this.database.prepare<[string, string]>(
            "INSERT INTO subjectTags (tagId, subjectId) VALUES (?, ?) ON CONFLICT(tagId, subjectId) DO NOTHING"
        );
        this.stmtAssignTagStudent = this.database.prepare<[string, string]>(
            "INSERT INTO studentTags (tagId, studentId) VALUES (?, ?) ON CONFLICT(tagId, studentId) DO NOTHING"
        );
        this.stmtAssignTagExam = this.database.prepare<[string, string]>(
            "INSERT INTO examTags (tagId, examId) VALUES (?, ?) ON CONFLICT(tagId, examId) DO NOTHING"
        );
        this.stmtUnassignTagQuestion = this.database.prepare<[string, string]>(
            "DELETE FROM questionTags WHERE tagId = ? AND questionId = ?"
        );
        this.stmtUnassignTagSubject = this.database.prepare<[string, string]>(
            "DELETE FROM subjectTags WHERE tagId = ? AND subjectId = ?"
        );
        this.stmtUnassignTagStudent = this.database.prepare<[string, string]>(
            "DELETE FROM studentTags WHERE tagId = ? AND studentId = ?"
        );
        this.stmtUnassignTagExam = this.database.prepare<[string, string]>(
            "DELETE FROM examTags WHERE tagId = ? AND examId = ?"
        );
    }

    private selectTagsSync(
        type?: "subject" | "question" | "exam" | "student" | "tagText",
        filter?: {
            subjectIds?: string[];
            questionIds?: string[];
            examIds?: string[];
            studentIds?: string[];
            tagText?: string[];
        }
    ): Tag[] | null {
        let res;
        let localFilter: string[];
        let localStmt: Statement<[string | undefined], dbTag> =
            this.stmtSelectTags;

        if (filter) {
            if (filter.subjectIds) {
                type = "subject";
                localFilter = filter.subjectIds;
            } else if (filter.questionIds) {
                type = "question";
                localFilter = filter.questionIds;
            } else if (filter.examIds) {
                type = "exam";
                localFilter = filter.examIds;
            } else if (filter.studentIds) {
                type = "student";
                localFilter = filter.studentIds;
            } else if (filter.tagText) {
                type = "tagText";
                localFilter = filter.tagText;
            } else localFilter = [];
        }

        if (type) {
            switch (type) {
                case "exam":
                    localStmt = filter
                        ? this.stmtSelectExamTagsByIds
                        : this.stmtSelectExamTags;
                    break;
                case "question":
                    localStmt = filter
                        ? this.stmtSelectQuestionTagsByIds
                        : this.stmtSelectQuestionTags;
                    break;
                case "student":
                    localStmt = filter
                        ? this.stmtSelectStudentTagsByIds
                        : this.stmtSelectStudentTags;
                    break;
                case "subject":
                    localStmt = filter
                        ? this.stmtSelectSubjectTagsByIds
                        : this.stmtSelectSubjectTags;
                    break;
                case "tagText":
                    localStmt = this.stmtSelectTagsByTagText;
                    break;
            }
        }

        if (localFilter!) res = localStmt.all(JSON.stringify(localFilter));
        // @ts-ignore
        else res = localStmt.all();

        if (res && res.length > 0) return res.sort();
        else return null;
    }

    public async selectTags(
        type?: "subject" | "question" | "exam" | "student",
        filter?: {
            subjectIds?: string[];
            questionIds?: string[];
            examIds?: string[];
            studentIds?: string[];
        }
    ) {
        return Promise.resolve(this.selectTagsSync(type, filter));
    }

    private selectTagSync(
        selector: string,
        selectionType: "id" | "text"
    ): Tag | null {
        let res;
        if (selectionType === "id") res = this.stmtSelectTag.get(selector);
        else if (selectionType === "text")
            res = this.stmtSelectTagText.get(selector);

        if (!res || !res.id) return null;

        if (res) return res;
        else return null;
    }

    public async selectTag(
        selector: string,
        selectionType: "id" | "text"
    ): Promise<Tag | null> {
        return Promise.resolve(this.selectTagSync(selector, selectionType));
    }

    private insertTagSync(tag: Omit<Tag, "id">): Tag {
        let dbObject = this.selectTagSync(tag.text, "text");
        if (!dbObject) {
            const id = createId();
            const dbOperation = this.stmtInsertTag.run({ ...tag, id });

            if (dbOperation.changes <= 0)
                throw Error("Insertion in DB failed!");

            dbObject = this.selectTagSync(id, "id");
        }

        if (dbObject) return dbObject;
        throw Error("No changes in DB detected");
    }

    public async insertTag(tag: Omit<Tag, "id">): Promise<Tag> {
        return Promise.resolve(this.insertTagSync(tag));
    }

    private updateTagSync(id: string, tag: Partial<Tag>): Tag | null {
        const oldDbObject = this.selectTagSync(id, "id");
        if (oldDbObject === null) return null;
        const newObject = { ...oldDbObject, ...tag, id: id };

        const dbOperation = this.stmtUpdateTag.run(newObject);

        if (dbOperation.changes <= 0) throw Error("Insertion in DB failed!");

        const dbObject = this.selectTagSync(id, "id");

        if (dbObject === null) return null;
        if (dbObject) return dbObject;

        throw Error("Problem while updating object");
    }

    public async updateTag(id: string, tag: Partial<Tag>): Promise<Tag | null> {
        return Promise.resolve(this.updateTagSync(id, tag));
    }

    private deleteTagSync(id: string): boolean | null {
        const oldDbObject = this.selectTagSync(id, "id");
        if (oldDbObject === null) return null;

        const res = this.stmtDeleteTag.run(id);
        if (res.changes >= 1) return true;
        else return false;
    }

    public async deleteTag(id: string): Promise<boolean | null> {
        return Promise.resolve(this.deleteTagSync(id));
    }

    private assignTagSync(
        id: string,
        type: "subject" | "question" | "exam" | "student",
        assigneeId: string
    ): boolean | null {
        let localStmt;

        switch (type) {
            case "exam":
                if (!this.selectExamSync(assigneeId)) return null;
                localStmt = this.stmtAssignTagExam;
                break;
            case "question":
                if (!this.selectQuestionSync(assigneeId)) return null;
                localStmt = this.stmtAssignTagQuestion;
                break;
            case "student":
                if (!this.selectStudentSync(assigneeId)) return null;
                localStmt = this.stmtAssignTagStudent;
                break;
            case "subject":
                if (!this.selectSubjectSync(assigneeId)) return null;
                localStmt = this.stmtAssignTagSubject;
                break;
        }

        const dbOperation = localStmt.run(id, assigneeId);
        return true;
    }

    public async assignTag(
        id: string,
        type: "subject" | "question" | "exam" | "student",
        assigneeId: string
    ): Promise<boolean | null> {
        return Promise.resolve(this.assignTagSync(id, type, assigneeId));
    }

    private unassignTagSync(
        id: string,
        type: "subject" | "question" | "exam" | "student",
        assigneeId: string
    ): boolean | null {
        if (!this.selectTagSync(id, "id")) return null;

        let localStmt;

        switch (type) {
            case "exam":
                localStmt = this.stmtUnassignTagExam;
                break;
            case "question":
                localStmt = this.stmtUnassignTagQuestion;
                break;
            case "student":
                localStmt = this.stmtUnassignTagStudent;
                break;
            case "subject":
                localStmt = this.stmtUnassignTagSubject;
                break;
        }

        const dbOperation = localStmt.run(id, assigneeId);
        return true;
    }

    public async unassignTag(
        id: string,
        type: "subject" | "question" | "exam" | "student",
        assigneeId: string
    ): Promise<boolean | null> {
        return Promise.resolve(this.unassignTagSync(id, type, assigneeId));
    }

    //MARK: ---------- Subjects ----------

    private defineSubjectsStatements() {
        this.stmtSelectSubjects = this.database.prepare<
            [],
            dbSubject & { questionIds: string; tags: string }
        >(
            `SELECT t.id, t.name, t.questionIds, json_group_array(tags.text) as tags
                FROM (SELECT subjects.id as id, subjects.name as name, json_group_array(questions.id) as questionIds
                        FROM subjects 
                            LEFT JOIN questions 
                                ON subjects.id = questions.subjectId 
                        GROUP BY subjects.id) as t
                    LEFT JOIN subjectTags 
                        ON t.id = subjectTags.subjectId 
                    LEFT JOIN tags 
                        ON subjectTags.tagId = tags.id
                GROUP BY t.id`
        );
        this.stmtSelectSubjectsById = this.database.prepare<
            [{ 1: string }],
            dbSubject & { questionIds: string; tags: string }
        >(
            `SELECT t.id, t.name, t.questionIds, json_group_array(tags.text) as tags
                FROM (SELECT subjects.id as id, subjects.name as name, json_group_array(questions.id) as questionIds
                        FROM subjects 
                            LEFT JOIN questions 
                                ON subjects.id = questions.subjectId 
                        WHERE subjects.id IN (SELECT value FROM json_each(?1)) 
                        GROUP BY subjects.id) as t
                    LEFT JOIN subjectTags 
                        ON t.id = subjectTags.subjectId 
                    LEFT JOIN tags 
                        ON subjectTags.tagId = tags.id
                WHERE t.id IN (SELECT value FROM json_each(?1)) 
                GROUP BY t.id`
            // SELECT subjects.id as id, subjects.name as name, json_group_array(questions.id) as questionIds
            //     FROM subjects
            //         LEFT JOIN questions
            //             ON subjects.id = questions.subjectId
            //         LEFT JOIN subjectTags
            //             ON subjects.id = subjectTags.subjectId
            //         LEFT JOIN tags
            //             ON subjectTags.tagId = tags.id
            //     GROUP BY subjects.id
        );
        this.stmtSelectSubjectsByTagText = this.database.prepare<
            [string],
            dbSubject & { questionIds: string; tags: string }
        >(
            `SELECT t.id, t.name, t.questionIds, json_group_array(tags.text) as tags
                FROM (SELECT subjects.id as id, subjects.name as name, json_group_array(questions.id) as questionIds
                        FROM subjects 
                            LEFT JOIN questions 
                                ON subjects.id = questions.subjectId 
                        GROUP BY subjects.id) as t
                    LEFT JOIN subjectTags 
                        ON t.id = subjectTags.subjectId 
                    LEFT JOIN tags 
                        ON subjectTags.tagId = tags.id
                WHERE tags.text LIKE (SELECT value FROM json_each(?) WHERE tags.text LIKE value) 
                GROUP BY t.id`
            // SELECT subjects.id as id, subjects.name as name, json_group_array(questions.id) as questionIds
            // FROM subjects
            //     LEFT JOIN questions
            //         ON subjects.id = questions.subjectId
            //     LEFT JOIN subjectTags
            //         ON subjects.id = subjectTags.subjectId
            //     LEFT JOIN tags
            //         ON subjectTags.tagId = tags.id
            // GROUP BY subjects.id
        );
        this.stmtSelectSubject = this.database.prepare<
            [{ 1: string }],
            dbSubject & { questionIds: string; tags: string }
        >(
            `SELECT t.id, t.name, t.questionIds, json_group_array(tags.text) as tags
            FROM (SELECT subjects.id as id, subjects.name as name, json_group_array(questions.id) as questionIds
                    FROM subjects 
                        LEFT JOIN questions 
                            ON subjects.id = questions.subjectId 
                    WHERE subjects.id = ?1
                    GROUP BY subjects.id) as t
                LEFT JOIN subjectTags 
                    ON t.id = subjectTags.subjectId 
                LEFT JOIN tags 
                    ON subjectTags.tagId = tags.id
            WHERE t.id = ?1 
            GROUP BY t.id`

            // SELECT subjects.id as id, subjects.name as name, json_group_array(questions.id) as questionIds
            //     FROM subjects
            //         LEFT JOIN questions
            //             ON subjects.id = questions.subjectId
            //         LEFT JOIN subjectTags
            //             ON subjects.id = subjectTags.subjectId
            //         LEFT JOIN tags
            //             ON subjectTags.tagId = tags.id
            //     WHERE subjects.id = ?
        );
        this.stmtInsertSubject = this.database.prepare<dbSubject>(
            "INSERT INTO subjects (id, name) VALUES ($id, $name)"
        );
        this.stmtUpdateSubject = this.database.prepare<dbSubject>(
            "UPDATE subjects SET name = $name WHERE id = $id"
        );
        this.stmtDeleteSubject = this.database.prepare<[string]>(
            "DELETE FROM subjects WHERE id = ?"
        );
    }

    private selectSubjectsSync(filter?: {
        subjectIds?: string[];
        tagText?: string[];
    }) {
        let res;
        if (filter) {
            if (filter.subjectIds)
                res = this.stmtSelectSubjectsById.all({
                    1: JSON.stringify(filter.subjectIds),
                });
            else if (filter.tagText)
                res = this.stmtSelectSubjectsByTagText.all(
                    JSON.stringify(
                        filter.tagText.map((text) => "%" + text + "%")
                    )
                );
        } else res = this.stmtSelectSubjects.all();

        if (res && res.length > 0)
            return res.map((r) => {
                return {
                    ...r,
                    questionIds: JSON.parse(r.questionIds)[0]
                        ? JSON.parse(r.questionIds)
                        : [],
                    tags: r.tags
                        ? JSON.parse(r.tags)[0]
                            ? JSON.parse(r.tags).sort()
                            : []
                        : [],
                };
            });
        else return null;
    }

    public async selectSubjects(filter?: {
        subjectIds?: string[];
        tagText?: string[];
    }) {
        return Promise.resolve(this.selectSubjectsSync(filter));
    }

    private selectSubjectSync(id: string): Subject | null {
        const res = this.stmtSelectSubject.get({ 1: id });

        if (!res || !res.id) return null;

        const dbObject: Subject = {
            id: res.id,
            name: res.name,
            questionIds: JSON.parse(res.questionIds)[0]
                ? JSON.parse(res.questionIds)
                : [],
            tags: res.tags
                ? JSON.parse(res.tags)[0]
                    ? JSON.parse(res.tags).sort()
                    : []
                : [],
        };

        if (dbObject) return dbObject;
        else return null;
    }

    public async selectSubject(id: string): Promise<Subject | null> {
        return Promise.resolve(this.selectSubjectSync(id));
    }

    private insertSubjectSync(subject: Omit<Subject, "id">): Subject {
        const dbObject = this.transInsertSubject(subject);

        if (dbObject) return dbObject;
        throw Error("No changes in DB detected");
    }

    public async insertSubject(subject: Omit<Subject, "id">): Promise<Subject> {
        return Promise.resolve(this.insertSubjectSync(subject));
    }

    private updateSubjectSync(
        id: string,
        subject: Partial<Subject>,
        replace: boolean = false
    ): Subject | null {
        const oldDbObject = this.selectSubjectSync(id);
        if (oldDbObject === null) return null;
        const newObject = {
            ...oldDbObject,
            ...subject,
            tags: replace
                ? subject.tags || []
                : _.merge([], oldDbObject.tags, subject.tags) || [],
        };
        const dbObject = this.transUpdateSubject(newObject, replace);
        if (dbObject === null) return null;
        if (dbObject) return dbObject;

        throw Error("Problem while updating object");
    }

    public async updateSubject(
        id: string,
        subject: Partial<Subject>,
        replace: boolean = false
    ): Promise<Subject | null> {
        return Promise.resolve(this.updateSubjectSync(id, subject, replace));
    }

    private deleteSubjectSync(id: string): boolean | null {
        const oldDbObject = this.selectSubjectSync(id);
        if (oldDbObject === null) return null;

        const res = this.stmtDeleteSubject.run(id);
        if (res.changes >= 1) return true;
        else return false;
    }

    public async deleteSubject(id: string): Promise<boolean | null> {
        return Promise.resolve(this.deleteSubjectSync(id));
    }

    private connectSubjectAndQuestionSync(
        subjectId: string,
        questionId: string,
        skipCheck = true
    ) {
        if (!skipCheck) {
            const subject = this.selectSubjectSync(subjectId);
            const question = this.selectQuestionSync(questionId);
            if (subject === null || question === null)
                throw Error("Subject or question does not exist", {
                    cause: errorCause.userError,
                });
        }

        const updatedObject = this.updateQuestionSync(
            questionId,
            {},
            { subjectId: subjectId }
        );

        if (updatedObject === null) return null;
        if (updatedObject) return true;

        throw Error("No changes in DB detected");
    }

    private disconnectSubjectAndQuestionSync(
        subjectId: string,
        questionId: string,
        skipCheck = false
    ) {
        if (!skipCheck) {
            const subject = this.selectSubjectSync(subjectId);
            const question = this.selectQuestionSync(questionId);
            if (subject === null || question === null) return null;
        }

        const updatedObject = this.updateQuestionSync(
            questionId,
            {},
            { subjectId: null }
        );

        if (updatedObject === null) return null;
        if (updatedObject) return true;

        throw Error("No changes in DB detected");
    }

    //MARK: ---------- Questions ----------

    private defineQuestionsStatements() {
        this.stmtSelectQuestions = this.database.prepare<
            [],
            dbQuestion & { tags: string }
        >(
            `SELECT questions.id as id, questions.text as text, questions.type as type, questions.subjectId as subjectId, questionObject, answerObject, json_group_array(tags.text) as tags 
                FROM questions 
                    LEFT JOIN questionTags
                        ON questions.id = questionTags.questionId
                    LEFT JOIN tags
                        ON questionTags.tagId = tags.id
                GROUP BY questions.id`
        );
        this.stmtSelectQuestionsById = this.database.prepare<
            [string],
            dbQuestion & { tags: string }
        >(
            `SELECT questions.id as id, questions.text as text, questions.type as type, questions.subjectId as subjectId, questionObject, answerObject, json_group_array(tags.text) as tags 
                FROM questions 
                    LEFT JOIN questionTags
                        ON questions.id = questionTags.questionId
                    LEFT JOIN tags
                        ON questionTags.tagId = tags.id
                WHERE questions.id IN (SELECT value FROM json_each(?))
                GROUP BY questions.id`
        );
        this.stmtSelectQuestionsBySubject = this.database.prepare<
            [string],
            dbQuestion & { tags: string }
        >(
            `SELECT questions.id as id, questions.text as text, questions.type as type, questions.subjectId as subjectId, questionObject, answerObject, json_group_array(tags.text) as tags 
                FROM questions 
                    LEFT JOIN questionTags
                        ON questions.id = questionTags.questionId
                    LEFT JOIN tags
                        ON questionTags.tagId = tags.id
                WHERE subjectId IN (SELECT value FROM json_each(?))
                GROUP BY questions.id`
        );
        this.stmtSelectQuestionsByExam = this.database.prepare<
            [string],
            dbQuestion & { tags: string }
        >(
            `SELECT questions.id as id, questions.text as text, questions.type as type, questions.subjectId as subjectId, questionObject, answerObject, json_group_array(tags.text) as tags 
                FROM questions 
                    LEFT JOIN questionTags
                        ON questions.id = questionTags.questionId
                    LEFT JOIN tags
                        ON questionTags.tagId = tags.id
                    LEFT JOIN examQuestions
                        ON questions.id = examQuestions.questionId
                    LEFT JOIN exams
                        ON examQuestions.examId = exams.id
                WHERE examQuestions.examId IN (SELECT value FROM json_each(?))
                GROUP BY questions.id`
        );
        this.stmtSelectQuestionsByTagText = this.database.prepare<
            [string],
            dbQuestion & { tags: string }
        >(
            `SELECT questions.id as id, questions.text as text, questions.type as type, questions.subjectId as subjectId, questionObject, answerObject, json_group_array(tags.text) as tags 
                FROM questions 
                    LEFT JOIN questionTags
                        ON questions.id = questionTags.questionId
                    LEFT JOIN tags
                        ON questionTags.tagId = tags.id
                WHERE tags.text LIKE (SELECT value FROM json_each(?) WHERE tags.text LIKE value)
                GROUP BY questions.id`
        );
        this.stmtSelectQuestion = this.database.prepare<
            [string],
            dbQuestion & { tags: string }
        >(
            `SELECT questions.id as id, questions.text as text, questions.type as type, questions.subjectId as subjectId, questionObject, answerObject, json_group_array(tags.text) as tags 
                FROM questions 
                    LEFT JOIN questionTags
                        ON questions.id = questionTags.questionId
                    LEFT JOIN tags
                        ON questionTags.tagId = tags.id
                WHERE questions.id = ?
                GROUP BY questions.id`
        );
        this.stmtInsertQuestion = this.database.prepare<dbQuestion>(
            "INSERT INTO questions (id, text, type, questionObject, answerObject, subjectId) VALUES ($id, $text, $type, $questionObject, $answerObject, $subjectId)"
        );
        this.stmtUpdateQuestion = this.database.prepare<dbQuestion>(
            "UPDATE questions SET text = $text, type = $type, questionObject = $questionObject, answerObject = $answerObject, subjectId = $subjectId  WHERE id = $id"
        );
        this.stmtDeleteQuestion = this.database.prepare<[string]>(
            "DELETE FROM questions WHERE id = ?"
        );
    }

    private selectQuestionsSync(filter?: {
        questionIds?: string[];
        subjectIds?: string[];
        examIds?: string[];
        tagText?: string[];
    }) {
        let res: (dbQuestion & {
            tags: string;
        })[];
        if (filter) {
            if (filter.questionIds)
                res = this.stmtSelectQuestionsById.all(
                    JSON.stringify(filter.questionIds)
                );
            else if (filter.examIds)
                res = this.stmtSelectQuestionsByExam.all(
                    JSON.stringify(filter.examIds)
                );
            else if (filter.tagText)
                res = this.stmtSelectQuestionsByTagText.all(
                    JSON.stringify(
                        filter.tagText.map((text) => "%" + text + "%")
                    )
                );
            else if (filter.subjectIds) {
                const dbSubjects = this.selectSubjectsSync({
                    subjectIds: filter.subjectIds,
                });
                if (dbSubjects === null) return null;

                res = this.stmtSelectQuestionsBySubject.all(
                    JSON.stringify(filter.subjectIds)
                );
            }
        } else res = this.stmtSelectQuestions.all();

        if (res!)
            return res?.map((question) => {
                return {
                    ...question,
                    answerObject: JSON.parse(question.answerObject),
                    questionObject: JSON.parse(question.questionObject),
                    tags: question.tags
                        ? JSON.parse(question.tags)[0]
                            ? JSON.parse(question.tags).sort()
                            : []
                        : [],
                };
            });
        else return null;
    }

    public async selectQuestions(filter?: {
        questionIds?: string[];
        subjectIds?: string[];
        examIds?: string[];
        tagText?: string[];
    }) {
        return Promise.resolve(this.selectQuestionsSync(filter));
    }

    private selectQuestionSync(
        id: string
    ): (Question & { subjectId?: string | null }) | null {
        const res = this.stmtSelectQuestion.get(id);
        if (res)
            return {
                ...res,
                answerObject: JSON.parse(res.answerObject),
                questionObject: JSON.parse(res.questionObject),
                tags: res.tags
                    ? JSON.parse(res.tags)[0]
                        ? JSON.parse(res.tags).sort()
                        : []
                    : [],
            };
        else return null;
    }

    public async selectQuestion(id: string): Promise<Question | null> {
        return Promise.resolve(this.selectQuestionSync(id));
    }

    private insertQuestionSync(question: Question) {
        const newDbObject = this.transInsertQuestion(question);
        if (newDbObject) return newDbObject;
        throw Error("No changes in DB detected");
    }

    public async insertQuestion(question: Question) {
        return Promise.resolve(this.insertQuestionSync(question));
    }

    private updateQuestionSync(
        id: string,
        question: Partial<Question>,
        rest?: { subjectId: string | null },
        replace: boolean = false
    ): Question | null {
        const oldDbObject = this.selectQuestionSync(id);
        if (oldDbObject === null) return null;

        const newObject = {
            ...oldDbObject,
            ...question,
            id: id,
            questionObject: JSON.stringify(
                replace
                    ? question.questionObject || {}
                    : _.merge(
                          {},
                          oldDbObject.questionObject,
                          question.questionObject
                      ) || {}
            ),
            answerObject: JSON.stringify(
                replace
                    ? question.answerObject || {}
                    : _.merge(
                          {},
                          oldDbObject.answerObject,
                          question.answerObject
                      ) || {}
            ),
            subjectId: rest ? rest.subjectId : oldDbObject.subjectId || null,
            tags: replace
                ? question.tags || []
                : _.merge([], oldDbObject.tags, question.tags) || [],
        };

        const newDbObject = this.transUpdateQuestion(newObject, replace);
        if (newDbObject === null) return null;
        else if (newDbObject) return newDbObject;

        throw Error("No changes in DB detected");
    }

    public async updateQuestion(
        id: string,
        question: Partial<Question>,
        replace: boolean
    ): Promise<Question | null> {
        return Promise.resolve(
            this.updateQuestionSync(id, question, undefined, replace)
        );
    }

    private deleteQuestionSync(id: string): boolean | null {
        const oldDbObject = this.selectQuestionSync(id);
        if (oldDbObject === null) return null;

        const res = this.stmtDeleteQuestion.run(id);
        if (res.changes >= 1) return true;
        else return false;
    }

    public async deleteQuestion(id: string): Promise<boolean | null> {
        return Promise.resolve(this.deleteQuestionSync(id));
    }

    //MARK: ---------- Exams ----------

    private defineExamsStatements() {
        this.stmtSelectExams = this.database.prepare<
            [],
            dbExam & { questionIds: string; tags: string }
        >(
            `SELECT t.id, t.name, t.subjectId as subjectId, t.configs as configs, t.questionIds, json_group_array(tags.text) as tags
                FROM (
                    SELECT exams.id as id, exams.name as name, exams.subjectId as subjectId, exams.configs as configs, json_group_array(questions.id) as questionIds
                        FROM exams 
                            LEFT JOIN examQuestions
                                ON exams.id = examQuestions.examId  
                            LEFT JOIN questions 
                                ON examQuestions.questionId = questions.id 
                        GROUP BY exams.id
                    ) as t
                    LEFT JOIN examTags 
                        ON t.id = examTags.examId 
                    LEFT JOIN tags 
                        ON examTags.tagId = tags.id
                GROUP BY t.id`
            // SELECT exams.id as id, exams.name as name, exams.subjectId as subjectId, json_group_array(questions.id) as questionIds, json_group_array(tags.text) as tags
            //     FROM exams
            //         LEFT JOIN examQuestions
            //             ON exams.id = examQuestions.examId
            //         LEFT JOIN questions
            //             ON examQuestions.questionId = questions.id
            //         LEFT JOIN examTags
            //             ON exams.id = examTags.examId
            //         LEFT JOIN tags
            //             ON examTags.tagId = tags.id
            // GROUP BY exams.id
        );
        this.stmtSelectExamsById = this.database.prepare<
            [{ 1: string }],
            dbExam & { questionIds: string; tags: string }
        >(
            `SELECT t.id, t.name, t.subjectId as subjectId, t.configs as configs, t.questionIds, json_group_array(tags.text) as tags
                FROM (
                    SELECT exams.id as id, exams.name as name, exams.subjectId as subjectId, exams.configs as configs, json_group_array(questions.id) as questionIds
                        FROM exams 
                            LEFT JOIN examQuestions
                                ON exams.id = examQuestions.examId  
                            LEFT JOIN questions 
                                ON examQuestions.questionId = questions.id 
                        WHERE exams.id IN (SELECT value FROM json_each(?1))
                        GROUP BY exams.id
                    ) as t
                    LEFT JOIN examTags 
                        ON t.id = examTags.examId 
                    LEFT JOIN tags 
                        ON examTags.tagId = tags.id
                WHERE t.id IN (SELECT value FROM json_each(?1))
                GROUP BY t.id`
            // SELECT exams.id as id, exams.name as name, exams.subjectId as subjectId, json_group_array(questions.id) as questionIds, json_group_array(tags.text) as tags
            //     FROM exams
            //         LEFT JOIN examQuestions
            //             ON exams.id = examQuestions.examId
            //         LEFT JOIN questions
            //             ON examQuestions.questionId = questions.id
            //         LEFT JOIN examTags
            //             ON exams.id = examTags.examId
            //         LEFT JOIN tags
            //             ON examTags.tagId = tags.id
            //     WHERE exams.id IN (SELECT value FROM json_each(?))
            //     GROUP BY exams.id
        );
        this.stmtSelectExamsBySubject = this.database.prepare<
            [{ 1: string }],
            dbExam & { questionIds: string; tags: string }
        >(
            `SELECT t.id, t.name, t.subjectId as subjectId, t.configs as configs, t.questionIds, json_group_array(tags.text) as tags
                FROM (
                    SELECT exams.id as id, exams.name as name, exams.subjectId as subjectId, exams.configs as configs, json_group_array(questions.id) as questionIds
                        FROM exams 
                            LEFT JOIN examQuestions
                                ON exams.id = examQuestions.examId  
                            LEFT JOIN questions 
                                ON examQuestions.questionId = questions.id 
                        WHERE  exams.subjectId IN (SELECT value FROM json_each(?1))
                        GROUP BY exams.id
                    ) as t
                    LEFT JOIN examTags 
                        ON t.id = examTags.examId 
                    LEFT JOIN tags 
                        ON examTags.tagId = tags.id
                WHERE  t.subjectId IN (SELECT value FROM json_each(?1))
                GROUP BY t.id`
            // SELECT exams.id as id, exams.name as name, exams.subjectId as subjectId, json_group_array(questions.id) as questionIds, json_group_array(tags.text) as tags
            //     FROM exams
            //         LEFT JOIN examQuestions
            //             ON exams.id = examQuestions.examId
            //         LEFT JOIN questions
            //             ON examQuestions.questionId = questions.id
            //         LEFT JOIN examTags
            //             ON exams.id = examTags.examId
            //         LEFT JOIN tags
            //             ON examTags.tagId = tags.id
            //     WHERE  exams.subjectId IN (SELECT value FROM json_each(?))
            //     GROUP BY exams.id
        );
        this.stmtSelectExamsByTagText = this.database.prepare<
            [string],
            dbExam & { questionIds: string; tags: string }
        >(
            `SELECT t.id, t.name, t.subjectId as subjectId, t.configs as configs, t.questionIds, json_group_array(tags.text) as tags
                FROM (
                    SELECT exams.id as id, exams.name as name, exams.subjectId as subjectId, exams.configs as configs, json_group_array(questions.id) as questionIds
                        FROM exams 
                            LEFT JOIN examQuestions
                                ON exams.id = examQuestions.examId  
                            LEFT JOIN questions 
                                ON examQuestions.questionId = questions.id 
                        GROUP BY exams.id
                    ) as t
                    LEFT JOIN examTags 
                        ON t.id = examTags.examId 
                    LEFT JOIN tags 
                        ON examTags.tagId = tags.id
                WHERE tags.text LIKE (SELECT value FROM json_each(?) WHERE tags.text LIKE value)
                GROUP BY t.id`

            // SELECT exams.id as id, exams.name as name, exams.subjectId as subjectId, json_group_array(questions.id) as questionIds, json_group_array(tags.text) as tags
            //     FROM exams
            //         LEFT JOIN examQuestions
            //             ON exams.id = examQuestions.examId
            //         LEFT JOIN questions
            //             ON examQuestions.questionId = questions.id
            //         LEFT JOIN examTags
            //             ON exams.id = examTags.examId
            //         LEFT JOIN tags
            //             ON examTags.tagId = tags.id
            // WHERE tags.text LIKE (SELECT value FROM json_each(?) WHERE tags.text LIKE value)
            // GROUP BY exams.id
        );
        this.stmtSelectExam = this.database.prepare<
            [{ 1: string }],
            dbExam & { questionIds: string; tags: string }
        >(
            `SELECT t.id, t.name, t.subjectId as subjectId, t.configs as configs, t.questionIds, json_group_array(tags.text) as tags
                FROM (
                    SELECT exams.id as id, exams.name as name, exams.subjectId as subjectId, exams.configs as configs, json_group_array(questions.id) as questionIds
                        FROM exams 
                            LEFT JOIN examQuestions
                                ON exams.id = examQuestions.examId  
                            LEFT JOIN questions 
                                ON examQuestions.questionId = questions.id 
                        WHERE exams.id = ?1
                        GROUP BY exams.id
                    ) as t
                    LEFT JOIN examTags 
                        ON t.id = examTags.examId 
                    LEFT JOIN tags 
                        ON examTags.tagId = tags.id
                WHERE t.id = ?1
                GROUP BY t.id`
            // `SELECT exams.id as id, exams.name as name, exams.subjectId as subjectId, json_group_array(questions.id) as questionIds, json_group_array(tags.text) as tags
            //     FROM exams
            //         LEFT JOIN examQuestions
            //             ON exams.id = examQuestions.examId
            //         LEFT JOIN questions
            //             ON examQuestions.questionId = questions.id
            //         LEFT JOIN examTags
            //             ON exams.id = examTags.examId
            //         LEFT JOIN tags
            //             ON examTags.tagId = tags.id
            // WHERE exams.id = ?`
        );
        this.stmtInsertExam = this.database.prepare<dbExam>(
            "INSERT INTO exams (id, name, subjectId, configs) VALUES ($id, $name, $subjectId, $configs)"
        );
        this.stmtUpdateExam = this.database.prepare<dbExam>(
            "UPDATE exams SET name = $name, subjectId = $subjectId, configs = $configs  WHERE id = $id"
        );
        this.stmtDeleteExam = this.database.prepare<[string]>(
            "DELETE FROM exams WHERE id = ?"
        );
        this.stmtInsertExamQuestion = this.database.prepare<[string, string]>(
            "INSERT INTO examQuestions (examId, questionId) VALUES (?, ?) ON CONFLICT(examId, questionId) DO NOTHING"
        );
        this.stmtDeleteExamQuestion = this.database.prepare<[string, string]>(
            "DELETE FROM examQuestions WHERE examId = ? AND questionId = ?"
        );
    }

    private selectExamsSync(filter?: {
        subjectIds?: string[];
        examIds?: string[];
        tagText?: string[];
    }): Exam[] | null {
        let res;
        if (filter) {
            if (filter.subjectIds)
                res = this.stmtSelectExamsBySubject.all({
                    1: JSON.stringify(filter.subjectIds),
                });
            else if (filter.examIds)
                res = this.stmtSelectExamsById.all({
                    1: JSON.stringify(filter.examIds),
                });
            else if (filter.tagText)
                res = this.stmtSelectExamsByTagText.all(
                    JSON.stringify(
                        filter.tagText.map((text) => "%" + text + "%")
                    )
                );
        } else res = this.stmtSelectExams.all();

        if (res && res.length > 0)
            return res.map((r) => {
                return {
                    ...r,
                    subjectIds: r.subjectId ? [r.subjectId] : null,
                    configs: JSON.parse(r.configs) || {},
                    questionIds: JSON.parse(r.questionIds)[0]
                        ? JSON.parse(r.questionIds)
                        : [],
                    tags: r.tags
                        ? JSON.parse(r.tags)[0]
                            ? JSON.parse(r.tags).sort()
                            : []
                        : [],
                };
            });
        else return null;
    }

    public async selectExams(filter?: {
        subjectIds?: string[];
        examIds?: string[];
        tagText?: string[];
    }) {
        return Promise.resolve(this.selectExamsSync(filter));
    }

    private selectExamSync(id: string): Exam | null {
        const res = this.stmtSelectExam.get({ 1: id });

        if (!res || !res.id) return null;

        const dbObject: Exam = {
            id: res.id,
            name: res.name,
            subjectIds: res.subjectId ? [res.subjectId] : null,
            configs: JSON.parse(res.configs) || {},
            questionIds: JSON.parse(res.questionIds)[0]
                ? JSON.parse(res.questionIds)
                : [],
            tags: res.tags
                ? JSON.parse(res.tags)[0]
                    ? JSON.parse(res.tags).sort()
                    : []
                : [],
        };

        if (dbObject) return dbObject;
        else return null;
    }

    public async selectExam(id: string): Promise<Exam | null> {
        return Promise.resolve(this.selectExamSync(id));
    }

    private insertExamSync(exam: Omit<Exam, "id">): Exam {
        const dbObject = this.transInsertExam(exam);

        if (dbObject) return dbObject;
        throw Error("No changes in DB detected");
    }

    public async insertExam(exam: Omit<Exam, "id">): Promise<Exam> {
        return Promise.resolve(this.insertExamSync(exam));
    }

    private updateExamSync(
        id: string,
        exam: Partial<Exam>,
        replace: boolean = false
    ): Exam | null {
        const oldDbObject = this.selectExamSync(id);
        if (oldDbObject === null) return null;
        const newObject = {
            ...oldDbObject,
            ...exam,
            configs: JSON.stringify(
                replace
                    ? exam.configs || {}
                    : _.merge({}, oldDbObject.configs, exam.configs) || {}
            ),
            subjectIds: replace
                ? exam.subjectIds || []
                : _.merge([], oldDbObject.subjectIds, exam.subjectIds) || [],
            tags: replace
                ? exam.tags || []
                : _.merge([], oldDbObject.tags, exam.tags) || [],
            id: id,
        };

        const dbObject = this.transUpdateExam(newObject, replace);
        if (dbObject === null) return null;
        if (dbObject) return dbObject;

        throw Error("Problem while updating object");
    }

    public async updateExam(
        id: string,
        exam: Partial<Exam>,
        replace: boolean = false
    ): Promise<Exam | null> {
        return Promise.resolve(this.updateExamSync(id, exam, replace));
    }

    private deleteExamSync(id: string): boolean | null {
        const oldDbObject = this.selectExamSync(id);
        if (oldDbObject === null) return null;

        const res = this.stmtDeleteExam.run(id);
        if (res.changes >= 1) return true;
        else return false;
    }

    public async deleteExam(id: string): Promise<boolean | null> {
        return Promise.resolve(this.deleteExamSync(id));
    }

    private connectExamAndQuestionSync(
        examId: string,
        questionId: string,
        skipCheck = true
    ) {
        if (!skipCheck) {
            const exam = this.selectExamSync(examId);
            const question = this.selectQuestionSync(questionId);
            if (exam === null || question === null)
                throw Error("Exam or question does not exist", {
                    cause: errorCause.userError,
                });
        }

        const updateAction = this.stmtInsertExamQuestion.run(
            examId,
            questionId
        );

        return true;
    }

    private disconnectExamAndQuestionSync(
        examId: string,
        questionId: string,
        skipCheck = false
    ) {
        if (!skipCheck) {
            const subject = this.selectExamSync(examId);
            const question = this.selectQuestionSync(questionId);
            if (subject === null || question === null) return null;
        }

        const updateAction = this.stmtDeleteExamQuestion.run(
            examId,
            questionId
        );

        return true;
    }

    //MARK: ---------- Exam Instances ----------

    private stmtSelectExamInstancesByExam!: Statement<
        [string],
        dbExamInstance & { studentIds: string }
    >;
    private stmtSelectExamInstance!: Statement<
        [string],
        dbExamInstance & { studentIds: string }
    >;
    private stmtDeleteExamInstances!: Statement<[string]>;
    private stmtInsertExamInstance!: Statement<dbExamInstance>;
    private stmtUpdateExamInstance!: Statement<dbExamInstance>;
    private stmtDeleteExamInstance!: Statement<[string]>;
    private stmtInsertExamInstanceStudent!: Statement<[string, string]>;
    private stmtDeleteExamInstanceStudent!: Statement<[string, string]>;

    private transInsertExamInstance;
    private transUpdateExamInstance;

    private defineExamInstancesStatements() {
        this.stmtSelectExamInstancesByExam = this.database.prepare<
            [string],
            dbExamInstance & { studentIds: string }
        >(
            `SELECT examInstances.id as id, examInstances.examId as examId, examInstances.generated as generated, examInstances.seed as seed, examInstances.groups as groups, json_group_array(students.id) as studentIds
            FROM examInstances
                LEFT JOIN examInstanceStudents
                    ON examInstances.id = examInstanceStudents.examInstanceId  
                LEFT JOIN students 
                    ON examInstanceStudents.studentId = students.id 
            WHERE examInstances.examId = ?
            GROUP BY examInstances.id`
        );
        this.stmtDeleteExamInstances = this.database.prepare<[string]>(
            "DELETE FROM examInstances WHERE examId = ?"
        );
        this.stmtSelectExamInstance = this.database.prepare<
            [string],
            dbExamInstance & { studentIds: string }
        >(
            `SELECT examInstances.id as id, examInstances.examId as examId, examInstances.generated as generated, examInstances.seed as seed, examInstances.groups as groups, json_group_array(students.id) as studentIds
                FROM examInstances
                    LEFT JOIN examInstanceStudents
                        ON examInstances.id = examInstanceStudents.examInstanceId  
                    LEFT JOIN students 
                        ON examInstanceStudents.studentId = students.id 
                WHERE examInstances.id = ?
                GROUP BY examInstances.id`
        );
        this.stmtInsertExamInstance = this.database.prepare<dbExamInstance>(
            "INSERT INTO examInstances (id, examId, generated, seed, groups) VALUES ($id, $examId, $generated, $seed, $groups)"
        );
        this.stmtUpdateExamInstance = this.database.prepare<dbExamInstance>(
            "UPDATE examInstances SET examId = $examId, generated = $generated, seed = $seed, groups = $groups WHERE id = $id"
        );
        this.stmtDeleteExamInstance = this.database.prepare<[string]>(
            "DELETE FROM examInstances WHERE id = ?"
        );
        this.stmtInsertExamInstanceStudent = this.database.prepare<
            [string, string]
        >(
            "INSERT INTO examInstanceStudents (examInstanceId, studentId) VALUES (?, ?) ON CONFLICT(examInstanceId, studentId) DO NOTHING"
        );
        this.stmtDeleteExamInstanceStudent = this.database.prepare<
            [string, string]
        >(
            "DELETE FROM examInstanceStudents WHERE examInstanceId = ? AND studentId = ?"
        );
    }

    private selectExamInstancesSync(examId: string): ExamInstance[] | null {
        let res = this.stmtSelectExamInstancesByExam.all(examId);

        if (res && res.length > 0)
            return res.map((r) => {
                return {
                    ...r,
                    groups: JSON.parse(r.groups)[0] ? JSON.parse(r.groups) : [],
                    studentIds: r.studentIds
                        ? JSON.parse(r.studentIds)[0]
                            ? JSON.parse(r.studentIds)
                            : []
                        : [],
                };
            });
        else return null;
    }

    public async selectExamInstances(examId: string) {
        return Promise.resolve(this.selectExamInstancesSync(examId));
    }

    private deleteExamInstancesSync(examId: string): boolean | null {
        const oldDbObjects = this.selectExamInstancesSync(examId);
        if (oldDbObjects === null) return null;

        const res = this.stmtDeleteExamInstances.run(examId);
        if (res.changes >= 1) return true;
        else return false;
    }

    public async deleteExamInstances(id: string): Promise<boolean | null> {
        return Promise.resolve(this.deleteExamInstancesSync(id));
    }

    private selectExamInstanceSync(id: string): ExamInstance | null {
        const res = this.stmtSelectExamInstance.get(id);

        if (!res || !res.id) return null;

        const dbObject: ExamInstance = {
            ...res,
            groups: JSON.parse(res.groups)[0] ? JSON.parse(res.groups) : [],
            studentIds: res.studentIds
                ? JSON.parse(res.studentIds)[0]
                    ? JSON.parse(res.studentIds)
                    : []
                : [],
        };

        if (dbObject) return dbObject;
        else return null;
    }

    public async selectExamInstance(id: string): Promise<ExamInstance | null> {
        return Promise.resolve(this.selectExamInstanceSync(id));
    }

    private insertExamInstanceSync(
        examInstance: Omit<ExamInstance, "id">
    ): ExamInstance {
        const dbObject = this.transInsertExamInstance(examInstance);

        if (dbObject) return dbObject;
        throw Error("No changes in DB detected");
    }

    public async insertExamInstance(
        examInstance: Omit<ExamInstance, "id">
    ): Promise<ExamInstance> {
        return Promise.resolve(this.insertExamInstanceSync(examInstance));
    }

    private updateExamInstanceSync(
        id: string,
        examInstance: Partial<ExamInstance>,
        replace: boolean = false
    ): ExamInstance | null {
        const oldDbObject = this.selectExamInstanceSync(id);
        if (oldDbObject === null) return null;
        const newObject = {
            ...oldDbObject,
            ...examInstance,
            groups: JSON.stringify(
                replace
                    ? examInstance.groups || []
                    : _.merge([], oldDbObject.groups, examInstance.groups) || []
            ),
            studentIds: replace
                ? examInstance.studentIds || []
                : _.merge(
                      [],
                      oldDbObject.studentIds,
                      examInstance.studentIds
                  ) || [],
            generated:
                examInstance.generated ||
                oldDbObject.generated ||
                new Date().toISOString(),
            id: id,
        };

        const dbObject = this.transUpdateExamInstance(newObject, replace);
        if (dbObject === null) return null;
        if (dbObject) return dbObject;

        throw Error("Problem while updating object");
    }

    public async updateExamInstance(
        id: string,
        examInstance: Partial<ExamInstance>,
        replace: boolean = false
    ): Promise<ExamInstance | null> {
        return Promise.resolve(
            this.updateExamInstanceSync(id, examInstance, replace)
        );
    }

    private deleteExamInstanceSync(id: string): boolean | null {
        const oldDbObject = this.selectExamInstanceSync(id);
        if (oldDbObject === null) return null;

        const res = this.stmtDeleteExamInstance.run(id);
        if (res.changes >= 1) return true;
        else return false;
    }

    public async deleteExamInstance(id: string): Promise<boolean | null> {
        return Promise.resolve(this.deleteExamInstanceSync(id));
    }

    private connectExamInstanceAndStudentSync(
        examInstanceId: string,
        studentId: string,
        skipCheck = true
    ) {
        if (!skipCheck) {
            const exam = this.selectExamInstanceSync(examInstanceId);
            const question = this.selectStudentSync(studentId);
            if (exam === null || question === null)
                throw Error("ExamInstance or student does not exist", {
                    cause: errorCause.userError,
                });
        }

        const updateAction = this.stmtInsertExamInstanceStudent.run(
            examInstanceId,
            studentId
        );

        return true;
    }

    private disconnectExamInstanceAndStudentSync(
        examInstanceId: string,
        studentId: string,
        skipCheck = false
    ) {
        if (!skipCheck) {
            const subject = this.selectExamInstanceSync(examInstanceId);
            const question = this.selectStudentSync(studentId);
            if (subject === null || question === null) return null;
        }

        const updateAction = this.stmtDeleteExamInstanceStudent.run(
            examInstanceId,
            studentId
        );

        return true;
    }

    //MARK: ---------- Exam Instances Answer ----------

    private stmtSelectExamInstanceAnswersByExamInstance!: Statement<
        [string],
        dbExamInstanceAnswer
    >;
    private stmtSelectExamInstanceAnswersByExamInstanceAndStudent!: Statement<
        [string, string],
        dbExamInstanceAnswer
    >;
    private stmtSelectExamInstanceAnswersByExamInstanceAndStudentAndScanNumber!: Statement<
        [string, string, number],
        dbExamInstanceAnswer
    >;

    private stmtDeleteExamInstanceAnswersByExamInstance!: Statement<[string]>;
    private stmtDeleteExamInstanceAnswersByExamInstanceAndStudent!: Statement<
        [string, string]
    >;
    private stmtDeleteExamInstanceAnswersByExamInstanceAndStudentAndScanNumber!: Statement<
        [string, string, number]
    >;

    private stmtInsertExamInstanceAnswer!: Statement<dbExamInstanceAnswer>;
    private stmtUpdateExamInstanceAnswer!: Statement<dbExamInstanceAnswer>;

    private defineExamInstanceAnswersStatements() {
        this.stmtSelectExamInstanceAnswersByExamInstance =
            this.database.prepare<[string], dbExamInstanceAnswer>(
                `SELECT examInstanceId, studentId, scanNumber, answerObject
                FROM examInstanceAnswers
                WHERE examInstanceId = ?`
            );
        this.stmtSelectExamInstanceAnswersByExamInstanceAndStudent =
            this.database.prepare<[string], dbExamInstanceAnswer>(
                `SELECT examInstanceId, studentId, scanNumber, answerObject
                FROM examInstanceAnswers
                WHERE examInstanceId = ? AND studentId = ?`
            );
        this.stmtSelectExamInstanceAnswersByExamInstanceAndStudentAndScanNumber =
            this.database.prepare<[string], dbExamInstanceAnswer>(
                `SELECT examInstanceId, studentId, scanNumber, answerObject
                FROM examInstanceAnswers
                WHERE examInstanceId = ? AND studentId = ? AND scanNumber = ?`
            );
        this.stmtDeleteExamInstanceAnswersByExamInstance =
            this.database.prepare<[string]>(
                `DELETE FROM examInstanceAnswers WHERE examInstanceId = ?`
            );
        this.stmtDeleteExamInstanceAnswersByExamInstanceAndStudent =
            this.database.prepare<[string], dbExamInstanceAnswer>(
                `DELETE FROM examInstanceAnswers WHERE examInstanceId = ? AND studentId = ?`
            );
        this.stmtDeleteExamInstanceAnswersByExamInstanceAndStudentAndScanNumber =
            this.database.prepare<[string], dbExamInstanceAnswer>(
                `DELETE FROM examInstanceAnswers WHERE examInstanceId = ? AND studentId = ? AND scanNumber = ?`
            );
        this.stmtInsertExamInstanceAnswer =
            this.database.prepare<dbExamInstanceAnswer>(
                "INSERT INTO examInstanceAnswers (examInstanceId, studentId, scanNumber, answerObject) VALUES ($examInstanceId, $studentId, $scanNumber, $answerObject)"
            );
        this.stmtUpdateExamInstanceAnswer =
            this.database.prepare<dbExamInstanceAnswer>(
                "UPDATE examInstanceAnswers SET answerObject = $answerObject WHERE examInstanceId = $examInstanceId AND studentId = $studentId AND scanNumber = $scanNumber"
            );
    }

    private selectExamInstanceAnswersSync(
        examInstanceId: string,
        studentId?: string,
        scanNumber?: number
    ): ExamInstanceAnswer[] | null {
        let res: dbExamInstanceAnswer[];

        if (studentId && scanNumber !== undefined)
            res =
                this.stmtSelectExamInstanceAnswersByExamInstanceAndStudentAndScanNumber.all(
                    examInstanceId,
                    studentId,
                    scanNumber
                );
        else if (studentId)
            res =
                this.stmtSelectExamInstanceAnswersByExamInstanceAndStudent.all(
                    examInstanceId,
                    studentId
                );
        else
            res =
                this.stmtSelectExamInstanceAnswersByExamInstance.all(
                    examInstanceId
                );

        if (res && res.length > 0)
            return res.map((r) => {
                return {
                    ...r,
                    answerObject: JSON.parse(r.answerObject) || {},
                };
            });
        else return null;
    }

    public async selectExamInstanceAnswers(
        examInstanceId: string,
        studentId?: string,
        scanNumber?: number
    ) {
        return Promise.resolve(
            this.selectExamInstanceAnswersSync(
                examInstanceId,
                studentId,
                scanNumber
            )
        );
    }

    private deleteExamInstanceAnswersSync(
        examInstanceId: string,
        studentId?: string,
        scanNumber?: number
    ): boolean | null {
        const oldDbObjects = this.selectExamInstanceAnswersSync(
            examInstanceId,
            studentId,
            scanNumber
        );
        if (oldDbObjects === null) return null;

        let res;

        if (studentId && scanNumber !== undefined)
            res =
                this.stmtDeleteExamInstanceAnswersByExamInstanceAndStudentAndScanNumber.run(
                    examInstanceId,
                    studentId,
                    scanNumber
                );
        else if (studentId)
            res =
                this.stmtDeleteExamInstanceAnswersByExamInstanceAndStudent.run(
                    examInstanceId,
                    studentId
                );
        else
            res =
                this.stmtDeleteExamInstanceAnswersByExamInstance.run(
                    examInstanceId
                );

        if (res.changes >= 1) return true;
        else return false;
    }

    public async deleteExamInstanceAnswers(
        examInstanceId: string,
        studentId?: string,
        scanNumber?: number
    ): Promise<boolean | null> {
        return Promise.resolve(
            this.deleteExamInstanceAnswersSync(
                examInstanceId,
                studentId,
                scanNumber
            )
        );
    }

    private insertExamInstanceAnswerSync(
        examInstanceAnswer: ExamInstanceAnswer
    ): ExamInstanceAnswer {
        const dbObject = {
            ...examInstanceAnswer,
            answerObject: JSON.stringify(examInstanceAnswer.answerObject || {}),
        };
        const res = this.stmtInsertExamInstanceAnswer.run(dbObject);

        if (res.changes < 1) throw Error("Insertion in DB failed! Aborting.");

        const createdDbObject = this.selectExamInstanceAnswersSync(
            dbObject.examInstanceId,
            dbObject.studentId,
            dbObject.scanNumber
        );

        if (createdDbObject && createdDbObject[0]) return createdDbObject[0];
        throw Error("No changes in DB detected");
    }

    public async insertExamInstanceAnswer(
        examInstanceAnswer: ExamInstanceAnswer
    ): Promise<ExamInstanceAnswer> {
        return Promise.resolve(
            this.insertExamInstanceAnswerSync(examInstanceAnswer)
        );
    }

    private updateExamInstanceAnswerSync(
        examInstanceId: string,
        studentId: string,
        scanNumber: number,
        examInstanceAnswer: ExamInstanceAnswer
    ): ExamInstanceAnswer | null {
        const oldDbObject = this.selectExamInstanceAnswersSync(
            examInstanceId,
            studentId,
            scanNumber
        );
        if (oldDbObject === null) return null;
        const newObject = {
            ...oldDbObject,
            ...examInstanceAnswer,
            answerObject: JSON.stringify(examInstanceAnswer.answerObject || {}),
            examInstanceId,
            studentId,
            scanNumber,
        };

        const res = this.stmtUpdateExamInstanceAnswer.run(newObject);

        if (res.changes < 1) throw Error("Insertion in DB failed! Aborting.");

        const createdDbObject = this.selectExamInstanceAnswersSync(
            examInstanceId,
            studentId,
            scanNumber
        );

        if (createdDbObject === null) return null;
        if (createdDbObject && createdDbObject[0]) return createdDbObject[0];

        throw Error("Problem while updating object");
    }

    public async updateExamInstanceAnswer(
        examInstanceId: string,
        studentId: string,
        scanNumber: number,
        examInstanceAnswer: ExamInstanceAnswer
    ): Promise<ExamInstanceAnswer | null> {
        return Promise.resolve(
            this.updateExamInstanceAnswerSync(
                examInstanceId,
                studentId,
                scanNumber,
                examInstanceAnswer
            )
        );
    }

    //MARK: ---------- Students ----------

    private defineStudentsStatements() {
        this.stmtSelectStudents = this.database.prepare<
            [],
            dbStudent & { tags: string }
        >(
            `SELECT students.id as id, students.firstName as firstName, students.lastName as lastName, students.studentId as studentId, json_group_array(tags.text) as tags 
                FROM students 
                    LEFT JOIN studentTags
                        ON students.id = studentTags.studentId
                    LEFT JOIN tags
                        ON studentTags.tagId = tags.id
                GROUP BY students.id`
        );
        this.stmtSelectStudentsById = this.database.prepare<
            [string],
            dbStudent & { tags: string }
        >(
            `SELECT students.id as id, students.firstName as firstName, students.lastName as lastName, students.studentId as studentId, json_group_array(tags.text) as tags 
                FROM students 
                    LEFT JOIN studentTags
                        ON students.id = studentTags.studentId
                    LEFT JOIN tags
                        ON studentTags.tagId = tags.id
                WHERE students.id IN (SELECT value FROM json_each(?))
                GROUP BY students.id`
        );
        this.stmtSelectStudentsByStudentId = this.database.prepare<
            [string],
            dbStudent & { tags: string }
        >(
            `SELECT students.id as id, students.firstName as firstName, students.lastName as lastName, students.studentId as studentId, json_group_array(tags.text) as tags 
                FROM students 
                    LEFT JOIN studentTags
                        ON students.id = studentTags.studentId
                    LEFT JOIN tags
                        ON studentTags.tagId = tags.id
                WHERE students.studentId IN (SELECT value FROM json_each(?))
                GROUP BY students.id`
        );
        this.stmtSelectStudentsByTagText = this.database.prepare<
            [string],
            dbStudent & { tags: string }
        >(
            `SELECT students.id as id, students.firstName as firstName, students.lastName as lastName, students.studentId as studentId, json_group_array(tags.text) as tags 
                FROM students 
                    LEFT JOIN studentTags
                        ON students.id = studentTags.studentId
                    LEFT JOIN tags
                        ON studentTags.tagId = tags.id
                WHERE tags.text LIKE (SELECT value FROM json_each(?) WHERE tags.text LIKE value)
                GROUP BY students.id`
        );
        this.stmtSelectStudent = this.database.prepare<
            [string],
            dbStudent & { tags: string }
        >(
            `SELECT students.id as id, students.firstName as firstName, students.lastName as lastName, students.studentId as studentId, json_group_array(tags.text) as tags 
                FROM students 
                    LEFT JOIN studentTags
                        ON students.id = studentTags.studentId
                    LEFT JOIN tags
                        ON studentTags.tagId = tags.id
                WHERE students.id = ?
                GROUP BY students.id`
        );
        this.stmtInsertStudent = this.database.prepare<dbStudent>(
            "INSERT INTO students (id, firstName, lastName, studentId) VALUES ($id, $firstName, $lastName, $studentId)"
        );
        this.stmtUpdateStudent = this.database.prepare<dbStudent>(
            "UPDATE students SET firstName = $firstName, lastName = $lastName, studentId = $studentId WHERE id = $id"
        );
        this.stmtDeleteStudent = this.database.prepare<[string]>(
            "DELETE FROM students WHERE id = ?"
        );
    }

    private selectStudentsSync(filter?: {
        studentIds?: string[];
        studentIdsAlt?: string[];
        tagText?: string[];
    }): Student[] | null {
        let res;
        if (filter) {
            if (filter.studentIds)
                res = this.stmtSelectStudentsById.all(
                    JSON.stringify(filter.studentIds)
                );
            else if (filter.studentIdsAlt)
                res = this.stmtSelectStudentsByStudentId.all(
                    JSON.stringify(filter.studentIdsAlt)
                );
            else if (filter.tagText)
                res = this.stmtSelectStudentsByTagText.all(
                    JSON.stringify(
                        filter.tagText.map((text) => "%" + text + "%")
                    )
                );
        } else res = this.stmtSelectStudents.all();

        if (res)
            return res?.map((student) => {
                return {
                    ...student,
                    tags: student.tags
                        ? JSON.parse(student.tags)[0]
                            ? JSON.parse(student.tags).sort()
                            : []
                        : [],
                };
            });
        else return null;
    }

    public async selectStudents(filter?: {
        studentIds?: string[];
        studentIdsAlt?: string[];
        tagText?: string[];
    }) {
        return Promise.resolve(this.selectStudentsSync(filter));
    }

    private selectStudentSync(id: string): Student | null {
        const res = this.stmtSelectStudent.get(id);
        if (res)
            return {
                ...res,
                tags: res.tags
                    ? JSON.parse(res.tags)[0]
                        ? JSON.parse(res.tags).sort()
                        : []
                    : [],
            };
        else return null;
    }

    public async selectStudent(id: string): Promise<Student | null> {
        return Promise.resolve(this.selectStudentSync(id));
    }

    private insertStudentSync(student: Student) {
        const dbObject = this.transInsertStudent(student);

        if (dbObject) return dbObject;
        throw Error("No changes in DB detected");
    }

    public async insertStudent(student: Student) {
        return Promise.resolve(this.insertStudentSync(student));
    }

    private updateStudentSync(
        id: string,
        student: Partial<Student>,
        replace: boolean
    ): Student | null {
        const oldDbObject = this.selectStudentSync(id);
        if (oldDbObject === null) return null;
        const newObject = {
            ...oldDbObject,
            ...student,
            tags: replace
                ? student.tags || []
                : _.merge([], oldDbObject.tags, student.tags) || [],
        };

        const dbObject = this.transUpdateStudent(newObject, replace);
        if (dbObject === null) return null;
        if (dbObject) return dbObject;

        throw Error("Problem while updating object");
    }

    public async updateStudent(
        id: string,
        student: Partial<Student>,
        replace: boolean
    ): Promise<Student | null> {
        return Promise.resolve(this.updateStudentSync(id, student, replace));
    }

    private deleteStudentSync(id: string): boolean | null {
        const oldDbObject = this.selectStudentSync(id);
        if (oldDbObject === null) return null;

        const res = this.stmtDeleteStudent.run(id);
        if (res.changes >= 1) return true;
        else return false;
    }

    public async deleteStudent(id: string): Promise<boolean | null> {
        return Promise.resolve(this.deleteStudentSync(id));
    }
}
