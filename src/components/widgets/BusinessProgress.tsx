import React from 'react';
import { motion } from 'motion/react';
import { Check, Clock, Circle } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
}

interface BusinessProgressProps {
  milestones: Milestone[];
  className?: string;
}

export function BusinessProgress({ milestones, className }: BusinessProgressProps) {
  const completedCount = milestones.filter(m => m.status === 'completed').length;
  const progressPercentage = Math.round((completedCount / (milestones.length - 1)) * 100);

  return (
    <div className={cn("glass-card neomorph-flat neomorph-flat-hover p-6 border-none", className)}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-sm font-bold tracking-wider uppercase text-slate-500">Business Launch Progress</h2>
          <p className="text-xs text-slate-500 mt-0.5">Track your journey to launching.</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-display font-extrabold text-primary">{progressPercentage}%</span>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Completed</p>
        </div>
      </div>

      <div className="relative">
        {/* Progress Bar Background */}
        <div className="absolute left-4 top-2 bottom-6 w-1.5 neomorph-pressed"></div>
        
        {/* Progress Bar Active */}
        <motion.div 
          initial={{ height: 0 }}
          animate={{ height: `${(completedCount / milestones.length) * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute left-4 top-2 w-1.5 bg-primary rounded-2xl"
        ></motion.div>

        <div className="space-y-6 relative">
          {milestones.map((milestone, index) => (
            <div key={milestone.id} className="flex gap-4">
              <div className="relative shrink-0">
                <div className={cn(
                  "w-8 h-8 rounded-2xl flex items-center justify-center border bg-[#F3F5F9] z-10 relative transition-all duration-500",
                  milestone.status === 'completed' ? "shadow-md text-primary border-primary/20" : 
                  milestone.status === 'current' ? "shadow-md text-primary border-primary" : 
                  "shadow-inner text-slate-500 border-white/40"
                )}>
                  {milestone.status === 'completed' ? (
                    <Check className="w-4 h-4" />
                  ) : milestone.status === 'current' ? (
                    <Clock className="w-4 h-4 animate-pulse" />
                  ) : (
                    <Circle className="w-2 h-2 fill-current" />
                  )}
                </div>
              </div>
              <div className={cn(
                "pt-1",
                milestone.status === 'pending' ? "opacity-60" : "opacity-100"
              )}>
                <h4 className={cn(
                  "text-xs font-bold uppercase tracking-wider",
                  milestone.status === 'current' ? "text-primary" : "text-slate-900"
                )}>
                  {milestone.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1">{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
