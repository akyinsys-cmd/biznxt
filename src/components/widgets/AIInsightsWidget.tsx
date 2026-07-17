import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Zap, Target, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';

export function AIInsightsWidget() {
  const { user } = useAuth();
  const [currentInsight, setCurrentInsight] = useState(0);

  const insights = [
    {
      id: 1,
      title: 'Resource Optimization',
      description: 'Your design team has 30% unused capacity this week. Consider pulling forward the "Branding Assets" milestone.',
      icon: <Zap size={20} className="text-amber-500" />,
      color: 'bg-amber-50 border-amber-100',
      action: 'Review Allocation'
    },
    {
      id: 2,
      title: 'Market Intelligence',
      description: 'Competitor activity detected in your sector. Recommended action: expedite the upcoming "Feature Launch".',
      icon: <Target size={20} className="text-rose-500" />,
      color: 'bg-rose-50 border-rose-100',
      action: 'View Analysis'
    },
    {
      id: 3,
      title: 'Velocity Acceleration',
      description: 'You are resolving tasks 15% faster than last month. Adjusting timeline projections could save you 2 weeks.',
      icon: <TrendingUp size={20} className="text-emerald-500" />,
      color: 'bg-emerald-50 border-emerald-100',
      action: 'Update Gantt'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInsight((prev) => (prev + 1) % insights.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const insight = insights[currentInsight];

  return (
    <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl">
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-2xl blur-[80px] -mr-24 -mt-24" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 rounded-2xl blur-[60px] -ml-16 -mb-16" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10">
            <Sparkles size={20} className="text-primary-100" />
          </div>
          <div>
            <h3 className="text-lg font-black tracking-tight">AI Insights</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Predictive Optimization</p>
          </div>
        </div>
        <div className="flex gap-1">
          {insights.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1 rounded-full transition-all duration-500 ${currentInsight === idx ? 'w-4 bg-primary' : 'w-1 bg-white/20'}`} 
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 h-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentInsight}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                {insight.icon}
                <span className="text-sm font-bold text-white">{insight.title}</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {insight.description}
              </p>
            </div>
            <button className="text-xs font-bold text-primary hover:text-white transition-colors flex items-center gap-1 self-start mt-2">
              {insight.action} <ArrowRight size={14} />
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
