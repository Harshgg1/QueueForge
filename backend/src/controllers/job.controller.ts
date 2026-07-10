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

export const getAllJobs = async(req: Request, res: Response) => { 
    
  const ownerId = req.user!.userId;
  const result = await getAllJobsService(ownerId);
  res.status(200).json(result);
}

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
