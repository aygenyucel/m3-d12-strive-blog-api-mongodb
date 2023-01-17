import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const blogPostsSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
      value: { type: Number },
      unit: { type: String },
    },
    author: {
      name: { type: String },
      avatar: { type: String },
    },
    content: { type: String },
  },
  {
    timestamps: true, //for creating automatically createdAt & updatedAt fields
  }
);
export default model("BlogPost", blogPostsSchema);
//this model now automatically linked to the "blogPosts" collection
//if collection is not there, it will be created
