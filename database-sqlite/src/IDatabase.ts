export interface Subject {
    id: string;
    name: string;
    questionIds: string[];
    tags: string[];
}

export interface Question {
    id: string;
    text: string;
    type: string;
    questionObject: { [key: string]: unknown };
    answerObject: { [key: string]: unknown };
    tags: string[];
}

export interface Exam {
    id: string;
    name?: string | null;
    subjectIds?: string[] | null;
    questionIds: string[];
    configs: { [key: string]: unknown };
    tags: string[];
}

export interface ExamInstance {
    id: string;
    examId: string;
    seed: number;
    generated: string;
    studentIds: string[];
    groups: string[];
}

export interface ExamInstanceAnswer {
    studentId: string;
    examInstanceId: string;
    answerObject: { [key: string]: unknown };
    scanNumber: number,
}

export interface Student {
    id: string;
    firstName: string;
    lastName: string;
    studentId?: string | null;
    tags: string[];
}

export interface Tag {
    id: string;
    text: string;
}

export default abstract class {
    public abstract selectSubjects(filter?: {subjectIds?: string[], tagText?: string[]}): Promise<Subject[] | null>;
    public abstract selectSubject(subjectId: string): Promise<Subject | null>;
    public abstract insertSubject(subject: Omit<Subject, "id">): Promise<Subject>;
    public abstract updateSubject(subjectId: string, subject: Partial<Subject>, replace?: boolean): Promise<Subject | null>;
    public abstract deleteSubject(subjectId: string): Promise<boolean | null>;

    public abstract selectQuestions(filter?: {questionIds?: string[], examIds?: string[], subjectIds?: string[], tagText?: string[]}): Promise<Question[] | null>;
    public abstract selectQuestion(questionId: string): Promise<Question | null>;
    public abstract insertQuestion(question: Omit<Question, "id">): Promise<Question>;
    public abstract updateQuestion(questionId: string, subject: Partial<Question>, replace?: boolean): Promise<Question | null>;
    public abstract deleteQuestion(questionId: string): Promise<boolean | null>;

    public abstract selectExamInstances(examId: string): Promise<ExamInstance[] | null>;
    public abstract deleteExamInstances(examId: string): Promise<boolean | null>;
    public abstract selectExamInstance(examInstanceId: string): Promise<ExamInstance | null>;
    public abstract insertExamInstance(examInstance: Omit<ExamInstance, "id">): Promise<ExamInstance>;
    public abstract updateExamInstance(examInstanceId: string, examInstance: Partial<ExamInstance>, replace?: boolean): Promise<ExamInstance | null>;
    public abstract deleteExamInstance(examInstanceId: string): Promise<boolean | null>;
    
    public abstract selectExamInstanceAnswers(examInstanceId: string, studentId?: string, scanNumber?: number): Promise<ExamInstanceAnswer[] | null>;
    public abstract deleteExamInstanceAnswers(examInstanceId: string, studentId?: string, scanNumber?: number): Promise<boolean | null>;
    public abstract insertExamInstanceAnswer(examInstanceAnswer: ExamInstanceAnswer): Promise<ExamInstanceAnswer>;
    public abstract updateExamInstanceAnswer(examInstanceId: string, studentId: string, scanNumber: number, examInstance: ExamInstanceAnswer): Promise<ExamInstanceAnswer | null>;

    public abstract selectExams(filter?: {subjectIds?: string[], examIds?: string[], tagText?: string[]}): Promise<Exam[] | null>;
    public abstract selectExam(examId: string): Promise<Exam | null>;
    public abstract insertExam(exam: Omit<Exam, "id">): Promise<Exam>;
    public abstract updateExam(examId: string, exam: Partial<Exam>, replace?: boolean): Promise<Exam | null>;
    public abstract deleteExam(examId: string): Promise<boolean | null>;

    public abstract selectStudents(filter?: {studentIds?: string[], studentIdsAlt?: string[], tagText?: string[]}): Promise<Student[] | null>;
    public abstract selectStudent(studentId: string): Promise<Student | null>;
    public abstract insertStudent(student: Omit<Student, "id">): Promise<Student>;
    public abstract updateStudent(studentId: string, student: Partial<Student>, replace?: boolean): Promise<Student | null>;
    public abstract deleteStudent(studentId: string): Promise<boolean | null>;

    public abstract selectTags(type?: "subject" | "question" | "exam" | "student" | "tagText", filter?: {questionIds?: string[], examIds?: string[], subjectIds?: string[], studentIds?: string[], tagText?: string[]}): Promise<Tag[] | null>;
    public abstract selectTag(selector: string, selectionType: "id" | "text"): Promise<Tag | null>;
    public abstract insertTag(tag: Omit<Tag, "id">): Promise<Tag>;
    public abstract updateTag(tagId: string, tag: Partial<Tag>): Promise<Tag | null>;
    public abstract deleteTag(tagId: string): Promise<boolean | null>;
    public abstract assignTag(tagId: string, type: "subject" | "question" | "exam" | "student", assigneeId: string): Promise<boolean | null>;
    public abstract unassignTag(tagId: string, type: "subject" | "question" | "exam" | "student", assigneeId: string): Promise<boolean | null>;
}

export const errorCause = {
    userError: "userError", // For 400 responses
    notFoundError: "notFoundError", // For 404 responses
    databaseError: "dbError", // For 500 responses
    notImplementedError: "dbError" // For 501 responses
}