import React, { useState, useRef } from 'react';
import { Upload01Icon } from 'hugeicons-react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  X, 
  RefreshCw, 
  Sparkles, 
  Building2, 
  ShieldCheck, 
  FileCheck
} from 'lucide-react';
import { uploadReport } from '../../lib/api';
import { Report } from '../../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { toast } from 'sonner';

interface DropzoneUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (report: Report) => void;
}

const QUICK_LAB_PRESETS = [
  'Quest Diagnostics',
  'LabCorp',
  'Metropolis Healthcare',
  'Mayo Clinic Labs'
];

export const DropzoneUpload: React.FC<DropzoneUploadProps> = ({ isOpen, onClose, onSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [labName, setLabName] = useState('Quest Diagnostics');
  const [isProcessing, setIsProcessing] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    { title: 'Document Upload', desc: 'Transferring file to diagnostic processing pipeline...' },
    { title: 'Preprocessing & Denoising', desc: 'Applying OpenCV image contrast enhancement...' },
    { title: 'Tesseract OCR Extraction', desc: 'Parsing text layers, tables, and numerical results...' },
    { title: 'Groq LLM Structuring', desc: 'Mapping canonical biomarkers, reference bounds & units...' },
    { title: 'Health Score Assessment', desc: 'Computing clinical risk index and AI summary...' }
  ];

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setErrorMsg(null);
    if (file.size === 0) {
      setErrorMsg('Selected file is empty (0 MB). Please upload a valid clinical report.');
      setSelectedFile(null);
      return;
    }
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'png', 'jpg', 'jpeg', 'webp', 'bmp'].includes(ext || '')) {
      setErrorMsg('Unsupported format. Please upload PDF, PNG, JPG, JPEG, or WEBP image file.');
      setSelectedFile(null);
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('File size exceeds maximum 15MB limit.');
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  };

  const handleProcessUpload = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setErrorMsg(null);
    setStepIndex(0);

    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 250);

    try {
      const report = await uploadReport(selectedFile, labName);
      clearInterval(interval);
      setStepIndex(steps.length - 1);
      toast.success('Report successfully analyzed and indexed!');
      setIsProcessing(false);
      onSuccess(report);
      onClose();
    } catch (err: any) {
      clearInterval(interval);
      setIsProcessing(false);
      const rawMsg = err?.message || '';
      setErrorMsg(rawMsg || 'Report analysis failed. Ensure the file contains legible lab text.');
      toast.error('Upload processing failed');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full p-6 space-y-4">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Upload01Icon className="w-7 h-7 text-primary shrink-0" />
            <div>
              <DialogTitle className="text-base font-bold text-foreground">Upload Laboratory Report</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                AI-powered biomarker parsing & clinical risk assessment
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-600 dark:text-red-400 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {!isProcessing ? (
          <div className="space-y-4">
            {/* Interactive Dropzone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-primary bg-primary/10'
                  : selectedFile
                  ? 'border-emerald-500/60 bg-emerald-500/5'
                  : 'border-border bg-secondary/30 hover:border-primary/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp,.bmp,image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && validateAndSetFile(e.target.files[0])}
              />

              {selectedFile ? (
                <div className="flex items-center justify-between p-3 rounded-xl border bg-card shadow-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                    <div className="text-left truncate">
                      <p className="text-xs font-bold text-foreground truncate">{selectedFile.name}</p>
                      <p className="text-[11px] text-muted-foreground font-mono">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center py-3">
                  <Upload01Icon className="w-10 h-10 text-primary mb-2 transition-transform group-hover:scale-110" />
                  <p className="text-xs sm:text-sm font-semibold text-foreground">
                    Drag & drop lab report PDF or image here, or <span className="text-primary font-bold underline">browse</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">PDF, PNG, JPG, JPEG, WEBP (Max 15MB)</p>
                </div>
              )}
            </div>

            {/* Lab Name Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-primary" />
                <span>Laboratory Facility Name</span>
              </label>

              <input
                type="text"
                value={labName}
                onChange={(e) => setLabName(e.target.value)}
                placeholder="Facility name (e.g., Quest Diagnostics)"
                className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-border bg-secondary/30 text-foreground outline-none focus:ring-2 focus:ring-primary/20"
              />

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-muted-foreground font-medium">Presets:</span>
                {QUICK_LAB_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setLabName(preset)}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-colors ${
                      labName === preset
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-secondary/40 text-muted-foreground border-border hover:text-foreground'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-foreground hover:bg-secondary border-border font-semibold">
                Cancel
              </Button>
              <Button
                type="button"
                variant="emerald"
                size="sm"
                disabled={!selectedFile}
                onClick={handleProcessUpload}
                className="gap-2"
              >
                <span>Start Extraction</span>
                <Sparkles className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ) : (
          /* Multi-Stage Processing Timeline Screen */
          <div className="py-4 space-y-6">
            <div className="text-center space-y-1">
              <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
              <h4 className="text-sm font-bold text-foreground">Processing Diagnostic Report</h4>
              <p className="text-xs text-muted-foreground">OCR extraction & LLM structuring in progress...</p>
            </div>

            <Progress value={((stepIndex + 1) / steps.length) * 100} className="h-2" />

            <div className="space-y-2 bg-secondary/20 p-3 rounded-xl border">
              {steps.map((st, idx) => {
                const isCurrent = idx === stepIndex;
                const isCompleted = idx < stepIndex;

                return (
                  <div key={st.title} className="flex items-center gap-3 p-2 rounded-lg text-xs">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                      isCompleted ? 'bg-emerald-500 text-white' : isCurrent ? 'bg-primary text-primary-foreground animate-pulse' : 'bg-muted text-muted-foreground'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`font-bold block ${isCurrent ? 'text-primary' : 'text-foreground'}`}>{st.title}</span>
                      {isCurrent && <span className="text-[10px] text-muted-foreground truncate block">{st.desc}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
