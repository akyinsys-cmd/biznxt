import { GuidedTour } from '../components/widgets/GuidedTour';
import { DailyBusinessPulse } from '../components/widgets/DailyBusinessPulse';
import { ActivityFeed } from '../components/widgets/ActivityFeed';
import { KPIStatCard } from '../components/widgets/KPIStatCard';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Clock, 
  FileText, 
  TrendingUp, 
  ArrowRight,
  Search,
  MoreVertical,
  Activity,
  Headset,
  CheckSquare,
  CalendarX2,
  Users,
  IndianRupee,
  Sparkles,
  Plus,
  Trash,
  Play,
  Check,
  Loader2,
  Upload,
  ExternalLink,
  Briefcase,
  Layers,
  FileSpreadsheet,
  Cpu,
  Bookmark,
  ChevronRight,
  Filter,
  CheckSquare as CheckedIcon,
  AlertTriangle,
  Globe,
  Download
} from 'lucide-react';
import { getAccessToken, initAuth } from '../lib/auth';
import type { User } from 'firebase/auth';
import { BusinessHealthScore } from '../components/widgets/BusinessHealthScore';
import { EnterprisePipeline } from '../components/widgets/EnterprisePipeline';
import { BusinessSuccessManagerWorkspace } from '../components/BusinessSuccessManagerWorkspace';
import { AdminWorkspace } from '../components/AdminWorkspace';
import { UserActivityLogger } from '../components/widgets/UserActivityLogger';
import { RecentReports } from '../components/widgets/RecentReports';
import { NotificationCenter } from '../components/widgets/NotificationCenter';
import { QuickActionsModal, QuickActionType } from '../components/widgets/QuickActionsModal';
import { BusinessProgress, Milestone } from '../components/widgets/BusinessProgress';
import { ResearchStatus } from '../components/widgets/ResearchStatus';
import { KPIDashboard } from '../components/widgets/KPIDashboard';
import { EmptyState } from '../components/ui/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { RecentActivities } from '../components/widgets/RecentActivities';
import { RecommendedServices } from '../components/widgets/RecommendedServices';
import { PaymentsInvoices } from '../components/widgets/PaymentsInvoices';
import { DownloadsSupport } from '../components/widgets/DownloadsSupport';
import { ProfileCompletion } from '../components/widgets/ProfileCompletion';
import { ReferralProgram } from '../components/widgets/ReferralProgram';
import { useNavigate } from 'react-router-dom';
import { PremiumDashboardSkeleton } from '../components/SkeletonComponent';
import { db, analytics } from '../lib/firebase';
import { logEvent } from 'firebase/analytics';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
  getDocs 
} from 'firebase/firestore';

const MOCK_MILESTONES: Milestone[] = [
  { id: '1', title: 'Idea Validation', description: 'AI research and feasibility study.', status: 'completed' },
  { id: '2', title: 'Business Plan', description: 'Financial modeling and strategy.', status: 'completed' },
  { id: '3', title: 'Company Registration', description: 'Legal entity creation and GST.', status: 'current' },
  { id: '4', title: 'Launch Ready', description: 'Brand identity and online presence.', status: 'pending' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, role, userData, accessToken, loading } = useAuth();
  const { confirm, showToast, success, error } = useToast();
  const [activeQuickAction, setActiveQuickAction] = useState<QuickActionType>(null);

  // Onboarding enforcement check
  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/login');
      return;
    }
    if (userData && !userData.completedOnboarding) {
      navigate('/onboarding');
    }
  }, [user, userData, loading, navigate]);

  // Firestore-backed lists
  const [tasks, setTasks] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  // Task Input State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [addingTask, setAddingTask] = useState(false);

  // AI Assistant Interaction State (Researcher Sandbox)
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiStep, setAiStep] = useState(0);
  const [aiReportOutput, setAiReportOutput] = useState<string | null>(null);

  // 1. Synchronize Firestore collection lists in real-time
  useEffect(() => {
    if (!user) return;

    // A. Sync Tasks
    const tasksQuery = query(
      collection(db, 'tasks'), 
      where('ownerId', '==', user.uid)
    );
    const unsubTasks = onSnapshot(tasksQuery, (snap) => {
      const items: any[] = [];
      snap.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      // Sort tasks (pending first, then created date)
      items.sort((a, b) => {
        if (a.status === b.status) return 0;
        return a.status === 'pending' ? -1 : 1;
      });
      setTasks(items);
    }, (err) => console.error("Error syncing tasks:", err));

    // B. Sync Consultations (Meetings)
    const meetingsQuery = query(
      collection(db, 'consultations'),
      where('ownerId', '==', user.uid)
    );
    const unsubMeetings = onSnapshot(meetingsQuery, (snap) => {
      const items: any[] = [];
      snap.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setEvents(items);
    }, (err) => console.error("Error syncing consultations:", err));

    // C. Sync Reports
    const reportsQuery = query(
      collection(db, 'reports'),
      where('ownerId', '==', user.uid)
    );
    const unsubReports = onSnapshot(reportsQuery, (snap) => {
      const items: any[] = [];
      snap.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setReports(items);
    }, (err) => console.error("Error syncing reports:", err));

    return () => {
      unsubTasks();
      unsubMeetings();
      unsubReports();
    };
  }, [user]);

  // Handle Task Addition
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !user) return;
    setAddingTask(true);
    try {
      await addDoc(collection(db, 'tasks'), {
        title: newTaskTitle.trim(),
        status: 'pending',
        ownerId: user.uid,
        createdAt: new Date().toISOString(),
      });
      setNewTaskTitle('');
      success('Launch task added successfully!');
    } catch (err: any) {
      error('Failed to add task: ' + err.message);
    } finally {
      setAddingTask(false);
    }
  };

  // Toggle Task Status
  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      const nextStatus = currentStatus === 'pending' ? 'completed' : 'pending';
      await updateDoc(taskRef, { status: nextStatus });
      success(nextStatus === 'completed' ? 'Task completed!' : 'Task set to pending.');
    } catch (err: any) {
      error('Failed to update task.');
    }
  };

  // Delete Task
  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      success('Task removed.');
    } catch (err: any) {
      error('Failed to delete task.');
    }
  };

  // Handle Consultation Cancellation
  const handleCancelConsultation = async (eventId: string) => {
    confirm({
      title: 'Cancel Consultation',
      message: 'Are you sure you want to cancel this consultation? Your assigned SME Business Consultant will be notified.',
      confirmText: 'Cancel Meeting',
      onConfirm: async () => {
        try {
          const meetRef = doc(db, 'consultations', eventId);
          await updateDoc(meetRef, { status: 'cancelled' });
          success('Consultation cancelled successfully.');
        } catch (err: any) {
          error('Failed to cancel consultation.');
        }
      }
    });
  };

  // Book a Quick Simulated Consultation (adds to Firestore)
  const handleQuickBook = async () => {
    if (!user) return;
    try {
      const docRef = await addDoc(collection(db, 'consultations'), {
        summary: 'SME Strategic Setup Call',
        dateTime: new Date(Date.now() + 86400000).toISOString(), // 24h from now
        ownerId: user.uid,
        status: 'scheduled',
      });
      
      // Track in Firebase Analytics
      if (analytics) {
        logEvent(analytics, 'consultation_purchased', {
          consultationId: docRef.id,
          summary: 'SME Strategic Setup Call',
          price: '₹2,500', // standard consultation charge
          currency: 'INR'
        });
        logEvent(analytics, 'payment_success', {
          itemType: 'consultation',
          itemId: docRef.id,
          itemName: 'SME Strategic Setup Call',
          amount: '₹2,500'
        });
      }

      success('Consultation booked! Shown in your itinerary.');
    } catch (err: any) {
      error('Failed to book meeting.');
    }
  };

  // Simulated Researcher AI Process
  const handleInvokeAiResearch = () => {
    setAiAnalyzing(true);
    setAiStep(1);
    setAiReportOutput(null);

    // Step 1: CapEx
    setTimeout(() => {
      setAiStep(2);
      // Step 2: Competition
      setTimeout(() => {
        setAiStep(3);
        // Step 3: Location
        setTimeout(() => {
          setAiStep(4);
          // Step 4: Ready
          setTimeout(() => {
            setAiAnalyzing(false);
            setAiReportOutput(`
=========================================
BIZNXT.ONLINE AI FEASIBILITY REPORT - R-8924
=========================================
Sector: EV Charging & Retail Spares Hub
Location: Sector 62, Noida, India (Urban Commercial)

1. FINANCIAL MODELING & CAPEX
- Total Capex Est: ₹42.5 Lakhs
- Real Estate & Grid Connection: ₹22 Lakhs
- Fast DC Chargers (2x 60kW): ₹15 Lakhs
- Working Capital (Opex 6M): ₹5.5 Lakhs
- IRR (Internal Rate of Return): 22.4% (Payback: 2.8 Years)

2. LOCATION AUDIT & FOOTFALL ANALYSIS
- Daily Average Traffic count: 18,400 vehicles
- Near commercial IT corridor (high density corporate employee hub)
- Grid Capacity verified: 120kVA line accessible nearby

3. COMPETITIVE STRENGTH (SWOT)
- Strengths: First mover in 5km radius; grid redundancy
- Weaknesses: Limited early local marketing coverage
- Opportunities: Integration with Indian government subsidies (FAME II schemes)

=========================================
STATUS: APPROVED BY BIZNXT.ONLINE AI ENGINE
=========================================
            `);
            success('AI Intelligence Report Compiled Successfully!');
          }, 1200);
        }, 1200);
      }, 1200);
    }, 1200);
  };

  if (loading) {
    return (
      <div className="max-w-[1600px] mx-auto px-8 py-10">
        <PremiumDashboardSkeleton />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50">
        <div className="w-16 h-16 rounded-3xl bg-red-50 flex items-center justify-center mb-4 text-red-500">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Workspace Locked</h2>
        <p className="text-slate-500 mb-6 max-w-sm">Please log in with your email or Google Account to access secure venture ledgers.</p>
        <button onClick={() => window.location.href = '/login'} className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-3xl font-medium transition-colors shadow-sm">
          Go to Sign In
        </button>
      </div>
    );
  }

  // ==========================================
  // BSM (BUSINESS SUCCESS MANAGER) PLATFORM WORKSPACE
  // ==========================================
  if (role === 'bsm') {
    return (
      <div className="flex-1 min-h-screen bg-slate-50 flex flex-col">
        <BusinessSuccessManagerWorkspace />
      </div>
    );
  }

  // ==========================================
  // A. ADMIN & SUPER ADMIN OPERATIONS DASHBOARD
  // ==========================================
  
  
  if (role === 'admin' || role === 'superadmin' || role === 'manager' || (role && role.includes('manager') && role !== 'bsm')) {
    return (
      <div className="flex-1 h-screen bg-slate-50 flex flex-col relative">
        <AdminWorkspace />
        
        {/* Floating UserActivityLogger for Admin Dashboard */}
        <div className="absolute bottom-6 right-6 w-96 z-[60] shadow-2xl rounded-3xl overflow-hidden pointer-events-auto">
          <UserActivityLogger />
        </div>
      </div>
    );
  }



  // ==========================================
  // B. RESEARCH EXECUTIVE WORKSPACE DASHBOARD
  // ==========================================
  if (role === 'researcher') {
    return (
      <div className="flex-1 bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-3xl bg-emerald-50 text-emerald-700 text-xs font-semibold">
                <Layers className="w-3.5 h-3.5" />
                <span>Executive Terminal: RESEARCHER</span>
              </div>
              <h1 className="text-3xl font-display font-bold text-slate-900 mt-2">
                Research & Analytics Desk
              </h1>
              <p className="text-slate-500 mt-1">Synthesizing raw entrepreneur briefs into validated macroeconomic feasibility reports.</p>
            </div>
            <div className="flex items-center space-x-3">
              <NotificationCenter />
            </div>
          </div>

          {/* Interactive Enterprise Architecture Pipeline */}
          <EnterprisePipeline />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Active Task Queue */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card bg-white p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-900 text-lg">My Active Ingestion Queue</h3>
                  <span className="text-xs text-slate-500">3 Tickets Pending Review</span>
                </div>

                <div className="space-y-4">
                  {/* Ticket 1 */}
                  <div className="p-4 border border-slate-100 rounded-3xl hover:border-slate-200 transition-colors bg-slate-50/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">TICKET ID: R-8924</span>
                        <h4 className="font-bold text-slate-900 mt-1">EV Spare Parts Hub feasibility study</h4>
                        <p className="text-xs text-slate-500 mt-1">Client: Ketan Sharma • Proposed Location: Sector 62, Noida</p>
                      </div>
                      <span className="px-2 py-1 rounded bg-amber-50 text-amber-700 text-xs font-semibold">Draft Required</span>
                    </div>

                    {/* AI Sandbox interaction trigger */}
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center text-xs text-slate-500">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        <span>Deadline: 24 Hours</span>
                      </div>
                      <button 
                        onClick={handleInvokeAiResearch}
                        disabled={aiAnalyzing}
                        className="bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-3xl text-xs font-medium transition-colors flex items-center space-x-1"
                      >
                        {aiAnalyzing ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Modeling...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3" />
                            <span>Invoke AI Analytics</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Ticket 2 */}
                  <div className="p-4 border border-slate-100 rounded-3xl bg-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">TICKET ID: R-4412</span>
                        <h4 className="font-bold text-slate-900 mt-1">Agri-tech cold storage logistics</h4>
                        <p className="text-xs text-slate-500 mt-1">Client: Harish Agro Co. • Location: Pune Outskirts</p>
                      </div>
                      <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-semibold">Awaiting SME</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Generation Stream Monitor */}
            <div className="space-y-6">
              <div className="glass-card bg-slate-900 text-white p-6 relative min-h-[300px] flex flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent opacity-50" />
                
                <div>
                  <div className="flex items-center space-x-2 text-emerald-400 mb-4">
                    <Cpu className="w-5 h-5" />
                    <span className="text-sm font-semibold tracking-wider uppercase">AI Analytical Engine</span>
                  </div>

                  {aiAnalyzing ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-xs">
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                        <span className="text-emerald-400">biznxt.online 3.0 Engine Executing...</span>
                      </div>
                      <div className="text-xs font-mono text-slate-500 space-y-2">
                        <p className={aiStep >= 1 ? 'text-emerald-400 font-semibold' : ''}>[Step 1] Initializing financial CapEx models...</p>
                        <p className={aiStep >= 2 ? 'text-emerald-400 font-semibold' : ''}>[Step 2] Scraping regional competitor density...</p>
                        <p className={aiStep >= 3 ? 'text-emerald-400 font-semibold' : ''}>[Step 3] Querying municipal zoning directories...</p>
                        <p className={aiStep >= 4 ? 'text-emerald-400 font-semibold' : ''}>[Step 4] Assembling executive brief...</p>
                      </div>
                    </div>
                  ) : aiReportOutput ? (
                    <div className="text-[10px] font-mono text-emerald-400 bg-black/40 p-3 rounded-3xl overflow-y-auto max-h-[220px]">
                      <pre className="whitespace-pre-wrap">{aiReportOutput}</pre>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500 text-sm">
                      <p>Awaiting analytical trigger.</p>
                      <p className="text-xs text-slate-500 mt-2">Click "Invoke AI Analytics" on an active brief to monitor live data modeling streams.</p>
                    </div>
                  )}
                </div>

                {aiReportOutput && (
                  <button 
                    onClick={() => {
                      success('Report draft pushed to SME Review stage successfully!');
                      setAiReportOutput(null);
                    }}
                    className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2.5 rounded-3xl transition-colors"
                  >
                    Promote Draft to SME Review
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // C. BUSINESS CONSULTANT COLLABORATION DASHBOARD
  // ==========================================
  if (role === 'consultant') {
    return (
      <div className="flex-1 bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-3xl bg-blue-50 text-blue-700 text-xs font-semibold">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Expert Hub: CONSULTANT</span>
              </div>
              <h1 className="text-3xl font-display font-bold text-slate-900 mt-2">
                Consultant Collaboration Hub
              </h1>
              <p className="text-slate-500 mt-1">Leading milestone execution roadmaps, legal sign-offs, and strategic advice.</p>
            </div>
            <div className="flex items-center space-x-3">
              <NotificationCenter />
            </div>
          </div>

          {/* Interactive Enterprise Architecture Pipeline */}
          <EnterprisePipeline />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Consultation Appointments List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card bg-white p-6">
                <h3 className="font-bold text-slate-900 text-lg mb-4">My Today Itinerary</h3>
                <div className="divide-y divide-slate-100">
                  <div className="py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-3xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                        KS
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Ketan Sharma - EV Venture</h4>
                        <p className="text-xs text-slate-500 mt-0.5">14:00 PM • Google Meet Call Scheduled</p>
                      </div>
                    </div>
                    <button className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-3xl flex items-center">
                      <span>Launch Call</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </button>
                  </div>

                  <div className="py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                        AS
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Amara BioTech - Brief Review</h4>
                        <p className="text-xs text-slate-500 mt-0.5">16:30 PM • Final Feasibility Sign-off</p>
                      </div>
                    </div>
                    <button className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-3xl flex items-center">
                      <span>View Files</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Legal Document Sign-off Card */}
            <div className="space-y-6">
              <div className="glass-card bg-white p-6">
                <h3 className="font-bold text-slate-900 text-lg mb-2">Pending Clearances</h3>
                <p className="text-xs text-slate-500 mb-4">Validate legal filing compliance documents.</p>

                <div className="space-y-4">
                  <div className="p-3 bg-slate-50 rounded-3xl border border-slate-100 flex justify-between items-center">
                    <div>
                      <h5 className="font-bold text-slate-900 text-xs">GST Registration - Sharma EV</h5>
                      <span className="text-[10px] text-slate-500">File size: 1.2 MB</span>
                    </div>
                    <button 
                      onClick={() => success(' Sharma EV GST Registration signed off successfully!')}
                      className="p-1.5 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-xs font-semibold"
                    >
                      Sign off
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // D. STANDARD REGISTERED CUSTOMER WORKSPACE
  // ==========================================
  return (
    <div className="flex-1 bg-slate-50 p-4 sm:p-6 lg:p-8 relative">
      <GuidedTour />
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-display font-black text-slate-900 tracking-tighter">
              Welcome back, <span className="text-primary">{user?.displayName ? user.displayName.split(' ')[0] : 'Entrepreneur'}</span>
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Your venture roadmap is synchronized and optimized for scale.</p>
          </div>
          <div className="flex items-center gap-3">
            <NotificationCenter />
            <button className="neo-button bg-primary text-white px-6 py-3 rounded-3xl font-black text-[10px] tracking-widest uppercase transition-all shadow-lg shadow-primary/20 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Scale Growth
            </button>
          </div>
        </div>

        <DailyBusinessPulse />

        {/* Interactive Enterprise Architecture Pipeline */}
        <div id="tour-active-projects">
          <EnterprisePipeline />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div id="tour-health-score">
            <BusinessHealthScore score={94} trend={6} />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card glass-card-hover p-8 rounded-3xl"
          >
             <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-500">Services</p>
                <h3 className="text-3xl font-black text-slate-900 mt-2">Active</h3>
              </div>
              <div className="w-12 h-12 rounded-3xl bg-primary/5 flex items-center justify-center text-primary">
                <Briefcase size={24} />
              </div>
            </div>
            <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-black uppercase tracking-wider bg-slate-50 p-3 rounded-3xl border border-slate-100">
               <div className="w-2 h-2 rounded-3xl bg-emerald-500 animate-pulse" />
               <span className="truncate">Incorporation filing in progress</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card glass-card-hover p-8 rounded-3xl"
          >
             <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-500">Opportunity</p>
                <h3 className="text-3xl font-black text-slate-900 mt-2">82<span className="text-sm font-medium text-slate-400">/100</span></h3>
              </div>
              <div className="w-12 h-12 rounded-3xl bg-accent/5 flex items-center justify-center text-accent">
                <Sparkles size={24} className="animate-float" />
              </div>
            </div>
            <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-black uppercase tracking-wider bg-slate-50 p-3 rounded-3xl border border-slate-100">
               <TrendingUp className="w-4 h-4 text-accent shrink-0" />
               <span className="truncate">High market fit detected</span>
            </div>
          </motion.div>

          <ResearchStatus 
            status="Completed" 
            title="SME Feasibility Audit" 
            ticketId="R-8924"
            updatedAt="Updated 2m ago"
            className="md:col-span-4 lg:col-span-1"
          />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Tasks & Reports */}
          <div className="lg:col-span-2 space-y-8">
            <ProfileCompletion onActionClick={(action) => {
              if (action === 'Start Research') {
                setActiveQuickAction('research');
              } else if (action === 'Verify KYC' || action === 'Add Tax ID') {
                setActiveQuickAction('consultation');
              } else {
                success(`Navigating to ${action}...`);
              }
            }} />
            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <KPIStatCard
                title="Total Revenue"
                value="₹1,245,000"
                trend="up"
                trendValue="+14%"
                icon={IndianRupee}
                sparklineData={[120, 140, 130, 160, 150, 180, 200]}
              />
              <KPIStatCard
                title="Active Projects"
                value="24"
                trend="up"
                trendValue="+3"
                icon={Briefcase}
                sparklineData={[10, 12, 11, 15, 18, 20, 24]}
              />
              <KPIStatCard
                title="Customer Satisfaction"
                value="98.5%"
                trend="neutral"
                trendValue="0%"
                icon={TrendingUp}
                sparklineData={[98, 97, 98, 99, 98.5, 98.5, 98.5]}
              />
            </div>
            
            <div className="h-96">
              <ActivityFeed />
            </div>

            <KPIDashboard />
            <BusinessProgress milestones={MOCK_MILESTONES} />

            {/* Interactive Task Board */}
            <div className="glass-card neomorph-flat p-6 border-none">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-sm font-bold tracking-wider uppercase text-slate-500">Launch Checklist Board</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Add and complete milestones synchronized in real-time to your Firestore ledger.</p>
                </div>
                <span className="text-xs font-bold font-mono px-2.5 py-1 bg-primary/10 text-primary rounded-3xl border border-primary/20">
                  {tasks.filter(t => t.status === 'completed').length}/{tasks.length} Completed
                </span>
              </div>
              
              {/* Add Task Form */}
              <form onSubmit={handleAddTask} className="flex gap-3 mb-6">
                <input 
                  type="text"
                  required
                  disabled={addingTask}
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="flex-1 px-4 py-3 neomorph-pressed text-xs font-semibold focus:ring-1 focus:ring-primary/40 text-slate-800 placeholder-slate-400 transition-all"
                  placeholder="e.g. Register for GST Identification Number"
                />
                <button
                  type="submit"
                  disabled={addingTask}
                  className="neomorph-btn bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-3 flex items-center shrink-0"
                >
                  {addingTask ? 'Saving...' : 'Add Task'}
                </button>
              </form>

              {/* Tasks List */}
              <div className="space-y-3">
                {tasks.length > 0 ? tasks.map((task) => {
                  const isCompleted = task.status === 'completed';
                  return (
                    <motion.div 
                      key={task.id} 
                      layout
                      className={`flex items-start p-4 rounded-3xl border transition-all ${
                        isCompleted ? 'border-emerald-100 bg-emerald-50/10' : 'border-transparent bg-[#F3F5F9] shadow-sm hover:shadow-md'
                      }`}
                    >
                       <button 
                         onClick={() => handleToggleTask(task.id, task.status)}
                         className="mt-0.5 mr-3 shrink-0"
                       >
                         {isCompleted ? (
                           <CheckedIcon className="w-5 h-5 text-emerald-500" />
                         ) : (
                           <div className="w-5 h-5 rounded-3xl border-2 border-slate-300 hover:border-primary transition-colors" />
                         )}
                       </button>
                       <div className="flex-1 min-w-0">
                         <h4 className={`text-xs font-bold uppercase tracking-wider ${isCompleted ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                           {task.title}
                         </h4>
                         {task.createdAt && (
                           <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                             Added {new Date(task.createdAt).toLocaleDateString()}
                           </span>
                         )}
                       </div>
                       <button 
                         onClick={() => handleDeleteTask(task.id)}
                         className="text-slate-500 hover:text-red-500 p-1.5 rounded-3xl hover:bg-red-50 transition-colors"
                       >
                         <Trash className="w-4 h-4" />
                       </button>
                     </motion.div>
                  );
                }) : (
                  <EmptyState 
                    icon={CheckSquare}
                    title="No tasks in your board"
                    description="Enter your next venture setup goal above to start tracking it dynamically."
                    className="min-h-[160px]"
                  />
                )}
              </div>
            </div>

            {/* Latest Reports */}
            <RecentReports reports={reports} onBrowse={() => {}} />

            {/* Premium SME Integrations */}
            <RecentActivities />
            <RecommendedServices onSelectService={(service) => {
              success(`Initializing onboarding sequence for "${service}"`);
              setActiveQuickAction('consultation');
            }} />
            <PaymentsInvoices onPayInvoice={(id) => {
              success(`Directing to secure credit card gateway for invoice ${id}...`);
            }} />
          </div>

          {/* Right Column: Calendar & Actions */}
          <div className="space-y-8">
            
            {/* Upcoming Consultations */}
            <div className="glass-card bg-white p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-display">My Consulting Itinerary</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Real-time scheduling with SME industry advisors.</p>
                </div>
                <CalendarIcon className="w-5 h-5 text-slate-500 shrink-0" />
              </div>
              
              <div className="space-y-4">
                 {events.length > 0 ? events.map((event) => {
                   const startDate = new Date(event.dateTime);
                   const isCancelled = event.status === 'cancelled';
                   return (
                    <div key={event.id} className="relative pl-6 pb-4 border-l-2 border-slate-100 last:border-0 last:pb-0">
                      <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-3xl border-4 border-white ${isCancelled ? 'bg-slate-300' : 'bg-primary'}`}></div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className={`text-sm font-semibold ${isCancelled ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                            {event.summary}
                          </h4>
                          <div className="flex items-center mt-1 text-[11px] text-slate-500">
                            <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" />
                            <span>{startDate.toLocaleDateString()}, {startDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                          {isCancelled && (
                            <span className="inline-block mt-1 px-1.5 py-0.5 bg-red-50 text-red-600 rounded text-[9px] font-bold">
                              Cancelled
                            </span>
                          )}
                        </div>
                        
                        {!isCancelled && (
                          <button 
                            onClick={() => handleCancelConsultation(event.id)}
                            className="text-[10px] text-red-500 hover:text-red-700 font-bold bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-3xl transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                   );
                 }) : (
                    <EmptyState 
                      icon={CalendarX2}
                      title="Schedule Cleared"
                      description="No upcoming expert consultations. Tap the quick action to book a strategic setup call."
                      className="min-h-[140px] p-4 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200"
                    />
                 )}
              </div>

              <button 
                onClick={handleQuickBook}
                className="w-full mt-6 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-3xl text-sm font-semibold transition-colors flex items-center justify-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Schedule Strategic Setup Call</span>
              </button>
            </div>

            {/* Quick Actions Panel */}
            <div id="tour-quick-actions" className="glass-card bg-slate-900 p-6 text-white relative overflow-hidden rounded-3xl shadow-lg space-y-4">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent opacity-50" />
              <div>
                <h2 className="text-lg font-bold relative z-10 font-display">Venture Quick Actions</h2>
                <p className="text-[11px] text-slate-500 relative z-10 mt-0.5">Control center for all active business setup and compliance routes.</p>
              </div>
              
              <div className="grid grid-cols-1 gap-2.5 relative z-10">
                <button 
                  onClick={() => setActiveQuickAction('research')}
                  className="w-full flex items-center justify-between p-3 rounded-3xl bg-white/10 hover:bg-white/15 transition-all text-xs font-bold border border-white/5 group"
                >
                  <div className="flex items-center gap-2.5">
                    <Search className="w-4 h-4 text-primary-light" />
                    <span>Start Business Research</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-primary-light group-hover:translate-x-1 transition-transform" />
                </button>

                <button 
                  onClick={() => {
                    navigate('/launch-wizard');
                    success('Initializing business launch wizard...');
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-3xl bg-white/10 hover:bg-white/15 transition-all text-xs font-bold border border-white/5 group"
                >
                  <div className="flex items-center gap-2.5">
                    <Play className="w-4 h-4 text-emerald-400" />
                    <span>Launch My Business</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </button>

                <button 
                  onClick={() => setActiveQuickAction('consultation')}
                  className="w-full flex items-center justify-between p-3 rounded-3xl bg-white/10 hover:bg-white/15 transition-all text-xs font-bold border border-white/5 group"
                >
                  <div className="flex items-center gap-2.5">
                    <CalendarIcon className="w-4 h-4 text-indigo-400" />
                    <span>Book Consultation</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </button>

                <button 
                  onClick={() => success('SME Manufacturer search catalog is being indexed...')}
                  className="w-full flex items-center justify-between p-3 rounded-3xl bg-white/10 hover:bg-white/15 transition-all text-xs font-bold border border-white/5 group"
                >
                  <div className="flex items-center gap-2.5">
                    <Cpu className="w-4 h-4 text-amber-400" />
                    <span>Find Manufacturer</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </button>

                <button 
                  onClick={() => success('Opening Platform Business Services directory...')}
                  className="w-full flex items-center justify-between p-3 rounded-3xl bg-white/10 hover:bg-white/15 transition-all text-xs font-bold border border-white/5 group"
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span>Business Services</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </button>

                <button 
                  onClick={() => success('Launching CGTMSE Loan eligibility assessment tool...')}
                  className="w-full flex items-center justify-between p-3 rounded-3xl bg-white/10 hover:bg-white/15 transition-all text-xs font-bold border border-white/5 group"
                >
                  <div className="flex items-center gap-2.5">
                    <IndianRupee className="w-4 h-4 text-emerald-400" />
                    <span>Business Loan</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </button>

                <button 
                  onClick={() => success('Initiating IEC (Import Export Code) registration application...')}
                  className="w-full flex items-center justify-between p-3 rounded-3xl bg-white/10 hover:bg-white/15 transition-all text-xs font-bold border border-white/5 group"
                >
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-blue-400" />
                    <span>Import Export Code</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </button>

                <button 
                  onClick={() => success('Consulting Dubai Meydan / DAFZA Freezone expansion advisor...')}
                  className="w-full flex items-center justify-between p-3 rounded-3xl bg-white/10 hover:bg-white/15 transition-all text-xs font-bold border border-white/5 group"
                >
                  <div className="flex items-center gap-2.5">
                    <ExternalLink className="w-4 h-4 text-teal-400" />
                    <span>Dubai Expansion</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </button>

                <button 
                  onClick={() => success('Fetching live report audits from regional compliance board...')}
                  className="w-full flex items-center justify-between p-3 rounded-3xl bg-white/10 hover:bg-white/15 transition-all text-xs font-bold border border-white/5 group"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-orange-400" />
                    <span>Track Reports</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </button>

                <button 
                  onClick={() => success('Redirecting to the download ledger below...')}
                  className="w-full flex items-center justify-between p-3 rounded-3xl bg-white/10 hover:bg-white/15 transition-all text-xs font-bold border border-white/5 group"
                >
                  <div className="flex items-center gap-2.5">
                    <Download className="w-4 h-4 text-indigo-400" />
                    <span>Download Reports</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </button>

                <button 
                  onClick={() => setActiveQuickAction('support')}
                  className="w-full flex items-center justify-between p-3 rounded-3xl bg-white/10 hover:bg-white/15 transition-all text-xs font-bold border border-white/5 group"
                >
                  <div className="flex items-center gap-2.5">
                    <Headset className="w-4 h-4 text-rose-400" />
                    <span>Contact Consultant</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Referral Program */}
            <ReferralProgram />
          </div>

        </div>

        {/* Downloads & Support Section Spanning Full Width at Bottom */}
        <DownloadsSupport onSupportOpen={() => setActiveQuickAction('support')} />

      </div>

      <QuickActionsModal 
        isOpen={activeQuickAction !== null} 
        actionType={activeQuickAction}
        onClose={() => setActiveQuickAction(null)} 
      />
    </div>
  );
}
