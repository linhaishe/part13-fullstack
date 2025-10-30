import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      console.log("Secret from env:", process.env.SECRET);
      const token = authorization.substring(7);
      console.log("Token extracted:", token);

      req.decodedToken = jwt.verify(
        authorization.substring(7),
        process.env.SECRET
      );
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    req.decodedToken = null;
  }
  next();
};
