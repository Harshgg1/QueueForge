import { Job } from "bullmq";
import prisma from "../lib/prisma";
import { JobStatus } from "@prisma/client";
import { processImage } from "../services/image.service";

export async function processJob(job: Job) {
//     console.log(job.opts);
//     console.log({
//   attemptsMade: job.attemptsMade,
//   attempts: job.opts.attempts,
// });
    console.log("Received Job:", job.id);
    const { jobId } = job.data;

    const jobRecord = await prisma.job.findUnique({ where: { id: jobId } });
    if (!jobRecord) {
        throw new Error("Job not found");
    }
    await prisma.job.update({
        where: { id: jobId },
        data: { status: JobStatus.RUNNING, startedAt: new Date() } 
    });
    console.log(`Processing ${jobRecord.type} Job...`);

    let result: any;

    try{switch (jobRecord.type) {
        case "IMAGE":
            result = await processImage(jobRecord, job);
            console.log("Image Processing Result:", result);
            break;
        default:
            throw new Error("Unknown job type");
    }

    await prisma.job.update({
        where: { id: jobId },
        data: {
            status: JobStatus.COMPLETED,
            completedAt: new Date(),
            result: {
                compressedPath: result.compressedPath,
                originalPath: (jobRecord.payload as any)?.imagePath
            }
        }
    });}
    catch (error) {
        throw error;
    }

}