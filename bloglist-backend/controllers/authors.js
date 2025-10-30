import { Router } from "express";
import { Blog } from "../models/index.js";
import { Sequelize } from "sequelize";
const router = Router();

router.get("/", async (request, response) => {
  // count author total articles and likes and order the data returned based on the number of likes
  // 1. count -  2. sum
  const authorsStats = await Blog.findAll({
    attributes: [
      "author",
      [Sequelize.fn("COUNT", Sequelize.col("id")), "blogs"],
      [Sequelize.fn("SUM", Sequelize.col("likes")), "likes"], // 总点赞数
    ], // 统计博客数量
    group: "author",
    order: [[Sequelize.fn("SUM", Sequelize.col("likes")), "DESC"]], // 可选，按博客数量排序
  });

  response.json(authorsStats);
});

export default router;
