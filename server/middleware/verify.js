import Jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

const verify = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const token = authHeader.split(" ")[1]

  Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "forbidden" })
    }

    req.user = decoded.username
    next()
  })
})

export default verify;
