import dotenv from "dotenv";
dotenv.config();
import {Worker} from "bullmq";
import redisClient from "./lib/redis";
import { processJob } from "./processors/job.processor";
import prisma from "./lib/prisma";
import { JobStatus } from "@prisma/client/edge";

const worker = new Worker("job-queue", async (job) => {
  await processJob(job);
}, { connection: redisClient, concurrency: 5 });

worker.on("completed", (job) => {
  console.log(`Job ${job.id} has been completed`);
}
);
worker.on("failed", async (job, err) => {

    await prisma.job.update({
        where: {
            id: job!.data.jobId,
        },
        data: {
            retryCount: job!.attemptsMade,
        },
    });

    if (job!.attemptsMade === job!.opts.attempts) {

        await prisma.job.update({
            where: {
                id: job!.data.jobId,
            },
            data: {
                status: JobStatus.FAILED,
                completedAt: new Date(),
            },
        });

        console.log(`💀 Job ${job!.id} permanently failed`);
    }
});
console.log("🚀 Worker started...");