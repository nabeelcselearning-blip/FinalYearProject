import React from 'react';
import { Upload, Image, FileText, Cpu, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

interface OcrPipelineVisualizerProps {
  ocrConfidence: number;
  laboratoryName: string;
  biomarkerCount: number;
}

export const OcrPipelineVisualizer: React.FC<OcrPipelineVisualizerProps> = ({
  ocrConfidence,
  laboratoryName,
  biomarkerCount,
}) => {
  const steps = [
    {
      id: 1,
      title: 'File Ingestion',
      desc: 'PDF / Image Upload',
      icon: Upload,
      status: 'completed',
    },
    {
      id: 2,
      title: 'Preprocessing',
      desc: 'Denoising & Contrast Enhancement',
      icon: Image,
      status: 'completed',
    },
    {
      id: 3,
      title: 'OCR Text Extraction',
      desc: `Tesseract OCR (${ocrConfidence}% Confidence)`,
      icon: FileText,
      status: 'completed',
    },
    {
      id: 4,
      title: 'Groq AI Structuring',
      desc: `Extracted ${biomarkerCount} Biomarkers`,
      icon: Cpu,
      status: 'completed',
    },
    {
      id: 5,
      title: 'Clinical Assessment',
      desc: 'Health Score & Risk Evaluation',
      icon: ShieldCheck,
      status: 'completed',
    },
  ];

  return (
    <Card className="border bg-card shadow-sm">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-primary" />
            <CardTitle className="text-sm font-bold">OCR & AI Extraction Pipeline</CardTitle>
          </div>
          <Badge variant="healthy">Pipeline Verified</Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex flex-col items-center text-center relative group">
                {/* Connecting Line */}
                {idx < steps.length - 1 && (
                  <div className="hidden sm:block absolute top-5 left-[60%] right-[-40%] h-0.5 bg-emerald-500/40 z-0" />
                )}

                <div className="relative z-10 w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs shadow-xs mb-2 transition-transform group-hover:scale-105">
                  <Icon className="w-5 h-5" />
                  <CheckCircle2 className="w-3.5 h-3.5 absolute -top-1 -right-1 text-emerald-500 bg-background rounded-full" />
                </div>

                <span className="text-xs font-bold text-foreground">{step.title}</span>
                <span className="text-[10px] text-muted-foreground mt-0.5 max-w-[120px]">{step.desc}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
