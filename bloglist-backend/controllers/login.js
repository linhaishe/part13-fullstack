import jwt from "jsonwebtoken";
import { Router } from "express";
import { User } from "../models/index.js";
import { createToken, saveUserToken } from "../utils/tokenHelper.js";
const router = Router();

router.post("/", async (request, response) => {
  const body = request.body;

  const user = await User.findOne({
    where: {
      username: body.username,
    },
  });

  const passwordCorrect = body.password === "secret";

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  if (user.disabled) {
    return response.status(401).json({
      error: "account disabled, please contact admin",
    });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = createToken(user);
  await saveUserToken(user.id, token);

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

export default router;
