import React, { useState, useEffect } from 'react';
import { Activity, Clock } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

export const logUserActivity = async (action: string, details: string, userEmail: string) => {
  try {
    await addDoc(collection(db, 'userActivities'), {
      action,
      details,
      userEmail,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Failed to log activity", error);
  }
};

export function UserActivityLogger() {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'userActivities'),
      orderBy('timestamp', 'desc'),
      limit(10)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      }));
      setActivities(logs);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-500" />
          System Activity Log
        </h3>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-2xl">Live</span>
      </div>
      
      {activities.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-sm">No recent activities found.</div>
      ) : (
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
          {activities.map((act) => (
            <div key={act.id} className="flex gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
              <div className="mt-1 bg-indigo-50 p-2 rounded-2xl text-indigo-600 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{act.action}</p>
                <p className="text-xs text-slate-500 mt-0.5">{act.details}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {act.userEmail}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {act.timestamp.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
