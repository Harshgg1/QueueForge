import { Job } from "bullmq";

export async function processJob(job: Job) {
    console.log("Received Job:", job.id);
    console.log(job.data);
}