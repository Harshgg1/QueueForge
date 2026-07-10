import { Router } from "express";
import { createJob, getAllJobs, getJobById } from "../controllers/job.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";
import { createImageJob } from "../controllers/job.controller";

const jobRouter = Router();

jobRouter.post("/",authMiddleware, createJob);

jobRouter.get("/", authMiddleware, getAllJobs);

jobRouter.get("/:id", getJobById);

jobRouter.post("/image", authMiddleware, upload.single("image"), createImageJob);


export default jobRouter;