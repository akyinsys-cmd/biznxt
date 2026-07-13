import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center min-h-[240px] glass-card bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.03)]",
        className
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-white/80 shadow-sm border border-white/50 flex items-center justify-center text-slate-500 mb-5 backdrop-blur-sm">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </motion.div>
  );
}
