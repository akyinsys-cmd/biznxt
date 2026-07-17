import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, Clock, FileText, MessageSquare, Plus } from 'lucide-react';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { format } from 'date-fns';

export function ProjectActivityTimelineWidget({ projectId }: { projectId: string }) {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    const q = query(
      collection(db, 'project_activities'),
      where('projectId', '==', projectId),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const unsub = onSnapshot(q, (snap) => {
      setActivities(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, [projectId]);

  if (loading) {
    return (
      <div className="bg-white shadow-xl shadow-slate-200/50 rounded-3xl p-6 border border-slate-100 flex flex-col items-center justify-center min-h-[350px]">
        <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Activity Feed...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden h-[350px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
            <Activity size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Activity Timeline</h3>
            <p className="text-xs font-medium text-slate-500">Live feed of project events</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <Clock size={32} className="mb-2 opacity-50" />
            <p className="text-sm font-medium">No recent activity</p>
          </div>
        ) : (
          activities.map((act, i) => (
            <div key={act.id} className="flex gap-4 relative">
              {i !== activities.length - 1 && (
                <div className="absolute left-[15px] top-8 bottom-[-24px] w-0.5 bg-slate-100" />
              )}
              <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center shrink-0 z-10 text-slate-500">
                {act.type === 'Document' ? <FileText size={14} className="text-indigo-500" /> :
                 act.type === 'Comment' ? <MessageSquare size={14} className="text-amber-500" /> :
                 <Plus size={14} />}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">
                  <span className="font-bold text-slate-900">{act.actorName || 'System'}</span> {act.description}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">
                  {act.timestamp ? format(act.timestamp.toDate(), 'MMM dd, HH:mm') : 'Just now'}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
