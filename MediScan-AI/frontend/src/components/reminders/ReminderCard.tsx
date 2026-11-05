import React from 'react';
import { motion } from 'framer-motion';
import { HealthReminder } from '../../types';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  Trash2, 
  Edit3, 
  Repeat, 
  TestTube2, 
  Pill, 
  UserCheck, 
  Droplet, 
  Dumbbell, 
  Moon, 
  Bell 
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface ReminderCardProps {
  reminder: HealthReminder;
  onEdit: (reminder: HealthReminder) => void;
  onDelete: (id: number) => void;
  onComplete: (id: number) => void;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({
  reminder,
  onEdit,
  onDelete,
  onComplete,
}) => {
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'lab_test':
        return { label: 'Lab Test', icon: TestTube2, textColor: 'text-sky-500', badgeColor: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20' };
      case 'medication':
        return { label: 'Medication', icon: Pill, textColor: 'text-emerald-500', badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' };
      case 'doctor_appointment':
        return { label: 'Doctor Appt', icon: UserCheck, textColor: 'text-purple-500', badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' };
      case 'water':
        return { label: 'Water Hydration', icon: Droplet, textColor: 'text-blue-500', badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' };
      case 'exercise':
        return { label: 'Exercise', icon: Dumbbell, textColor: 'text-amber-500', badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' };
      case 'sleep':
        return { label: 'Sleep Goal', icon: Moon, textColor: 'text-indigo-500', badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' };
      default:
        return { label: 'General Health', icon: Bell, textColor: 'text-slate-500', badgeColor: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20' };
    }
  };

  const badge = getTypeBadge(reminder.reminder_type);
  const TypeIcon = badge.icon;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`p-5 transition-all relative overflow-hidden flex flex-col justify-between border bg-card shadow-sm ${
        reminder.status === 'Completed' ? 'opacity-80' : ''
      }`}>
        <div>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className={`w-6 h-6 flex items-center justify-center shrink-0 ${badge.textColor}`}>
                <TypeIcon className="w-5 h-5" />
              </div>
              <div>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${badge.badgeColor}`}>
                  {badge.label}
                </span>
                <h4 className="text-sm font-extrabold text-foreground mt-1 line-clamp-1">
                  {reminder.title}
                </h4>
              </div>
            </div>

            <Badge variant={reminder.status === 'Completed' ? 'healthy' : reminder.status === 'Missed' ? 'critical' : 'slate'}>
              {reminder.status}
            </Badge>
          </div>

          {reminder.description && (
            <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
              {reminder.description}
            </p>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground py-2.5 border-t border-border/50">
            <div className="flex items-center gap-1.5 font-mono">
              <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>{reminder.reminder_date}</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>{reminder.reminder_time}</span>
            </div>
            <div className="flex items-center gap-1.5 col-span-2 text-[11px] font-medium text-muted-foreground">
              <Repeat className="w-3.5 h-3.5 shrink-0" />
              <span>Repeat Schedule: <strong>{reminder.repeat_option}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/50 mt-3">
          {reminder.status !== 'Completed' ? (
            <Button
              variant="emerald"
              size="sm"
              onClick={() => reminder.id && onComplete(reminder.id)}
              className="gap-1.5 text-xs h-8"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Mark Done</span>
            </Button>
          ) : (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Completed
            </span>
          )}

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(reminder)}
              className="h-8 w-8 p-0"
              title="Edit reminder"
            >
              <Edit3 className="w-3.5 h-3.5 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => reminder.id && onDelete(reminder.id)}
              className="h-8 w-8 p-0 text-destructive"
              title="Delete reminder"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
