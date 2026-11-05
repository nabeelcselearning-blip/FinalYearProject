import React, { useState, useEffect } from 'react';
import { fetchProfile, updateProfile } from '../lib/api';
import { UserProfile } from '../types';
import { User, Save, ShieldCheck, Heart, AlertCircle } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    age: 35,
    gender: 'male',
    height_cm: 175,
    weight_kg: 72,
    blood_group: 'O+',
    lifestyle: 'active',
    exercise_frequency: '3-5_times',
    smoking_status: 'non_smoker',
    alcohol_consumption: 'none',
    allergies: '',
    chronic_diseases: '',
    family_medical_history: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [fullName, setFullName] = useState(() => localStorage.getItem('mediscan_user_name') || 'John Doe');

  useEffect(() => {
    fetchProfile()
      .then((data) => {
        setProfile(data);
      })
      .catch(console.error);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      localStorage.setItem('mediscan_user_name', fullName);
      window.dispatchEvent(new Event('mediscan_name_updated'));
      const updated = await updateProfile(profile);
      setProfile(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }

  };

  const bmi = profile.height_cm && profile.weight_kg
    ? (profile.weight_kg / ((profile.height_cm / 100) ** 2)).toFixed(1)
    : '23.5';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-page text-foreground font-heading">
            User Demographics & Profile Settings
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Maintain your patient name and personal health metrics
          </p>
        </div>
      </div>

      <div className="p-3.5 rounded-[10px] bg-primary/10 border border-primary/20 flex items-start gap-2.5 text-xs text-primary">
        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
        <span>
          <b>Clinical Privacy Note:</b> Profile demographics refine educational reference ranges (e.g. gender-specific hemoglobin limits) and are <b>never treated as diagnostic diagnostic replacements</b>.
        </span>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-semibold">
          Profile saved successfully! Dashboard greeting updated.
        </div>
      )}

      <form onSubmit={handleSave} className="card-soft p-5 space-y-6">
        {/* Personal Identification & Demographics */}
        <div className="space-y-4">
          <h3 className="heading-section text-foreground border-b border-border pb-2">
            Personal & Physical Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-xs font-semibold text-foreground mb-1">
                Patient Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full h-[40px] px-3 rounded-[10px] text-sm border border-border bg-secondary/50 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Age (Years)
              </label>
              <input
                type="number"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })}
                className="w-full h-[40px] px-3 rounded-[10px] text-sm border border-border bg-secondary/50 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Gender
              </label>
              <select
                value={profile.gender}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                value={profile.height_cm}
                onChange={(e) => setProfile({ ...profile, height_cm: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Weight (kg) <span className="text-slate-400 font-normal">(BMI: {bmi})</span>
              </label>
              <input
                type="number"
                value={profile.weight_kg}
                onChange={(e) => setProfile({ ...profile, weight_kg: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Lifestyle Habits */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
            Lifestyle & Habits
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Blood Group
              </label>
              <select
                value={profile.blood_group}
                onChange={(e) => setProfile({ ...profile, blood_group: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Lifestyle Category
              </label>
              <select
                value={profile.lifestyle}
                onChange={(e) => setProfile({ ...profile, lifestyle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white"
              >
                <option value="sedentary">Sedentary (Office Work)</option>
                <option value="active">Moderately Active</option>
                <option value="athlete">Athlete / Highly Active</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Exercise Frequency
              </label>
              <select
                value={profile.exercise_frequency}
                onChange={(e) => setProfile({ ...profile, exercise_frequency: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white"
              >
                <option value="none">None</option>
                <option value="1-2_times">1 - 2 times per week</option>
                <option value="3-5_times">3 - 5 times per week</option>
                <option value="daily">Daily Exercise</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Smoking Status
              </label>
              <select
                value={profile.smoking_status}
                onChange={(e) => setProfile({ ...profile, smoking_status: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white"
              >
                <option value="non_smoker">Non-Smoker</option>
                <option value="former">Former Smoker</option>
                <option value="current">Current Smoker</option>
              </select>
            </div>
          </div>
        </div>

        {/* Medical Context */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
            Clinical History & Allergies
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Known Allergies
              </label>
              <textarea
                value={profile.allergies || ''}
                onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                rows={2}
                placeholder="e.g. Penicillin, Peanuts, Latex..."
                className="w-full p-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Chronic Conditions
              </label>
              <textarea
                value={profile.chronic_diseases || ''}
                onChange={(e) => setProfile({ ...profile, chronic_diseases: e.target.value })}
                rows={2}
                placeholder="e.g. Mild Asthma, Hypertension..."
                className="w-full p-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Family Medical History
              </label>
              <textarea
                value={profile.family_medical_history || ''}
                onChange={(e) => setProfile({ ...profile, family_medical_history: e.target.value })}
                rows={2}
                placeholder="e.g. Diabetes in family lineage..."
                className="w-full p-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm shadow-sm shadow-sky-600/20 inline-flex items-center gap-2 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Profile Details'}
          </button>
        </div>
      </form>
    </div>
  );
};
