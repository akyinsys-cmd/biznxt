import React from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  ShieldAlert, 
  Sparkles, 
  ArrowUpRight, 
  Clock, 
  CheckSquare, 
  Calendar,
  AlertTriangle,
  Lightbulb,
  Building2,
  FileText,
  CreditCard,
  History,
  TrendingUp,
  Target,
  ChevronDown,
  Globe
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, RadarProps, ResponsiveContainer } from 'recharts';
import { BusinessHealth, BusinessTask, CalendarEvent, BusinessDocument } from './types';
import BSMCard from '../../components/project/BSMCard';
import { Project, BSMDetails } from '../../types/project';

interface CommandCenterProps {
  health: BusinessHealth | null;
  tasks: BusinessTask[];
  events: CalendarEvent[];
  documents: BusinessDocument[];
  onTabChange: (tab: string) => void;
  project?: Project | null;
  bsm?: BSMDetails | null;
}

export function CommandCenter({ health, tasks, events, documents, onTabChange, project, bsm }: CommandCenterProps) {
  const pendingTasks = tasks.filter(t => t.status !== 'Completed');
  const criticalTasks = pendingTasks.filter(t => t.priority === 'Critical' || t.priority === 'High');
  const upcomingEvents = events.filter(e => new Date(e.dateTime).getTime() > Date.now());

  const radarData = [
    { subject: 'Compliance', A: health?.healthScore || 84, fullMark: 100 },
    { subject: 'Readiness', A: health?.readinessScore || 78, fullMark: 100 },
    { subject: 'Growth', A: health?.growthIndex || 72, fullMark: 100 },
    { subject: 'Strategy', A: 65, fullMark: 100 },
    { subject: 'Ops', A: 90, fullMark: 100 },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Hero Panel */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-white/10">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-2xl blur-3xl"></div>
        <div className="relative z-10 max-w-3xl">
          <span className="bg-indigo-500/25 text-indigo-300 text-[10px] font-black px-4 py-1.5 rounded-2xl border border-indigo-400/30 uppercase tracking-[0.2em]">
            Live Overview
          </span>
          <h1 className="text-4xl font-black font-display mt-4 tracking-tighter leading-tight">
            My Business Control Center
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-6">
            <button className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 transition-all group whitespace-nowrap">
              <div className="w-8 h-8 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                <Globe size={16} />
              </div>
              <div className="text-left">
                <p className="text-[8px] font-black text-indigo-300 uppercase tracking-widest whitespace-nowrap">Territory</p>
                <p className="text-[11px] font-black text-white uppercase tracking-wider whitespace-nowrap">India Operations</p>
              </div>
              <ChevronDown size={14} className="text-white/40 group-hover:text-white transition-colors ml-2" />
            </button>

            <button className="flex items-center gap-3 bg-slate-900/40 hover:bg-slate-900/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/5 transition-all group whitespace-nowrap">
              <div className="w-8 h-8 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Target size={16} />
              </div>
              <div className="text-left">
                <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest whitespace-nowrap">Active Project</p>
                <p className="text-[11px] font-black text-white uppercase tracking-wider whitespace-nowrap">{project?.title || 'Logistics Master'}</p>
              </div>
              <ChevronDown size={14} className="text-white/40 group-hover:text-white transition-colors ml-2" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Grid: Health Stats & BSM Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Health & Stats */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Health Score */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-2xl -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Health Score</p>
                  <p className="text-4xl font-black text-slate-900 mt-2 tracking-tighter">{health?.healthScore || 84}%</p>
                </div>
                <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600 border border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                  <Activity size={20} strokeWidth={2} />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] text-emerald-600 font-black uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-2xl bg-emerald-500 animate-pulse"></span> Excellent
                </span>
                <button onClick={() => onTabChange('ai')} className="text-[10px] text-slate-400 hover:text-primary font-black uppercase tracking-widest flex items-center gap-1">
                  Analyze <ArrowUpRight size={12} />
                </button>
              </div>
            </motion.div>

            {/* Readiness Index */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-2xl -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Readiness</p>
                  <p className="text-4xl font-black text-slate-900 mt-2 tracking-tighter">{health?.readinessScore || 78}%</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 border border-blue-100 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                  <Sparkles size={20} strokeWidth={2} />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] text-blue-600 font-black uppercase tracking-wider">
                  3/4 Verified
                </span>
                <button onClick={() => onTabChange('profile')} className="text-[10px] text-slate-400 hover:text-primary font-black uppercase tracking-widest flex items-center gap-1">
                  Profile <ArrowUpRight size={12} />
                </button>
              </div>
            </motion.div>

            {/* Growth Index */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-2xl -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth Index</p>
                  <p className="text-4xl font-black text-slate-900 mt-2 tracking-tighter">{health?.growthIndex || 72}%</p>
                </div>
                <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600 border border-indigo-100 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">
                  <ArrowUpRight size={20} strokeWidth={2} />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] text-indigo-600 font-black uppercase tracking-wider">
                  Active Trade
                </span>
                <button onClick={() => onTabChange('projects')} className="text-[10px] text-slate-400 hover:text-primary font-black uppercase tracking-widest flex items-center gap-1">
                  Projects <ArrowUpRight size={12} />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Growth Matrix Chart */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-900 flex items-center justify-center shadow-inner">
                  <Target size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 tracking-tight">Strategic Matrix</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Performance Analysis</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current</span>
                </div>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#f1f5f9" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} />
                  <Radar
                    name="Current"
                    dataKey="A"
                    stroke="#C1121F"
                    strokeWidth={2}
                    fill="#C1121F"
                    fillOpacity={0.1}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right: BSM Card */}
        <div className="lg:col-span-4">
          {bsm ? (
            <BSMCard bsm={bsm} project={project || null} onScheduleMeeting={() => onTabChange('calendar')} />
          ) : (
            <div className="bg-primary/5 rounded-3xl border border-dashed border-primary/20 p-8 text-center h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-lg mb-4">
                <ShieldAlert size={32} />
              </div>
              <h4 className="text-sm font-black text-slate-900 uppercase mb-2">Success Manager Pending</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">Your dedicated consultant will be assigned shortly after initial documentation review.</p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Alerts & Risk Log & Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Alerts */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-50 pb-3">
            <ShieldAlert className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-slate-800 font-display">Active Risk & Compliance Alerts</h3>
          </div>
          {health?.riskAlerts && health.riskAlerts.length > 0 ? (
            <div className="space-y-3">
              {health.riskAlerts.map((alert, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 rounded-2xl border text-sm flex items-start gap-3 ${
                    alert.type === 'High' 
                      ? 'bg-rose-50 border-primary/20 text-rose-800' 
                      : 'bg-amber-50 border-amber-100 text-amber-800'
                  }`}
                >
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold mr-1">[{alert.type} Severity]</span>
                    {alert.message}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-4">
                <ShieldAlert size={24} />
              </div>
              <p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-1">Status: Protected</p>
              <p className="text-[10px] font-bold text-slate-400 max-w-[200px]">No active compliance or system risks logged at this time.</p>
            </div>
          )}
        </div>

        {/* Growth Opportunities */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-50 pb-3">
            <Lightbulb className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-slate-800 font-display">Targeted Growth Opportunities</h3>
          </div>
          {health?.growthOpportunities && health.growthOpportunities.length > 0 ? (
            <div className="space-y-3">
              {health.growthOpportunities.map((opp, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-primary/5 border border-primary/10 text-sm text-slate-900 flex items-start gap-3">
                  <span className="bg-primary text-white rounded-2xl w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>{opp}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mb-4">
                <Lightbulb size={24} />
              </div>
              <p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-1">Matrix Calculating</p>
              <p className="text-[10px] font-bold text-slate-400 max-w-[200px]">Opportunity matrices are calculating. Keep business profile updated to trigger new insights.</p>
            </div>
          )}
        </div>
      </div>

      {/* 4. Critical Pending Items Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Critical Tasks */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-4 border-b border-slate-50 pb-3">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-slate-700" />
              <h3 className="font-bold text-slate-800 font-display">Critical Pending Operations</h3>
            </div>
            <button onClick={() => onTabChange('tasks')} className="text-xs text-primary font-semibold hover:underline">
              Task Manager
            </button>
          </div>
          {criticalTasks.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {criticalTasks.map((task) => (
                <div key={task.id} className="py-3 flex justify-between items-center gap-4 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{task.taskName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-mono text-slate-500">Due: {task.deadline}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-2xl font-bold uppercase ${
                        task.priority === 'Critical' 
                          ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-600">{task.progress}% Done</span>
                    <div className="w-20 bg-slate-100 h-1.5 rounded-2xl overflow-hidden mt-1">
                      <div className="bg-primary h-1.5" style={{ width: `${task.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-300">
                <CheckSquare size={32} />
              </div>
              <h4 className="text-sm font-black text-slate-900 uppercase mb-2">Backlog Clear</h4>
              <p className="text-xs text-slate-500 mb-6 font-medium">You've reached operational flow state. All critical tasks are handled.</p>
              <button 
                onClick={() => onTabChange('tasks')}
                className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:scale-105 transition-all"
              >
                Log New Task
              </button>
            </div>
          )}
        </div>

        {/* Upcoming Itinerary */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-4 border-b border-slate-50 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-slate-700" />
              <h3 className="font-bold text-slate-800 font-display">Upcoming Schedule</h3>
            </div>
            <button onClick={() => onTabChange('calendar')} className="text-xs text-indigo-600 font-semibold hover:underline">
              Calendar
            </button>
          </div>
          {upcomingEvents.length > 0 ? (
            <div className="space-y-3">
              {upcomingEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="p-3 bg-slate-50/75 border border-slate-100 rounded-2xl text-xs text-slate-700">
                  <p className="font-bold text-slate-900 truncate">{event.title}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(event.dateTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-200">
                <Calendar size={20} />
              </div>
              <p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-1">No Meetings</p>
              <button 
                onClick={() => onTabChange('calendar')}
                className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest mt-2"
              >
                Sync Calendar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
