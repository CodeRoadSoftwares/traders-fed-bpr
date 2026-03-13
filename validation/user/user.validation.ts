import { JKDistrict } from "@/constants/districts";
import z from "zod";

export const userValidation = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
  phone: z.number(),
  address: z.object({
    line1: z.string(),
    district: z.enum(JKDistrict),
    pincode: z.number(),
  }),
});
export const signinValidation = z.object({
  email: z.string(),
  password: z.string(),
});

export type IUser = z.infer<typeof userValidation>;
export type ISignin = z.infer<typeof signinValidation>;
