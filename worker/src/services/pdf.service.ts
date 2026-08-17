import { PDFParse } from "pdf-parse";
import { downloadFile, getPublicUrl } from "../lib/storage";

export async function processPdf(jobRecord: any) {
    const pdfPath = jobRecord.payload.pdfPath;

    // Download PDF buffer from Supabase
    const buffer = await downloadFile(pdfPath);

    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();

    const originalUrl = getPublicUrl(pdfPath);

    return {
        originalPath: pdfPath,
        originalUrl,
        pages: result.total,
        preview: result.text.slice(0, 1000),
        textLength: result.text.length
    };
}