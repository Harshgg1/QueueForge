import type { Request, Response } from "express";
import { createJobService, getJobByIdService } from "../services/job.services";

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