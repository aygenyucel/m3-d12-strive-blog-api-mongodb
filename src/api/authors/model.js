import mongoose from "mongoose";

const { Schema, model } = mongoose;

const authorsSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: false },
  },
  { timestamps: true }
);

export default model("Author", authorsSchema);
