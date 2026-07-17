import React, { useState, useEffect, useRef } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Calendar } from 'lucide-react';
import { ProjectTask } from '../../types/project';
import { format, addDays, differenceInDays } from 'date-fns';
import { useNotifications } from '../../context/NotificationContext';

export function ProjectGanttChart({ projectId }: { projectId: string }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { addLocalNotification } = useNotifications();

  // Drag state
  const [draggingTask, setDraggingTask] = useState<string | null>(null);
  const [dragStartX, setDragStartX] = useState(0);
  const [initialTaskRange, setInitialTaskRange] = useState<[number, number]>([0, 0]);
  const [minDate, setMinDate] = useState(Date.now());
  const [maxDate, setMaxDate] = useState(addDays(Date.now(), 30).getTime());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'project_tasks'), where('projectId', '==', projectId));
        const snap = await getDocs(q);
        const tasks = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProjectTask & { id: string }));
        
        let chartData = tasks.map(t => {
            const end = new Date(t.deadline || Date.now()).getTime();
            const start = addDays(new Date(end), -3).getTime();
            return {
                id: t.id,
                name: t.title.substring(0, 15) + (t.title.length > 15 ? '...' : ''),
                range: [start, end],
                fullTitle: t.title,
                startDate: start,
                endDate: end
            };
        }).sort((a, b) => a.startDate - b.startDate);
        
        if (chartData.length === 0) {
            const now = Date.now();
            chartData = [
                { id: 'mock-1', name: 'Research Phase', range: [now, addDays(now, 5).getTime()], fullTitle: 'Research Phase', startDate: now, endDate: addDays(now, 5).getTime() },
                { id: 'mock-2', name: 'Legal Docs', range: [addDays(now, 3).getTime(), addDays(now, 10).getTime()], fullTitle: 'Legal Docs', startDate: addDays(now, 3).getTime(), endDate: addDays(now, 10).getTime() },
                { id: 'mock-3', name: 'Registration', range: [addDays(now, 8).getTime(), addDays(now, 15).getTime()], fullTitle: 'Registration', startDate: addDays(now, 8).getTime(), endDate: addDays(now, 15).getTime() }
            ];
        }
        
        setData(chartData);
        
        // Calculate bounds
        if (chartData.length > 0) {
            const minD = Math.min(...chartData.map(d => d.range[0]));
            const maxD = Math.max(...chartData.map(d => d.range[1]));
            setMinDate(minD);
            setMaxDate(Math.max(maxD, addDays(minD, 14).getTime())); // at least 14 days
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching gantt data:", err);
        setLoading(false);
      }
    };
    if (projectId) fetchData();
  }, [projectId]);

  const handleMouseDown = (e: React.MouseEvent, task: any) => {
    setDraggingTask(task.id);
    setDragStartX(e.clientX);
    setInitialTaskRange([task.range[0], task.range[1]]);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingTask || !containerRef.current) return;
    
    const deltaX = e.clientX - dragStartX;
    const containerWidth = containerRef.current.clientWidth;
    const totalDuration = maxDate - minDate;
    
    const timeDelta = (deltaX / containerWidth) * totalDuration;
    
    setData(prev => prev.map(t => {
      if (t.id === draggingTask) {
        return {
          ...t,
          range: [initialTaskRange[0] + timeDelta, initialTaskRange[1] + timeDelta]
        };
      }
      return t;
    }));
  };

  const handleMouseUp = async () => {
    if (draggingTask) {
      const task = data.find(t => t.id === draggingTask);
      if (task && !task.id.startsWith('mock-')) {
        try {
          // In a real app we'd update Firestore with the new dates
          await updateDoc(doc(db, 'project_tasks', task.id), {
            deadline: new Date(task.range[1]).toISOString()
          });
          addLocalNotification({
            type: 'success',
            title: 'Task Rescheduled',
            message: `${task.fullTitle} has been moved.`
          });
        } catch (err) {
          console.error("Failed to update task dates", err);
        }
      } else if (task && task.id.startsWith('mock-')) {
         addLocalNotification({
            type: 'success',
            title: 'Mock Task Rescheduled',
            message: `${task.fullTitle} has been moved.`
          });
      }
      setDraggingTask(null);
    }
  };

  if (loading) return <div className="h-64 bg-slate-50 animate-pulse rounded-3xl" />;

  const totalDuration = maxDate - minDate;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] h-full flex flex-col"
         onMouseMove={handleMouseMove}
         onMouseUp={handleMouseUp}
         onMouseLeave={handleMouseUp}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
          <Calendar size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Task Timeline</h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Interactive Gantt (Drag to reschedule)</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto relative" ref={containerRef}>
        <div className="relative min-w-[500px]">
          {/* Grid lines */}
          <div className="absolute top-0 bottom-0 left-[100px] right-0 flex justify-between pointer-events-none opacity-20">
            {[0, 1, 2, 3, 4, 5].map(i => (
              <div key={i} className="border-l border-slate-300 h-full" />
            ))}
          </div>

          <div className="space-y-4 pt-2">
            {data.map(task => {
              const startPercent = Math.max(0, ((task.range[0] - minDate) / totalDuration) * 100);
              const widthPercent = Math.min(100 - startPercent, ((task.range[1] - task.range[0]) / totalDuration) * 100);
              
              return (
                <div key={task.id} className="flex items-center group relative h-8">
                  <div className="w-[100px] text-xs font-semibold text-slate-600 truncate pr-4" title={task.fullTitle}>
                    {task.name}
                  </div>
                  <div className="flex-1 relative h-full">
                    <div 
                      className={`absolute h-6 top-1 rounded-lg shadow-sm transition-shadow cursor-grab active:cursor-grabbing ${draggingTask === task.id ? 'bg-emerald-400 shadow-lg scale-[1.02] z-10' : 'bg-emerald-500 group-hover:bg-emerald-400'}`}
                      style={{ 
                        left: `${startPercent}%`, 
                        width: `${widthPercent}%` 
                      }}
                      onMouseDown={(e) => handleMouseDown(e, task)}
                    >
                       <div className="hidden group-hover:block absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-20">
                         {format(new Date(task.range[0]), 'MMM dd')} - {format(new Date(task.range[1]), 'MMM dd')}
                       </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
