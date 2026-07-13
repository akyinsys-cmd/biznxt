import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion } from 'motion/react';
import { Activity, Clock } from 'lucide-react';

interface AnalyticsEvent {
  id: string;
  userId: string;
  name: string;
  metadata?: any;
  timestamp: any;
}

export function ActivityFeed() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'analytics_events'),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newEvents: AnalyticsEvent[] = [];
      snapshot.forEach((doc) => {
        newEvents.push({ id: doc.id, ...doc.data() } as AnalyticsEvent);
      });
      setEvents(newEvents);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching activity feed:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-full flex items-center justify-center">
        <Activity className="w-6 h-6 text-slate-700 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-full">
      <h3 className="text-sm font-bold text-slate-200 mb-6 flex items-center gap-2">
        <Activity className="w-4 h-4 text-primary" />
        Real-Time Activity Feed
      </h3>
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {events.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No recent activity found.</p>
        ) : (
          events.map((event, i) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3"
            >
              <div className="mt-1">
                <div className="w-2 h-2 rounded-full bg-primary ring-4 ring-primary/20" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-300">
                  <span className="text-white">{event.userId ? 'User' : 'System'}</span> performed <span className="text-blue-400">{event.name}</span>
                </p>
                {event.metadata && event.metadata.path && (
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">Path: {event.metadata.path}</p>
                )}
                <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-600">
                  <Clock className="w-3 h-3" />
                  {event.timestamp ? new Date(event.timestamp.toDate ? event.timestamp.toDate() : event.timestamp).toLocaleString() : 'Just now'}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
