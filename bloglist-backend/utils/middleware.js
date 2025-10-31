import jwt from "jsonwebtoken";
import { UserToken } from "../models/index.js";
// export const tokenExtractor = (req, res, next) => {
//   const authorization = req.get("authorization");
//   if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
//     try {
//       console.log("Secret from env:", process.env.SECRET);
//       const token = authorization.substring(7);
//       console.log("Token extracted:", token);

//       req.decodedToken = jwt.verify(
//         authorization.substring(7),
//         process.env.SECRET
//       );
//     } catch {
//       return res.status(401).json({ error: "token invalid" });
//     }
//   } else {
//     req.decodedToken = null;
//   }
//   next();
// };

export const tokenExtractor = async (req, res, next) => {
  const authorization = req.get("authorization");
  console.log('authorization', authorization);
  

  if (!authorization) {
    // 没有 token 就跳过，不返回 401,不强制所有请求都验证token
    return next();
  }

  if (!authorization.toLowerCase().startsWith("bearer ")) {
    return res.status(401).json({ error: "token missing" });
  }

  const token = authorization.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    const validToken = await UserToken.findOne({
      where: { userId: decoded.id, token },
    });

    if (!validToken) {
      return res.status(401).json({ error: "token expired or invalid" });
    }

    req.user = decoded;
    req.decodedToken = decoded;
    req.token = token; 
  } catch (err) {
    return res.status(401).json({ error: "token invalid" });
  }

  next();
};
