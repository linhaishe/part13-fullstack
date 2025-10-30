import express from "express";
import { connectDb } from "./utils/db.js";
import cors from "cors";
import config from "./utils/config.js";
import  blogsRouter from  "./controllers/blogs.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/blogs", blogsRouter);

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: err.message })
})

const start = async () => {
  await connectDb();
  app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
  });
};

start();
