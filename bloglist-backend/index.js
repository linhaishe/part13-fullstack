import express from "express";
import { Blog, connectDb } from "./db.js";
import cors from "cors";

const app = express();

await connectDb();

app.use(cors());
app.use(express.json());

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

app.get("/api/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    console.log(
      `${blog.id}. ${blog.title} by ${blog.author} (${blog.likes} likes)`
    );
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/blogs", async (req, res) => {
  try {
    const { author, title, url, likes } = req.body;

    // 可以加简单验证
    if (!title || !url) {
      return res.status(400).json({ error: "title and url are required" });
    }

    const newBlog = await Blog.create({
      author,
      title,
      url,
      likes: likes || 0, // 默认0
    });

    res.status(201).json(newBlog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/blogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    await blog.destroy();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
