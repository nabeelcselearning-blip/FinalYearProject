import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Download, FileText, ExternalLink } from 'lucide-react';
import { getReportPdfExportUrl } from '../../lib/api';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: string;
  reportName: string;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  onClose,
  reportId,
  reportName,
}) => {
  const pdfUrl = getReportPdfExportUrl(reportId);
  // Hash parameters to hide PDF sidebar drawer and fit horizontally to full width
  const viewerUrl = `${pdfUrl}#navpanes=0&view=FitH`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl border bg-card shadow-2xl">
        <DialogHeader className="p-4 border-b bg-card flex flex-row items-center justify-between gap-4 shrink-0">
          <div>
            <DialogTitle className="text-sm sm:text-base font-extrabold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <span>{reportName} - Clinical PDF Inspection</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5 font-medium">
              Full resolution diagnostic laboratory report document
            </DialogDescription>
          </div>

          <div className="flex items-center gap-2 mr-6">
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8 cursor-pointer">
                <ExternalLink className="w-3.5 h-3.5 text-primary" />
                <span>Open Full Window</span>
              </Button>
            </a>
            <a href={pdfUrl} download={`MediScan_Report_${reportId.slice(0, 8)}.pdf`}>
              <Button variant="emerald" size="sm" className="gap-1.5 text-xs h-8 cursor-pointer">
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </Button>
            </a>
          </div>
        </DialogHeader>

        <div className="flex-1 bg-slate-900/90 w-full h-full relative overflow-hidden">
          <iframe
            src={viewerUrl}
            title="Report PDF Viewer"
            className="w-full h-full border-none"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
