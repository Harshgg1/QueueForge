import sharp from "sharp";
import path from "path";
import type { Job } from "bullmq";

export async function processImage(jobRecord: any, job:Job) {
    const inputPath = path.resolve("../backend", jobRecord.payload.imagePath);
    
    const fileName = `${Date.now()}-compressed.jpg`;
    const relativeOutputPath = `uploads/compressed/${fileName}`;
    const absoluteOutputPath = path.resolve("../backend", relativeOutputPath);

    await sharp(inputPath)
        .resize(800)
        .jpeg({ quality: 70 })
        .toFile(absoluteOutputPath);

    return {
        compressedPath: relativeOutputPath,
        originalPath: jobRecord.payload.imagePath
    };
}