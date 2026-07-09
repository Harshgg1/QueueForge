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

    await jobQueue.add("process-job", { jobId: result.id });

    const updatedJob = await prisma.job.update({
        where: { id: result.id },
        data: { status: JobStatus.QUEUED }
    });
    return updatedJob;
}
export const getJobByIdService = async(id: string) => {
    console.log("service called");
    // Implementation for retrieving a job by ID
    return { success: true, message: "Job retrieved successfully" };
}