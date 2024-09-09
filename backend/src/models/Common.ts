import z from "zod";

export const tagModel = z.string();
export const tagsModel = tagModel.array();
export const idModel = z.string().cuid2();

export const tagWithIdModel = z.object({ text: tagModel, id: idModel });

export const wrapper = z.object({
    statusCode: z.number(),
    statusMessage: z.string(),
});

export const successData = z.object({
    success: z.boolean(),
});

export type TagsType = z.infer<typeof tagsModel>;
export type TagType = z.infer<typeof tagModel>;
export type TagWithIdType = z.infer<typeof tagWithIdModel>;
export type IdType = z.infer<typeof idModel>;
