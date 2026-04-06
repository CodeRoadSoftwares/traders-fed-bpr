import { ShopCategory } from "@/constants/categories";
import z from "zod";

export const shopSchema = z.object({
  shopName: z.string(),
  registrationNumber: z.string(),
  licenseNumber: z.string(),
  category: z.enum(ShopCategory),
  primaryPhoto: z.string().url(),
  photos: z.array(z.string()).optional(),
  shopkeeperPhoto: z.string().url().optional(),
  documents: z
    .object({
      aadhar: z.string().url().optional(),
      pan: z.string().url().optional(),
      photograph: z.string().url().optional(),
      municipalityCertificate: z.string().url().optional(),
      rentOrElectricityBill: z.string().url().optional(),
      otherLicenses: z.array(z.string().url()).optional(),
    })
    .optional(),
  location: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
});

export type IShop = z.infer<typeof shopSchema>;
