import React, { useState, useEffect } from 'react';
import { X, ArrowRightLeft, TrendingUp, TrendingDown, Minus, Sparkles, Loader2 } from 'lucide-react';
import { Report, ComparisonResult } from '../../types';
import { compareReports } from '../../lib/api';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: Report[];
  selectedIds?: string[];
}

export const CompareModal: React.FC<CompareModalProps> = ({ isOpen, onClose, reports, selectedIds = [] }) => {
  const [baselineId, setBaselineId] = useState<string>('');
  const [currentId, setCurrentId] = useState<string>('');
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const runComparison = async (bId: string, cId: string) => {
    if (!bId || !cId) return;
    if (bId === cId) {
      setError('Please select two distinct laboratory reports for comparison.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await compareReports(bId, cId);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to compare reports.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setResult(null);
      setError(null);
      return;
    }

    let bId = '';
    let cId = '';

    if (selectedIds && selectedIds.length >= 2) {
      const r1 = reports.find(r => r.id === selectedIds[0]);
      const r2 = reports.find(r => r.id === selectedIds[1]);

      if (r1 && r2) {
        const d1 = new Date(r1.upload_date).getTime();
        const d2 = new Date(r2.upload_date).getTime();
        if (d1 <= d2) {
          bId = r1.id;
          cId = r2.id;
        } else {
          bId = r2.id;
          cId = r1.id;
        }
      } else {
        bId = selectedIds[0];
        cId = selectedIds[1];
      }
    } else if (selectedIds && selectedIds.length === 1) {
      cId = selectedIds[0];
      const other = reports.find(r => r.id !== cId);
      bId = other ? other.id : '';
    } else if (reports && reports.length >= 2) {
      bId = reports[reports.length - 1].id;
      cId = reports[0].id;
    }

    setBaselineId(bId);
    setCurrentId(cId);

    if (bId && cId && bId !== cId) {
      runComparison(bId, cId);
    }
  }, [isOpen, selectedIds, reports]);

  if (!isOpen) return null;

  const handleRunComparison = () => {
    runComparison(baselineId, currentId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl card-border p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <ArrowRightLeft className="w-5 h-5 text-sky-600" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
            Laboratory Report Comparison Tool
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-6">
          Compare biomarker deltas over time to track medical improvements or emerging variations
        </p>

        {/* Report Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Baseline Report (Earlier Date)
            </label>
            <select
              value={baselineId}
              onChange={(e) => setBaselineId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            >
              {reports.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.file_name} ({new Date(r.upload_date).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Comparison Report (Current Date)
            </label>
            <select
              value={currentId}
              onChange={(e) => setCurrentId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            >
              {reports.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.file_name} ({new Date(r.upload_date).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
            {error}
          </div>
        )}

        <div className="flex justify-end mb-6">
          <button
            onClick={handleRunComparison}
            disabled={isLoading}
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-sky-600 text-white hover:bg-sky-500 disabled:opacity-50 inline-flex items-center gap-2 cursor-pointer shadow-sm shadow-sky-600/20"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate AI Comparison
          </button>
        </div>

        {/* Comparison Results */}
        {result && (
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            {/* AI Summary Box */}
            <div className="p-4 rounded-xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900">
              <h4 className="text-xs font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Groq AI Longitudinal Comparison Summary
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {result.ai_comparison_summary}
              </p>
            </div>

            {/* Deltas Table */}
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white font-heading mb-3">
                Biomarker Progress Breakdown
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                      <th className="py-2.5 px-3">Biomarker</th>
                      <th className="py-2.5 px-3">Baseline</th>
                      <th className="py-2.5 px-3">Current</th>
                      <th className="py-2.5 px-3">Delta</th>
                      <th className="py-2.5 px-3 text-right">Trend Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {result.deltas.map((d, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                          {d.canonical_name}
                        </td>
                        <td className="py-3 px-3 text-slate-500">
                          {d.baseline_value} {d.unit}
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                          {d.current_value} {d.unit}
                        </td>
                        <td className="py-3 px-3 font-mono font-semibold">
                          {d.delta_value > 0 ? `+${d.delta_value}` : d.delta_value} ({d.delta_percentage}%)
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            d.trend_status === 'improved'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                              : d.trend_status === 'worsened' || d.trend_status === 'new_abnormal'
                              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}>
                            {d.trend_status === 'improved' && <TrendingUp className="w-3 h-3" />}
                            {(d.trend_status === 'worsened' || d.trend_status === 'new_abnormal') && <TrendingDown className="w-3 h-3" />}
                            {d.trend_status === 'stable' && <Minus className="w-3 h-3" />}
                            {d.trend_status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
