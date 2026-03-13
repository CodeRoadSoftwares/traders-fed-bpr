import { ShopCategory } from "@/constants/categories";
import z from "zod";

export const shopSchema = z.object({
  registrationNumber: z.string(),
  licenseNumber: z.string(),
  category: z.enum(ShopCategory),
});

export type IShop = z.infer<typeof shopSchema>;
