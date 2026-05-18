import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { AuthRequest } from "../types/globals.js";

export const adminMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.jwt;
  if (!token) {
    return res.status(401).json({ msg: "Unauthorized!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET!) as { id: string };

    const user = await User.findById(decoded.id, "_id role").lean();
    if (!user) {
      return res.status(404).json({ msg: "User not found, go home." });
    }

    if(user.role !== 'admin') {
      return res.status(401).json({ msg: "User not an admin!" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT verification failed: ", err);
    return res.status(403).json({ msg: "Invalid Token." });
  }
};

