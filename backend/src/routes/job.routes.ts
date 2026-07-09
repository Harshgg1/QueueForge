import { Router } from "express";
import { createJob, getJobById } from "../controllers/job.controller";

const jobRouter = Router();

jobRouter.post("/jobs", createJob);

jobRouter.get("/jobs/:id", getJobById);

export default jobRouter;