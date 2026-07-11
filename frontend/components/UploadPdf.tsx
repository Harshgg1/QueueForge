"use client";

import { useState, useRef } from "react";
import useUploadPdf from "@/hooks/useUploadPdf";
import { useToast } from "@/providers/ToastProvider";

export default function UploadPdf() {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadPdf = useUploadPdf();

  const handleUpload = () => {
    if (!file) return;

    const formData = new FormData();

    formData.append("pdf", file);

    uploadPdf.mutate(formData, {
      onSuccess: () => {
        setFile(null);
        if (inputRef.current) inputRef.current.value = "";
        toast("✓ PDF uploaded for extraction", "success");
      },
      onError: () => {
        toast("Failed to upload PDF", "error");
      },
    });
  };

  return (
    <div className="flex items-center gap-3">
      <label className="flex-1 relative">
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          onChange={(e) => {
            if (e.target.files) {
              setFile(e.target.files[0]);
            }
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex items-center gap-3 px-4 py-2.5 bg-card border border-dashed border-border rounded-lg hover:border-accent/50 transition-colors cursor-pointer">
          <svg className="w-5 h-5 text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-sm text-muted truncate">
            {file ? file.name : "Choose a PDF..."}
          </span>
        </div>
      </label>

      <button
        onClick={handleUpload}
        disabled={!file || uploadPdf.isPending}
        className="px-4 py-2.5 bg-accent hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none text-white text-sm font-medium rounded-lg transition-all shrink-0"
      >
        {uploadPdf.isPending ? (
          <span className="inline-flex items-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Uploading...
          </span>
        ) : (
          "Upload"
        )}
      </button>
    </div>
  );
}