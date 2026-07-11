import { QueueEvents } from "bullmq";
import Redis from "ioredis";
import prisma from "./prisma";
import { getIO } from "../socket/socket";

export function initQueueEvents() {
    const connection = new Redis({ maxRetriesPerRequest: null });
    const queueEvents = new QueueEvents("job-queue", { connection });

    // Helper function to emit job updates efficiently
    const emitJobUpdate = async (jobId: string, status: string) => {
        try {
            console.log(`[QueueEvents] Event received for job ${jobId}, status: ${status}`);
            const job = await prisma.job.findUnique({
                where: { id: jobId },
                select: { ownerId: true }
            });

            if (job) {
                console.log(`[QueueEvents] Emitting jobUpdated to user ${job.ownerId}`);
                getIO().to(job.ownerId).emit("jobUpdated", { jobId, status });
            } else {
                console.log(`[QueueEvents] Job ${jobId} not found in DB, ignoring.`);
            }
        } catch (error) {
            console.error(`Failed to emit job update for job ${jobId}:`, error);
        }
    };

    queueEvents.on("waiting", async ({ jobId }) => {
        await emitJobUpdate(jobId, "QUEUED");
    });

    queueEvents.on("active", async ({ jobId }) => {
        await emitJobUpdate(jobId, "RUNNING");
    });

    queueEvents.on("completed", async ({ jobId }) => {
        await emitJobUpdate(jobId, "COMPLETED");
    });

    queueEvents.on("failed", async ({ jobId }) => {
        await emitJobUpdate(jobId, "FAILED");
    });

    return queueEvents;
}
