import type { Request, Response } from "express";
import { createJobService, getAllJobsService, getJobByIdService } from "../services/job.services";
import { JobType } from "@prisma/client/edge";

export const createJob = async(req: Request, res: Response) => {
  const {title, type, payload } = req.body;
  const ownerId = req.user!.userId;
  const result = await createJobService({title, jobType: type, payload, ownerId});
  res.status(201).json(result);
};

export const getJobById = async(req: Request, res: Response) => {
  const result = await getJobByIdService(req.params.id as string);
  res.status(200).json(result);
};

export const getAllJobs = async (req: Request, res: Response) => {

    const { status, type, page = "1", limit = "10" } = req.query;

    const jobs = await getAllJobsService(
        req.user!.userId,
        status as string | undefined,
        type as string | undefined,
        Number(page),
        Number(limit)
    );

    res.status(200).json(jobs);
};

export const createImageJob = async(req: Request, res: Response) => {
    const result = await createJobService({
    title: req.file!.originalname,
    jobType: JobType.IMAGE,
    payload: {
        imagePath: req.file!.path
    },
    ownerId: req.user!.userId
});

res.status(201).json(result);
};
