import z from "zod";

export const noticeSchema = z.object({
  title: z.string(),
  message: z.string(),
  visibility: z.enum(["PUBLIC", "SHOPS"]),
  urgent: z.boolean().optional(),
});

export type INotice = z.infer<typeof noticeSchema>;
