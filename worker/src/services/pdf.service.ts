import fs from "fs/promises";
import path from "path";
import { PDFParse } from "pdf-parse";

export async function processPdf(jobRecord: any) {
    const inputPath = path.resolve(
        "../backend",
        jobRecord.payload.pdfPath
    );

    const buffer = await fs.readFile(inputPath);

    const parser = new PDFParse({ data: buffer });

    const result = await parser.getText();

    await parser.destroy();

    return {
        pages: result.total,
        preview: result.text.slice(0, 300),
        textLength: result.text.length
    };
}