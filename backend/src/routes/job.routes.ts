import { Router } from "express";
import { createJob, getJobById } from "../controllers/job.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
const jobRouter = Router();

jobRouter.post("/",authMiddleware, createJob);

jobRouter.get("/:id", getJobById);

export default jobRouter;