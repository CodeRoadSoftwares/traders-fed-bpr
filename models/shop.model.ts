import { ShopCategory } from "@/constants/categories";
import { Schema, Types, model } from "mongoose";

const shopSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "user", required: true, unique: true },
    registrationNumber: { type: String, required: true, unique: true },
    licenseNumber: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: Object.values(ShopCategory),
      required: true,
    },
    certificateNumber: { type: String, required: true, unique: true },
    certificateIssuedAt: { type: Date },
    certificateExpiryDate: { type: Date },
    certificateStatus: {
      type: String,
      enum: ["PENDING", "ACTIVE", "REJECTED", "EXPIRED"],
      default: "PENDING",
    },
    actionBy: { type: Types.ObjectId, ref: "user", unique: true },
  },
  { timestamps: true },
);

const Shop = model("Shop", shopSchema);
export default Shop;
