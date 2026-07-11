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
            jobId: result.id,
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
export const getJobByIdService = async(jobId: string, ownerId: string) => {
    const job = await prisma.job.findUnique({ where: { id: jobId, ownerId } });
    return { success: true, message: "Job retrieved successfully", data: job };
}

export const getAllJobsService = async (
    ownerId: string,
    status?: string,
    type?: string,
    page: number = 1,
    limit: number = 10
) => {
    const skip = (page - 1) * limit;

    const whereClause: any = {
        ownerId
    };

    if (status) {
        whereClause.status = status as JobStatus;
    }

    if (type) {
        whereClause.type = type as JobType;
    }
    const totalJobs = await prisma.job.count({
    where: whereClause
    });
    const jobs = await prisma.job.findMany({
        where: whereClause,
        orderBy: {
            createdAt: "desc"
        },
        skip,
        take: limit
    });

    return {
        jobs,
        pagination: {
            page,
            limit,
            totalJobs,
            totalPages: Math.ceil(totalJobs / limit)
        }
    };
};