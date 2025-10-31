import express from "express";
import { connectDb } from "./utils/db.js";
import cors from "cors";
import config from "./utils/config.js";
import blogsRouter from "./controllers/blogs.js";
import loginRouter from "./controllers/login.js";
import usersRouter from "./controllers/users.js";
import authorsRouter from "./controllers/authors.js";
import userMarks from "./controllers/userMarks.js";
import { tokenExtractor } from "./utils/middleware.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(tokenExtractor);

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/author", authorsRouter);
app.use("/api/readinglist", userMarks);

app.use((err, req, res, next) => {
  console.error(err);

  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({ error: error.errors[0].message });
  }

  res.status(500).json({ error: err.message });
});

const start = async () => {
  await connectDb();
  app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
  });
};

start();
