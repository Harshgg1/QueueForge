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
  // Convert Node Buffer to a Blob. This avoids 'fetch failed' errors in 
  // Node's native fetch (undici) when handling Multer's pooled buffers.
  const blob = new Blob([file], { type: contentType });

  const { error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, blob, {
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