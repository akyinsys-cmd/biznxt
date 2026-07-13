import { useState, useEffect, useMemo, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  FileText, 
  Calendar, 
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  Zap,
  MoreVertical,
  Paperclip,
  ArrowUpRight,
  Plus,
  Play,
  Briefcase,
  Calculator,
  Flag,
  History,
  Activity,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Project, ProjectTask, ProjectMilestone, ProjectRisk, ProjectActivity, CustomerDocument } from '../types/project';
import { db } from '../lib/firebase';
import { doc, onSnapshot, collection, query, where, orderBy, limit, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { PremiumDashboardSkeleton, SkeletonComponent } from '../components/SkeletonComponent';
import QuotationView from '../components/project/QuotationView';
import BSMControls from '../components/project/BSMControls';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { format } from 'date-fns';

// ============================================================================
// MEMOIZED SUB-COMPONENTS FOR PREVENTING REDUNDANT RE-RENDERS
// ============================================================================

const OverviewStatsSection = memo(({ progress, risksCount, activeTasksCount, budget }: {
  progress: number;
  risksCount: number;
  activeTasksCount: number;
  budget: number;
}) => {
  const stats = useMemo(() => [
    { label: 'Project Velocity', value: `${progress || 0}%`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-500/5' },
    { label: 'Structural Risks', value: risksCount || 0, icon: AlertCircle, color: 'text-primary', bg: 'bg-primary/5' },
    { label: 'Active Tasks', value: activeTasksCount || 0, icon: Clock, color: 'text-amber-700', bg: 'bg-amber-500/5' },
    { label: 'Allocated Capital', value: budget ? `₹${(budget / 1000).toFixed(0)}k` : 'TBD', icon: ShieldCheck, color: 'text-primary', bg: 'bg-primary/5' },
  ], [progress, risksCount, activeTasksCount, budget]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group"
        >
          <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-2xl blur-3xl -mr-12 -mt-12 opacity-50 group-hover:opacity-100 transition-opacity`} />
          <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] mb-4 relative z-10">{stat.label}</p>
          <div className="flex items-end justify-between relative z-10">
             <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
             <div className={`w-10 h-10 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                <stat.icon size={20} />
             </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
});

const TasksListSection = memo(({ tasks, isBSM, onUpdateStatus }: { tasks: ProjectTask[], isBSM: boolean, onUpdateStatus: (id: string, status: string) => void }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-24 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
        <p className="text-sm font-black text-slate-600 uppercase tracking-widest">Zero tasks defined for current sprint</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {tasks.map(task => (
        <div key={task.id} className="p-8 bg-white border border-slate-100 rounded-[2rem] hover:border-primary/20 transition-all group shadow-sm hover:shadow-xl hover:shadow-primary/5">
          <div className="flex items-start justify-between mb-6">
            <div className="flex gap-6">
              <button 
                onClick={() => isBSM && onUpdateStatus(task.id, task.status === 'Completed' ? 'Pending' : 'Completed')}
                disabled={!isBSM}
                className={`mt-1 w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  task.status === 'Completed' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-50 text-slate-600 border border-slate-100 hover:border-emerald-500'
                }`}
              >
                <CheckCircle2 size={24} />
              </button>
              <div>
                <h4 className="text-lg font-black text-slate-900 mb-2 group-hover:text-primary transition-colors tracking-tight">{task.title}</h4>
                <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-xl">{task.description}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded-2xl text-[9px] font-black uppercase tracking-[0.15em] mb-3 inline-block shadow-sm ${
                task.priority === 'High' || task.priority === 'Critical' ? 'bg-primary text-white shadow-primary/20' : 'bg-slate-800 text-white shadow-slate-800/10'
              }`}>
                {task.priority} Priority
              </span>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-700 justify-end tracking-widest">
                <Clock size={14} /> {task.deadline ? new Date(task.deadline).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase() : 'NOT SET'}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <div className="flex items-center gap-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-900 rounded-2xl flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-slate-900/20">
                  {task.assignedTo?.charAt(0)}
                </div>
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{task.assignedTo}</span>
              </div>
              <div className="flex items-center gap-4 w-48">
                <div className="flex-1 h-2 bg-slate-100 rounded-2xl overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${task.status === 'Completed' ? 100 : task.completionPercentage}%` }}
                    className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
                  />
                </div>
                <span className="text-[10px] font-black text-slate-900 tracking-tighter">{task.status === 'Completed' ? 100 : task.completionPercentage}%</span>
              </div>
            </div>
            {isBSM && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onUpdateStatus(task.id, 'Blocked')}
                  className="px-3 py-1 bg-rose-50 text-rose-600 rounded-2xl text-[9px] font-black uppercase hover:bg-rose-100"
                >
                  Block
                </button>
                <button className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all">
                  <MoreVertical size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
});

const MilestonesListSection = memo(({ milestones }: { milestones: ProjectMilestone[] }) => {
  if (milestones.length === 0) {
    return (
      <div className="text-center py-24 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
        <p className="text-sm font-black text-slate-600 uppercase tracking-widest">No strategic milestones established</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 py-4">
      {milestones.map((milestone, idx) => (
        <div key={milestone.id} className="relative pl-16">
          {idx !== milestones.length - 1 && (
            <div className="absolute left-[23px] top-10 bottom-[-40px] w-1 bg-slate-100 rounded-2xl" />
          )}
          <div className={`absolute left-0 top-0 w-12 h-12 rounded-[1.25rem] border-4 border-white shadow-xl flex items-center justify-center z-10 ${
            milestone.status === 'Completed' ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-white'
          }`}>
            <Flag size={20} />
          </div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex items-center justify-between group hover:border-primary/20 transition-all"
          >
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h4 className="text-lg font-black text-slate-900 tracking-tight">{milestone.title}</h4>
                {milestone.isPaymentMilestone && (
                  <span className="px-3 py-1 bg-amber-500 text-white text-[9px] font-black rounded-2xl uppercase tracking-widest shadow-lg shadow-amber-500/20">Financial Target</span>
                )}
              </div>
              <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">
                TARGET COMPLETION: {milestone.expectedDate ? new Date(milestone.expectedDate).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase() : 'PENDING SCHEDULE'}
              </p>
            </div>
            <div className="flex items-center gap-6">
              {milestone.status === 'Completed' ? (
                <div className="flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-700 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                  <CheckCircle2 size={16} /> Verified
                </div>
              ) : (
                <button className="px-8 py-3 bg-slate-900 text-white text-[10px] font-black rounded-2xl uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:scale-105 transition-all">Authenticate Milestone</button>
              )}
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  );
});

const DocumentsListSection = memo(({ documents, isBSM, onUpdateStatus }: { documents: CustomerDocument[], isBSM: boolean, onUpdateStatus: (id: string, status: CustomerDocument['status']) => void }) => {
  if (documents.length === 0) {
    return (
      <div className="grid grid-cols-1 text-center py-24 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
        <p className="text-sm font-black text-slate-600 uppercase tracking-widest">Vault is currently empty</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {documents.map(doc => (
        <div key={doc.id} className="p-6 bg-white border border-slate-100 rounded-[2rem] flex flex-col gap-5 hover:border-primary/20 transition-all cursor-pointer group shadow-sm hover:shadow-xl hover:shadow-primary/5">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 group-hover:text-primary group-hover:bg-primary/5 transition-all">
              <FileText size={32} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-black text-slate-900 truncate tracking-tight mb-1">{doc.name}</h4>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                  doc.status === 'Approved' ? 'bg-emerald-500 text-white' : 
                  doc.status === 'Rejected' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {doc.status}
                </span>
                <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{doc.type}</p>
              </div>
            </div>
            <button 
              onClick={() => doc.url && window.open(doc.url)}
              className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all"
            >
              <ArrowUpRight size={20} />
            </button>
          </div>

          {isBSM && doc.status === 'Under Review' && (
            <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
              <button 
                onClick={() => onUpdateStatus(doc.id, 'Approved')}
                className="flex-1 py-3 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={14} /> Approve
              </button>
              <button 
                onClick={() => onUpdateStatus(doc.id, 'Rejected')}
                className="flex-1 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                <XCircle size={14} /> Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
});

const ActivityLogSection = memo(({ activities }: { activities: ProjectActivity[] }) => {
  if (activities.length === 0) {
    return (
      <div className="text-center py-24 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
        <p className="text-sm font-black text-slate-600 uppercase tracking-widest">Zero activity nodes recorded</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {activities.map((activity, i) => (
        <div key={activity.id} className="flex gap-6 relative">
          {i !== activities.length - 1 && (
            <div className="absolute left-6 top-12 bottom-[-32px] w-0.5 bg-slate-100" />
          )}
          <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 shadow-sm relative z-10">
            {activity.type === 'Task' && <CheckCircle2 size={18} className="text-emerald-500" />}
            {activity.type === 'Meeting' && <Calendar size={18} className="text-blue-500" />}
            {activity.type === 'Document' && <FileText size={18} className="text-primary" />}
            {activity.type === 'Timeline' && <Zap size={18} className="text-amber-500" />}
            {activity.type === 'System' && <ShieldCheck size={18} className="text-slate-900" />}
          </div>
          <div className="pt-1">
            <p className="text-sm font-black text-slate-900 tracking-tight">
              {activity.actorName} <span className="text-slate-500 font-medium">{activity.description}</span>
            </p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
              {activity.timestamp ? format(activity.timestamp.toDate(), 'MMM dd, HH:mm') : 'JUST NOW'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
});

const RisksListSection = memo(({ risks }: { risks: ProjectRisk[] }) => {
  if (risks.length === 0) {
    return (
      <div className="text-center py-24 bg-emerald-50/30 rounded-[2rem] border border-dashed border-emerald-200">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-500 shadow-xl shadow-emerald-500/10">
          <ShieldCheck size={32} />
        </div>
        <p className="text-sm font-black text-emerald-700 uppercase tracking-widest">Structural Integrity Optimal • Zero Risks Detected</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {risks.map(risk => (
        <div key={risk.id} className="p-8 bg-rose-50/50 border border-primary/20 rounded-[2.5rem] flex items-center justify-between group transition-all hover:bg-rose-50">
          <div className="flex gap-6">
            <div className="w-14 h-14 bg-white text-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/10 border border-primary/20">
              <AlertCircle size={28} />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-900 tracking-tight mb-2 uppercase">{risk.type} Anomaly</h4>
              <p className="text-sm text-slate-800 font-medium max-w-xl leading-relaxed">{risk.description}</p>
            </div>
          </div>
          <div className="text-right">
             <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${
                risk.level === 'High' ? 'bg-primary text-white shadow-primary/30' : 'bg-rose-100 text-[#111827] shadow-rose-100/30'
             }`}>
                {risk.level} Criticality
             </span>
          </div>
        </div>
      ))}
    </div>
  );
});

const TeamListSection = memo(({ team }: { team: Project['team'] }) => {
  return (
    <div className="space-y-6">
      {(team || []).map(member => (
        <div key={member.id} className="flex items-center justify-between group cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={member.avatar} alt="" className="w-12 h-12 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform animate-in fade-in" referrerPolicy="no-referrer" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-white rounded-2xl" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors tracking-tight">{member.name}</h4>
              <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{member.role}</p>
            </div>
          </div>
          <button className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-600 rounded-2xl hover:text-primary hover:bg-primary/5 transition-all border border-slate-100">
            <MessageSquare size={18} />
          </button>
        </div>
      ))}
    </div>
  );
});

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function ProjectDashboard() {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
  const [risks, setRisks] = useState<ProjectRisk[]>([]);
  const [documents, setDocuments] = useState<CustomerDocument[]>([]);
  const [activities, setActivities] = useState<ProjectActivity[]>([]);
  const [activeSection, setActiveSection] = useState<'tasks' | 'milestones' | 'documents' | 'risks' | 'quotation' | 'activity'>('tasks');
  const [loading, setLoading] = useState(true);
  const [timeoutError, setTimeoutError] = useState(false);

  const isBSM = user?.role === 'bsm' || user?.role === 'admin' || user?.role === 'superadmin';

  const logActivity = async (type: ProjectActivity['type'], description: string) => {
    if (!id || !user) return;
    try {
      await addDoc(collection(db, 'project_activities'), {
        projectId: id,
        type,
        description,
        actorId: user.uid,
        actorName: user.displayName || 'System',
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.error('Activity log failure', err);
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'project_tasks', taskId), { 
        status,
        completionPercentage: status === 'Completed' ? 100 : undefined
      });
      if (status === 'Completed') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      const task = tasks.find(t => t.id === taskId);
      logActivity('Task', `marked task "${task?.title}" as ${status}`);
      showToast(`Task status updated to ${status}`, 'success');
    } catch (err) {
      showToast('Failed to update task', 'error');
    }
  };

  const handleUpdateDocStatus = async (docId: string, status: CustomerDocument['status']) => {
    try {
      await updateDoc(doc(db, 'customer_documents', docId), { status });
      const document = documents.find(d => d.id === docId);
      logActivity('Document', `${status} document: ${document?.name}`);
      showToast(`Document ${status}`, 'success');
    } catch (err) {
      showToast('Failed to update document', 'error');
    }
  };

  const handleAdvanceStage = async (nextStage: Project['currentTimelineStep']) => {
    if (!id || !project) return;
    try {
      await updateDoc(doc(db, 'client_projects', id), { currentTimelineStep: nextStage });
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6']
      });
      logActivity('Timeline', `advanced project to ${nextStage} stage`);
      showToast(`Project advanced to ${nextStage}`, 'success');
    } catch (err) {
      showToast('Failed to advance stage', 'error');
    }
  };

  // High performance single mount data fetching subscription
  useEffect(() => {
    if (!id) return;
    let active = true;

    // 1. Sync Project Base Data
    const unsubProject = onSnapshot(doc(db, 'client_projects', id), (docSnap) => {
      if (active) {
        if (docSnap.exists()) {
          const data = docSnap.data() as Project;
          setProject({ id: docSnap.id, ...data });
          if (data.status === 'Quotation Pending') {
            setActiveSection('quotation');
          }
        }
        setLoading(false);
      }
    });

    // 2. Sync Tasks
    const qTasks = query(collection(db, 'project_tasks'), where('projectId', '==', id), orderBy('createdAt', 'desc'));
    const unsubTasks = onSnapshot(qTasks, (snap) => {
      if (active) {
        setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() } as ProjectTask)));
      }
    });

    // 3. Sync Milestones
    const qMilestones = query(collection(db, 'project_milestones'), where('projectId', '==', id));
    const unsubMilestones = onSnapshot(qMilestones, (snap) => {
      if (active) {
        setMilestones(snap.docs.map(d => ({ id: d.id, ...d.data() } as ProjectMilestone)));
      }
    });

    // 4. Sync Risks
    const qRisks = query(collection(db, 'project_risks'), where('projectId', '==', id));
    const unsubRisks = onSnapshot(qRisks, (snap) => {
      if (active) {
        setRisks(snap.docs.map(d => ({ id: d.id, ...d.data() } as ProjectRisk)));
      }
    });

    // 5. Sync Documents
    const qDocs = query(collection(db, 'customer_documents'), where('projectId', '==', id));
    const unsubDocs = onSnapshot(qDocs, (snap) => {
      if (active) {
        setDocuments(snap.docs.map(d => ({ id: d.id, ...d.data() } as CustomerDocument)));
      }
    });

    // 6. Sync Activities
    const qActivities = query(collection(db, 'project_activities'), where('projectId', '==', id), orderBy('timestamp', 'desc'), limit(20));
    const unsubActivities = onSnapshot(qActivities, (snap) => {
      if (active) {
        setActivities(snap.docs.map(d => ({ id: d.id, ...d.data() } as ProjectActivity)));
      }
    });

    const fallbackTimer = setTimeout(() => {
      if (active && loading) {
        setLoading(false);
        setTimeoutError(true);
      }
    }, 10000);

    return () => {
      active = false;
      clearTimeout(fallbackTimer);
      unsubProject();
      unsubTasks();
      unsubMilestones();
      unsubRisks();
      unsubDocs();
      unsubActivities();
    };
  }, [id, loading]);

  // Compute calculated values with useMemo to guard against redundant list computations
  const activeTasksCount = useMemo(() => tasks.filter(t => t.status !== 'Completed').length, [tasks]);
  const risksCount = useMemo(() => risks.length, [risks]);
  const velocityProgress = useMemo(() => project?.progress ?? 0, [project]);
  const allocatedCapital = useMemo(() => project?.budget ?? 0, [project]);

  if (loading) return (
    <div className="min-h-screen bg-[#F1F5F9] pb-12">
      <div className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-20">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <SkeletonComponent className="w-48 h-8 rounded-2xl" />
          </div>
        </div>
      </div>
      <div className="max-w-[1600px] mx-auto px-8 py-6">
        <PremiumDashboardSkeleton />
      </div>
    </div>
  );

  if (timeoutError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F1F5F9]">
        <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-2xl flex items-center justify-center mb-6">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Connection Timeout</h2>
        <p className="text-slate-500 mb-8 max-w-md text-center font-medium">
          We were unable to load the project dashboard within the expected timeframe. Please check your network and try again.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (!project) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F1F5F9] p-8 text-center">
      <AlertCircle size={48} className="text-primary mb-4" />
      <h2 className="text-xl font-black text-slate-900 mb-2">Project Execution Node Not Found</h2>
      <p className="text-sm text-slate-700 mb-6 font-medium">The requested project identifier does not match any active enterprise records.</p>
      <button 
        onClick={() => navigate('/projects')}
        className="px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl text-xs uppercase tracking-widest"
      >
        Return to Project Hub
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header */}
      <div className="bg-white/80 backdrop-blur-[30px] border-b border-slate-200/50 px-8 py-6 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => navigate('/projects')}
              className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-600 hover:text-slate-900 rounded-2xl transition-all border border-slate-100"
            >
              <ArrowLeft size={22} />
            </button>
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-black text-slate-900 tracking-tighter">{project.title || project.businessName || 'Untitled Project'}</h1>
                <span className={`px-3 py-1 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${
                  project.status === 'Active' ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 
                  project.status === 'Quotation Pending' ? 'bg-amber-500 text-white shadow-amber-500/20' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {project.status}
                </span>
              </div>
              <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] mt-1">
                EXECUTION NODE: {project.id} • {project.type || 'Business Launch'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="h-12 px-8 bg-primary text-white text-[10px] font-black rounded-2xl shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 uppercase tracking-widest">
              <Plus size={18} />
              Initialize Task
            </button>
            <button className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-slate-900 transition-all shadow-sm">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-8 py-10">
        <div className="grid grid-cols-12 gap-10">
          
          {/* Left Column - Main Details */}
          <div className="col-span-12 lg:col-span-8 space-y-10">
            
            {/* Overview Cards */}
            <OverviewStatsSection 
              progress={velocityProgress}
              risksCount={risksCount}
              activeTasksCount={activeTasksCount}
              budget={allocatedCapital}
            />

            {/* Main Project Board */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
              <div className="px-10 py-8 border-b border-slate-100 flex items-center gap-10 bg-slate-50/30 overflow-x-auto whitespace-nowrap scrollbar-hide">
                {[
                  { id: 'tasks', label: 'Execution Board', icon: CheckCircle2 },
                  { id: 'quotation', label: 'Launch Quote', icon: Calculator },
                  { id: 'milestones', label: 'Strategic Milestones', icon: Flag },
                  { id: 'documents', label: 'Asset Vault', icon: FileText },
                  { id: 'activity', label: 'Timeline History', icon: Activity },
                  { id: 'risks', label: 'Risk Intelligence', icon: AlertCircle },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id as any)}
                    className={`py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative flex items-center gap-3 ${
                      activeSection === tab.id ? 'text-primary' : 'text-slate-700 hover:text-slate-950'
                    }`}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                    {activeSection === tab.id && (
                      <motion.div layoutId="projectTab" className="absolute bottom-[-32px] left-0 right-0 h-1.5 bg-primary rounded-t-full shadow-[0_-4px_10px_rgba(193,18,31,0.3)]" />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-10">
                <AnimatePresence mode="wait">
                  {activeSection === 'quotation' && (
                    <motion.div key="quotation" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <QuotationView projectId={project.id} onAccepted={() => setActiveSection('tasks')} />
                    </motion.div>
                  )}
                  {activeSection === 'tasks' && (
                    <motion.div 
                      key="tasks"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <TasksListSection 
                        tasks={tasks} 
                        isBSM={isBSM} 
                        onUpdateStatus={handleUpdateTaskStatus} 
                      />
                    </motion.div>
                  )}

                  {activeSection === 'milestones' && (
                    <motion.div 
                      key="milestones"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <MilestonesListSection milestones={milestones} />
                    </motion.div>
                  )}

                  {activeSection === 'documents' && (
                    <motion.div 
                      key="documents"
                    >
                      <DocumentsListSection 
                        documents={documents} 
                        isBSM={isBSM}
                        onUpdateStatus={handleUpdateDocStatus}
                      />
                    </motion.div>
                  )}

                  {activeSection === 'activity' && (
                    <motion.div key="activity">
                      <ActivityLogSection activities={activities} />
                    </motion.div>
                  )}

                  {activeSection === 'risks' && (
                    <motion.div 
                      key="risks"
                    >
                      <RisksListSection risks={risks} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Column - Team & AI */}
          <div className="col-span-12 lg:col-span-4 space-y-10">
            
            {isBSM && project && (
              <BSMControls 
                project={project} 
                onUpdate={() => {}} 
                onAdvanceStage={handleAdvanceStage}
              />
            )}

            {/* AI Insights Card */}
            <div className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-900/40">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/30 rounded-2xl blur-[100px] -mr-24 -mt-24" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/20 rounded-2xl blur-[80px] -ml-16 -mb-16" />
              
              <div className="flex items-center gap-4 mb-10 relative z-10">
                <div className="w-12 h-12 bg-primary rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-primary/40">
                  <Zap size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">AI Copilot</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Predictive Engine v4.0</p>
                </div>
              </div>

              <div className="space-y-6 relative z-10">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-colors"
                >
                  <h4 className="text-[10px] font-black text-primary uppercase mb-3 tracking-[0.2em]">Strategy Insight</h4>
                  <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    Based on your industry ({project.businessCategory || 'Selected'}), we recommend prioritizing <span className="text-white font-black">Trademark Protection</span> before public beta.
                  </p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-colors"
                >
                  <h4 className="text-[10px] font-black text-emerald-400 uppercase mb-3 tracking-[0.2em]">Efficiency Protocol</h4>
                  <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    Integrated GST & MSME filing can reduce total onboarding timeline by <span className="text-white font-black">48 hours</span>.
                  </p>
                </motion.div>
              </div>

              <button className="w-full mt-10 py-5 bg-primary text-white font-black rounded-2xl text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]">
                Generate Strategic Overview
              </button>
            </div>

            {/* Project Team */}
            <div className="bg-white rounded-3xl border border-slate-100 p-10 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Project Node Network</h3>
                <span className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 border border-slate-100">
                  <Users size={18} />
                </span>
              </div>
              <TeamListSection team={project.team} />
              
              {(!project.team || project.team.length === 0) && (
                <div className="text-center py-6">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network assignment pending acceptance</p>
                </div>
              )}

              <div className="mt-10 pt-10 border-t border-slate-100">
                <button className="w-full py-5 bg-slate-50 text-slate-900 font-black rounded-[1.5rem] text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-3 border border-slate-100">
                  <Plus size={18} />
                  Add Execution Resource
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
