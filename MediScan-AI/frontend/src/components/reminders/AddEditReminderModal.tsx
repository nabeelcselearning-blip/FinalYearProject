import React, { useState, useEffect } from 'react';
import { HealthReminder } from '../../types';
import { X, Bell, Calendar, Clock, Repeat, AlignLeft } from 'lucide-react';

interface AddEditReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reminder: Partial<HealthReminder>) => Promise<void>;
  initialData?: HealthReminder | null;
}

export const AddEditReminderModal: React.FC<AddEditReminderModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reminderType, setReminderType] = useState<HealthReminder['reminder_type']>('general');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('09:00');
  const [repeatOption, setRepeatOption] = useState<HealthReminder['repeat_option']>('Once');
  const [status, setStatus] = useState<HealthReminder['status']>('Upcoming');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setReminderType(initialData.reminder_type);
      setReminderDate(initialData.reminder_date);
      setReminderTime(initialData.reminder_time);
      setRepeatOption(initialData.repeat_option);
      setStatus(initialData.status);
    } else {
      setTitle('');
      setDescription('');
      setReminderType('general');
      const today = new Date().toISOString().split('T')[0];
      setReminderDate(today);
      setReminderTime('09:00');
      setRepeatOption('Once');
      setStatus('Upcoming');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !reminderDate) return;

    setIsSubmitting(true);
    try {
      await onSave({
        ...(initialData?.id ? { id: initialData.id } : {}),
        title: title.trim(),
        description: description.trim() || undefined,
        reminder_type: reminderType,
        reminder_date: reminderDate,
        reminder_time: reminderTime,
        repeat_option: repeatOption,
        status: status,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-card text-card-foreground w-full max-w-lg rounded-3xl border border-border/80 p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-border/60 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground font-heading">
                {initialData ? 'Edit Health Reminder' : 'Add Health Reminder'}
              </h3>
              <p className="text-xs text-muted-foreground">
                Configure schedule and repeat alerts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Reminder Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Fasting Glucose Follow-up, Take Vitamin B12"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-border bg-secondary/40 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Category Type
              </label>
              <select
                value={reminderType}
                onChange={(e) => setReminderType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-border bg-secondary/40 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="lab_test">Repeat Lab Test</option>
                <option value="medication">Medication Schedule</option>
                <option value="doctor_appointment">Doctor Appointment</option>
                <option value="water">Daily Water Intake</option>
                <option value="exercise">Exercise Goal</option>
                <option value="sleep">Sleep Goal</option>
                <option value="general">General Health</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Repeat Interval
              </label>
              <select
                value={repeatOption}
                onChange={(e) => setRepeatOption(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-border bg-secondary/40 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="Once">Once</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-primary" /> Date *
              </label>
              <input
                type="date"
                required
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-border bg-secondary/40 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-primary" /> Time *
              </label>
              <input
                type="time"
                required
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-border bg-secondary/40 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {initialData && (
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-border bg-secondary/40 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
                <option value="Missed">Missed</option>
              </select>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
              <AlignLeft className="w-3.5 h-3.5 text-primary" /> Additional Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Fasting for 10 hours required before test."
              className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-border bg-secondary/40 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all"
            >
              {isSubmitting ? 'Saving...' : initialData ? 'Update Reminder' : 'Create Reminder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
