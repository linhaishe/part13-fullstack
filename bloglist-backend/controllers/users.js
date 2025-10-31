import { Router } from "express";
import { User, Blog, UserMark } from "../models/index.js";
const router = Router();

router.get("/", async (req, res) => {
  const users = await User.findAll({
    // Making a join query
    include: [
      {
        model: Blog,
        // removing the unnecessary field userId from the notes associated with the user
        attributes: { exclude: ["userId"] },
        // through: { attributes: [] }, // 通过 UserMark 表，不返回额外字段
      },
      {
        model: UserMark,
        include: [
          {
            model: Blog,
            attributes: ["id", "title", "author"],
          },
        ],
        attributes: ["id"], // UserMark 自己的字段
      },
    ],
  });
  res.json(users);
});

router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.get("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

router.put("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    user.userName = req.body.userName;
    await User.save();
    res.json(user);
  } else {
    res.status(404).end();
  }
});

const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id);
  if (!user.admin) {
    return res.status(401).json({ error: "operation not allowed" });
  }
  next();
};

router.put("/:username", isAdmin, async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username,
    },
  });

  if (user) {
    user.disabled = req.body.disabled;
    await user.save();
    res.json(user);
  } else {
    res.status(404).end();
  }
});

export default router;
