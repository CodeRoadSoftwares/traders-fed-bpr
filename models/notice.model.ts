import { Schema, Types, model } from "mongoose";

const noticeSchema = new Schema(
  {
    createdBy: { type: Types.ObjectId, ref: "user", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    visibility: { type: String, enum: ["PUBLIC", "SHOPS"], required: true },
    urgent: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Notice = model("Notice", noticeSchema);
export default Notice;
