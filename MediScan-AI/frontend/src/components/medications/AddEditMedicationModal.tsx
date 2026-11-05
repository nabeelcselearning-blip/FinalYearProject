import React, { useState, useEffect } from 'react';
import { Medication } from '../../types';
import { X, Pill, Calendar, Clock, AlignLeft } from 'lucide-react';

interface AddEditMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (medication: Partial<Medication>) => Promise<void>;
  initialData?: Medication | null;
}

export const AddEditMedicationModal: React.FC<AddEditMedicationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Once daily');
  const [startDate, setStartDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDosage(initialData.dosage);
      setFrequency(initialData.frequency);
      setStartDate(initialData.start_date);
      setNotes(initialData.notes || '');
    } else {
      setName('');
      setDosage('');
      setFrequency('Once daily');
      setStartDate(new Date().toISOString().split('T')[0]);
      setNotes('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dosage.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        ...(initialData?.id ? { id: initialData.id } : {}),
        name: name.trim(),
        dosage: dosage.trim(),
        frequency: frequency.trim(),
        start_date: startDate,
        notes: notes.trim() || undefined,
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
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground font-heading">
                {initialData ? 'Edit Medication' : 'Add Active Medication'}
              </h3>
              <p className="text-xs text-muted-foreground">
                Track prescriptions for automated biomarker interaction analysis
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
              Medication Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Metformin, Atorvastatin, Levothyroxine"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-border bg-secondary/40 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Dosage Amount *
              </label>
              <input
                type="text"
                required
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="e.g. 500mg, 10mg, 50mcg"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-border bg-secondary/40 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-border bg-secondary/40 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="Once daily">Once daily</option>
                <option value="Twice daily (BID)">Twice daily (BID)</option>
                <option value="Three times daily">Three times daily</option>
                <option value="As needed (PRN)">As needed (PRN)</option>
                <option value="Weekly">Weekly</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-primary" /> Therapy Start Date
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-border bg-secondary/40 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
              <AlignLeft className="w-3.5 h-3.5 text-primary" /> Special Instructions / Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Take with morning meal. Separate calcium by 4 hours."
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
              className="px-6 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 shadow-md transition-all cursor-pointer"
            >
              {isSubmitting ? 'Saving...' : initialData ? 'Update Medication' : 'Add Medication'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
