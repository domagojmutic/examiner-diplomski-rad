import z from "zod";
import { idModel, tagsModel } from "./Common";

export const examModel = z.object({
    id: idModel,
    name: z.string().nullable().optional(),
    subjectIds: idModel.array().nullable().optional(),
    questionIds: idModel.array(),
    configs: z.record(z.string(), z.any()),
    tags: tagsModel,
});

export const examInstanceModel = z.object({
    id: idModel,
    examId: idModel,
    seed: z.number(),
    generated: z.string().datetime(),
    groups: z.string().array(),
    studentIds: idModel.array(),
});

export const examInstanceAnswerModel = z.object({
    examInstanceId: idModel,
    studentId: idModel,
    scanNumber: z.number(),
    answerObject: z.record(z.string(), z.any()),
});

export type ExamType = z.infer<typeof examModel>;
export type ExamInstanceType = z.infer<typeof examInstanceModel>;
export type ExamInstanceAnswerType = z.infer<typeof examInstanceAnswerModel>;
