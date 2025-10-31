import { Router } from "express";
import { Blog, User } from "../models/index.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Op } from "sequelize";
import { sequelize } from "../utils/db.js";

const router = Router();
dotenv.config();

const blogFinder = async (req, res, next) => {
  const blog = await Blog.findByPk(req.params.id);
  if (!blog) return res.status(404).json({ error: "Blog not found" });
  req.blog = blog;
  next();
};

router.get("/", async (req, res) => {
  try {
    let where = {};
    if (req.query.search) {
      // where.title = {
      //  [Op.iLike]: `%${req.query.search}%`
      // };
      where = {
        [Op.or]: [
          {
            title: {
              [Op.iLike]: `%${req.query.search}%`,
            },
          },
          {
            author: {
              [Op.iLike]: `%${req.query.search}%`,
            },
          },
        ],
      };
    }
    const blogs = await Blog.findAll({
      // add to each note information about the user who added it
      attributes: { exclude: ["userId"] },
      include: {
        model: User,
        attributes: ["name"],
      },
      where,
      order: sequelize.literal("likes DESC"),
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
    const { author, title, url, likes, year } = req.body;
    const user = await User.findByPk(req.decodedToken.id);
    if (!title || !url) {
      return res.status(400).json({ error: "title and url are required" });
    }

    const newBlog = await Blog.create({
      year,
      author,
      title,
      url,
      likes: likes || 0,
      // we did not make a change to the model that defines notes, but we can still add a user to note objects
      userId: user.id,
      date: new Date(),
    });

    res.status(201).json(newBlog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", blogFinder, async (req, res) => {
  try {
    const { author, title, url, likes } = req.body;
    const blog = req.blog;

    if (!title || !url) {
      return res.status(400).json({ error: "title and url are required" });
    }

    blog.author = author || blog.author;
    blog.title = title;
    blog.url = url;
    blog.likes = likes !== undefined ? likes : blog.likes;

    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", blogFinder, async (req, res) => {
  try {
    const decodedToken = req.decodedToken;
    console.log("req.blog.userId", req.blog.userId);
    console.log("decodedToken.id", decodedToken.id);

    if (!decodedToken.id) {
      return res.status(401).json({ error: "token missing or invalid" });
    }

    if (!req.blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    if (req.blog.userId.toString() !== decodedToken.id.toString()) {
      return res
        .status(403)
        .json({ error: "only the creator can delete this blog" });
    }

    await req.blog.destroy();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
