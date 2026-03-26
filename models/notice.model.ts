import { Schema, Types, model, models } from "mongoose";

const noticeSchema = new Schema(
  {
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    visibility: { type: String, enum: ["PUBLIC", "SHOPS"], required: true },
    urgent: { type: Boolean, default: false },
    attachments: [
      {
        url: { type: String, required: true },
        name: { type: String, required: true },
        type: { type: String, enum: ["image", "pdf"], required: true },
      },
    ],
  },
  { timestamps: true },
);

const Notice = models.Notice || model("Notice", noticeSchema);
export default Notice;
