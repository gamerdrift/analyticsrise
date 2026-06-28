'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';
import { UploadCloud, FileText, CheckCircle } from 'lucide-react';
import { Progress } from '@/app/components/feedback/FeedbackControls';

// --- DRAG AND DROP RESUME UPLOADER ---
interface UploaderProps {
  onUploadComplete?: (fileName: string, fileSize: string) => void;
}

export function ResumeUploader({ onUploadComplete }: UploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<{ name: string; size: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (selectedFile: File) => {
    if (!selectedFile) return;
    
    // Check type (PDF/Word doc)
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(selectedFile.type)) {
      alert('Error: Only PDF or DOCX files are permitted.');
      return;
    }

    const sizeStr = `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`;
    setFile({ name: selectedFile.name, size: sizeStr });
    setUploading(true);
    setProgress(0);

    // Simulate upload timer
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          if (onUploadComplete) onUploadComplete(selectedFile.name, sizeStr);
          return 100;
        }
        return prev + 20;
      });
    }, 200);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={clsx(
        'p-8 rounded-xl border border-dashed text-center flex flex-col items-center justify-center min-h-[220px] transition-all bg-[#0D1117]/30 select-none relative',
        dragActive ? 'border-[#00E5FF] bg-[#00E5FF]/5' : 'border-slate-800 hover:border-slate-700'
      )}
    >
      <input
        type="file"
        id="resume-file-input"
        className="hidden"
        accept=".pdf,.doc,.docx"
        onChange={handleChange}
        disabled={uploading}
      />

      {!file && !uploading && (
        <>
          <UploadCloud className="w-10 h-10 text-slate-500 mb-4" />
          <span className="text-xs text-white font-bold uppercase tracking-wider block mb-1">
            Drag & Drop Resume File
          </span>
          <span className="text-[10px] text-slate-500 font-mono block mb-6">
            PDF, DOCX up to 5MB
          </span>
          <label
            htmlFor="resume-file-input"
            className="px-5 py-2 rounded border border-slate-700 text-slate-300 text-[10px] font-mono font-bold tracking-widest uppercase hover:bg-slate-800 hover:text-white transition-all cursor-pointer bg-[#05070B]"
          >
            Select Document
          </label>
        </>
      )}

      {uploading && (
        <div className="w-full max-w-xs space-y-4">
          <FileText className="w-10 h-10 text-[#00E5FF] animate-bounce mx-auto" />
          <span className="text-[10px] text-slate-400 font-mono block">UPLOADING: {file?.name}</span>
          <Progress value={progress} />
        </div>
      )}

      {!uploading && file && (
        <div className="space-y-4 text-center">
          <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
          <div>
            <span className="text-xs font-bold text-white block">{file.name}</span>
            <span className="text-[9px] font-mono text-slate-500 block mt-1">{file.size} | UPLOAD SUCCESSFUL</span>
          </div>
          <button
            onClick={() => setFile(null)}
            className="text-[9px] font-mono font-bold text-[#FF1744] hover:underline uppercase tracking-widest block mx-auto"
          >
            Replace Document
          </button>
        </div>
      )}
    </div>
  );
}
