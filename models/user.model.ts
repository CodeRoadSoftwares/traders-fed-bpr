import { JKDistrict } from "@/constants/districts";
import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: {
      line: { type: String },
      district: { type: String, enum: Object.values(JKDistrict) },
      pincode: { type: Number },
    },
    password: { type: String, required: true },
    phone: { type: Number, required: true, unique: true },
    role: {
      type: String,
      enum: ["SHOP", "ADMIN", "SUPER_ADMIN"],
      required: true,
    },
  },
  { timestamps: true },
);

const User = models.User || model("User", userSchema);
export default User;
