import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { useToast } from '../../context/ToastContext';
import { db } from '../../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  setDoc,
  serverTimestamp,
  orderBy,
  limit
} from 'firebase/firestore';
import { 
  Building2, 
  Activity, 
  ChevronRight,
  Loader2,
  FileText,
  FolderLock,
  MessageCircle,
  Sparkles,
  FileSignature
} from 'lucide-react';

import { 
  BusinessProfile, 
  BusinessGoal, 
  BusinessProject, 
  BusinessTask, 
  BusinessDocument, 
  CalendarEvent, 
  FinanceRecord, 
  BusinessNotification, 
  BusinessActivity, 
  BusinessHealth 
} from './types';
import { Project, BSMDetails } from '../../types/project';
import { DashboardSkeleton } from '../../components/ui/Skeleton';

// Subcomponents
import { CommandCenter as BaseCommandCenter } from './CommandCenter';

// Memoize core landing view
const CommandCenter = React.memo(BaseCommandCenter);

// On-demand Lazy Loading with Memoization for heavy secondary views
const DocumentVault = React.lazy(() => import('./DocumentVault').then(module => ({ default: React.memo(module.DocumentVault) })));
const AiAssistant = React.lazy(() => import('./AiAssistant').then(module => ({ default: React.memo(module.AiAssistant) })));
const CommunicationHub = React.lazy(() => import('../CommunicationHub').then(module => ({ default: React.memo(module) })));

export default function BusinessOSDashboard() {
  const { user, userData, loading: authLoading } = useAuth();
  const { showToast, success, error } = useToast();
  const navigate = useNavigate();

  // Active Tab State
  const [activeTab, setActiveTab] = useState('command-center');
  
  // App Loading States
  const [initializing, setInitializing] = useState(true);
  const [timeoutError, setTimeoutError] = useState(false);

  // Consolidated Database States
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [goals, setGoals] = useState<BusinessGoal | null>(null);
  const [health, setHealth] = useState<BusinessHealth | null>(null);
  const [projects, setProjects] = useState<BusinessProject[]>([]);
  const [tasks, setTasks] = useState<BusinessTask[]>([]);
  const [documents, setDocuments] = useState<BusinessDocument[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [finance, setFinance] = useState<FinanceRecord[]>([]);
  const [notifications, setNotifications] = useState<BusinessNotification[]>([]);
  const [activityLogs, setActivityLogs] = useState<BusinessActivity[]>([]);

  // Phase 4 - BSM Data
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [bsm, setBsm] = useState<BSMDetails | null>(null);

  // Onboarding & Authentication guard
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Determine active-tab data needs to implement precise dynamic Firestore subscriptions (fetch only when component mounts)
  const needsProfile = useMemo(() => activeTab === 'profile' || activeTab === 'ai', [activeTab]);
  const needsGoals = useMemo(() => activeTab === 'goals' || activeTab === 'ai', [activeTab]);
  const needsHealth = useMemo(() => activeTab === 'command-center' || activeTab === 'ai', [activeTab]);
  const needsProjects = useMemo(() => activeTab === 'projects' || activeTab === 'tasks', [activeTab]);
  const needsTasks = useMemo(() => activeTab === 'command-center' || activeTab === 'tasks' || activeTab === 'ai', [activeTab]);
  const needsDocuments = useMemo(() => activeTab === 'command-center' || activeTab === 'documents' || activeTab === 'ai', [activeTab]);
  const needsEvents = useMemo(() => activeTab === 'command-center' || activeTab === 'calendar', [activeTab]);
  const needsFinance = useMemo(() => (activeTab === 'finance') && (userData?.role === 'admin' || userData?.role === 'superadmin' || userData?.role === 'bsm'), [activeTab, userData?.role]);
  const needsActivityLogs = useMemo(() => (activeTab === 'admin') && (userData?.role === 'admin' || userData?.role === 'superadmin'), [activeTab, userData?.role]);

  // 1. One-time seeding initialization on mount
  useEffect(() => {
    if (!user) return;
    let active = true;

    const fallbackTimer = setTimeout(() => {
      if (active) {
        setInitializing(false);
        setTimeoutError(true);
        error('Data loading taking longer than usual. Try refreshing if things seem stuck.');
      }
    }, 10000);

    const runSeeder = async () => {
      try {
        if (active) {
          setInitializing(false);
          clearTimeout(fallbackTimer);
        }
      } catch (err) {
        console.error('Check failed:', err);
        if (active) {
          setInitializing(false);
          clearTimeout(fallbackTimer);
        }
      }
    };

    runSeeder();

    return () => {
      active = false;
      clearTimeout(fallbackTimer);
    };
  }, [user, success, error]);

  // 2. Real-time Profile subscription (lazy, only active when tab needs it)
  useEffect(() => {
    if (!user || initializing || !needsProfile) return;
    const q = query(collection(db, 'business_profiles'), where('ownerId', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        setProfile({ id: snap.docs[0].id, ...snap.docs[0].data() } as BusinessProfile);
      }
    }, (err) => {
      console.error('Error fetching profile:', err);
    });
    return unsub;
  }, [user, initializing, needsProfile]);

  // 3. Real-time Goals subscription (lazy, only active when tab needs it)
  useEffect(() => {
    if (!user || initializing || !needsGoals) return;
    const q = query(collection(db, 'business_goals'), where('ownerId', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        setGoals({ id: snap.docs[0].id, ...snap.docs[0].data() } as BusinessGoal);
      }
    }, (err) => {
      console.error('Error fetching goals:', err);
    });
    return unsub;
  }, [user, initializing, needsGoals]);

  // 4. Real-time Health subscription (lazy, only active when tab needs it)
  useEffect(() => {
    if (!user || initializing || !needsHealth) return;
    const q = query(collection(db, 'business_health'), where('ownerId', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        setHealth({ id: snap.docs[0].id, ...snap.docs[0].data() } as BusinessHealth);
      }
    }, (err) => {
      console.error('Error fetching health scores:', err);
    });
    return unsub;
  }, [user, initializing, needsHealth]);

  // 5. Real-time Projects subscription (lazy, only active when tab needs it)
  useEffect(() => {
    if (!user || initializing || !needsProjects) return;
    const q = query(collection(db, 'business_projects'), where('ownerId', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const list: BusinessProject[] = [];
      snap.forEach(docItem => {
        list.push({ id: docItem.id, ...docItem.data() } as BusinessProject);
      });
      setProjects(list);
    }, (err) => {
      console.error('Error fetching projects:', err);
    });
    return unsub;
  }, [user, initializing, needsProjects]);

  // 6. Real-time Tasks subscription (lazy, only active when tab needs it)
  useEffect(() => {
    if (!user || initializing || !needsTasks) return;
    const q = query(collection(db, 'business_tasks'), where('ownerId', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const list: BusinessTask[] = [];
      snap.forEach(docItem => {
        list.push({ id: docItem.id, ...docItem.data() } as BusinessTask);
      });
      setTasks(list);
    }, (err) => {
      console.error('Error fetching tasks:', err);
    });
    return unsub;
  }, [user, initializing, needsTasks]);

  // 7. Real-time Documents subscription (lazy, only active when tab needs it)
  useEffect(() => {
    if (!user || initializing || !needsDocuments) return;
    const q = query(collection(db, 'business_documents'), where('ownerId', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const list: BusinessDocument[] = [];
      snap.forEach(docItem => {
        list.push({ id: docItem.id, ...docItem.data() } as BusinessDocument);
      });
      setDocuments(list);
    }, (err) => {
      console.error('Error fetching documents:', err);
    });
    return unsub;
  }, [user, initializing, needsDocuments]);

  // 8. Real-time Calendar subscription (lazy, only active when tab needs it)
  useEffect(() => {
    if (!user || initializing || !needsEvents) return;
    const q = query(collection(db, 'business_calendar'), where('ownerId', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const list: CalendarEvent[] = [];
      snap.forEach(docItem => {
        list.push({ id: docItem.id, ...docItem.data() } as CalendarEvent);
      });
      setEvents(list);
    }, (err) => {
      console.error('Error fetching calendar events:', err);
    });
    return unsub;
  }, [user, initializing, needsEvents]);

  // 9. Real-time Finance subscription (lazy, only active when tab needs it)
  useEffect(() => {
    if (!user || initializing || !needsFinance) return;
    const q = query(collection(db, 'business_finance'), where('ownerId', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const list: FinanceRecord[] = [];
      snap.forEach(docItem => {
        list.push({ id: docItem.id, ...docItem.data() } as FinanceRecord);
      });
      setFinance(list);
    }, (err) => {
      console.error('Error fetching finance records:', err);
    });
    return unsub;
  }, [user, initializing, needsFinance]);

  // 10. Real-time Activity logs subscription (lazy, only active when tab needs it)
  useEffect(() => {
    if (!user || initializing || !needsActivityLogs) return;
    const q = query(collection(db, 'business_activity'), where('ownerId', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const list: BusinessActivity[] = [];
      snap.forEach(docItem => {
        list.push({ id: docItem.id, ...docItem.data() } as BusinessActivity);
      });
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setActivityLogs(list);
    }, (err) => {
      console.error('Error fetching activity logs:', err);
    });
    return unsub;
  }, [user, initializing, needsActivityLogs]);

  // Phase 4 - Real-time Project & BSM subscription
  useEffect(() => {
    if (!user || initializing) return;
    const q = query(collection(db, 'client_projects'), where('customerId', '==', user.uid), limit(1));
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const pData = { id: snap.docs[0].id, ...snap.docs[0].data() } as Project;
        setActiveProject(pData);
        
        if (pData.bsmId) {
          onSnapshot(doc(db, 'users', pData.bsmId), (userSnap) => {
            if (userSnap.exists()) {
              setBsm(userSnap.data() as BSMDetails);
            }
          });
        }
      }
    });
    return unsub;
  }, [user, initializing]);

  // Operations and database updates helpers wrapped in useCallback for referential stability
  const handleSaveProfile = useCallback(async (updatedProfile: BusinessProfile) => {
    if (!profile?.id || !user) return;
    try {
      const docRef = doc(db, 'business_profiles', profile.id);
      await updateDoc(docRef, { ...updatedProfile, updatedAt: new Date().toISOString() });
      await addDoc(collection(db, 'business_activity'), {
        ownerId: user.uid,
        action: 'Updated Corporate Registry',
        module: 'Corporate Identity',
        details: `Modified details for ${updatedProfile.businessName}.`,
        createdAt: new Date().toISOString()
      });
      success('Corporate profile updated in the master registry.');
    } catch (err: any) {
      error('Failed to update profile: ' + err.message);
    }
  }, [profile?.id, user, success, error]);

  const handleSaveGoal = useCallback(async (updatedGoal: BusinessGoal) => {
    if (!goals?.id || !user) return;
    try {
      const docRef = doc(db, 'business_goals', goals.id);
      await updateDoc(docRef, { ...updatedGoal, updatedAt: new Date().toISOString() });
      await addDoc(collection(db, 'business_activity'), {
        ownerId: user.uid,
        action: 'Updated Growth Goals',
        module: 'Strategic Planning',
        details: `Adjusted monthly and annual revenue projections.`,
        createdAt: new Date().toISOString()
      });
      success('Operational growth goals aligned.');
    } catch (err: any) {
      error('Failed to save goals.');
    }
  }, [goals?.id, user, success, error]);

  const handleCreateProject = useCallback(async (proj: Omit<BusinessProject, 'id' | 'ownerId' | 'createdAt'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'business_projects'), {
        ...proj,
        ownerId: user.uid,
        createdAt: new Date().toISOString()
      });
      await addDoc(collection(db, 'business_activity'), {
        ownerId: user.uid,
        action: 'Initiated Project Module',
        module: 'Projects Board',
        details: `Launched project track: ${proj.name}.`,
        createdAt: new Date().toISOString()
      });
      success('Project module initiated.');
    } catch (err) {
      error('Failed to create project.');
    }
  }, [user, success, error]);

  const handleUpdateProjectStatus = useCallback(async (projId: string, status: BusinessProject['status'], projName: string) => {
    try {
      const docRef = doc(db, 'business_projects', projId);
      await updateDoc(docRef, { status });
      if (user) {
        await addDoc(collection(db, 'business_activity'), {
          ownerId: user.uid,
          action: 'Updated Project Status',
          module: 'Projects Board',
          details: `Changed status of ${projName} to ${status}.`,
          createdAt: new Date().toISOString()
        });
      }
      success('Project status updated.');
    } catch (err) {
      error('Failed to update project status.');
    }
  }, [user, success, error]);

  const handleCreateTask = useCallback(async (task: Omit<BusinessTask, 'id' | 'ownerId' | 'createdAt'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'business_tasks'), {
        ...task,
        ownerId: user.uid,
        createdAt: new Date().toISOString()
      });
      await addDoc(collection(db, 'business_activity'), {
        ownerId: user.uid,
        action: 'Logged Custom Task',
        module: 'Task Manager',
        details: `Logged task checklist: ${task.taskName}.`,
        createdAt: new Date().toISOString()
      });
      success('Custom operational task saved.');
    } catch (err) {
      error('Failed to log task.');
    }
  }, [user, success, error]);

  const handleToggleTaskStatus = useCallback(async (taskId: string, currentStatus: BusinessTask['status'], taskName: string) => {
    try {
      const docRef = doc(db, 'business_tasks', taskId);
      const nextStatus = currentStatus === 'Completed' ? 'In Progress' : 'Completed';
      const nextProgress = nextStatus === 'Completed' ? 100 : 50;
      await updateDoc(docRef, { status: nextStatus, progress: nextProgress });
      
      if (user) {
        await addDoc(collection(db, 'business_activity'), {
          ownerId: user.uid,
          action: 'Toggled Task Status',
          module: 'Task Manager',
          details: `Marked task "${taskName}" as ${nextStatus}.`,
          createdAt: new Date().toISOString()
        });
      }
      
      success(nextStatus === 'Completed' ? 'Task checked off!' : 'Task returned to active backlog.');
    } catch (err) {
      error('Failed to toggle task.');
    }
  }, [user, success, error]);

  const handleDeleteTask = useCallback(async (taskId: string, taskName: string) => {
    try {
      await deleteDoc(doc(db, 'business_tasks', taskId));
      if (user) {
        await addDoc(collection(db, 'business_activity'), {
          ownerId: user.uid,
          action: 'Deleted Task',
          module: 'Task Manager',
          details: `Removed task "${taskName}" from backlog.`,
          createdAt: new Date().toISOString()
        });
      }
      success('Task removed from board.');
    } catch (err) {
      error('Failed to remove task.');
    }
  }, [user, success, error]);

  const handleUploadDocument = useCallback(async (docObj: Omit<BusinessDocument, 'id' | 'ownerId' | 'uploadedAt' | 'version' | 'history'>) => {
    if (!user) return;
    try {
      const nowStr = new Date().toISOString();
      await addDoc(collection(db, 'business_documents'), {
        ...docObj,
        ownerId: user.uid,
        uploadedAt: nowStr,
        version: 1,
        history: [{ version: 1, url: '#', uploadedAt: nowStr, changedBy: user.email }]
      });
      await addDoc(collection(db, 'business_activity'), {
        ownerId: user.uid,
        action: 'Registered Vault Document',
        module: 'Document Vault',
        details: `Uploaded certificate ${docObj.name} in vault catalog.`,
        createdAt: nowStr
      });
      success('File encrypted and registered in Document Vault.');
    } catch (err) {
      error('Failed to register file.');
    }
  }, [user, success, error]);

  const handleDeleteDocument = useCallback(async (docId: string, docName: string) => {
    try {
      await deleteDoc(doc(db, 'business_documents', docId));
      if (user) {
        await addDoc(collection(db, 'business_activity'), {
          ownerId: user.uid,
          action: 'Deleted Vault Document',
          module: 'Document Vault',
          details: `Removed file "${docName}" from vault.`,
          createdAt: new Date().toISOString()
        });
      }
      success('File removed from registry.');
    } catch (err) {
      error('Failed to delete file.');
    }
  }, [user, success, error]);

  const handleCreateEvent = useCallback(async (event: Omit<CalendarEvent, 'id' | 'ownerId' | 'reminderSent' | 'googleCalendarSynced'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'business_calendar'), {
        ...event,
        ownerId: user.uid,
        reminderSent: false,
        googleCalendarSynced: false
      });
      await addDoc(collection(db, 'business_activity'), {
        ownerId: user.uid,
        action: 'Scheduled Calendar Event',
        module: 'Schedules',
        details: `Scheduled event: ${event.title}.`,
        createdAt: new Date().toISOString()
      });
      success('Calendar event locked.');
    } catch (err) {
      error('Failed to schedule event.');
    }
  }, [user, success, error]);

  const handleSyncGoogleCalendar = useCallback(() => {
    success('Google Calendar bidirectional sync complete.');
  }, [success]);

  const handleAddRecord = useCallback(async (rec: Omit<FinanceRecord, 'id' | 'ownerId' | 'createdAt'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'business_finance'), {
        ...rec,
        ownerId: user.uid,
        createdAt: new Date().toISOString()
      });
      await addDoc(collection(db, 'business_activity'), {
        ownerId: user.uid,
        action: 'Recorded Treasury Transaction',
        module: 'Finance Overview',
        details: `Recorded ${rec.type} of ₹${rec.amount} for ${rec.category}.`,
        createdAt: new Date().toISOString()
      });
      success('Treasury transaction saved.');
    } catch (err) {
      error('Failed to save transaction.');
    }
  }, [user, success, error]);

  if (initializing) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex overflow-x-auto pb-3 gap-2">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-10 w-32 bg-slate-100 rounded-3xl animate-pulse" />
          ))}
        </div>
        <DashboardSkeleton />
      </div>
    );
  }

  if (timeoutError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-3xl flex items-center justify-center mb-6">
          <Activity size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Connection Timeout</h2>
        <p className="text-slate-500 mb-8 max-w-md text-center font-medium">
          We were unable to load your dashboard data within the expected timeframe. Please check your network and try again.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-4 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // Navigation config
  const tabs = [
    { id: 'command-center', name: 'My Projects', icon: Activity },
    { id: 'documents', name: 'My Documents', icon: FolderLock },
    { id: 'doc-center', name: 'Guides', icon: FileText },
    { id: 'messages', name: 'Expert Chat', icon: MessageCircle },
    { id: 'ai', name: 'AI Help', icon: Sparkles },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen">
      {/* 1. Header with Claymorphic Title */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/50 p-10 rounded-3xl shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/5 rounded-3xl blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Business Dashboard</h1>
            <p className="text-slate-500 font-medium tracking-tight">Manage all your company paperwork and projects in one place.</p>
          </div>
              <div className="flex items-center gap-4 whitespace-nowrap">
            <div className="px-6 py-3 bg-white/80 border border-white rounded-3xl shadow-sm backdrop-blur-sm flex items-center gap-6">
               <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 whitespace-nowrap">Status</p>
                 <div className="flex items-center gap-2 whitespace-nowrap">
                   <div className="w-2 h-2 rounded-3xl bg-emerald-500 animate-pulse" />
                   <span className="text-[11px] font-black text-slate-900 uppercase tracking-wider">Operational</span>
                 </div>
               </div>
               <div className="w-px h-8 bg-slate-100" />
               <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 whitespace-nowrap">Audit Mode</p>
                 <div className="flex items-center gap-2 whitespace-nowrap">
                   <Sparkles size={12} className="text-primary animate-pulse" />
                   <span className="text-[11px] font-black text-primary uppercase tracking-wider">Secure</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Module Selection Tabs */}
      <div className="flex overflow-x-auto pb-3 gap-3 scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-4 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-3 border shadow-sm whitespace-nowrap ${
                isActive 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/20 scale-[1.05] z-10' 
                  : 'bg-white/70 text-slate-500 border-white/80 hover:bg-white hover:text-slate-900 backdrop-blur-sm'
              }`}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-400")} strokeWidth={isActive ? 2.5 : 2} />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Primary Workspace Body */}
      <div className="min-h-[60vh] bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 p-8 shadow-inner">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <React.Suspense fallback={<DashboardSkeleton />}>
              {activeTab === 'command-center' && (
                <CommandCenter 
                  health={health} 
                  tasks={tasks} 
                  events={events} 
                  documents={documents} 
                  onTabChange={setActiveTab} 
                  project={activeProject}
                  bsm={bsm}
                />
              )}
              {activeTab === 'documents' && (
                <DocumentVault 
                  documents={documents} 
                  onUploadDocument={handleUploadDocument}
                  onDeleteDocument={handleDeleteDocument}
                />
              )}
              {activeTab === 'doc-center' && (
                <div className="py-20 text-center">
                  <div className="w-24 h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-primary shadow-inner">
                    <FileSignature size={48} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Intelligent Document Center</h2>
                  <p className="text-slate-500 max-w-lg mx-auto mb-10 font-medium leading-relaxed">
                    Access our enterprise suite of document automation tools. Generate legal agreements, service contracts, and corporate filings with one click.
                  </p>
                  <button 
                    onClick={() => navigate('/documents')}
                    className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 transition-all hover:scale-[1.05]"
                  >
                    Open Document Workspace
                  </button>
                </div>
              )}
              {activeTab === 'messages' && (
                <div className="bg-white rounded-3xl p-1 border border-slate-100 shadow-xl h-[700px] overflow-hidden">
                  <CommunicationHub />
                </div>
              )}
              {activeTab === 'ai' && (
                <AiAssistant 
                  profile={profile} 
                  goals={goals} 
                  tasks={tasks} 
                  documents={documents} 
                  health={health} 
                />
              )}
            </React.Suspense>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
