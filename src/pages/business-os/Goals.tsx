import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Target, 
  IndianRupee, 
  TrendingUp, 
  UserPlus, 
  Briefcase, 
  Save 
} from 'lucide-react';
import { BusinessGoal } from './types';

interface GoalsProps {
  goal: BusinessGoal | null;
  onSaveGoal: (goal: BusinessGoal) => Promise<void>;
}

export function Goals({ goal, onSaveGoal }: GoalsProps) {
  const [edited, setEdited] = useState<BusinessGoal>(
    goal || {
      ownerId: '',
      monthlyRevenueGoal: 5000000,
      monthlyRevenueCurrent: 3250000,
      annualRevenueGoal: 60000000,
      annualRevenueCurrent: 18000000,
      expansionGoal: '',
      hiringGoal: '',
      fundingGoal: '',
      exportGoal: '',
      brandGoal: '',
      completionPercentage: 60,
      updatedAt: ''
    }
  );

  const [saving, setSaving] = useState(false);

  const handleFieldChange = (field: keyof BusinessGoal, value: any) => {
    setEdited(prev => {
      const next = { ...prev, [field]: value };
      // Recalculate average progress percentage
      const monthlyRatio = Math.min(1, next.monthlyRevenueCurrent / (next.monthlyRevenueGoal || 1));
      const annualRatio = Math.min(1, next.annualRevenueCurrent / (next.annualRevenueGoal || 1));
      next.completionPercentage = Math.round(((monthlyRatio + annualRatio) / 2) * 100);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSaveGoal(edited);
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header Panel */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-600 p-4 rounded-2xl text-white">
            <Target className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">Corporate Growth Targets & Goals</h2>
            <p className="text-xs text-slate-500">Track and adjust your domestic/international expansion milestones and revenue benchmarks.</p>
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-2xl font-semibold text-sm shadow-sm hover:shadow transition-all duration-150 flex items-center justify-center gap-2"
        >
          {saving ? 'Saving...' : 'Commit Growth Targets'}
          <Save className="w-4 h-4" />
        </button>
      </div>

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Targets */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-800 font-display flex items-center gap-2 border-b border-slate-50 pb-3">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Financial Targets & Current Revenue
          </h3>

          {/* Monthly Revenue Goal */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label className="font-bold text-slate-700">Monthly Revenue Goal</label>
              <span className="font-mono font-bold text-slate-800">{formatCurrency(edited.monthlyRevenueGoal)}</span>
            </div>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="500000" 
                max="20000000" 
                step="50000"
                value={edited.monthlyRevenueGoal}
                onChange={e => handleFieldChange('monthlyRevenueGoal', parseInt(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>Current Status:</span>
              <input 
                type="number"
                value={edited.monthlyRevenueCurrent}
                onChange={e => handleFieldChange('monthlyRevenueCurrent', parseInt(e.target.value) || 0)}
                className="bg-slate-50 border border-slate-200 rounded-2xl px-2 py-1 text-xs text-right font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="bg-slate-100 h-2 rounded-2xl overflow-hidden mt-1">
              <div 
                className="bg-emerald-500 h-2" 
                style={{ width: `${Math.min(100, (edited.monthlyRevenueCurrent / (edited.monthlyRevenueGoal || 1)) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Annual Revenue Goal */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label className="font-bold text-slate-700">Annual Revenue Goal</label>
              <span className="font-mono font-bold text-slate-800">{formatCurrency(edited.annualRevenueGoal)}</span>
            </div>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="10000000" 
                max="500000000" 
                step="500000"
                value={edited.annualRevenueGoal}
                onChange={e => handleFieldChange('annualRevenueGoal', parseInt(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>Current Status:</span>
              <input 
                type="number"
                value={edited.annualRevenueCurrent}
                onChange={e => handleFieldChange('annualRevenueCurrent', parseInt(e.target.value) || 0)}
                className="bg-slate-50 border border-slate-200 rounded-2xl px-2 py-1 text-xs text-right font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="bg-slate-100 h-2 rounded-2xl overflow-hidden mt-1">
              <div 
                className="bg-emerald-500 h-2" 
                style={{ width: `${Math.min(100, (edited.annualRevenueCurrent / (edited.annualRevenueGoal || 1)) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tactical Targets */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 font-display flex items-center gap-2 border-b border-slate-50 pb-3">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            Operational & Tactical Milestones
          </h3>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Global Expansion Goal</label>
            <textarea
              rows={2}
              value={edited.expansionGoal}
              onChange={e => handleFieldChange('expansionGoal', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Hiring & Talents Goal</label>
            <input
              type="text"
              value={edited.hiringGoal}
              onChange={e => handleFieldChange('hiringGoal', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Funding & Investment Goal</label>
            <input
              type="text"
              value={edited.fundingGoal}
              onChange={e => handleFieldChange('fundingGoal', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Export Performance Goal</label>
            <input
              type="text"
              value={edited.exportGoal}
              onChange={e => handleFieldChange('exportGoal', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
