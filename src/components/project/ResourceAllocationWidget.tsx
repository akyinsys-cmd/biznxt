import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Users2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ProjectTask } from '../../types/project';
import { useNotifications } from '../../context/NotificationContext';

export function ResourceAllocationWidget({ projectId }: { projectId?: string }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addLocalNotification } = useNotifications();
  const [alertsSent, setAlertsSent] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        let q;
        if (projectId) {
            q = query(collection(db, 'project_tasks'), where('projectId', '==', projectId));
        } else {
            q = query(collection(db, 'project_tasks')); // fetch all tasks if no project specified
        }
        
        const snap = await getDocs(q);
        const tasks = snap.docs.map(doc => doc.data() as ProjectTask);
        
        const counts: Record<string, {name: string; count: number}> = {};
        tasks.forEach(t => {
           const assignee = t.assignedTo || 'Unassigned';
           if (!counts[assignee]) {
              counts[assignee] = { name: assignee, count: 0 };
           }
           counts[assignee].count += 1;
        });
        
        let chartData = Object.values(counts).sort((a, b) => b.count - a.count);
        
        if (chartData.length === 0) {
            chartData = [
                { name: 'Alex M.', count: 3 },
                { name: 'Sarah J.', count: 5 },
                { name: 'David K.', count: 2 }
            ];
        }
        
        setData(chartData);
        
        const THRESHOLD = 4;
        chartData.forEach(user => {
          if (user.count > THRESHOLD && user.name !== 'Unassigned') {
             // Only send once per component mount/update to prevent spam
             if (!alertsSent[user.name]) {
                setAlertsSent(prev => ({...prev, [user.name]: true}));
                // Wait to avoid React state warning if called synchronously during render? No, this is inside async fetch so it's fine.
                addLocalNotification({
                  type: 'alert',
                  title: 'Overcapacity Alert',
                  message: `${user.name} has ${user.count} tasks assigned, which exceeds the threshold of ${THRESHOLD}.`
                });
             }
          }
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching resource allocation:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId]);

  if (loading) return <div className="h-64 bg-slate-50 animate-pulse rounded-3xl" />;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
          <Users2 size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Resource Allocation</h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Task Distribution</p>
        </div>
      </div>
      
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} width={80} />
            <Tooltip 
              cursor={{fill: '#f8fafc'}}
              contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'}}
            />
            <Bar dataKey="count" fill="#6366f1" radius={[0, 8, 8, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
