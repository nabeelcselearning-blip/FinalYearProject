import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { FollowupRecommendation } from '../../types';
import { Stethoscope, Clock, ShieldCheck, BellPlus, CheckCircle2, ExternalLink, Loader2 } from 'lucide-react';
import { createReminder } from '../../lib/api';
import { useRemindersQuery } from '../../lib/queries';
import { Button } from '../ui/button';

interface FollowupRecommendationsCardProps {
  recommendations: FollowupRecommendation[];
}

export const FollowupRecommendationsCard: React.FC<FollowupRecommendationsCardProps> = ({
  recommendations,
}) => {
  const queryClient = useQueryClient();
  const { data: existingReminders = [] } = useRemindersQuery();
  const [scheduledState, setScheduledState] = useState<Record<string, { loading: boolean; done: boolean; error?: string }>>({});

  if (!recommendations || recommendations.length === 0) return null;

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Important':
        return 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';
      case 'Recommended':
        return 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30';
      default:
        return 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30';
    }
  };

  const calculateTargetDate = (timeline: string): string => {
    const today = new Date();
    let daysToAdd = 21; // Default 3 weeks

    const lower = timeline.toLowerCase();
    if (lower.includes('1-2') || lower.includes('1 to 2')) daysToAdd = 10;
    else if (lower.includes('2-3') || lower.includes('2 to 3')) daysToAdd = 17;
    else if (lower.includes('2-4') || lower.includes('2 to 4')) daysToAdd = 21;
    else if (lower.includes('3-4') || lower.includes('3 to 4')) daysToAdd = 25;
    else if (lower.includes('4-6') || lower.includes('4 to 6')) daysToAdd = 35;
    else if (lower.includes('6-12') || lower.includes('6 to 12')) daysToAdd = 180;

    today.setDate(today.getDate() + daysToAdd);
    return today.toISOString().split('T')[0];
  };

  const handleAutomateReminder = async (rec: FollowupRecommendation, idx: number) => {
    const key = `rec_${idx}_${rec.test_name}`;
    setScheduledState(prev => ({ ...prev, [key]: { loading: true, done: false } }));

    try {
      const targetDate = calculateTargetDate(rec.suggested_timeline);
      await createReminder({
        title: `Follow-Up Lab: ${rec.test_name}`,
        description: `Automated follow-up test: ${rec.reason} (Triggered by ${rec.trigger_biomarker})`,
        reminder_type: 'lab_test',
        reminder_date: targetDate,
        reminder_time: '09:00',
        repeat_option: 'Once',
        status: 'Upcoming'
      });

      await queryClient.invalidateQueries({ queryKey: ['reminders'] });
      localStorage.setItem('mediscan_reminders_cleared', 'false');
      window.dispatchEvent(new Event('mediscan_reminders_updated'));
      setScheduledState(prev => ({ ...prev, [key]: { loading: false, done: true } }));
    } catch (err: any) {
      setScheduledState(prev => ({ ...prev, [key]: { loading: false, done: false, error: err.message || 'Failed to schedule reminder' } }));
    }
  };

  return (
    <div className="card-soft p-6 space-y-5 border-sky-500/30 bg-gradient-to-br from-sky-500/[0.03] to-transparent">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="heading-card text-foreground font-heading">
              Evidence-Informed Follow-Up Recommendations
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Suggested clinical laboratory tests based on abnormal biomarker findings
            </p>
          </div>
        </div>

        <Link
          to="/reminders"
          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto shrink-0"
        >
          <span>Open Follow-ups Tab</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {recommendations.map((rec, index) => {
          const key = `rec_${index}_${rec.test_name}`;
          const state = scheduledState[key];
          const isAlreadyScheduledInDb = (existingReminders || []).some(r =>
            r.title.toLowerCase().includes(rec.test_name.toLowerCase()) ||
            (r.description && rec.trigger_biomarker && r.description.toLowerCase().includes(rec.trigger_biomarker.toLowerCase()))
          );
          const isDone = state?.done || isAlreadyScheduledInDb;

          return (
            <div
              key={index}
              className="p-5 sm:p-6 rounded-2xl bg-card border border-border/80 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-sm sm:text-base font-bold text-foreground font-heading leading-snug">
                    {rec.test_name}
                  </h4>
                  <span className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border ${getPriorityBadge(rec.priority)}`}>
                    {rec.priority}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {rec.reason}
                </p>
              </div>

              <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground font-mono flex-wrap">
                  <span className="flex items-center gap-1.5 font-medium text-foreground">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>{rec.suggested_timeline}</span>
                  </span>
                  <span>•</span>
                  <span className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                    Triggered by: {rec.trigger_biomarker}
                  </span>
                </div>

                {isDone ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Reminder Added
                    </span>
                    <Link
                      to="/reminders"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs transition-colors"
                    >
                      <span>Open Follow-ups Tab</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={state?.loading}
                    onClick={() => handleAutomateReminder(rec, index)}
                    className="gap-1.5 text-xs h-9 px-4 rounded-xl border-primary/40 text-primary hover:bg-primary/10 cursor-pointer shrink-0 font-bold"
                  >
                    {state?.loading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <BellPlus className="w-3.5 h-3.5" />
                    )}
                    <span>{state?.loading ? 'Scheduling...' : 'Add Automated Reminder'}</span>
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-5 rounded-2xl bg-secondary/40 border border-border/50 gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="font-medium">Discuss these recommendations with your primary physician during your next clinical consultation.</span>
        </div>
        <Link
          to="/reminders"
          className="text-primary hover:underline font-bold shrink-0 self-end sm:self-auto flex items-center gap-1"
        >
          <span>Manage All Scheduled Follow-ups →</span>
        </Link>
      </div>
    </div>
  );
};
