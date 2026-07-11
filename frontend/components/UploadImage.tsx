"use client";

import { useState, useRef } from "react";
import useUploadImage from "@/hooks/useUploadImage";
import { useToast } from "@/providers/ToastProvider";

export default function UploadImage() {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadImage = useUploadImage();

  const handleUpload = () => {
    if (!file) return;

    const formData = new FormData();

    formData.append("image", file);

    uploadImage.mutate(formData, {
      onSuccess: () => {
        setFile(null);
        if (inputRef.current) inputRef.current.value = "";
        toast("✓ Image uploaded successfully", "success");
      },
      onError: () => {
        toast("Failed to upload image", "error");
      },
    });
  };

  return (
    <div className="flex items-center gap-3">
      <label className="flex-1 relative">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files) {
              setFile(e.target.files[0]);
            }
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex items-center gap-3 px-4 py-2.5 bg-card border border-dashed border-border rounded-lg hover:border-accent/50 transition-colors cursor-pointer">
          <svg className="w-5 h-5 text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm text-muted truncate">
            {file ? file.name : "Choose an image..."}
          </span>
        </div>
      </label>

      <button
        onClick={handleUpload}
        disabled={!file || uploadImage.isPending}
        className="px-4 py-2.5 bg-accent hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none text-white text-sm font-medium rounded-lg transition-all shrink-0"
      >
        {uploadImage.isPending ? (
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