import React from 'react';
import { motion } from 'motion/react';
import { Activity } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BusinessHealthScoreProps {
  score: number;
  trend: number;
  delay?: number;
  className?: string;
}

export function BusinessHealthScore({ score, trend, delay = 0, className }: BusinessHealthScoreProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={cn("glass-card glass-card-hover p-8 rounded-3xl", className)}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-500">Venture Health Index</p>
          <h3 className="text-3xl font-black text-slate-900 mt-2 tracking-tighter">
            {score}
            <span className="text-lg text-slate-400 font-medium">/100</span>
          </h3>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/5 flex items-center justify-center text-emerald-500">
          <Activity size={24} />
        </div>
      </div>
      <div className="w-full bg-slate-50 h-3 p-1 rounded-2xl overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className="bg-emerald-500 h-full rounded-2xl"
        />
      </div>
      <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 mt-4 flex items-center gap-2">
        <span className={cn("px-2 py-0.5 rounded-2xl font-bold", trend > 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600")}>
          {trend > 0 ? `+${trend} pts` : `${trend} pts`}
        </span>
        Velocity delta
      </p>
    </motion.div>
  );
}
