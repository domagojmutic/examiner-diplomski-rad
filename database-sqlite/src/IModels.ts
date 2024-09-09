export interface dbSubject {
    name: string;
    id: string;
}

export interface dbQuestion {
    text: string;
    type: string;
    questionObject: string;
    answerObject: string;
    subjectId?: string | null;
    id: string;
}

export interface dbExam {
    subjectId?: string | null;
    configs: string;
    name?: string | null;
    id: string;
}

export interface dbStudent {
    id: string;
    firstName: string;
    lastName: string;
    studentId?: string | null;
}

export interface dbTag {
    text: string;
    id: string;
}

export interface dbExamInstance {
    id: string;
    examId: string;
    seed: number;
    generated: string;
    groups: string;
}

export interface dbExamInstanceAnswer {
    examInstanceId: string;
    studentId: string;
    scanNumber: number;
    answerObject: string;
}