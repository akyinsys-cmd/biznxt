import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import { Project } from '../../types/project';

interface Props {
  project: Project;
}

export function ProjectAIInsights({ project }: Props) {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<{ statusSummary?: string; risks?: string[]; nextSteps?: string[] } | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await fetch('/api/project/insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectData: project })
        });
        const data = await response.json();
        setInsights(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, [project]);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!insights) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-indigo-50 to-white rounded-3xl p-8 border border-indigo-100 shadow-sm relative overflow-hidden mb-8"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Sparkles size={24} />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">AI Project Insights</h3>
          <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">Gemini Powered Analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Executive Summary</h4>
          <p className="text-sm text-slate-600 leading-relaxed">{insights.statusSummary || 'Project is progressing according to plan.'}</p>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-500" />
            Detected Risks
          </h4>
          <ul className="space-y-3">
            {(insights.risks || []).map((risk, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                {risk}
              </li>
            ))}
            {(!insights.risks || insights.risks.length === 0) && (
              <li className="text-sm text-slate-500 italic">No significant risks detected.</li>
            )}
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <ArrowRight size={16} className="text-emerald-500" />
            Recommended Next Steps
          </h4>
          <ul className="space-y-3">
            {(insights.nextSteps || []).map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 text-xs font-bold">{i + 1}</div>
                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
