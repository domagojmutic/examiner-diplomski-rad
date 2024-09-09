/* eslint-disable @typescript-eslint/no-explicit-any */
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
  questionObject: { [key: string]: any };
  answerObject: { [key: string]: any };
  tags: string[];
}

export interface Exam {
  id: string;
  name?: string | null;
  subjectIds?: string[] | null;
  questionIds: string[];
  configs: {
    questions?: {
      [key: string]: {
        questionObject: { [key: string]: any };
        answerObject: { [key: string]: any };
      };
    };
    [key: string]: unknown;
  };
  tags: string[];
}

export interface ExamInstance {
  id: string;
  examId: string;
  seed: string;
  generated: Date;
  studentIds: string[];
  groups: string[];
}

export interface ExamInstanceAnswer {
  examInstanceId: string;
  studentId: string;
  scanNumber: number;
  answerObject: {
    group: string;
    seed: number;
    [key: string]: { [key: string]: unknown } | string | number;
  };
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
