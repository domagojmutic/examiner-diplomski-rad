import z from "zod";
import { idModel, tagsModel } from "./Common";

export const subjectModel = z.object({
    id: idModel,
    name: z.string(),
    questionIds: idModel.array(),
    tags: tagsModel,
});

export type SubjectType = z.infer<typeof subjectModel>;
