import z from "zod";
import { idModel, tagsModel } from "./Common";

export const questionModel = z.object({
    id: idModel,
    text: z.string(),
    type: z.string(),
    questionObject: z.record(z.string(), z.any()),
    answerObject: z.record(z.string(), z.any()),
    tags: tagsModel,
});

export type QuestionType = z.infer<typeof questionModel>;
