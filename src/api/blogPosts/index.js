/* ********************************************** BLOGPOSTS CRUD ENDPOINTS ***********************************

1. CREATE --> POST http://localhost:3001/blogPosts/ (+body)
2. READ --> GET http://localhost:3001/blogPosts/ (+ optional query params)
3. READ (single blogPost) --> GET http://localhost:3001/blogPosts/:blogPostId
4. UPDATE (single blogPost) --> PUT http://localhost:3001/blogPosts/:blogPostId (+ body)
5. DELETE (single blogPost) --> DELETE http://localhost:3001/blogPosts/:blogPostId

*/

import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import uniqid from "uniqid";
import httpErrors from "http-errors";
import { blogPostsJSONPath } from "../lib/fs-tools.js";

const { NotFound, Unauthorized, BadRequest } = httpErrors;
const blogPostsRouter = express.Router();

const getBlogPosts = () => JSON.parse(fs.readFileSync(blogPostsJSONPath));

const writeBlogPosts = (blogPostsArray) =>
  fs.writeFileSync(blogPostsJSONPath, JSON.stringify(blogPostsArray));

//POST http://localhost:3001/blogPosts/ (+body)

blogPostsRouter.get("/", (req, res) => {
  const blogPostsArray = getBlogPosts();
  res.send(blogPostsArray);
});

//POST http://localhost:3001/blogPosts/ (+body)

blogPostsRouter.post("/", (req, res) => {
  const blogPostsArray = getBlogPosts();
  const newBlogPost = { ...req.body, createdAt: new Date(), _id: uniqid() };
  blogPostsArray.push(newBlogPost);
  writeBlogPosts(blogPostsArray);
  res.status(201).send({ _id: newBlogPost._id });
});

//GET http://localhost:3001/blogPosts/:blogPostId

blogPostsRouter.get("/:blogPostId", (req, res, next) => {
  try {
    const blogPostsArray = getBlogPosts();
    const blogPost = blogPostsArray.find(
      (blogPost) => blogPost._id === req.params.blogPostId
    );
    if (blogPost) {
      res.send(blogPost);
    } else {
      next(NotFound(`Blog post with id ${req.params.blogPostId} not found!`));
    }
    // const blogPost = blogPostsArray.find(
    //     (blogPost) => blogPost._id === req.params.blogPostId
    //   );
    //   res.send(blogPost);
  } catch (error) {
    next(error);
  }
});

//PUT http://localhost:3001/blogPosts/:blogPostId (+ body)
blogPostsRouter.put("/:blogPostId", (req, res) => {
  const blogPostArray = getBlogPosts();
  const index = blogPostArray.findIndex(
    (blogPost) => blogPost._id === req.params.blogPostId
  );
  const oldBlogPost = blogPostArray[index];
  const updatedBlogPost = {
    ...oldBlogPost,
    ...req.body,
    updatedAt: new Date(),
  };
  blogPostArray[index] = updatedBlogPost;
  writeBlogPosts(blogPostArray);
  res.send(updatedBlogPost);
});

//DELETE http://localhost:3001/blogPosts/:blogPostId
blogPostsRouter.delete("/:blogPostId", (req, res) => {
  const blogPostsArray = getBlogPosts();
  const remainingBlogPosts = blogPostsArray.filter(
    (blogPost) => blogPost._id !== req.params.blogPostId
  );
  writeBlogPosts(remainingBlogPosts);
  res.send();
});

export default blogPostsRouter;
