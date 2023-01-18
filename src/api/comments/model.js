import mongoose, { model } from "mongoose";

const { Schema } = mongoose;

const commentsSchema = new Schema(
  {
    comment: { type: String, required: true },
    user: { type: String, required: false },
  },
  { timestamps: true }
);

export default model("comment", commentsSchema);
