import { ShopCategory } from "@/constants/categories";
import { Schema, Types, model, models } from "mongoose";

const shopSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, unique: true },
    shopName: { type: String, required: true },
    registrationNumber: { type: String, required: true, unique: true },
    licenseNumber: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: Object.values(ShopCategory),
      required: true,
    },
    photos: [{ type: String }],
    primaryPhoto: { type: String },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    certificateNumber: { type: String, required: true, unique: true },
    certificateIssuedAt: { type: Date },
    certificateExpiryDate: { type: Date },
    certificateStatus: {
      type: String,
      enum: ["PENDING", "ACTIVE", "REJECTED", "EXPIRED"],
      default: "PENDING",
    },
    actionBy: { type: Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

const Shop = models.Shop || model("Shop", shopSchema);
export default Shop;
