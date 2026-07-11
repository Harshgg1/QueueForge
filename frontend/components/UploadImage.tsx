"use client";

import { useState, useRef } from "react";
import useUploadImage from "@/hooks/useUploadImage";
import { useToast } from "@/providers/ToastProvider";
import { ImageIcon, Loader2 } from "lucide-react";

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
        toast("Image uploaded successfully", "success");
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
        <div className="flex items-center gap-3 px-4 py-2.5 bg-background border border-dashed border-border rounded-lg hover:border-muted-foreground transition-colors cursor-pointer">
          <ImageIcon className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-sm text-foreground truncate">
            {file ? file.name : "Choose an image..."}
          </span>
        </div>
      </label>

      <button
        onClick={handleUpload}
        disabled={!file || uploadImage.isPending}
        className="px-4 py-2.5 bg-foreground hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed text-background text-sm font-medium rounded-lg transition-all shrink-0"
      >
        {uploadImage.isPending ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Uploading...
          </span>
        ) : (
          "Upload"
        )}
      </button>
    </div>
  );
}