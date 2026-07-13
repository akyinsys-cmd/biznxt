import { useState, useEffect } from 'react';
import { Project, ProjectActivity } from '../../../types/project';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { format } from 'date-fns';
import { CheckCircle2, FileText, MessageSquare, Calendar, Activity, DollarSign } from 'lucide-react';

export function Timeline({ project }: { project: Project }) {
  const [activities, setActivities] = useState<ProjectActivity[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'project_activities'), 
      where('projectId', '==', project.id),
      orderBy('timestamp', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setActivities(snap.docs.map(d => ({ id: d.id, ...d.data() } as ProjectActivity)));
    });
    return () => unsub();
  }, [project.id]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'Task': return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'Document': return <FileText size={16} className="text-blue-500" />;
      case 'Meeting': return <Calendar size={16} className="text-purple-500" />;
      case 'Payment': return <DollarSign size={16} className="text-amber-500" />;
      case 'Note': return <MessageSquare size={16} className="text-slate-500" />;
      default: return <Activity size={16} className="text-slate-500" />;
    }
  };

  return (
    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm min-h-[600px]">
      <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Activity Timeline</h3>
      
      <div className="relative pl-6 border-l-2 border-slate-100 space-y-8">
        {activities.map(activity => (
          <div key={activity.id} className="relative">
            <div className="absolute -left-[35px] bg-white p-1 rounded-2xl border-2 border-slate-100">
              {getIcon(activity.type)}
            </div>
            <div>
              <p className="text-sm font-black text-slate-900">{activity.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{activity.actorName}</span>
                <span className="text-slate-300">•</span>
                <span className="text-[10px] font-bold text-slate-500">
                  {activity.timestamp?.seconds ? format(new Date(activity.timestamp.seconds * 1000), 'MMM dd, yyyy hh:mm a') : 'Just now'}
                </span>
              </div>
            </div>
          </div>
        ))}
        {activities.length === 0 && (
          <div className="text-center py-12 text-slate-500 font-bold text-sm">
            No activity recorded yet.
          </div>
        )}
      </div>
    </div>
  );
}
