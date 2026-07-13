import { useState, useEffect } from 'react';
import { 
  CheckCircle2, AlertCircle, Clock, FileText, DollarSign, 
  Briefcase, Calendar, MessageSquare, ArrowUpRight 
} from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { Project, ProjectTask, ProjectMeeting } from '../../types/project';
import { format } from 'date-fns';

export function BSMOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    assignedCustomers: 0,
    projectsInProgress: 0,
    completedProjects: 0,
    pendingDocuments: 0,
    pendingResearch: 0,
    pendingQuotations: 0,
    pendingPayments: 0,
  });

  const [todayTasks, setTodayTasks] = useState<ProjectTask[]>([]);
  const [todayMeetings, setTodayMeetings] = useState<ProjectMeeting[]>([]);

  useEffect(() => {
    if (!user) return;
    const active = true;

    // Fetch projects to calculate stats
    const unsubProjects = onSnapshot(query(collection(db, 'client_projects'), where('bsmId', '==', user.uid)), (snap) => {
      let inProgress = 0;
      let completed = 0;
      let pendingDocs = 0;
      let pendingResearch = 0;
      let pendingQuotes = 0;

      snap.docs.forEach(doc => {
        const p = doc.data() as Project;
        if (p.status === 'Completed') completed++;
        else if (p.status === 'Active') inProgress++;
        else if (p.status === 'Quotation Pending') pendingQuotes++;

        if (p.currentTimelineStep === 'Documentation') pendingDocs++;
        if (p.currentTimelineStep === 'Research') pendingResearch++;
      });

      setStats(s => ({
        ...s,
        assignedCustomers: snap.size,
        projectsInProgress: inProgress,
        completedProjects: completed,
        pendingDocuments: pendingDocs,
        pendingResearch: pendingResearch,
        pendingQuotations: pendingQuotes,
      }));
    });

    // Today's Tasks
    const unsubTasks = onSnapshot(query(
      collection(db, 'project_tasks'),
      where('assignedTo', '==', user.uid),
      where('status', '!=', 'Completed')
    ), (snap) => {
      const tasks = snap.docs.map(d => ({ id: d.id, ...d.data() } as ProjectTask));
      setTodayTasks(tasks);
    });

    // Today's Meetings
    const unsubMeetings = onSnapshot(query(
      collection(db, 'project_meetings'),
      where('bsmId', '==', user.uid),
      where('status', '==', 'Scheduled')
    ), (snap) => {
      const meetings = snap.docs.map(d => ({ id: d.id, ...d.data() } as ProjectMeeting));
      setTodayMeetings(meetings);
    });

    return () => {
      unsubProjects();
      unsubTasks();
      unsubMeetings();
    };
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Assigned Customers" value={stats.assignedCustomers} icon={Briefcase} color="text-blue-500" bg="bg-blue-50" />
        <StatCard title="Projects In Progress" value={stats.projectsInProgress} icon={ArrowUpRight} color="text-emerald-500" bg="bg-emerald-50" />
        <StatCard title="Completed Projects" value={stats.completedProjects} icon={CheckCircle2} color="text-purple-500" bg="bg-purple-50" />
        <StatCard title="Pending Payments" value={stats.pendingPayments} icon={DollarSign} color="text-amber-500" bg="bg-amber-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm col-span-2">
          <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6">Action Required</h3>
          <div className="grid grid-cols-2 gap-4">
            <ActionCard title="Pending Research" count={stats.pendingResearch} icon={FileText} color="text-indigo-500" />
            <ActionCard title="Pending Quotations" count={stats.pendingQuotations} icon={DollarSign} color="text-emerald-500" />
            <ActionCard title="Pending Documents" count={stats.pendingDocuments} icon={FileText} color="text-amber-500" />
            <ActionCard title="Pending Tasks" count={todayTasks.length} icon={CheckCircle2} color="text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Today's Schedule</h3>
            <Calendar className="text-slate-400" size={20} />
          </div>
          <div className="space-y-4">
            {todayMeetings.length === 0 ? (
              <p className="text-sm font-bold text-slate-500 text-center py-4">No meetings scheduled for today.</p>
            ) : (
              todayMeetings.map(m => (
                <div key={m.id} className="flex gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex-shrink-0 text-center">
                    <p className="text-xs font-black text-primary uppercase">{format(new Date(m.dateTime), 'hh:mm a')}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">{m.title}</h4>
                    <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1 mt-1">
                      {m.platform}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col group hover:border-primary/30 transition-all">
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${bg} ${color} mb-4 group-hover:scale-110 transition-transform`}>
        <Icon size={20} />
      </div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</p>
      <h4 className="text-2xl font-black text-slate-900 mt-1">{value}</h4>
    </div>
  );
}

function ActionCard({ title, count, icon: Icon, color }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer group">
      <div className="flex items-center gap-3">
        <Icon size={18} className={color} />
        <span className="text-sm font-bold text-slate-700">{title}</span>
      </div>
      <span className="w-8 h-8 flex items-center justify-center bg-white rounded-2xl text-sm font-black text-slate-900 shadow-sm group-hover:scale-110 transition-transform">{count}</span>
    </div>
  );
}
