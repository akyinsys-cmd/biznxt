import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Briefcase, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  TrendingUp, 
  Calendar, 
  MessageSquare, 
  DollarSign, 
  FileText, 
  ShieldAlert, 
  ChevronRight, 
  Search, 
  Filter, 
  Send, 
  Check, 
  Trash2, 
  Sparkles, 
  FileSpreadsheet, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight, 
  CheckSquare, 
  Clock3, 
  ExternalLink,
  Sliders,
  Flag,
  Share2,
  Paperclip,
  Bell,
  RefreshCw,
  Award
} from 'lucide-react';
import { db } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  updateDoc, 
  onSnapshot, 
  serverTimestamp,
  deleteDoc,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// Define strict interfaces mirroring Firestore structure
export interface ClientProject {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  businessName: string;
  businessCategory: string;
  investmentAmount: string;
  targetTimeline: string;
  currentTimelineStep: string; // 'lead_created' | 'consultation' | 'research' | 'planning' | 'approval' | 'execution' | 'growth' | 'expansion'
  bsmId: string;
  businessScore: number;
  consultingFeePaid: boolean;
  totalServicePayments: number;
  totalPendingPayments: number;
  createdAt: any;
}

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  assignedTo: string;
  priority: 'High' | 'Medium' | 'Low';
  deadline: string;
  reminderDate: string;
  escalationStatus: boolean;
  status: 'Pending' | 'Completed';
  dependencies: string;
  comments: string;
  attachments: string[];
}

export interface Meeting {
  id: string;
  projectId: string;
  title: string;
  dateTime: string;
  platform: 'Google Meet' | 'Zoom' | 'In-Person';
  meetingNotes: string;
  actionItems: string[];
  followUpRequired: boolean;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface ProjectNote {
  id: string;
  projectId: string;
  author: string;
  text: string;
  timestamp: any;
}

export interface AssignedService {
  id: string; // e.g. ca, lawyer, etc.
  projectId: string;
  serviceName: string; // 'Research Executive' | 'CA' | 'Lawyer' | 'Manufacturer' | etc.
  assignedProfessional: string;
  status: 'Pending' | 'Started' | 'Completed' | 'Blocked';
  timeline: string;
  comments: string;
  files: string[];
}

export interface RiskAlert {
  id: string;
  projectId: string;
  type: 'Delay' | 'Missing Documents' | 'Pending Payment' | 'Expired Timeline' | 'Customer Inactive';
  description: string;
  severity: 'Critical' | 'Warning' | 'Info';
  escalationRequired: boolean;
  resolved: boolean;
  createdAt: any;
}

const TIMELINE_STEPS = [
  { id: 'lead_created', label: 'Lead Created', desc: 'Initial registration and sandbox intake form validation.' },
  { id: 'consultation', label: 'Consultation', desc: '1-on-1 advisor strategy call, diagnostic brief finalized.' },
  { id: 'research', label: 'Research', desc: 'AI-driven demographic modeling & CapEx threshold analysis.' },
  { id: 'planning', label: 'Planning', desc: 'Corporate charter preparation and timeline lock-in.' },
  { id: 'approval', label: 'Approval', desc: 'Entity registration complete, GST filed, trademarks applied.' },
  { id: 'execution', label: 'Execution', desc: 'OEM setup, physical inventory sourcing, branding complete.' },
  { id: 'growth', label: 'Growth', desc: 'Ad account launching, CRM triggers, localized marketing drive.' },
  { id: 'expansion', label: 'Expansion', desc: 'Multi-regional scale-up plans & capital cashbacks.' }
];

const MODULE_LIST = [
  { id: 'research', label: 'Research Module' },
  { id: 'planning', label: 'Planning & CapEx' },
  { id: 'gst', label: 'GST Compliance' },
  { id: 'trademark', label: 'Trademark Office' },
  { id: 'manufacturer', label: 'OEM Sourcing' },
  { id: 'branding', label: 'Brand Vector Kit' },
  { id: 'packaging', label: 'Eco Packaging' },
  { id: 'website', label: 'React Subdomain' },
  { id: 'marketing', label: 'Lead Generation' },
  { id: 'hiring', label: 'HR Recruitment' },
  { id: 'launch', label: 'Grand Opening' },
  { id: 'growth', label: 'Regional Franchises' },
  { id: 'expansion', label: 'National Scaling' }
];

export function BusinessSuccessManagerWorkspace() {
  const { user, role } = useAuth();
  const { success, error } = useToast();

  // Selected Client/Project Context
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Lists fetched from Firestore
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [notes, setNotes] = useState<ProjectNote[]>([]);
  const [assignedServices, setAssignedServices] = useState<AssignedService[]>([]);
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([]);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [activeTab, setActiveTab] = useState<'profile' | 'timeline' | 'tasks' | 'team' | 'meetings' | 'payments' | 'communications' | 'modules' | 'documents' | 'risks'>('profile');

  // Input states for creating objects
  const [isSeeding, setIsSeeding] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddMeetingModal, setShowAddMeetingModal] = useState(false);

  // New task form state
  const [newTask, setNewTask] = useState({
    title: '',
    assignedTo: 'Research Executive',
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    deadline: '',
    reminderDate: '',
    dependencies: '',
    comments: ''
  });

  // New meeting form state
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    dateTime: '',
    platform: 'Google Meet' as 'Google Meet' | 'Zoom' | 'In-Person',
    meetingNotes: '',
    actionItemsRaw: '',
    followUpRequired: false
  });

  // New Note state
  const [noteText, setNoteText] = useState('');

  // Communications tab state
  const [whatsappTemplate, setWhatsappTemplate] = useState('welcome');
  const [customEmailSubject, setCustomEmailSubject] = useState('');
  const [customEmailBody, setCustomEmailBody] = useState('');
  const [customCallNotes, setCustomCallNotes] = useState('');

  // Load Firestore data
  useEffect(() => {
    if (!user) return;

    // Listen to client_projects
    const unsubProjects = onSnapshot(collection(db, 'client_projects'), (snap) => {
      const list: ClientProject[] = [];
      snap.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as ClientProject);
      });
      setProjects(list);
    }, (err) => console.error(err));

    // Listen to project_tasks
    const unsubTasks = onSnapshot(collection(db, 'project_tasks'), (snap) => {
      const list: ProjectTask[] = [];
      snap.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as ProjectTask);
      });
      setTasks(list);
    }, (err) => console.error(err));

    // Listen to meetings
    const unsubMeetings = onSnapshot(collection(db, 'meetings'), (snap) => {
      const list: Meeting[] = [];
      snap.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Meeting);
      });
      setMeetings(list);
    }, (err) => console.error(err));

    // Listen to project_notes
    const unsubNotes = onSnapshot(collection(db, 'project_notes'), (snap) => {
      const list: ProjectNote[] = [];
      snap.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as ProjectNote);
      });
      // Sort notes chronologically
      list.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds);
      setNotes(list);
    }, (err) => console.error(err));

    // Listen to assigned_services
    const unsubServices = onSnapshot(collection(db, 'assigned_services'), (snap) => {
      const list: AssignedService[] = [];
      snap.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as AssignedService);
      });
      setAssignedServices(list);
    }, (err) => console.error(err));

    // Listen to risk_alerts
    const unsubRisks = onSnapshot(collection(db, 'risk_alerts'), (snap) => {
      const list: RiskAlert[] = [];
      snap.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as RiskAlert);
      });
      setRiskAlerts(list);
    }, (err) => console.error(err));

    return () => {
      unsubProjects();
      unsubTasks();
      unsubMeetings();
      unsubNotes();
      unsubServices();
      unsubRisks();
    };
  }, [user]);

  // Seed default demo data if Firestore is empty
  const seedDemoData = async () => {
    if (!user) return;
    setIsSeeding(true);
    try {
      // 1. Check if projects exist
      const pSnap = await getDocs(collection(db, 'client_projects'));
      if (!pSnap.empty) {
        success('Active projects found. Demosphere already initialized.');
        setIsSeeding(false);
        return;
      }

      // Initialize BSM details document
      await setDoc(doc(db, 'business_success_managers', user.uid), {
        name: user.displayName || 'Amit Kumar',
        email: user.email || 'bsm@biznxt.online',
        assignedCount: 3,
        kpiCompleted: 14,
        kpiCsat: 96,
        kpiRevenue: 345000,
        averageCompletionDays: 24,
        role: 'bsm'
      });

      // Sample Projects
      const demoProjects: Omit<ClientProject, 'id'>[] = [
        {
          clientName: 'Ketan Sharma',
          clientEmail: 'ketan.sharma@example.com',
          clientPhone: '+91 98765 43210',
          businessName: 'Sharma EV Charging Hub',
          businessCategory: 'EV Charging & Retail Spares',
          investmentAmount: '₹14,50,000',
          targetTimeline: '3 Months (Oct 2026)',
          currentTimelineStep: 'research',
          bsmId: user.uid,
          businessScore: 92,
          consultingFeePaid: true,
          totalServicePayments: 45000,
          totalPendingPayments: 25000,
          createdAt: new Date()
        },
        {
          clientName: 'Amara BioTech',
          clientEmail: 'sneha.roy@amarabiotech.in',
          clientPhone: '+91 88776 55443',
          businessName: 'Amara Bio-degradable Packaging',
          businessCategory: 'Industrial Sourcing & Supply Chain',
          investmentAmount: '₹35,00,000',
          targetTimeline: '6 Months (Jan 2027)',
          currentTimelineStep: 'consultation',
          bsmId: user.uid,
          businessScore: 84,
          consultingFeePaid: true,
          totalServicePayments: 120000,
          totalPendingPayments: 80000,
          createdAt: new Date()
        },
        {
          clientName: 'Vikas Agro Terminal',
          clientEmail: 'vikas.agro@rediffmail.com',
          clientPhone: '+91 77665 44332',
          businessName: 'Apex Cold-Chain Farm Storage',
          businessCategory: 'Cold Storage & Farm Logistics',
          investmentAmount: '₹48,00,000',
          targetTimeline: '4 Months (Nov 2026)',
          currentTimelineStep: 'lead_created',
          bsmId: user.uid,
          businessScore: 78,
          consultingFeePaid: false,
          totalServicePayments: 0,
          totalPendingPayments: 150000,
          createdAt: new Date()
        }
      ];

      for (const dp of demoProjects) {
        const docRef = await addDoc(collection(db, 'client_projects'), dp);
        
        // Seed historical timeline entries in the project_timeline collection
        await addDoc(collection(db, 'project_timeline'), {
          projectId: docRef.id,
          stepId: 'lead_created',
          changedBy: 'System Ingest',
          timestamp: new Date(),
          status: 'Completed'
        });
        
        if (dp.currentTimelineStep !== 'lead_created') {
          await addDoc(collection(db, 'project_timeline'), {
            projectId: docRef.id,
            stepId: 'consultation',
            changedBy: 'Senior Success Advisor',
            timestamp: new Date(),
            status: 'Completed'
          });
        }
        
        if (dp.currentTimelineStep === 'research') {
          await addDoc(collection(db, 'project_timeline'), {
            projectId: docRef.id,
            stepId: 'research',
            changedBy: 'Market Research Desk',
            timestamp: new Date(),
            status: 'Completed'
          });
        }

        // Seed initial tasks for this project
        await addDoc(collection(db, 'project_tasks'), {
          projectId: docRef.id,
          title: 'Review CapEx zoning report with researcher',
          assignedTo: 'Research Executive',
          priority: 'High',
          deadline: '2026-07-20',
          reminderDate: '2026-07-18',
          escalationStatus: false,
          status: 'Pending',
          dependencies: 'None',
          comments: 'Initial market density metrics show significant regional gap.',
          attachments: ['market_draft.pdf']
        });

        await addDoc(collection(db, 'project_tasks'), {
          projectId: docRef.id,
          title: 'Formulate preliminary GST entity declaration',
          assignedTo: 'CA',
          priority: 'Medium',
          deadline: '2026-07-28',
          reminderDate: '2026-07-26',
          escalationStatus: false,
          status: 'Pending',
          dependencies: 'Review CapEx zoning report',
          comments: 'Prepare LLP partnership agreement first.',
          attachments: []
        });

        // Seed initial meeting
        await addDoc(collection(db, 'meetings'), {
          projectId: docRef.id,
          title: 'Venture Alignment Call',
          dateTime: '2026-07-15T11:00',
          platform: 'Google Meet',
          meetingNotes: 'Scheduled initial brief with BSM to clarify land clearances.',
          actionItems: ['Submit layout sketches', 'Verify local FAME II subsidy eligibility'],
          followUpRequired: true,
          status: 'Scheduled'
        });

        // Seed default assigned services
        const rolesToSeed = [
          { role: 'researcher', name: 'Research Executive', prof: 'Sanjay Deshmukh' },
          { role: 'ca', name: 'Chartered Accountant (CA)', prof: 'Rajesh Mehta, FCA' },
          { role: 'lawyer', name: 'Corporate Lawyer', prof: 'Meenakshi Iyer, Adv' },
          { role: 'manufacturer', name: 'OEM Manufacturer', prof: 'Vedic Gears India' },
          { role: 'marketing', name: 'Marketing Agency', prof: 'SlingShot Media Agency' },
          { role: 'websiteteam', name: 'Website Team', prof: 'DevStudio Webcraft' }
        ];

        for (const r of rolesToSeed) {
          await addDoc(collection(db, 'assigned_services'), {
            projectId: docRef.id,
            id: r.role,
            serviceName: r.name,
            assignedProfessional: r.prof,
            status: 'Started',
            timeline: '3 Weeks',
            comments: 'Allocated during initial kickoff.',
            files: []
          });
        }

        // Seed some initial notes
        await addDoc(collection(db, 'project_notes'), {
          projectId: docRef.id,
          author: 'System BSM Engine',
          text: `Venture registered under success coordinator assigned BSM ID: ${user.uid}.`,
          timestamp: new Date()
        });

        // Seed a risk alert for Vikas Agro
        if (dp.clientName === 'Vikas Agro Terminal') {
          await addDoc(collection(db, 'risk_alerts'), {
            projectId: docRef.id,
            type: 'Pending Payment',
            description: 'Intake Consulting Fee invoice of ₹15,000 has expired.',
            severity: 'Critical',
            escalationRequired: true,
            resolved: false,
            createdAt: new Date()
          });
        }
      }

      success('biznxt.online BSM Enterprise Sandbox environment populated successfully!');
    } catch (err: any) {
      error('Failed to populate sandbox: ' + err.message);
    } finally {
      setIsSeeding(false);
    }
  };

  // Quick helper to fetch selected project data
  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const selectedProjectTasks = tasks.filter(t => t.projectId === selectedProjectId);
  const selectedProjectMeetings = meetings.filter(m => m.projectId === selectedProjectId);
  const selectedProjectNotes = notes.filter(n => n.projectId === selectedProjectId);
  const selectedProjectServices = assignedServices.filter(s => s.projectId === selectedProjectId);
  const selectedProjectRisks = riskAlerts.filter(r => r.projectId === selectedProjectId);

  // Search/Filter logic for Dashboard Clients
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.businessName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.businessCategory.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || p.currentTimelineStep === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // KPI Calculations
  const totalCSAT = 96;
  const totalProjectsCompleted = projects.filter(p => p.currentTimelineStep === 'expansion').length + 12;
  const totalRevenue = projects.reduce((acc, curr) => acc + curr.totalServicePayments, 280000);
  const pendingPaymentsSum = projects.reduce((acc, curr) => acc + curr.totalPendingPayments, 105000);
  const projectsAtRiskCount = riskAlerts.filter(r => !r.resolved && r.severity === 'Critical').length;

  // Add Task handler
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !newTask.title.trim()) return;

    try {
      await addDoc(collection(db, 'project_tasks'), {
        projectId: selectedProjectId,
        title: newTask.title.trim(),
        assignedTo: newTask.assignedTo,
        priority: newTask.priority,
        deadline: newTask.deadline || '2026-08-01',
        reminderDate: newTask.reminderDate || '2026-07-30',
        escalationStatus: false,
        status: 'Pending',
        dependencies: newTask.dependencies || 'None',
        comments: newTask.comments || '',
        attachments: []
      });

      // Add project audit note
      await addDoc(collection(db, 'project_notes'), {
        projectId: selectedProjectId,
        author: 'BSM System',
        text: `New delegated task added: "${newTask.title.trim()}" assigned to ${newTask.assignedTo}`,
        timestamp: new Date()
      });

      setNewTask({
        title: '',
        assignedTo: 'CA',
        priority: 'Medium',
        deadline: '',
        reminderDate: '',
        dependencies: '',
        comments: ''
      });
      setShowAddTaskModal(false);
      success('Delegated project task initialized & registered!');
    } catch (err: any) {
      error('Failed to create task: ' + err.message);
    }
  };

  // Add Meeting handler
  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !newMeeting.title.trim()) return;

    try {
      const itemsList = newMeeting.actionItemsRaw
        ? newMeeting.actionItemsRaw.split('\n').filter(i => i.trim() !== '')
        : [];

      await addDoc(collection(db, 'meetings'), {
        projectId: selectedProjectId,
        title: newMeeting.title.trim(),
        dateTime: newMeeting.dateTime || new Date().toISOString().substring(0, 16),
        platform: newMeeting.platform,
        meetingNotes: newMeeting.meetingNotes || '',
        actionItems: itemsList,
        followUpRequired: newMeeting.followUpRequired,
        status: 'Scheduled'
      });

      // Add project audit note
      await addDoc(collection(db, 'project_notes'), {
        projectId: selectedProjectId,
        author: 'BSM System',
        text: `Meeting scheduled: "${newMeeting.title.trim()}" on ${newMeeting.dateTime}`,
        timestamp: new Date()
      });

      setNewMeeting({
        title: '',
        dateTime: '',
        platform: 'Google Meet',
        meetingNotes: '',
        actionItemsRaw: '',
        followUpRequired: false
      });
      setShowAddMeetingModal(false);
      success('Google Calendar meeting and feedback dispatch ready!');
    } catch (err: any) {
      error('Failed to schedule meeting: ' + err.message);
    }
  };

  // Post Note handler
  const handlePostNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !noteText.trim() || !user) return;

    try {
      await addDoc(collection(db, 'project_notes'), {
        projectId: selectedProjectId,
        author: user.displayName || 'BSM',
        text: noteText.trim(),
        timestamp: new Date()
      });
      setNoteText('');
      success('Audit ledger memo logged!');
    } catch (err: any) {
      error('Failed to log note: ' + err.message);
    }
  };

  // Update Timeline Step
  const handleUpdateTimelineStep = async (stepId: string) => {
    if (!selectedProjectId) return;
    try {
      const pRef = doc(db, 'client_projects', selectedProjectId);
      await updateDoc(pRef, { currentTimelineStep: stepId });

      await addDoc(collection(db, 'project_notes'), {
        projectId: selectedProjectId,
        author: 'BSM System',
        text: `Venture roadmap stage advanced to: ${stepId.toUpperCase()}`,
        timestamp: new Date()
      });

      // Maintain project_timeline collection for timeline audit
      await addDoc(collection(db, 'project_timeline'), {
        projectId: selectedProjectId,
        stepId,
        changedBy: user?.displayName || 'Business Success Manager',
        timestamp: new Date(),
        status: 'Completed'
      });

      success(`Timeline step updated to: ${stepId.toUpperCase()}`);
    } catch (err: any) {
      error('Failed to update stage: ' + err.message);
    }
  };

  // Update Professional service status
  const handleUpdateServiceStatus = async (serviceId: string, status: 'Pending' | 'Started' | 'Completed' | 'Blocked') => {
    if (!selectedProjectId) return;
    try {
      // Find the specific document
      const svcDoc = selectedProjectServices.find(s => s.id === serviceId || s.serviceName.includes(serviceId));
      if (svcDoc) {
        const sRef = doc(db, 'assigned_services', svcDoc.id);
        await updateDoc(sRef, { status });
        success(`Service status updated to ${status}`);
      } else {
        // Create it if not present
        await addDoc(collection(db, 'assigned_services'), {
          projectId: selectedProjectId,
          id: serviceId,
          serviceName: serviceId,
          assignedProfessional: 'Expert Partner',
          status,
          timeline: 'Varies',
          comments: 'Updated in workspace.',
          files: []
        });
        success(`New service node initialized & marked ${status}`);
      }
    } catch (err: any) {
      error('Failed to update service status: ' + err.message);
    }
  };

  // Add custom risk alert
  const handleCreateRisk = async (type: RiskAlert['type'], desc: string, severity: RiskAlert['severity']) => {
    if (!selectedProjectId) return;
    try {
      await addDoc(collection(db, 'risk_alerts'), {
        projectId: selectedProjectId,
        type,
        description: desc,
        severity,
        escalationRequired: true,
        resolved: false,
        createdAt: new Date()
      });
      success('Risk ledger incident created successfully!');
    } catch (err: any) {
      error('Failed to create risk: ' + err.message);
    }
  };

  // Resolve risk alert
  const handleResolveRisk = async (riskId: string) => {
    try {
      const rRef = doc(db, 'risk_alerts', riskId);
      await updateDoc(rRef, { resolved: true, escalationRequired: false });
      success('Risk resolved and marked clear.');
    } catch (err: any) {
      error('Failed to clear risk.');
    }
  };

  // Update Task Completion
  const handleToggleTaskStatus = async (taskId: string, current: string) => {
    try {
      const tRef = doc(db, 'project_tasks', taskId);
      const nextStatus = current === 'Pending' ? 'Completed' : 'Pending';
      await updateDoc(tRef, { status: nextStatus });
      success(`Task marked as ${nextStatus}!`);
    } catch (err: any) {
      error('Failed to change task status.');
    }
  };

  return (
    <div className="flex-1 bg-slate-50 p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 border-b border-slate-200/60 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-2xl bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200/50">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Enterprise Lead Workspace</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-slate-900 mt-2 tracking-tight">
              Business Success Manager Platform
            </h1>
            <p className="text-slate-500 mt-1 max-w-2xl text-sm leading-relaxed">
              Consolidated 10-Tier advisory, professional logistics, financial cashbacks, and customer milestone tracking from intake to regional expansion.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={seedDemoData}
              disabled={isSeeding}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2.5 px-4 rounded-2xl transition-all shadow-sm flex items-center gap-1.5"
            >
              {isSeeding ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Seeding Demosphere...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Seed Demo Workspace</span>
                </>
              )}
            </button>
            
            {projects.length > 0 && selectedProjectId && (
              <button
                onClick={() => setSelectedProjectId(null)}
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-2xl transition-all"
              >
                Back to Dashboard
              </button>
            )}
          </div>
        </div>

        {/* Dashboard Parent / Client Profile Detail Toggle */}
        {!selectedProjectId ? (
          /* ========================================== */
          /* 1. PARENT EXECUTIVE METRICS & CLIENTS BOARD */
          /* ========================================== */
          <div className="space-y-8">
            {/* KPI Panels Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-card bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Completed Launches</span>
                  <span className="text-3xl font-display font-bold text-slate-900 block">{totalProjectsCompleted}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> +18% Target Gain
                  </span>
                </div>
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold">
                  ✓
                </div>
              </div>

              <div className="glass-card bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Customer CSAT</span>
                  <span className="text-3xl font-display font-bold text-slate-900 block">{totalCSAT}%</span>
                  <span className="text-[10px] text-indigo-600 font-semibold block">Top Rating in India Desk</span>
                </div>
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold">
                  ★
                </div>
              </div>

              <div className="glass-card bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Intake Seed Revenue</span>
                  <span className="text-3xl font-display font-bold text-slate-900 block">₹{totalRevenue.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-500 font-semibold block">Consultation + Registration Fees</span>
                </div>
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center font-bold">
                  ₹
                </div>
              </div>

              <div className="glass-card bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Projects At Risk</span>
                  <span className="text-3xl font-display font-bold text-primary-dark block">{projectsAtRiskCount}</span>
                  <span className="text-[10px] text-primary font-semibold block">Escalation Required</span>
                </div>
                <div className="w-12 h-12 bg-rose-50 text-primary-dark rounded-2xl flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Main Board and Secondary Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Today's Clients List */}
              <div className="lg:col-span-2 space-y-6">
                <div className="glass-card bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                  
                  {/* Filters Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4 mb-6">
                    <div>
                      <h3 className="font-bold text-slate-950 text-lg">Today's Assigned Clients</h3>
                      <p className="text-xs text-slate-500">Manage, review, and coordinate client projects directly.</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search clients..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="bg-slate-50 border border-slate-200 text-xs text-slate-800 pl-8 pr-3 py-1.5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-indigo-500 w-44"
                        />
                      </div>

                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-xs text-slate-800 px-2 py-1.5 rounded-2xl focus:outline-none"
                      >
                        <option value="All">All Steps</option>
                        <option value="lead_created">Lead Created</option>
                        <option value="consultation">Consultation</option>
                        <option value="research">Research</option>
                        <option value="planning">Planning</option>
                        <option value="approval">Approval</option>
                        <option value="execution">Execution</option>
                        <option value="growth">Growth</option>
                        <option value="expansion">Expansion</option>
                      </select>
                    </div>
                  </div>

                  {filteredProjects.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      <Users className="w-12 h-12 mx-auto text-slate-400 mb-3" />
                      <p className="text-sm font-semibold">No assigned venture portfolios found.</p>
                      <p className="text-xs text-slate-500 mt-1">Click "Seed Demo Workspace" to populate the active pipeline instantly.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredProjects.map((p) => {
                        const projectTasksPending = tasks.filter(t => t.projectId === p.id && t.status === 'Pending').length;
                        const isRiskCritical = riskAlerts.some(r => r.projectId === p.id && !r.resolved && r.severity === 'Critical');
                        
                        return (
                          <div 
                            key={p.id}
                            className={`p-4 border rounded-2xl hover:border-slate-300 transition-all bg-white relative group cursor-pointer ${
                              isRiskCritical ? 'border-rose-200 hover:border-rose-300 bg-rose-50/5' : 'border-slate-100'
                            }`}
                            onClick={() => setSelectedProjectId(p.id)}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-slate-950 text-base">{p.businessName}</h4>
                                  <span className="text-xs px-2.5 py-0.5 rounded-2xl font-bold bg-slate-100 text-slate-700 capitalize">
                                    {p.currentTimelineStep.replace('_', ' ')}
                                  </span>
                                  {isRiskCritical && (
                                    <span className="text-[10px] bg-primary text-white px-1.5 py-0.2 rounded-2xl font-bold uppercase tracking-widest animate-pulse">
                                      Critical Risk
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-500">
                                  Client: <strong className="text-slate-800">{p.clientName}</strong> • Category: {p.businessCategory}
                                </p>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 font-mono">
                                  <span>Investment: {p.investmentAmount}</span>
                                  <span>Timeline: {p.targetTimeline}</span>
                                  <span>Score: {p.businessScore}/100</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 shrink-0 sm:self-center">
                                <div className="text-right">
                                  <span className="text-xs block text-slate-500 font-medium">Pending Tasks</span>
                                  <span className="text-sm font-bold text-slate-800 block">{projectTasksPending} Action Items</span>
                                </div>
                                <div className="w-8 h-8 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-100 transition-all">
                                  <ChevronRight className="w-4 h-4" />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>
              </div>

              {/* Right Column: Platform Operations Alerts & Action Items */}
              <div className="space-y-6">
                
                {/* At-Risk / Escalation Queue */}
                <div className="glass-card bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                  <h4 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-primary" />
                    Priority Risks & Escalations
                  </h4>
                  {riskAlerts.filter(r => !r.resolved).length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4">No active threat alerts in the ledger. All systems normal.</p>
                  ) : (
                    <div className="space-y-3">
                      {riskAlerts.filter(r => !r.resolved).map((risk) => {
                        const proj = projects.find(p => p.id === risk.projectId);
                        return (
                          <div key={risk.id} className="p-3 bg-rose-50/50 border border-primary/20 rounded-2xl space-y-1.5 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-rose-700 capitalize">{risk.type}</span>
                              <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 text-[9px] font-bold uppercase">{risk.severity}</span>
                            </div>
                            <p className="text-slate-600 leading-relaxed">{risk.description}</p>
                            {proj && <p className="text-[10px] text-slate-500 font-medium">Project: {proj.businessName}</p>}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleResolveRisk(risk.id);
                              }}
                              className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 block text-right w-full"
                            >
                              Resolve Event ✓
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Scheduled Today Itinerary */}
                <div className="glass-card bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                  <h4 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    Advisory Cal Meetings ({meetings.length})
                  </h4>
                  {meetings.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4">No strategy consultations scheduled.</p>
                  ) : (
                    <div className="space-y-3">
                      {meetings.slice(0, 3).map((meet) => {
                        const p = projects.find(proj => proj.id === meet.projectId);
                        return (
                          <div key={meet.id} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl space-y-1 text-xs">
                            <h5 className="font-bold text-slate-900">{meet.title}</h5>
                            <p className="text-slate-500 text-[11px]">{new Date(meet.dateTime).toLocaleDateString()} • {new Date(meet.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100/60">
                              <span>Venture: {p?.businessName || 'Sharma EV'}</span>
                              <span className="text-indigo-600 font-bold">{meet.platform}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        ) : (
          /* ========================================== */
          /* 2. COMPREHENSIVE CLIENT PROFILE DETAIL VIEW */
          /* ========================================== */
          <div className="space-y-8">
            
            {/* Project Quick Header Panel */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden shadow-md">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent opacity-50" />
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest bg-indigo-600 text-indigo-100 px-3 py-1 rounded-2xl border border-indigo-500/30">
                      Active Managed Venture
                    </span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      Business Score: {selectedProject?.businessScore}/100
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold">{selectedProject?.businessName}</h2>
                  <p className="text-slate-400 text-sm">
                    Owner: <strong className="text-white">{selectedProject?.clientName}</strong> • {selectedProject?.clientEmail} • {selectedProject?.clientPhone}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 text-xs shrink-0 bg-white/5 p-4 rounded-2xl border border-white/10 font-mono">
                  <div>
                    <span className="text-slate-500 block">CapEx Investment</span>
                    <span className="font-bold text-white text-base mt-0.5 block">{selectedProject?.investmentAmount}</span>
                  </div>
                  <div className="border-l border-white/10 pl-4">
                    <span className="text-slate-500 block">Consulting Fee</span>
                    <span className={`font-bold text-xs mt-1 block py-0.5 px-2 rounded ${
                      selectedProject?.consultingFeePaid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-primary/20 text-rose-400'
                    }`}>
                      {selectedProject?.consultingFeePaid ? 'PAID ✓' : 'UNPAID'}
                    </span>
                  </div>
                  <div className="border-l border-white/10 pl-4">
                    <span className="text-slate-500 block">Timeline target</span>
                    <span className="font-bold text-white block mt-0.5">{selectedProject?.targetTimeline}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Tab Navigation */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
              {[
                { id: 'profile', label: 'Client Profile' },
                { id: 'timeline', label: 'Client Timeline' },
                { id: 'tasks', label: 'Task Management' },
                { id: 'team', label: 'Team Assignment' },
                { id: 'meetings', label: 'Consultation Calendar' },
                { id: 'payments', label: 'Payments & Fee' },
                { id: 'communications', label: 'Communication Hub' },
                { id: 'modules', label: '12-Module Status' },
                { id: 'documents', label: 'Document Vault' },
                { id: 'risks', label: 'Risk Incident Centre' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
                    activeTab === tab.id 
                      ? 'bg-slate-900 text-white shadow-sm' 
                      : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left 2 Columns: Main active Tab Workspace */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Tab 1: Client Profile */}
                {activeTab === 'profile' && (
                  <div className="glass-card bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
                    <h3 className="font-bold text-slate-900 text-lg">General Portfolio Summary</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                      <div className="space-y-4">
                        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                          <span className="text-xs text-slate-500 font-bold block uppercase tracking-wider">Business Sector Category</span>
                          <span className="font-semibold text-slate-800">{selectedProject?.businessCategory}</span>
                        </div>
                        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                          <span className="text-xs text-slate-500 font-bold block uppercase tracking-wider">Project Launch BSM</span>
                          <span className="font-semibold text-slate-800">Assigned Coordinator (ID: {selectedProject?.bsmId})</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                          <span className="text-xs text-slate-500 font-bold block uppercase tracking-wider">Venture Launch Score</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-950 text-lg">{selectedProject?.businessScore}/100</span>
                            <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Optimal Feasibility</span>
                          </div>
                        </div>
                        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                          <span className="text-xs text-slate-500 font-bold block uppercase tracking-wider">Created Stamp</span>
                          <span className="font-mono text-slate-600 text-xs">
                            {selectedProject?.createdAt?.toDate ? selectedProject.createdAt.toDate().toLocaleString() : 'Registered'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-6 space-y-4">
                      <h4 className="font-bold text-slate-900 text-sm">Pre-populated AI Feasibility Study Recommendations</h4>
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 font-mono">
                        "Under India's MSME initiatives, CGTMSE credit schemes, and regional state industrial plans, the industry is entering a highly subsidized consolidation phase. Organized players comprise only 28% of the market share, leaving a massive 72% fragmentation tier ready for capture by structured, digitally integrated brands."
                      </p>
                    </div>
                  </div>
                )}

                {/* Tab 2: Client Timeline */}
                {activeTab === 'timeline' && (
                  <div className="glass-card bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">Venture Success Roadmap Timeline</h3>
                      <p className="text-xs text-slate-500 mt-1">Track and transition the primary stage of the entrepreneur client journey.</p>
                    </div>

                    <div className="space-y-6">
                      {TIMELINE_STEPS.map((step, idx) => {
                        const isCurrent = selectedProject?.currentTimelineStep === step.id;
                        // Simplistic index comparison to check completed steps
                        const currentStepIndex = TIMELINE_STEPS.findIndex(s => s.id === selectedProject?.currentTimelineStep);
                        const isCompleted = idx < currentStepIndex;

                        return (
                          <div key={step.id} className="flex gap-4 relative">
                            {idx < TIMELINE_STEPS.length - 1 && (
                              <div className={`absolute left-4 top-8 bottom-0 w-0.5 ${isCompleted ? 'bg-indigo-600' : 'bg-slate-100'}`} />
                            )}
                            
                            <button
                              onClick={() => handleUpdateTimelineStep(step.id)}
                              className={`w-8 h-8 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                                isCurrent 
                                  ? 'bg-slate-900 text-white ring-4 ring-slate-100' 
                                  : isCompleted 
                                    ? 'bg-indigo-600 text-white' 
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                              }`}
                            >
                              {isCompleted ? '✓' : idx + 1}
                            </button>

                            <div className="space-y-1">
                              <h4 className={`font-bold text-sm ${isCurrent ? 'text-slate-950 font-extrabold' : 'text-slate-800'}`}>
                                {step.label} {isCurrent && '(Active Stage)'}
                              </h4>
                              <p className="text-xs text-slate-500 max-w-lg leading-relaxed">{step.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tab 3: Task Management */}
                {activeTab === 'tasks' && (
                  <div className="glass-card bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">Project Delegated Tasks</h3>
                        <p className="text-xs text-slate-500">Track task lists assigned to various professionals and team members.</p>
                      </div>
                      <button
                        onClick={() => setShowAddTaskModal(true)}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2 px-3 rounded-2xl flex items-center gap-1 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create Task</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {selectedProjectTasks.length === 0 ? (
                        <p className="text-xs text-slate-500 text-center py-8">No tasks logged for this project. Ready to initialize.</p>
                      ) : (
                        selectedProjectTasks.map((task) => (
                          <div 
                            key={task.id} 
                            className={`p-4 border rounded-2xl flex items-center justify-between gap-4 transition-all ${
                              task.status === 'Completed' ? 'bg-slate-50/50 border-slate-100 opacity-70' : 'border-slate-100 bg-white hover:border-slate-200'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className={`font-bold text-sm ${task.status === 'Completed' ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                                  {task.title}
                                </h4>
                                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                                  task.priority === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {task.priority}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500">Assigned To: <strong className="text-slate-700">{task.assignedTo}</strong> • Due: {task.deadline}</p>
                              {task.comments && <p className="text-[11px] text-slate-500 italic">"{task.comments}"</p>}
                            </div>

                            <button
                              onClick={() => handleToggleTaskStatus(task.id, task.status)}
                              className={`w-7 h-7 rounded-2xl flex items-center justify-center border-2 transition-all ${
                                task.status === 'Completed' 
                                  ? 'bg-emerald-500 border-emerald-500 text-white' 
                                  : 'border-slate-200 hover:border-slate-400 text-transparent hover:text-slate-500'
                              }`}
                            >
                              ✓
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Tab 4: Team Assignment */}
                {activeTab === 'team' && (
                  <div className="glass-card bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">Partner Team Allocations</h3>
                      <p className="text-xs text-slate-500 mt-1">Assign and coordinate status updates of central and regional experts.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { role: 'researcher', name: 'Research Executive' },
                        { role: 'ca', name: 'Chartered Accountant (CA)' },
                        { role: 'lawyer', name: 'Corporate Lawyer' },
                        { role: 'manufacturer', name: 'OEM Manufacturer' },
                        { role: 'marketing', name: 'Marketing Agency' },
                        { role: 'websiteteam', name: 'Website Team' },
                        { role: 'packaging', name: 'Packaging Designer' },
                        { role: 'branding', name: 'Branding Strategist' },
                        { role: 'loan', name: 'Loan Partner' },
                        { role: 'importexport', name: 'Import Export Expert' },
                        { role: 'insurance', name: 'Insurance Desk' },
                        { role: 'recruitment', name: 'Recruitment Officer' }
                      ].map((item) => {
                        const allocation = selectedProjectServices.find(s => s.id === item.role || s.serviceName.toLowerCase() === item.name.toLowerCase());
                        const status = allocation?.status || 'Pending';
                        
                        return (
                          <div key={item.role} className="p-4 border border-slate-100 rounded-2xl space-y-3 bg-slate-50/20">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold text-slate-950 text-xs">{item.name}</h4>
                                <p className="text-[10px] text-slate-500 font-medium">Assigned: {allocation?.assignedProfessional || 'Not Assigned'}</p>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide ${
                                status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 
                                status === 'Started' ? 'bg-blue-100 text-blue-800' : 
                                status === 'Blocked' ? 'bg-rose-100 text-rose-800 animate-pulse' : 
                                'bg-slate-100 text-slate-500'
                              }`}>
                                {status}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {(['Pending', 'Started', 'Completed', 'Blocked'] as const).map((st) => (
                                <button
                                  key={st}
                                  onClick={() => handleUpdateServiceStatus(item.role, st)}
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold border transition-all ${
                                    status === st 
                                      ? 'bg-slate-900 text-white border-slate-900' 
                                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-500'
                                  }`}
                                >
                                  {st}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tab 5: Consultation Calendar */}
                {activeTab === 'meetings' && (
                  <div className="glass-card bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">Scheduled Meetings</h3>
                        <p className="text-xs text-slate-500">Coordinate and verify client advisor discussions & action items.</p>
                      </div>
                      <button
                        onClick={() => setShowAddMeetingModal(true)}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2 px-3 rounded-2xl flex items-center gap-1 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Schedule Meeting</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {selectedProjectMeetings.length === 0 ? (
                        <p className="text-xs text-slate-500 text-center py-8">No scheduled consultations found. Create one now.</p>
                      ) : (
                        selectedProjectMeetings.map((meet) => (
                          <div key={meet.id} className="p-4 border border-slate-100 rounded-2xl space-y-3 bg-white">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold text-slate-900 text-sm">{meet.title}</h4>
                                <p className="text-xs text-slate-500 mt-0.5">
                                  {new Date(meet.dateTime).toLocaleDateString()} • {new Date(meet.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} ({meet.platform})
                                </p>
                              </div>
                              <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-2xl font-bold uppercase tracking-wide">
                                Google Calendar Sync
                              </span>
                            </div>

                            {meet.meetingNotes && (
                              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                <strong>Notes:</strong> {meet.meetingNotes}
                              </p>
                            )}

                            {meet.actionItems && meet.actionItems.length > 0 && (
                              <div className="space-y-1 text-xs">
                                <span className="font-bold text-slate-700">Action Items:</span>
                                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                                  {meet.actionItems.map((item, i) => (
                                    <li key={i}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Tab 6: Payments */}
                {activeTab === 'payments' && (
                  <div className="glass-card bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
                    <h3 className="font-bold text-slate-900 text-lg">Venture Payments Ledger</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-2xl space-y-1">
                        <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider block">Total Service Paid</span>
                        <span className="text-2xl font-display font-bold text-slate-900">₹{selectedProject?.totalServicePayments.toLocaleString()}</span>
                      </div>
                      <div className="p-4 bg-rose-50/40 border border-primary/20 rounded-2xl space-y-1">
                        <span className="text-xs text-rose-700 font-bold uppercase tracking-wider block">Total Pending Invoice</span>
                        <span className="text-2xl font-display font-bold text-slate-900">₹{selectedProject?.totalPendingPayments.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-bold text-slate-900 text-sm">Active Invoices</h4>
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-950">Venture Ingest Consultation Invoice</p>
                          <p className="text-[10px] text-slate-500 font-mono">Invoice Ref: INV-2026-904</p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase">PAID</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-950">LLP Entity Registration + Stamp Duty</p>
                          <p className="text-[10px] text-slate-500 font-mono">Invoice Ref: INV-2026-905</p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold uppercase">PENDING</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 7: Communications */}
                {activeTab === 'communications' && (
                  <div className="glass-card bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
                    <h3 className="font-bold text-slate-900 text-lg">WhatsApp & Email Client Dispatch</h3>
                    
                    <div className="space-y-4">
                      {/* WhatsApp Pre-templated dispatch */}
                      <div className="p-4 bg-indigo-50/20 border border-indigo-100 rounded-2xl space-y-3">
                        <h4 className="font-bold text-slate-900 text-xs">WhatsApp Direct Templates</h4>
                        <div className="flex gap-2">
                          {['welcome', 'milestone_ready', 'payment_pending', 'meeting_rescheduled'].map((t) => (
                            <button
                              key={t}
                              onClick={() => setWhatsappTemplate(t)}
                              className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-all ${
                                whatsappTemplate === t ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {t.replace('_', ' ')}
                            </button>
                          ))}
                        </div>
                        
                        <p className="text-xs text-slate-600 leading-relaxed font-mono bg-white p-3 rounded-2xl border border-slate-100">
                          {whatsappTemplate === 'welcome' && `Hello ${selectedProject?.clientName}, Welcome to biznxt.online! Your dedicated Business Success Manager has been assigned. Log in now to view your venture timeline.`}
                          {whatsappTemplate === 'milestone_ready' && `Hi ${selectedProject?.clientName}, clean news! Your next major venture milestone has been signed off and cleared by the consultant board.`}
                          {whatsappTemplate === 'payment_pending' && `Urgent Notice: Hi ${selectedProject?.clientName}, invoice INV-2026-905 for company registration stamp duty remains pending in your ledger.`}
                          {whatsappTemplate === 'meeting_rescheduled' && `Hello ${selectedProject?.clientName}, your strategy call has been locked in on Google Calendar. See you soon!`}
                        </p>

                        <button
                          onClick={() => success('WhatsApp template dispatch processed successfully!')}
                          className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-2xl transition-all"
                        >
                          Send WhatsApp Blast
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 8: 12-Module Status */}
                {activeTab === 'modules' && (
                  <div className="glass-card bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">12-Module Service Delivery Control</h3>
                      <p className="text-xs text-slate-500">Set active operational completion statuses across the 12 core channels.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {MODULE_LIST.map((mod) => {
                        const service = selectedProjectServices.find(s => s.id === mod.id || s.serviceName.toLowerCase().includes(mod.label.toLowerCase()));
                        const activeStatus = service?.status || 'Pending';
                        
                        return (
                          <div key={mod.id} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between text-xs">
                            <div>
                              <p className="font-bold text-slate-900">{mod.label}</p>
                              <p className="text-[10px] text-slate-500">Current Node State</p>
                            </div>

                            <select
                              value={activeStatus}
                              onChange={(e) => handleUpdateServiceStatus(mod.id, e.target.value as any)}
                              className="bg-white border border-slate-200 text-xs text-slate-800 px-2 py-1 rounded-2xl focus:outline-none"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Started">Started</option>
                              <option value="Completed">Completed</option>
                              <option value="Blocked">Blocked</option>
                            </select>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tab 9: Documents */}
                {activeTab === 'documents' && (
                  <div className="glass-card bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
                    <h3 className="font-bold text-slate-900 text-lg">Document Vault</h3>
                    
                    <div className="space-y-3">
                      {[
                        { title: 'Partnership LLP Corporate Deed', file: 'LLP_Deed_SharmaEV.pdf', sz: '1.4 MB' },
                        { title: 'Central GST Compliance Certificate', file: 'GST_Approval_ शर्मा_EV.pdf', sz: '650 KB' },
                        { title: 'A.I. Feasibility Report Final PDF', file: 'BIZNXT_EV_Study_R8924.pdf', sz: '3.1 MB' },
                        { title: 'Venture Seed Fund Agreement', file: 'Seed_Agreement_V1.pdf', sz: '2.2 MB' }
                      ].map((doc, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-indigo-500" />
                            <div>
                              <p className="font-bold text-slate-900">{doc.title}</p>
                              <p className="text-[10px] text-slate-500 font-mono">{doc.file} • {doc.sz}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => success(`${doc.title} initiated for secure client download!`)}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                          >
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 10: Risk Alerts */}
                {activeTab === 'risks' && (
                  <div className="glass-card bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">Risk Incidents Board</h3>
                        <p className="text-xs text-slate-500">Track expired schedules, missing files, or payment blockages.</p>
                      </div>
                      <button
                        onClick={() => handleCreateRisk('Delay', 'Project delivery schedule delayed past initial target timeline.', 'Warning')}
                        className="bg-primary-dark hover:bg-rose-700 text-white font-semibold text-xs py-2 px-3 rounded-2xl transition-colors"
                      >
                        Raise Warning Alert
                      </button>
                    </div>

                    <div className="space-y-3">
                      {selectedProjectRisks.length === 0 ? (
                        <p className="text-xs text-slate-500 text-center py-8">No risks registered for this project portfolio.</p>
                      ) : (
                        selectedProjectRisks.map((risk) => (
                          <div 
                            key={risk.id} 
                            className={`p-4 border rounded-2xl flex items-center justify-between text-xs ${
                              risk.resolved ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-rose-50/10 border-rose-200'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-sm">{risk.type}</span>
                                <span className={`text-[9px] font-bold px-2 py-0.2 rounded ${
                                  risk.severity === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {risk.severity}
                                </span>
                              </div>
                              <p className="text-slate-600">{risk.description}</p>
                            </div>

                            {!risk.resolved && (
                              <button
                                onClick={() => handleResolveRisk(risk.id)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-1.5 px-3 rounded-2xl transition-colors"
                              >
                                Mark Clear
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

              </div>

              {/* Right Column: Persistent Audit Ledger Notes Panel */}
              <div className="space-y-6">
                
                {/* Audit Memos Logger */}
                <div className="glass-card bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-indigo-500" />
                    BSM Project Memo Ledger
                  </h4>

                  <form onSubmit={handlePostNote} className="space-y-2">
                    <textarea
                      placeholder="Type a persistent client note or event log entry..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-50 text-xs text-slate-800 p-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2 rounded-2xl transition-all"
                    >
                      Log Ledger Entry
                    </button>
                  </form>

                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {selectedProjectNotes.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-4">No audit notes recorded yet.</p>
                    ) : (
                      selectedProjectNotes.map((note) => (
                        <div key={note.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-xs">
                          <div className="flex items-center justify-between text-slate-500 text-[10px] font-mono">
                            <span className="font-bold text-slate-700">{note.author}</span>
                            <span>
                              {note.timestamp?.toDate ? note.timestamp.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Log'}
                            </span>
                          </div>
                          <p className="text-slate-600 leading-relaxed font-mono">{note.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Assigned Experts Overview */}
                <div className="glass-card bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4">
                  <h4 className="font-bold text-sm tracking-wide">Allocated Experts Pipeline</h4>
                  <div className="space-y-3">
                    {[
                      { role: 'Research Expert', prof: 'Sanjay Deshmukh' },
                      { role: 'Chartered Accountant (CA)', prof: 'Rajesh Mehta, FCA' },
                      { role: 'Corporate Lawyer', prof: 'Meenakshi Iyer, Adv' }
                    ].map((exp, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs pb-2 border-b border-white/5">
                        <div>
                          <span className="text-slate-500 text-[10px] block">{exp.role}</span>
                          <span className="font-bold text-slate-100">{exp.prof}</span>
                        </div>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold uppercase py-0.5 px-2 rounded">
                          Connected
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>

      {/* MODAL 1: ADD DELEGATED TASK */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Initialize Delegated Task</h3>
            
            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Task Title / Deliverable Name</label>
                <input
                  type="text"
                  placeholder="e.g. Conduct second-round EV zone mapping"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  required
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-2xl text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Assigned Partner Professional</label>
                  <select
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-2xl text-slate-800"
                  >
                    <option value="Research Executive">Research Executive</option>
                    <option value="CA">Chartered Accountant (CA)</option>
                    <option value="Lawyer">Corporate Lawyer</option>
                    <option value="Manufacturer">OEM Manufacturer</option>
                    <option value="Marketing Agency">Marketing Agency</option>
                    <option value="Website Team">Website Team</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-2xl text-slate-800"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-2xl text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Reminder Trigger Date</label>
                  <input
                    type="date"
                    value={newTask.reminderDate}
                    onChange={(e) => setNewTask({...newTask, reminderDate: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-2xl text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Dependencies</label>
                <input
                  type="text"
                  placeholder="e.g. GST portal receipt must be signed off"
                  value={newTask.dependencies}
                  onChange={(e) => setNewTask({...newTask, dependencies: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-2xl text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Scope Comments</label>
                <textarea
                  placeholder="Add scope details or description notes..."
                  value={newTask.comments}
                  onChange={(e) => setNewTask({...newTask, comments: e.target.value})}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-2xl text-slate-800"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-2xl transition-colors"
                >
                  Create Task Node
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-2xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: SCHEDULE STRATEGY MEETING */}
      {showAddMeetingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Schedule Client strategy meeting</h3>
            
            <form onSubmit={handleCreateMeeting} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Meeting Title</label>
                <input
                  type="text"
                  placeholder="e.g. CapEx and LLC structure final check"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                  required
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-2xl text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Platform</label>
                  <select
                    value={newMeeting.platform}
                    onChange={(e) => setNewMeeting({...newMeeting, platform: e.target.value as any})}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-2xl text-slate-800"
                  >
                    <option value="Google Meet">Google Meet</option>
                    <option value="Zoom">Zoom</option>
                    <option value="In-Person">In-Person</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={newMeeting.dateTime}
                    onChange={(e) => setNewMeeting({...newMeeting, dateTime: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-2xl text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Pre-Call Advisor Notes</label>
                <textarea
                  placeholder="Brief context for the Google Calendar invite description..."
                  value={newMeeting.meetingNotes}
                  onChange={(e) => setNewMeeting({...newMeeting, meetingNotes: e.target.value})}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-2xl text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Draft Action Items (one per line)</label>
                <textarea
                  placeholder="Verify bank NOC&#10;Approve GST draft"
                  value={newMeeting.actionItemsRaw}
                  onChange={(e) => setNewMeeting({...newMeeting, actionItemsRaw: e.target.value})}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-2xl text-slate-800"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="followUp"
                  checked={newMeeting.followUpRequired}
                  onChange={(e) => setNewMeeting({...newMeeting, followUpRequired: e.target.checked})}
                  className="rounded border-slate-300 text-indigo-600"
                />
                <label htmlFor="followUp" className="text-slate-600 font-semibold select-none">
                  Request automatic follow-up and notification dispatch
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-2xl transition-colors"
                >
                  Schedule Invite
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddMeetingModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-2xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
