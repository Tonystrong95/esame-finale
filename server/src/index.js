import express from "express";
import bodyParser from "body-parser";
import fs from "node:fs/promises";
const app = express();
const port = 3001;

app.use(bodyParser.json());

import {
  getAll,
  createAlbum,
  createPhoto,
  deleteAlbum,
  deletePhoto,
  editAlbum,
  editPhoto,
} from "./db.js";

app.get("/photoazon", getAll);
app.post("/photoazon/:id", createPhoto);
app.post("/photoazon", createAlbum);
app.put("/photoazon/:id", editAlbum);
app.put("/photoazon/:photoazonId/photo/:photoId", editPhoto);
app.delete("/photoazon/:photoazonId/photo/:photoId", deletePhoto);
app.delete("/photoazon/:id", deleteAlbum);
app.listen(port, () => {
  console.log("listening on :" + port);
});
