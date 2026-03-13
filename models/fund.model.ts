import { Schema, Types, model } from "mongoose";

const fundSchema = new Schema(
  {
    type: { type: String, enum: ["INCOME", "EXPENSE"], required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    createdBy: { type: Types.ObjectId, ref: "user", required: true },
  },
  { timestamps: true },
);

const Fund = model("Fund", fundSchema);
export default Fund;
