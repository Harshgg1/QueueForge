import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const bucketName = process.env.SUPABASE_BUCKET!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadFile(
  filePath: string,
  file: Buffer,
  contentType: string
) {
  // Create a clean copy to avoid Node's fetch (undici) choking on pooled Buffers
  const data = new Uint8Array(file);

  const { error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, data, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  return filePath;
}

export async function downloadFile(filePath: string) {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .download(filePath);

  if (error) {
    throw new Error(`Failed to download file: ${error.message}`);
  }

  const arrayBuffer = await data.arrayBuffer();

  return Buffer.from(arrayBuffer);
}

export async function deleteFile(filePath: string) {
  const { error } = await supabase.storage
    .from(bucketName)
    .remove([filePath]);

  if (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}