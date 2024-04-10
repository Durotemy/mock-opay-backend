import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = <any>jwt.verify(token, "opay");
    console.log("decoded", decoded);
    // req?.user as any  = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({ error: "Forbidden" });
  }
};

export { authenticateToken };
