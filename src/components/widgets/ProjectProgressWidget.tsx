import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { Project } from '../../types/project';
import { Briefcase, Activity, CheckCircle2, Circle } from 'lucide-react';

export function ProjectProgressWidget() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'client_projects'), where('clientEmail', '==', user.email));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
      setProjects(items.filter(p => p.status !== 'Completed' && p.status !== 'Cancelled'));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  if (loading) return <div className="h-48 animate-pulse bg-slate-100 rounded-3xl" />;
  if (projects.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> Active Project Progress
          </h3>
          <p className="text-sm text-slate-500 mt-1">Track your venture's momentum across all active milestones.</p>
        </div>
      </div>
      <div className="space-y-6">
        {projects.slice(0, 3).map((project) => (
          <div key={project.id} className="relative">
            <div className="flex justify-between items-end mb-2">
              <div>
                <h4 className="font-semibold text-slate-900">{project.title}</h4>
                <p className="text-xs text-slate-500">{project.currentTimelineStep} Phase</p>
              </div>
              <span className="text-xl font-black text-slate-900">{project.progress || 0}%</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${project.progress || 0}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
              />
            </div>
            {/* Milestones Indicator */}
            <div className="flex justify-between mt-3 px-1">
               {['Research', 'Documentation', 'Registration', 'Launch'].map((milestone, idx) => {
                 const stepMapping: Record<string, number> = {
                    'Research': 0, 'Quotation': 1, 'Documentation': 2, 'Registration': 3, 
                    'Branding': 4, 'Manufacturer': 5, 'Website': 6, 'Marketing': 7, 'Launch': 8, 'Growth': 9
                 };
                 const targetSteps = ['Research', 'Documentation', 'Registration', 'Launch'];
                 const currentIdx = stepMapping[project.currentTimelineStep] || 0;
                 const targetIdx = stepMapping[milestone] || 0;
                 
                 const isCompleted = currentIdx > targetIdx || project.progress === 100;
                 const isCurrent = currentIdx === targetIdx && project.progress < 100;
                 
                 return (
                   <div key={milestone} className="flex flex-col items-center gap-1">
                     {isCompleted ? (
                       <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                     ) : isCurrent ? (
                       <Circle className="w-4 h-4 text-primary fill-primary/20" />
                     ) : (
                       <Circle className="w-4 h-4 text-slate-300" />
                     )}
                     <span className={`text-[10px] font-bold uppercase tracking-wider ${isCompleted || isCurrent ? 'text-slate-700' : 'text-slate-400'}`}>
                       {milestone}
                     </span>
                   </div>
                 );
               })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
