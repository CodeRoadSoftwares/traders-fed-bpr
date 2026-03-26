import z from "zod";

export const attachmentSchema = z.object({
  url: z.string(),
  name: z.string(),
  type: z.enum(["image", "pdf"]),
});

export const noticeSchema = z.object({
  title: z.string(),
  message: z.string(),
  visibility: z.enum(["PUBLIC", "SHOPS"]),
  urgent: z.boolean().optional(),
  attachments: z.array(attachmentSchema).optional(),
});

export type INotice = z.infer<typeof noticeSchema>;
