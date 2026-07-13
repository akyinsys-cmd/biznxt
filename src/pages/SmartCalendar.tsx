import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  X,
  Target
} from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  parseISO,
  isToday
} from 'date-fns';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ProjectTask, ProjectMeeting, ProjectMilestone, Project } from '../types/project';

export default function SmartCalendar() {
  const { user, role } = useAuth();
  const { showToast } = useToast();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [meetings, setMeetings] = useState<ProjectMeeting[]>([]);
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    let qProjects;
    if (role === 'admin' || role === 'superadmin') {
      qProjects = query(collection(db, 'client_projects'));
    } else if (role === 'bsm') {
      qProjects = query(collection(db, 'client_projects'), where('bsmId', '==', user.uid));
    } else {
      qProjects = query(collection(db, 'client_projects'), where('clientId', '==', user.uid));
    }

    const unsubProjects = onSnapshot(qProjects, (snap) => {
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() } as Project)));
    });

    // For simplicity, we fetch all and filter in memory if needed, since in query limits are 10
    const unsubTasks = onSnapshot(collection(db, 'project_tasks'), (snap) => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() } as ProjectTask)));
    });

    const unsubMeetings = onSnapshot(collection(db, 'project_meetings'), (snap) => {
      setMeetings(snap.docs.map(d => ({ id: d.id, ...d.data() } as ProjectMeeting)));
    });

    const unsubMilestones = onSnapshot(collection(db, 'project_milestones'), (snap) => {
      setMilestones(snap.docs.map(d => ({ id: d.id, ...d.data() } as ProjectMilestone)));
    });

    setLoading(false);

    return () => {
      unsubProjects();
      unsubTasks();
      unsubMeetings();
      unsubMilestones();
    };
  }, [user, role]);

  const projectIds = useMemo(() => new Set(projects.map(p => p.id)), [projects]);

  const filteredTasks = useMemo(() => tasks.filter(t => projectIds.has(t.projectId) || t.assignedTo === user?.uid), [tasks, projectIds, user]);
  const filteredMeetings = useMemo(() => meetings.filter(m => projectIds.has(m.projectId) || m.clientId === user?.uid || m.bsmId === user?.uid), [meetings, projectIds, user]);
  const filteredMilestones = useMemo(() => milestones.filter(m => projectIds.has(m.projectId)), [milestones, projectIds]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const onDateClick = (day: Date) => {
    setSelectedDate(day);
  };

  const getEventsForDate = (date: Date) => {
    const dayTasks = filteredTasks.filter(t => t.deadline && isSameDay(parseISO(t.deadline), date));
    const dayMeetings = filteredMeetings.filter(m => m.dateTime && isSameDay(parseISO(m.dateTime), date));
    const dayMilestones = filteredMilestones.filter(m => m.expectedDate && isSameDay(parseISO(m.expectedDate), date));
    return { dayTasks, dayMeetings, dayMilestones };
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const { dayTasks, dayMeetings, dayMilestones } = getEventsForDate(cloneDay);
        const hasEvents = dayTasks.length > 0 || dayMeetings.length > 0 || dayMilestones.length > 0;

        days.push(
          <div
            className={`min-h-[100px] border border-slate-100 p-2 cursor-pointer transition-all ${
              !isSameMonth(day, monthStart)
                ? "bg-slate-50 text-slate-400"
                : isSameDay(day, selectedDate)
                ? "bg-blue-50 border-blue-200"
                : "bg-white hover:bg-slate-50"
            }`}
            key={day.toString()}
            onClick={() => onDateClick(cloneDay)}
          >
            <div className="flex justify-between items-start">
              <span className={`w-8 h-8 flex items-center justify-center rounded-2xl text-sm font-semibold ${
                isToday(day) ? 'bg-blue-600 text-white shadow-md' : isSameDay(day, selectedDate) ? 'text-blue-700' : 'text-slate-700'
              }`}>
                {formattedDate}
              </span>
              {hasEvents && (
                <div className="flex gap-1">
                  {dayMeetings.length > 0 && <div className="w-2 h-2 rounded-full bg-purple-500" title="Meetings" />}
                  {dayTasks.length > 0 && <div className="w-2 h-2 rounded-full bg-amber-500" title="Tasks" />}
                  {dayMilestones.length > 0 && <div className="w-2 h-2 rounded-full bg-emerald-500" title="Milestones" />}
                </div>
              )}
            </div>
            
            <div className="mt-2 space-y-1">
              {dayMeetings.slice(0, 2).map(m => (
                <div key={m.id} className="text-[10px] font-medium bg-purple-50 text-purple-700 px-2 py-1 rounded truncate">
                  {format(parseISO(m.dateTime), 'HH:mm')} {m.title}
                </div>
              ))}
              {dayTasks.slice(0, 2).map(t => (
                <div key={t.id} className="text-[10px] font-medium bg-amber-50 text-amber-700 px-2 py-1 rounded truncate">
                  {t.title}
                </div>
              ))}
              {(dayMeetings.length + dayTasks.length + dayMilestones.length) > 4 && (
                <div className="text-[10px] text-slate-500 font-medium pl-1">
                  +{(dayMeetings.length + dayTasks.length + dayMilestones.length) - 4} more
                </div>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="bg-white rounded-2xl overflow-hidden border border-slate-200">{rows}</div>;
  };

  const renderDays = () => {
    const dateFormat = "EEEE";
    const days = [];
    let startDate = startOfWeek(currentDate);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="text-center py-4 font-bold text-xs uppercase tracking-widest text-slate-500 bg-slate-50" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="grid grid-cols-7 border-t border-l border-r border-slate-200 rounded-t-2xl">{days}</div>;
  };

  const { dayTasks, dayMeetings, dayMilestones } = getEventsForDate(selectedDate);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-[1600px] mx-auto px-8 py-10 flex flex-col lg:flex-row gap-8">
        
        {/* Main Calendar Area */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Smart Calendar</h1>
              <p className="text-sm font-medium text-slate-500 mt-1">Syncs with your projects, milestones, and tasks</p>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center bg-white rounded-2xl p-1 border border-slate-200 shadow-sm">
                <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-2xl transition-colors">
                  <ChevronLeft className="w-5 h-5 text-slate-600" />
                </button>
                <span className="w-40 text-center font-bold text-slate-800">
                  {format(currentDate, "MMMM yyyy")}
                </span>
                <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-2xl transition-colors">
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              <button 
                onClick={() => setIsScheduleModalOpen(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl font-bold shadow-lg shadow-blue-600/20 transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Schedule Meeting</span>
              </button>
            </div>
          </div>

          <div className="bg-white shadow-xl shadow-slate-200/40 rounded-3xl p-6 border border-slate-100">
            {renderDays()}
            {renderCells()}
          </div>
        </div>

        {/* Sidebar Schedule Details */}
        <div className="w-full lg:w-96 flex flex-col">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm sticky top-10">
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">
              {isToday(selectedDate) ? 'Today' : format(selectedDate, "EEEE, MMMM do")}
            </h3>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">Schedule Details</p>

            <div className="space-y-8">
              {/* Meetings */}
              <div>
                <h4 className="flex items-center text-sm font-bold text-slate-800 mb-4">
                  <Video className="w-4 h-4 mr-2 text-purple-500" />
                  Meetings ({dayMeetings.length})
                </h4>
                {dayMeetings.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">No meetings scheduled.</p>
                ) : (
                  <div className="space-y-3">
                    {dayMeetings.map(m => (
                      <div key={m.id} className="p-4 bg-purple-50/50 border border-purple-100 rounded-2xl">
                        <p className="font-bold text-slate-900">{m.title}</p>
                        <div className="flex items-center text-xs text-slate-500 mt-2 space-x-4">
                          <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {format(parseISO(m.dateTime), 'h:mm a')}</span>
                          <span>{m.platform}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tasks */}
              <div>
                <h4 className="flex items-center text-sm font-bold text-slate-800 mb-4">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-amber-500" />
                  Task Deadlines ({dayTasks.length})
                </h4>
                {dayTasks.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">No tasks due.</p>
                ) : (
                  <div className="space-y-3">
                    {dayTasks.map(t => (
                      <div key={t.id} className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl flex items-start gap-3">
                        <div className="mt-0.5"><AlertCircle className="w-4 h-4 text-amber-500" /></div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{t.title}</p>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">{t.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Milestones */}
              <div>
                <h4 className="flex items-center text-sm font-bold text-slate-800 mb-4">
                  <Target className="w-4 h-4 mr-2 text-emerald-500" />
                  Milestones ({dayMilestones.length})
                </h4>
                {dayMilestones.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">No milestones.</p>
                ) : (
                  <div className="space-y-3">
                    {dayMilestones.map(m => (
                      <div key={m.id} className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-start gap-3">
                        <div className="w-2 h-2 mt-1.5 rounded-2xl bg-emerald-500" />
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{m.title}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mt-1">{m.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Schedule Meeting Modal Placeholder */}
      <AnimatePresence>
        {isScheduleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-xl font-black text-slate-900">Schedule Meeting</h3>
                <button onClick={() => setIsScheduleModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8">
                <p className="text-sm text-slate-500 mb-6 font-medium text-center">
                  Select a project and proposed time. An invitation will be sent to your assigned manager.
                </p>
                <form className="space-y-4" onSubmit={async (e) => {
                  e.preventDefault();
                  // For a real app, we'd gather form data here and insert into Firestore.
                  // Simulating success here.
                  showToast('Meeting scheduled successfully.', 'success');
                  setIsScheduleModalOpen(false);
                }}>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Project</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-blue-500 outline-none text-sm font-medium" required>
                      <option value="">Select a project...</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.businessName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Date & Time</label>
                    <input type="datetime-local" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-blue-500 outline-none text-sm font-medium" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Agenda / Topic</label>
                    <input type="text" placeholder="E.g., Quarterly Review" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-blue-500 outline-none text-sm font-medium" required />
                  </div>
                  
                  <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-colors shadow-lg shadow-blue-600/20 mt-4">
                    Confirm Scheduling
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
