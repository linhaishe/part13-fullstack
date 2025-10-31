import { Router } from "express";
import { invalidateToken } from "../utils/tokenHelper.js";

const router = Router();

// 🧩 登出接口
router.delete("/", async (req, res) => {
  console.log('req', req);
  
  const deletedCount = await invalidateToken(req.token);

  if (deletedCount === 0) {
    return res.status(400).json({ message: "No active session found" });
  }

  res.status(200).json({ message: "Logout successful" });
});

export default router;
