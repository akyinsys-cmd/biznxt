import { useState, useEffect, useMemo, memo } from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  color: 'blue' | 'emerald' | 'amber' | 'rose' | 'indigo' | 'violet';
}

export const StatCard = memo(function StatCard({ label, value, subValue, icon: Icon, trend, color }: StatCardProps) {
  const colorMap = {
    blue: 'bg-rose-50/70 text-primary border-primary/10',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    rose: 'bg-rose-50 text-primary border-primary/20',
    indigo: 'bg-slate-100 text-slate-800 border-slate-200',
    violet: 'bg-rose-100 text-primary-dark border-primary/30',
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-2">
        <div className={`p-2 rounded-2xl border ${colorMap[color]}`}>
          <Icon size={18} />
        </div>
        {trend && (
          <div className={`flex items-center gap-0.5 text-[10px] font-black px-1.5 py-0.5 rounded-2xl ${
            trend.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-primary-dark'
          }`}>
            {trend.isUp ? '↑' : '↓'} {trend.value}%
          </div>
        )}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</p>
        <h3 className="text-xl font-black text-slate-900 truncate">{value}</h3>
        {subValue && <p className="text-[10px] text-slate-500 font-medium truncate">{subValue}</p>}
      </div>
    </motion.div>
  );
});
