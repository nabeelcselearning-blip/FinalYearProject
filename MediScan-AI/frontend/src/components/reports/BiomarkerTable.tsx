import React, { useState } from 'react';
import { ChevronRight, CheckCircle, AlertTriangle } from 'lucide-react';
import { Biomarker } from '../../types';
import { BiomarkerDetailDrawer } from './BiomarkerDetailDrawer';

interface BiomarkerTableProps {
  biomarkers: Biomarker[];
}

export const BiomarkerTable: React.FC<BiomarkerTableProps> = ({ biomarkers }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeBiomarker, setActiveBiomarker] = useState<Biomarker | null>(null);

  const categories = ['All', ...Array.from(new Set(biomarkers.map((b) => b.category)))];

  const filteredBiomarkers = selectedCategory === 'All'
    ? biomarkers
    : biomarkers.filter((b) => b.category === selectedCategory);

  const badgeStyles: Record<string, string> = {
    green: 'badge-muted-green',
    yellow: 'badge-muted-yellow',
    orange: 'badge-muted-orange',
    red: 'badge-muted-red'
  };

  return (
    <div className="card-soft p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
            Laboratory Parameters Panel
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Click on any parameter row to inspect detailed clinical significance, causes, and diet tips
          </p>
        </div>

        {/* Panel Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-sky-600 border-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-3">Test Biomarker</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Measured Value</th>
              <th className="py-3 px-3">Reference Range</th>
              <th className="py-3 px-3">Clinical Status</th>
              <th className="py-3 px-3 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800 text-sm">
            {filteredBiomarkers.map((b, idx) => (
              <tr
                key={idx}
                onClick={() => setActiveBiomarker(b)}
                className="hover:bg-slate-100/60 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
              >
                <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white">
                  {b.canonical_name}
                  <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    Alias: {b.raw_name}
                  </span>
                </td>
                <td className="py-3.5 px-3 text-xs text-slate-600 dark:text-slate-300 font-medium">
                  {b.category}
                </td>
                <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white font-heading">
                  {b.string_value ? b.string_value : b.value}{' '}
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{b.unit}</span>
                </td>
                <td className="py-3.5 px-3 text-xs text-slate-600 dark:text-slate-300 font-medium">
                  {b.reference_range_str}
                </td>
                <td className="py-3.5 px-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${badgeStyles[b.color_code] || badgeStyles['green']}`}>
                    {b.color_code === 'green' ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <AlertTriangle className="w-3 h-3" />
                    )}
                    {b.status.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td className="py-3.5 px-3 text-right text-slate-400">
                  <ChevronRight className="w-4 h-4 inline-block" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Drawer */}
      <BiomarkerDetailDrawer
        biomarker={activeBiomarker}
        onClose={() => setActiveBiomarker(null)}
      />
    </div>
  );
};
