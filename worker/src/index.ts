import dotenv from "dotenv";
dotenv.config();
import {Worker} from "bullmq";
import redisClient from "./lib/redis";
import { processJob } from "./processors/job.processor";

const worker = new Worker("job-queue", async (job) => {
  await processJob(job);
}, { connection: redisClient });
console.log("🚀 Worker started...");