import { Router } from "express";
import Blog from "../models/index.js";
const router = Router();

const blogFinder = async (req, res, next) => {
  const blog = await Blog.findByPk(req.params.id)
  if (!blog) return res.status(404).json({ error: "Blog not found" })
  req.blog = blog
  next()
}

router.get("/", async (req, res) => {
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

router.get("/:id", blogFinder, async (req, res) => {
  try {
    console.log(
      `${req.blog.id}. ${req.blog.title} by ${req.blog.author} (${req.blog.likes} likes)`
    );
    res.json(req.blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
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

router.put("/:id", blogFinder, async (req, res) => {
  try {
    const { author, title, url, likes } = req.body
    const blog = req.blog

    if (!title || !url) {
      return res.status(400).json({ error: "title and url are required" })
    }

    blog.author = author || blog.author
    blog.title = title
    blog.url = url
    blog.likes = likes !== undefined ? likes : blog.likes

    await blog.save()
    res.json(blog)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete("/:id", blogFinder, async (req, res) => {
  try {
    if (!req.blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    await blog.destroy();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
