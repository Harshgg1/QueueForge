import prisma from "../lib/prisma";
import { JobType, JobStatus } from "@prisma/client";
import jobQueue from "../lib/queue";

export const createJobService = async({title, jobType, payload, ownerId}: {title: string; jobType: JobType; payload: any; ownerId: string}) => {
    console.log("service called");
    const result = await prisma.job.create({
        data: {
            title,
            type: jobType,
            payload,
            ownerId
}
    });

    await jobQueue.add("process-job",
         { jobId: result.id}, {
            attempts: 3,
            backoff: { type: "exponential", delay: 2000 },
            removeOnComplete: 100,
            removeOnFail: 100,
        });

    const updatedJob = await prisma.job.update({
        where: { id: result.id },
        data: { status: JobStatus.QUEUED }
    });
    return updatedJob;
}
export const getJobByIdService = async(id: string) => {
    const job = await prisma.job.findUnique({ where: { id } });
    return { success: true, message: "Job retrieved successfully", data: job };
}

export const getAllJobsService = async(ownerId: string) => {
    const jobs = await prisma.job.findMany({ where: { ownerId }, orderBy: { createdAt: "desc" } });
    return { success: true, message: "Jobs retrieved successfully", data: jobs };
}