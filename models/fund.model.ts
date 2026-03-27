import { Schema, Types, model, models } from "mongoose";

const fundSchema = new Schema(
  {
    type: { type: String, enum: ["INCOME", "EXPENSE"], required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    shopUser: { type: Types.ObjectId, ref: "User" }, // Shop owner who contributed (for INCOME)
  },
  { timestamps: true },
);

const Fund = models.Fund || model("Fund", fundSchema);
export default Fund;
