/************** AUTHORS CRUD ENDPOINTS ************
 1. CREATE => POST http://localhost:3001/authors/ (+ body)
 2. READ => GET http://localhost:3001/authors/ (+ optional query params)
 3. READ (single author) => GET http://localhost:3001/authors/:authorId
 4. UPDATE (single author) => PUT http://localhost:3001/authors/:authorId (+ body)
 5. DELETE (single author) => DELETE http://localhost:3001/authors/:authorId
*/

import express from "express"; // 3RD PARTY MODULE (npm i express)
import fs from "fs"; //CORE MODULE
import { fileURLToPath } from "url"; // CORE MODULE
import { dirname, join } from "path"; //CORE MODULE

import uniqid from "uniqid"; // 3RD PARTY MODULE (npm i uniqid)
import { authorsJSONPath } from "../lib/fs-tools.js";

const authorsRouter = express.Router();

/****************************** */
/* how I get the authors.json path? */
/* console.log("current file url (url, not path!):", import.meta.url);
console.log("current file path: ", fileURLToPath(import.meta.url));
//parent's folder path
console.log("parent folder path: ", dirname(fileURLToPath(import.meta.url)));
console.log(
  "target: ",
  join(dirname(fileURLToPath(import.meta.url)), "authors.json")
); */

/****************************** */

//1. CREATE => POST http://localhost:3001/authors/ (+ body)
authorsRouter.post("/", (req, res) => {
  console.log("req body:", req.body);
  const newAuthor = {
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: uniqid(),
  };
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
  authorsArray.push(newAuthor);
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray));
  res.status(201).send({ id: newAuthor.id });
});

//2. READ => GET http://localhost:3001/authors/ (+ optional query params)
authorsRouter.get("/", (req, res) => {
  //2.1 => read the content of authors.json file, obtaining an array
  const fileContent = JSON.parse(fs.readFileSync(authorsJSONPath));
  console.log("fileContent:", fileContent);
  //2.2 => send it back as a response
  res.send(fileContent);
});

//3. READ (single author) => GET http://localhost:3001/authors/:authorId
authorsRouter.get("/:authorId", (req, res) => {
  const authorId = req.params.authorId;
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
  const author = authorsArray.find((author) => author._id === authorId);
  res.send(author);
});

//4. UPDATE (single author) => PUT http://localhost:3001/authors/:authorId (+ body)
authorsRouter.put("/:authorId", (req, res) => {
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
  const index = authorsArray.findIndex(
    (author) => author._id === req.params.authorId
  );
  const oldAuthor = authorsArray[index];
  const updatedAuthor = { ...oldAuthor, ...req.body, updatedAt: new Date() };
  authorsArray[index] = updatedAuthor;

  // 3. Save the modified array back to disk
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray));

  // 4. Send back a proper response
  res.send(updatedAuthor);
});

//5. DELETE (single author) => DELETE http://localhost:3001/authors/:authorId
authorsRouter.delete("/:authorId", (req, res) => {
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
  const authorId = req.params.authorId;
  const remainingAuthors = authorsArray.filter(
    (author) => author._id !== authorId
  );
  fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors));
  res.send();
});

export default authorsRouter;
