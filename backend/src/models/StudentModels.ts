import z from "zod";
import { idModel, tagsModel } from "./Common";

export const studentModel = z.object({
    id: idModel,
    firstName: z.string(),
    lastName: z.string(),
    studentId: z.string().optional().nullable(),
    tags: tagsModel,
});

export type StudentType = z.infer<typeof studentModel>;
