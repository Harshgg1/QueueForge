"use client";

import { useState } from "react";
import  useUploadPdf  from "@/hooks/useUploadPdf";

export default function UploadPdf() {
  const [file, setFile] = useState<File | null>(null);

  const uploadPdf = useUploadPdf();

  const handleUpload = () => {
    if (!file) return;

    const formData = new FormData();

    formData.append("pdf", file);

    uploadPdf.mutate(formData);
  };

  return (
    <>
      <input
        type="file"
        accept="application/pdf*"
        onChange={(e) => {
          if (e.target.files) {
            setFile(e.target.files[0]);
          }
        }}
      />

      <button
        onClick={handleUpload}
        disabled={!file || uploadPdf.isPending}
      >
        {uploadPdf.isPending ? "Uploading..." : "Upload PDF"}
      </button>
    </>
  );
}