import sharp from "sharp";
import type { Job } from "bullmq";
import {
    downloadFile,
    uploadFile,
    getPublicUrl
} from "../lib/storage";

export async function processImage(jobRecord: any, job: Job) {

    const imagePath = jobRecord.payload.imagePath;

    // Download original image from Supabase
    const inputBuffer = await downloadFile(imagePath);

    const originalSize = inputBuffer.length;

    // Compress image
    const outputBuffer = await sharp(inputBuffer)
        .resize(800)
        .jpeg({ quality: 70 })
        .toBuffer();

    const compressedSize = outputBuffer.length;

    // Store compressed image in Supabase
    const fileName = `${Date.now()}-compressed.jpg`;

    const compressedPath = `processed/images/${fileName}`;

    await uploadFile(
        compressedPath,
        outputBuffer,
        "image/jpeg"
    );

    // Generate browser-accessible URLs
    const originalUrl = getPublicUrl(imagePath);
    const compressedUrl = getPublicUrl(compressedPath);

    return {
        compressedPath,
        originalPath: imagePath,

        originalUrl,
        compressedUrl,

        originalSize,
        compressedSize
    };
}