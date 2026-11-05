import React, { useState } from 'react';
import { 
  useMedicationsQuery, 
  useMedicationInteractionsQuery, 
  useCreateMedicationMutation, 
  useDeleteMedicationMutation 
} from '../lib/queries';
import { Medication } from '../types';
import { AddEditMedicationModal } from '../components/medications/AddEditMedicationModal';
import { MedicationInteractionCard } from '../components/reports/MedicationInteractionCard';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Card } from '../components/ui/card';
import { Pill, Plus, Calendar, Trash2, Edit3, Activity } from 'lucide-react';
import { toast } from 'sonner';

export const MedicationsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);

  const { data: medications = [], isLoading: isLoadingMeds } = useMedicationsQuery();
  const { data: interactions } = useMedicationInteractionsQuery();
  const createMutation = useCreateMedicationMutation();
  const deleteMutation = useDeleteMedicationMutation();

  const handleSave = async (medData: Partial<Medication>): Promise<void> => {
    return new Promise((resolve) => {
      createMutation.mutate(medData, {
        onSuccess: () => {
          toast.success('Medication record saved');
          setIsModalOpen(false);
          resolve();
        },
        onError: () => {
          toast.error('Failed to save medication');
          resolve();
        },
      });
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this medication record?')) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success('Medication record deleted'),
        onError: () => toast.error('Failed to delete medication'),
      });
    }
  };

  const openCreateModal = () => {
    setEditingMedication(null);
    setIsModalOpen(true);
  };

  const openEditModal = (med: Medication) => {
    setEditingMedication(med);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Prescription Medications Tracker</h1>
            <Badge variant="slate">{medications.length} Active</Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Cross-referencing active medications with diagnostic laboratory biomarkers.
          </p>
        </div>

        <Button onClick={openCreateModal} variant="emerald" className="gap-2 text-xs">
          <Plus className="w-4 h-4" />
          <span>Add Medication</span>
        </Button>
      </div>

      {/* Interactions Alert Card */}
      {interactions && <MedicationInteractionCard analysis={interactions} />}

      {/* List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          Tracked Medications
        </h2>

        {isLoadingMeds ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-40 rounded-xl" />
            <Skeleton className="h-40 rounded-xl" />
          </div>
        ) : medications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {medications.map((med) => (
              <Card key={med.id} className="p-4 border bg-card shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                        <Pill className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-foreground">{med.name}</h3>
                        <Badge variant="healthy" className="mt-0.5 font-mono">
                          {med.dosage} • {med.frequency}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-3">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span>Started: {med.start_date}</span>
                  </div>

                  {med.notes && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2 bg-secondary/30 p-2.5 rounded-lg border">
                      {med.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t mt-4">
                  <Button variant="ghost" size="sm" onClick={() => openEditModal(med)}>
                    <Edit3 className="w-3.5 h-3.5 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => med.id && handleDelete(med.id)}>
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center border rounded-2xl bg-card space-y-3">
            <Pill className="w-10 h-10 text-muted-foreground mx-auto opacity-50" />
            <h3 className="text-sm font-bold text-foreground">No Tracked Medications</h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Add your active medications to analyze interactions with lab biomarkers.
            </p>
            <Button onClick={openCreateModal} variant="emerald" size="sm" className="gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              <span>Add First Medication</span>
            </Button>
          </div>
        )}
      </div>

      <AddEditMedicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingMedication}
      />
    </div>
  );
};
