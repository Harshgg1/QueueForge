import sharp from "sharp";
import path from "path";
import type { Job } from "bullmq";

export async function processImage(jobRecord: any, job:Job) {
    const inputPath = path.resolve("../backend", jobRecord.payload.imagePath);

    const outputPath = path.join(
        "uploads/compressed",
        `${Date.now()}-compressed.jpg`
    );

    await sharp(inputPath)
        .resize(800)
        .jpeg({ quality: 70 })
        .toFile(outputPath);

    return {
        compressedPath: outputPath,
    };
}