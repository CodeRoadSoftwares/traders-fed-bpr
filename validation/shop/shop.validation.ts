import { ShopCategory } from "@/constants/categories";
import z from "zod";

export const shopSchema = z.object({
  registrationNumber: z.string(),
  licenseNumber: z.string(),
  category: z.enum(ShopCategory),
  photos: z.array(z.string()).optional(),
  location: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
});

export type IShop = z.infer<typeof shopSchema>;
