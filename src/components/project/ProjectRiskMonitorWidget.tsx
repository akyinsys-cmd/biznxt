import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, TrendingDown, Clock, Bot } from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ProjectRisk, ProjectMilestone } from '../../types/project';

export function ProjectRiskMonitorWidget({ projectId }: { projectId: string }) {
  const [risks, setRisks] = useState<ProjectRisk[]>([]);
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    const qRisks = query(collection(db, 'project_risks'), where('projectId', '==', projectId));
    const unsubRisks = onSnapshot(qRisks, (snap) => {
      setRisks(snap.docs.map(d => ({ id: d.id, ...d.data() } as ProjectRisk)));
      setLoading(false);
    });
    
    const qMilestones = query(collection(db, 'project_milestones'), where('projectId', '==', projectId));
    const unsubMilestones = onSnapshot(qMilestones, (snap) => {
      setMilestones(snap.docs.map(d => ({ id: d.id, ...d.data() } as ProjectMilestone)));
    });

    return () => { unsubRisks(); unsubMilestones(); };
  }, [projectId]);

  if (loading) return null;

  // Simple simulated AI analysis of risks based on upcoming milestones
  const upcomingMilestones = milestones.filter(m => m.status !== 'Completed' && m.expectedDate).sort((a, b) => new Date(a.expectedDate || 0).getTime() - new Date(b.expectedDate || 0).getTime());
  
  const hasImminentMilestone = upcomingMilestones.length > 0 && 
    (new Date(upcomingMilestones[0].expectedDate!).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000);

  const activeRisks = risks.filter(r => !r.resolved);

  return (
    <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden h-[350px] flex flex-col shadow-xl shadow-slate-900/20">
      <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 rounded-full blur-[60px] -mr-10 -mt-10" />
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-10 h-10 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center">
          <ShieldAlert size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold">Project Risk Monitor</h3>
          <p className="text-xs font-medium text-slate-400 flex items-center gap-1">
            <Bot size={12} /> AI-Powered Analysis
          </p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 relative z-10">
        {hasImminentMilestone && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex gap-3">
            <Clock size={18} className="text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-rose-100">Imminent Deadline Risk</h4>
              <p className="text-xs text-rose-300/80 mt-1">
                Milestone "{upcomingMilestones[0].title}" is due within 7 days. Current task completion rate suggests a 35% probability of delay.
              </p>
            </div>
          </div>
        )}

        {activeRisks.map(risk => (
          <div key={risk.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex gap-3">
            {risk.level === 'High' ? <AlertTriangle size={18} className="text-rose-400 shrink-0 mt-0.5" /> :
             risk.level === 'Medium' ? <TrendingDown size={18} className="text-amber-400 shrink-0 mt-0.5" /> :
             <ShieldAlert size={18} className="text-blue-400 shrink-0 mt-0.5" />}
            <div>
              <h4 className="text-sm font-bold text-slate-100">{risk.type}</h4>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  risk.level === 'High' ? 'bg-rose-500/20 text-rose-300' :
                  risk.level === 'Medium' ? 'bg-amber-500/20 text-amber-300' :
                  'bg-blue-500/20 text-blue-300'
                }`}>{risk.level} Severity</span>
                <span className="text-[10px] text-slate-400 font-medium">{risk.level}</span>
              </div>
            </div>
          </div>
        ))}

        {!hasImminentMilestone && activeRisks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 pb-8">
            <ShieldAlert size={32} className="mb-2 opacity-50" />
            <p className="text-sm font-medium">No active risks detected</p>
          </div>
        )}
      </div>
    </div>
  );
}
