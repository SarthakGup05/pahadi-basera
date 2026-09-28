'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { uploadToImageKit, ImageKitUploadResponse } from '@/lib/imagekit';

export interface ImageUploadDropzoneProps {
  folder?: 'properties' | 'packages' | 'blogs' | 'avatars' | 'kyc';
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  onUploadSuccess: (results: ImageKitUploadResponse[]) => void;
  className?: string;
  label?: string;
  hint?: string;
  showPreviews?: boolean;
}

export default function ImageUploadDropzone({
  folder = 'properties',
  multiple = false,
  maxFiles = 5,
  maxSizeMB = 10,
  onUploadSuccess,
  className = '',
  label = 'Upload High-Altitude Photos',
  hint = 'Supports PNG, JPG, WebP, or HEIC up to 10MB each',
  showPreviews = true,
}: ImageUploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadedList, setUploadedList] = useState<ImageKitUploadResponse[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | File[]) => {
    setErrorMessage(null);
    const validFiles: File[] = [];

    const fileArray = Array.from(files);
    if (!multiple && fileArray.length > 1) {
      setErrorMessage('Single file mode enabled. Please select only one photo.');
      return;
    }

    if (multiple && fileArray.length + uploadedList.length > maxFiles) {
      setErrorMessage(`Maximum of ${maxFiles} photos allowed.`);
      return;
    }

    for (const f of fileArray) {
      if (!f.type.startsWith('image/')) {
        setErrorMessage(`"${f.name}" is not a valid image format.`);
        return;
      }
      if (f.size > maxSizeMB * 1024 * 1024) {
        setErrorMessage(`"${f.name}" exceeds the ${maxSizeMB}MB file size limit.`);
        return;
      }
      validFiles.push(f);
    }

    if (validFiles.length === 0) return;

    setUploading(true);
    const newUploads: ImageKitUploadResponse[] = [];

    try {
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        setProgressText(`Uploading ${i + 1} of ${validFiles.length}: ${file.name}...`);
        const res = await uploadToImageKit(file, { folder });
        newUploads.push(res);
      }

      const updated = [...uploadedList, ...newUploads];
      setUploadedList(updated);
      onUploadSuccess(updated);
    } catch (err: any) {
      console.error('ImageKit dropzone upload error:', err);
      setErrorMessage(err.message || 'Failed to upload image to ImageKit. Please check your credentials.');
    } finally {
      setUploading(false);
      setProgressText('');
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeUploaded = (fileId: string) => {
    const filtered = uploadedList.filter(item => item.fileId !== fileId);
    setUploadedList(filtered);
    onUploadSuccess(filtered);
  };

  return (
    <div className={`w-full flex flex-col gap-3 ${className}`}>
      {/* Drop Zone Box */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
          isDragging
            ? 'border-emerald-500 bg-emerald-50/50'
            : 'border-stone-200 hover:border-emerald-400 bg-stone-50/50 hover:bg-stone-50'
        } ${uploading ? 'pointer-events-none opacity-70' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center py-2">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-2" />
            <p className="text-xs font-semibold text-stone-700">{progressText}</p>
            <p className="text-[10px] text-stone-400 mt-1">Directly streaming to ImageKit CDN storage...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex items-center justify-center text-emerald-600 mb-2.5">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-stone-800 tracking-tight">{label}</p>
            <p className="text-[11px] text-stone-500 mt-0.5">{hint}</p>
            <span className="inline-block mt-3 px-3 py-1 bg-white border border-stone-200/70 rounded-full text-[10px] font-semibold text-stone-600 shadow-2xs">
              Click or drag & drop photos here
            </span>
          </div>
        )}
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Uploaded Thumbnails Preview */}
      {showPreviews && uploadedList.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 pt-1">
          {uploadedList.map((item) => (
            <div
              key={item.fileId}
              className="relative aspect-square rounded-xl overflow-hidden border border-stone-200 bg-stone-100 group shadow-xs"
            >
              <img
                src={item.thumbnailUrl || item.url}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeUploaded(item.fileId);
                }}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-stone-900/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 cursor-pointer"
                title="Remove photo"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="absolute bottom-1 left-1 flex items-center gap-1 bg-emerald-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                <CheckCircle2 className="w-2.5 h-2.5" />
                <span>Uploaded</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
