import React, { useState, useEffect } from 'react';
import { Award, Star, Shield, Target, Zap, CheckCircle2 } from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ProjectMilestone } from '../../types/project';

export function MilestoneBadgesWidget({ projectId }: { projectId: string }) {
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    const q = query(collection(db, 'project_milestones'), where('projectId', '==', projectId));
    const unsub = onSnapshot(q, (snap) => {
      setMilestones(snap.docs.map(d => ({ id: d.id, ...d.data() } as ProjectMilestone)));
      setLoading(false);
    });
    return () => unsub();
  }, [projectId]);

  if (loading) return null;

  const completed = milestones.filter(m => m.status === 'Completed');
  if (completed.length === 0) return null; // Only show if there are badges

  const getBadgeIcon = (index: number) => {
    const icons = [Award, Star, Shield, Target, Zap, CheckCircle2];
    const Icon = icons[index % icons.length];
    return <Icon size={24} className="text-white" />;
  };

  const getBadgeColor = (index: number) => {
    const colors = [
      'from-amber-400 to-orange-500',
      'from-emerald-400 to-teal-500',
      'from-blue-400 to-indigo-500',
      'from-purple-400 to-pink-500',
      'from-rose-400 to-red-500',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col h-[280px]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
          <Award size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Milestone Badges</h3>
          <p className="text-xs font-medium text-slate-500">Gamification layer & team achievements</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-x-auto flex items-center gap-6 pb-2 snap-x">
        {completed.map((m, i) => (
          <div key={m.id} className="snap-center shrink-0 flex flex-col items-center group">
            <div className={`w-20 h-20 rounded-[2rem] bg-gradient-to-br ${getBadgeColor(i)} flex items-center justify-center shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform cursor-pointer relative`}>
              {getBadgeIcon(i)}
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                <CheckCircle2 size={14} className="text-emerald-500" />
              </div>
            </div>
            <p className="text-xs font-bold text-slate-700 mt-4 text-center max-w-[100px] leading-tight group-hover:text-amber-600 transition-colors">
              {m.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
