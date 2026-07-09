import { Job } from "bullmq";
import prisma from "../lib/prisma";
import { JobStatus } from "@prisma/client";

export async function processJob(job: Job) {
    console.log("Received Job:", job.id);
    const { jobId } = job.data;
    console.log("1");
    const jobRecord = await prisma.job.findUnique({ where: { id: jobId } });
    if (!jobRecord) {
        throw new Error("Job not found");
    }console.log("4");
    await prisma.job.update({
        where: { id: jobId },
        data: { status: JobStatus.RUNNING, startedAt: new Date() } 
    });
    console.log("2");
    console.log(`Processing ${jobRecord.type} Job...`);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    await prisma.job.update({
    where: { id: jobId },
    data: {
        status: JobStatus.COMPLETED,
        completedAt: new Date(),
        result: {
            message: "Job completed successfully"
        }
    }
});
console.log("3");

    console.log("Job Completed");
}