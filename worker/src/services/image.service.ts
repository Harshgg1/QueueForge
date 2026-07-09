import { Job } from "bullmq";

export async function processImage(job: Job, jobRecord: any) {
    // console.log("Compressing Image...");
    console.log(`Attempt: ${job.attemptsMade + 1}`);
    throw new Error("Image processing failed");
    await new Promise(resolve => setTimeout(resolve,3000));

    return {
        compressedUrl: "compressed-image.jpg"
    };
}