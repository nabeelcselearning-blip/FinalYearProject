import React, { useState } from 'react';
import { 
  useRemindersQuery, 
  useCreateReminderMutation, 
  useUpdateReminderMutation, 
  useCompleteReminderMutation, 
  useDeleteReminderMutation 
} from '../lib/queries';
import { HealthReminder } from '../types';
import { ReminderCard } from '../components/reminders/ReminderCard';
import { AddEditReminderModal } from '../components/reminders/AddEditReminderModal';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Bell, Plus, Search, BellOff } from 'lucide-react';
import { toast } from 'sonner';

export const RemindersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'All' | 'Upcoming' | 'Completed' | 'Missed'>('All');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<HealthReminder | null>(null);

  const { data: reminders = [], isLoading } = useRemindersQuery();
  const createMutation = useCreateReminderMutation();
  const updateMutation = useUpdateReminderMutation();
  const completeMutation = useCompleteReminderMutation();
  const deleteMutation = useDeleteReminderMutation();

  const handleSave = async (reminderData: Partial<HealthReminder>) => {
    if (editingReminder && editingReminder.id) {
      updateMutation.mutate(
        { id: editingReminder.id, reminder: reminderData },
        {
          onSuccess: () => {
            toast.success('Reminder updated successfully');
            setIsModalOpen(false);
          },
          onError: () => toast.error('Failed to update reminder'),
        }
      );
    } else {
      createMutation.mutate(reminderData, {
        onSuccess: () => {
          toast.success('New health reminder scheduled');
          setIsModalOpen(false);
        },
        onError: () => toast.error('Failed to create reminder'),
      });
    }
  };

  const handleComplete = (id: number) => {
    completeMutation.mutate(id, {
      onSuccess: () => toast.success('Reminder marked as completed'),
      onError: () => toast.error('Failed to mark reminder complete'),
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this health reminder?')) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success('Reminder deleted'),
        onError: () => toast.error('Failed to delete reminder'),
      });
    }
  };

  const openCreateModal = () => {
    setEditingReminder(null);
    setIsModalOpen(true);
  };

  const openEditModal = (reminder: HealthReminder) => {
    setEditingReminder(reminder);
    setIsModalOpen(true);
  };

  const filteredReminders = reminders.filter((r) => {
    const matchesTab = activeTab === 'All' || r.status === activeTab;
    const matchesType = selectedType === 'all' || r.reminder_type === selectedType;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Health Reminders & Schedules</h1>
            <Badge variant="slate">{reminders.length} Total</Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Automated notifications for diagnostic re-tests, prescription dosing, and clinical follow-ups.
          </p>
        </div>

        <Button onClick={openCreateModal} variant="emerald" className="gap-2 text-xs">
          <Plus className="w-4 h-4" />
          <span>Add Reminder</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-secondary/30 p-1 rounded-xl border border-border">
          {(['All', 'Upcoming', 'Completed', 'Missed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reminders..."
              className="w-full pl-9 pr-3.5 py-1.5 rounded-lg text-xs border border-border bg-secondary/30 text-foreground focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs border border-border bg-secondary/30 text-foreground"
          >
            <option value="all">All Categories</option>
            <option value="lab_test">Lab Tests</option>
            <option value="medication">Medications</option>
            <option value="doctor_appointment">Doctor Visits</option>
            <option value="water">Water Hydration</option>
            <option value="exercise">Exercise</option>
            <option value="sleep">Sleep Goals</option>
            <option value="general">General</option>
          </select>
        </div>
      </div>

      {/* List Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      ) : filteredReminders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredReminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onEdit={openEditModal}
              onDelete={handleDelete}
              onComplete={handleComplete}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center border rounded-2xl bg-card space-y-3">
          <Bell className="w-10 h-10 text-muted-foreground mx-auto opacity-50" />
          <h3 className="text-sm font-bold text-foreground">No Reminders Found</h3>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            You currently have no health reminders in this view.
          </p>
          <Button onClick={openCreateModal} variant="emerald" size="sm" className="gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Reminder</span>
          </Button>
        </div>
      )}

      <AddEditReminderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingReminder}
      />
    </div>
  );
};
