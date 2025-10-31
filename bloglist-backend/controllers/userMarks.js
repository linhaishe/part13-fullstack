import { Router } from "express";
import { UserMarks } from "../models/index.js";
const router = Router();

router.get("/", async (req, res) => {
  const readingList = await UserMarks.findAll();
  res.json(readingList);
});

export default router;
