import express from "express";
import { Blog, connectDb } from "./db.js";
import cors from 'cors';

const app = express();

await connectDb();

app.use(cors());

app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.findAll();
    blogs.forEach((blog) => {
      console.log(
        `${blog.id}. ${blog.title} by ${blog.author} (${blog.likes} likes)`
      );
    });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
