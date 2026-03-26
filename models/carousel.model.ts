import { Schema, Types, model, models } from "mongoose";

const carouselSchema = new Schema(
  {
    slides: [
      {
        imageUrl: { type: String, required: true },
        title: { type: String, required: true },
        subtitle: { type: String, default: "" },
      },
    ],
    updatedBy: { type: Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

const Carousel = models.Carousel || model("Carousel", carouselSchema);
export default Carousel;
