import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { UserToken } from "../models/index.js";
dotenv.config();

export const createToken = (user) => {
  const payload = { id: user.id, username: user.username };
  return jwt.sign(payload, process.env.SECRET, { expiresIn: "7d" });
};

export const saveUserToken = async (userId, token) => {
  const [userToken, created] = await UserToken.findOrCreate({
    where: { userId },
    defaults: { token },
  });

  if (!created) {
    userToken.token = token;
    await userToken.save();
  }

  return userToken;
};

export const invalidateToken = async (token) => {
  await UserToken.destroy({ where: { token } });
};
