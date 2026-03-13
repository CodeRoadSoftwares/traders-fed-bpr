import z from "zod";

export const fundSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string(),
  amount: z.number().positive(),
  description: z.string(),
  date: z.string().datetime(),
});

export type IFund = z.infer<typeof fundSchema>;
