import React from 'react';
import { AiHealthAssistant } from '../components/chat/AiHealthAssistant';
import { useReportsQuery } from '../lib/queries';

export const ChatPage: React.FC = () => {
  const { data: reports = [] } = useReportsQuery();
  const latestReport = reports[0] || null;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in-50 slide-in-from-top-4 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Clinical AI Intelligence</h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Conversational diagnostic assistance, biomarker interpretation, reference range explanations, and nutritional guidance.
          </p>
        </div>
      </div>
      <AiHealthAssistant latestReport={latestReport} />
    </div>
  );
};
