import React from 'react';
import { motion } from 'motion/react';
import { UserCheck, CheckCircle2, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

interface CompletionItem {
  id: string;
  task: string;
  completed: boolean;
  actionLabel: string;
}

const CHECKLIST_ITEMS: CompletionItem[] = [
  { id: 'c1', task: 'Administrative Profile details', completed: true, actionLabel: 'Edit Profile' },
  { id: 'c2', task: 'Free Business Research Form', completed: true, actionLabel: 'Start Research' },
  { id: 'c3', task: 'Identity & KYC Document Upload', completed: false, actionLabel: 'Verify KYC' },
  { id: 'c4', task: 'Statutory GSTIN/PAN filing status', completed: false, actionLabel: 'Add Tax ID' }
];

export function ProfileCompletion({ onActionClick }: { onActionClick?: (action: string) => void }) {
  const completedCount = CHECKLIST_ITEMS.filter(i => i.completed).length;
  const percentage = Math.round((completedCount / CHECKLIST_ITEMS.length) * 100);

  return (
    <div className="glass-card bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Profile Completion Ledger</h3>
          <p className="text-xs text-slate-500 mt-0.5">Maintain verified credentials to bypass registration bottlenecks.</p>
        </div>
        
        {/* Progress Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-2xl bg-indigo-50 border border-indigo-100 text-primary font-bold text-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
          <span>{percentage}% Complete</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2.5 rounded-2xl overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-primary to-indigo-500 rounded-2xl"
        />
      </div>

      {/* Checkbox Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {CHECKLIST_ITEMS.map((item) => (
          <div 
            key={item.id}
            className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
              item.completed ? 'border-slate-50 bg-slate-50/50' : 'border-slate-150 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className={`w-4.5 h-4.5 shrink-0 ${
                item.completed ? 'text-emerald-500 fill-emerald-50' : 'text-slate-400'
              }`} />
              <span className={`text-xs font-semibold leading-tight ${
                item.completed ? 'text-slate-500 line-through' : 'text-slate-800'
              }`}>
                {item.task}
              </span>
            </div>

            {!item.completed && (
              <button 
                onClick={() => onActionClick?.(item.actionLabel)}
                className="text-[10px] text-primary hover:text-primary-dark font-bold flex items-center gap-0.5 shrink-0"
              >
                <span>Go</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
