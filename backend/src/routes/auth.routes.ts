import { Router } from "express";
import { login, signup } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import prisma from "../lib/prisma";

const router = Router();

router.post("/signup", signup);

router.post("/login", login);

router.get("/me", authMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user!.userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  if (!user) {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
    return;
  }

  res.json({
    success: true,
    data: user,
  });
});

export default router;