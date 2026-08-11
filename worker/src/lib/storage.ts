import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(
    supabaseUrl,
    supabaseKey
);

const test: number = "this is wrong";

const BUCKET_NAME = process.env.SUPABASE_BUCKET!;

export async function uploadFile(
    filePath: string,
    fileBuffer: Buffer,
    contentType: string
) {
    //Create a clean copy to avoid Node's fetch (undici) choking on pooled Buffers
    const data = new Uint8Array(fileBuffer);

    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, data, {
            contentType,
            upsert: true
        });

    if (error) {
        throw new Error(`Supabase upload failed: ${error.message}`);
    }

    return filePath;
}

export async function downloadFile(
    filePath: string
): Promise<Buffer> {

    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .download(filePath);

    if (error) {
        throw new Error(`Supabase download failed: ${error.message}`);
    }

    return Buffer.from(await data.arrayBuffer());
}

export function getPublicUrl(filePath: string) {

    const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

    return data.publicUrl;
}