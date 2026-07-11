"use client";

import { useState } from "react";
import  useUploadImage  from "@/hooks/useUploadImage";

export default function UploadImage() {
  const [file, setFile] = useState<File | null>(null);

  const uploadImage = useUploadImage();

  const handleUpload = () => {
    if (!file) return;

    const formData = new FormData();

    formData.append("image", file);

    uploadImage.mutate(formData);
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files) {
            setFile(e.target.files[0]);
          }
        }}
      />

      <button
        onClick={handleUpload}
        disabled={!file || uploadImage.isPending}
      >
        {uploadImage.isPending ? "Uploading..." : "Upload Image"}
      </button>
    </>
  );
}