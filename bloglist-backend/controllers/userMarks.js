import { Router } from "express";
import { UserMarks } from "../models/index.js";
const router = Router();

router.get("/", async (req, res) => {
  const readingList = await UserMarks.findAll();
  res.json(readingList);
});

router.put("/:id", async (req, res) => {
  const decodedToken = req.decodedToken;
  const markedBlog = await UserMarks.findByPk(req.params.id);

  if (markedBlog.userId.toString() !== decodedToken.id.toString()) {
    return res
      .status(403)
      .json({ error: "only the creator can mark read this blog" });
  }

  markedBlog.isRead = req.body.read;
  await markedBlog.save();
  res.json(markedBlog);
});

export default router;
