import z from "zod";

export const adminSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.number(),
});

export type IAdmin = z.infer<typeof adminSchema>;
