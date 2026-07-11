import sharp from "sharp";
import path from "path";
import { stat } from "fs/promises";
import type { Job } from "bullmq";

export async function processImage(jobRecord: any, job:Job) {
    const inputPath = path.resolve("../backend", jobRecord.payload.imagePath);
    
    const fileName = `${Date.now()}-compressed.jpg`;
    const relativeOutputPath = `uploads/compressed/${fileName}`;
    const absoluteOutputPath = path.resolve("../backend", relativeOutputPath);

    const originalSize = (await stat(inputPath)).size;

    await sharp(inputPath)
        .resize(800)
        .jpeg({ quality: 70 })
        .toFile(absoluteOutputPath);

    const compressedSize = (await stat(absoluteOutputPath)).size;

    return {
        compressedPath: relativeOutputPath,
        originalPath: jobRecord.payload.imagePath,
        originalSize,
        compressedSize
    };
}