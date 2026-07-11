import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/auth";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.cookies.token ;

  if (!token) {
    res.status(401).json({
      error: "No token provided",
    });
    return;
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    res.status(401).json({
      error: "Invalid token",
    });
    return;
  }

  (req as any).user = decoded;

  next();
}