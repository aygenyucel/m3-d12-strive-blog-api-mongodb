/* ********************************************** BLOGPOSTS CRUD ENDPOINTS ***********************************

1. CREATE --> POST http://localhost:3001/blogPosts/ (+body)
2. READ --> GET http://localhost:3001/blogPosts/ (+ optional query params)
3. READ (single blogPost) --> GET http://localhost:3001/blogPosts/:blogPostId
4. UPDATE (single blogPost) --> PUT http://localhost:3001/blogPosts/:blogPostId (+ body)
5. DELETE (single blogPost) --> DELETE http://localhost:3001/blogPosts/:blogPostId

*/

import express from "express";
import fs from "fs";
import httpErrors from "http-errors";
import { blogPostsJSONPath } from "../lib/fs-tools.js";

import BlogPostsModel from "./model.js";
import CommentsModel from "../comments/model.js";

const { NotFound, Unauthorized, BadRequest } = httpErrors;
const blogPostsRouter = express.Router();

const getBlogPosts = () => JSON.parse(fs.readFileSync(blogPostsJSONPath));

const writeBlogPosts = (blogPostsArray) =>
  fs.writeFileSync(blogPostsJSONPath, JSON.stringify(blogPostsArray));

//POST http://localhost:3001/blogPosts/ (+body)

/* blogPostsRouter.get("/", (req, res) => {
  const blogPostsArray = getBlogPosts();
  res.send(blogPostsArray);
}); */

blogPostsRouter.get("/", async (req, res, next) => {
  try {
    const blogPosts = await BlogPostsModel.find();
    res.send(blogPosts);
  } catch (error) {
    next(error);
  }
});

//POST http://localhost:3001/blogPosts/ (+body)

/* blogPostsRouter.post("/", (req, res) => {
  const blogPostsArray = getBlogPosts();
  const newBlogPost = { ...req.body, createdAt: new Date(), _id: uniqid() };
  blogPostsArray.push(newBlogPost);
  writeBlogPosts(blogPostsArray);
  res.status(201).send({ _id: newBlogPost._id });
}); */

blogPostsRouter.post("/", async (req, res, next) => {
  try {
    const newBlogPost = new BlogPostsModel(req.body);
    await newBlogPost.save();
    res.status(201).send(newBlogPost._id);
  } catch (error) {
    next(error);
  }
});

//GET http://localhost:3001/blogPosts/:blogPostId

/* blogPostsRouter.get("/:blogPostId", (req, res, next) => {
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
}); */

blogPostsRouter.get("/:blogPostId", async (req, res, next) => {
  try {
    const blogPost = await BlogPostsModel.findById(req.params.blogPostId);

    if (blogPost) {
      res.send(blogPost);
    } else {
      next(NotFound(`Blog post with id ${req.params.blogPostId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

//PUT http://localhost:3001/blogPosts/:blogPostId (+ body)
/* blogPostsRouter.put("/:blogPostId", (req, res) => {
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
}); */

blogPostsRouter.put("/:blogPostId", async (req, res, next) => {
  try {
    const updatedBlogPost = await BlogPostsModel.findByIdAndUpdate(
      req.params.blogPostId,
      req.body,
      { new: true, runValidators: true }
      //if you want to get back the newly updated record, you need to set new: true)
      //By default validation is off here --> set runValidators:true
    );

    if (updatedBlogPost) {
      res.send(updatedBlogPost);
    } else {
      next(NotFound(`Blog post with id ${req.params.blogPostId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

//DELETE http://localhost:3001/blogPosts/:blogPostId
/* blogPostsRouter.delete("/:blogPostId", (req, res) => {
  const blogPostsArray = getBlogPosts();
  const remainingBlogPosts = blogPostsArray.filter(
    (blogPost) => blogPost._id !== req.params.blogPostId
  );
  writeBlogPosts(remainingBlogPosts);
  res.send();
});
 */

blogPostsRouter.delete("/:blogPostId", async (req, res, next) => {
  try {
    const deletedBlogPost = await BlogPostsModel.findByIdAndDelete(
      req.params.blogPostId
    );
    if (deletedBlogPost) {
      res.status(204).end();
    } else {
      next(NotFound(`Blog post with id ${req.params.blogPostId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

//adds a new comment for the specified blog post
blogPostsRouter.post("/:blogPostId", async (req, res, next) => {
  try {
    const blogPost = BlogPostsModel.findById(req.params.blogPostId);

    if (blogPost) {
      const newComment = new CommentsModel(req.body);

      const newCommentToInsert = {
        ...newComment.toObject(),
        commentDate: new Date(),
      };
      console.log("newComment:", newComment);
      console.log("comment object to insert:", newCommentToInsert);

      const updatedBlogPost = await BlogPostsModel.findByIdAndUpdate(
        req.params.blogPostId,
        { $push: { comments: newCommentToInsert } },
        { new: true, runValidators: true }
      );

      res.send(updatedBlogPost);
    } else {
      next(NotFound(`BlogPost with id ${req.params.blogPostId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

//returns all the comments for the specified blog post
blogPostsRouter.get("/:blogPostId/comments", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

//returns a single comment for the specified blog post
blogPostsRouter.get(
  "/:blogPostId/comments/:commentId",
  async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  }
);

//edit the comment belonging to the specified blog post
blogPostsRouter.put(
  "/:blogPostId/comment/:commentId",
  async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  }
);

//delete the comment belonging to the specified blog post
blogPostsRouter.delete(
  "/:blogPostId/comment/:commentId",
  async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  }
);

export default blogPostsRouter;
