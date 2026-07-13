import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Check, 
  ChevronRight, 
  Upload, 
  ArrowRight, 
  Clock, 
  Award, 
  Users, 
  MessageSquare, 
  Download, 
  Shield, 
  Star, 
  Sparkles, 
  Info, 
  Plus, 
  AlertCircle, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  HelpCircle,
  RefreshCw,
  Send,
  Eye,
  CheckCircle2,
  Trash2,
  Lock,
  UserCheck,
  Filter,
  AlertTriangle,
  FolderOpen,
  Activity,
  PlusCircle,
  CheckSquare,
  Bookmark,
  Share2,
  CheckSquare2,
  ListTodo,
  Play,
  Pause
} from 'lucide-react';
import { db } from '../lib/firebase';
import LocationMap from './LocationMap';
import ResearchFeedbackDialog from './research/ResearchFeedbackDialog';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  doc, 
  updateDoc, 
  onSnapshot, 
  serverTimestamp,
  getDoc,
  setDoc,
  deleteDoc
} from 'firebase/firestore';

// Types passed from parent
interface ResearchTicket {
  id: string;
  ticketNumber: string;
  orderId: string;
  userId: string;
  userEmail: string;
  userName: string;
  packageId: string;
  packageName: string;
  businessCategory: string;
  businessType: string;
  investment: string;
  location: string;
  createdAt: any;
  updatedAt: any;
  dueDate: string;
  status: string;
  priority: 'High' | 'Medium' | 'Low';
  assignedExecutive: string;
  assignedQALead?: string;
  comments: { sender: string; senderRole: string; message: string; timestamp: any }[];
  internalNotes: string;
  findings?: {
    marketSize?: string;
    competitors?: string;
    financialEstimates?: string;
    swotAnalysis?: string;
    roadmap?: string;
    locationAnalysis?: string;
    customAnswers?: string;
  };
}

interface ResearchTeamWorkspaceProps {
  tickets: ResearchTicket[];
  selectedTicketId: string | null;
  setSelectedTicketId: (id: string | null) => void;
  user: any;
  role: string | null;
  activeRole: string;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  handleUpdateStatus: (status: string) => Promise<void>;
  handleAssignExecutive: (name: string) => Promise<void>;
  handleSaveFindings: () => Promise<void>;
  handleSaveInternalNotes: () => Promise<void>;
  handleAddComment: (e: React.FormEvent) => Promise<void>;
  handleDownloadReportPDF: (ticket: ResearchTicket) => void;
  STATUS_FLOW: { id: string; label: string; color: string }[];
}

// 10 manual research sections
interface ManualFindings {
  marketFindings: string;
  competitorNotes: string;
  investmentObservations: string;
  customerProfile: string;
  locationAssessment: string;
  supplierNotes: string;
  manufacturerNotes: string;
  growthOpportunities: string;
  risks: string;
  recommendations: string;
}

// Source item
interface ResearchSource {
  id?: string;
  title: string;
  type: string; // Website, Interview, Government Report, Industry Database, Expert Review
  notes: string;
  researchDate: string;
  confidence: 'High' | 'Medium' | 'Low';
  status: 'Verified' | 'Pending';
}

// Internal checklist item
interface QualityChecklistState {
  id?: string;
  sectionsComplete: boolean;
  noMissingData: boolean;
  formattingChecked: boolean;
  calculationsReviewed: boolean;
  recommendationsReviewed: boolean;
  spellingChecked: boolean;
  commentsRemoved: boolean;
  attachmentsVerified: boolean;
  updatedBy: string;
  updatedAt: any;
}

// Sub-task assignment
interface ResearchTask {
  id?: string;
  title: string;
  assignedTo: string;
  dueDate: string;
  status: 'Pending' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
  createdAt: any;
}

// Internal team message/log
interface ActivityLog {
  id?: string;
  action: string;
  details: string;
  timestamp: string;
  userEmail: string;
  userName: string;
}

export default function ResearchTeamWorkspace({
  tickets,
  selectedTicketId,
  setSelectedTicketId,
  user,
  role,
  activeRole,
  showToast,
  handleUpdateStatus,
  handleAssignExecutive,
  handleSaveFindings,
  handleSaveInternalNotes,
  handleAddComment,
  handleDownloadReportPDF,
  STATUS_FLOW
}: ResearchTeamWorkspaceProps) {

  // Inner Tab States
  const [researcherTab, setResearcherTab] = useState<'dashboard' | 'queue' | 'workspace' | 'performance'>('dashboard');
  const [workspaceSubTab, setWorkspaceSubTab] = useState<'summary' | 'ai_assistant' | 'manual' | 'sources' | 'checklist' | 'chat' | 'documents'>('summary');
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);

  // Research Timer States
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [timerElapsed, setTimerElapsed] = useState<number>(0);

  // Active Research Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerElapsed(prev => prev + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive]);

  // Reset timer on active ticket change
  useEffect(() => {
    setTimerActive(false);
    setTimerElapsed(0);
  }, [selectedTicketId]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [
      hrs.toString().padStart(2, '0'),
      mins.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

  const handleLogTimerSession = async () => {
    if (timerElapsed === 0) return;
    const durationStr = formatTime(timerElapsed);
    setTimerActive(false);
    try {
      await logExecutiveAction("RESEARCH_TIME_LOGGED", `Logged ${durationStr} of active analytical research time.`);
      showToast(`Successfully logged ${durationStr} research session duration to activity logs!`, "success");
      setTimerElapsed(0);
    } catch (err) {
      showToast("Failed to log research session duration.", "error");
    }
  };

  // Queue Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [filterPackage, setFilterPackage] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterLocation, setFilterLocation] = useState<string>('');
  const [filterInvestment, setFilterInvestment] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'createdAt'>('dueDate');

  // AI Assistant States
  const [aiDraftType, setAiDraftType] = useState<string>('executive_summary');
  const [aiSpecialInstructions, setAiSpecialInstructions] = useState<string>('');
  const [aiDraftOutput, setAiDraftOutput] = useState<string>('');
  const [generatingAi, setGeneratingAi] = useState<boolean>(false);

  // Manual Findings State
  const [manualFindings, setManualFindings] = useState<ManualFindings>({
    marketFindings: '',
    competitorNotes: '',
    investmentObservations: '',
    customerProfile: '',
    locationAssessment: '',
    supplierNotes: '',
    manufacturerNotes: '',
    growthOpportunities: '',
    risks: '',
    recommendations: ''
  });
  const [savingManual, setSavingManual] = useState(false);

  // Source Tracking State
  const [sourcesList, setSourcesList] = useState<ResearchSource[]>([]);
  const [newSource, setNewSource] = useState<ResearchSource>({
    title: '',
    type: 'Website',
    notes: '',
    researchDate: new Date().toISOString().split('T')[0],
    confidence: 'High',
    status: 'Pending'
  });

  // Quality Checklist State
  const [checklist, setChecklist] = useState<QualityChecklistState>({
    sectionsComplete: false,
    noMissingData: false,
    formattingChecked: false,
    calculationsReviewed: false,
    recommendationsReviewed: false,
    spellingChecked: false,
    commentsRemoved: false,
    attachmentsVerified: false,
    updatedBy: '',
    updatedAt: null
  });

  // Sub-tasks State (For internal workflows)
  const [tasksList, setTasksList] = useState<ResearchTask[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  // Document version history State
  const [reportVersions, setReportVersions] = useState<{ id: string; versionName: string; notes: string; uploadedBy: string; timestamp: string; downloadUrl?: string }[]>([]);
  const [newVersionName, setNewVersionName] = useState('');
  const [newVersionNotes, setNewVersionNotes] = useState('');

  // Internal Audit Logs
  const [auditLogs, setAuditLogs] = useState<ActivityLog[]>([]);

  // Local notifications and internal communications
  const [internalMentions, setInternalMentions] = useState<{ id: string; member: string; message: string; timestamp: string }[]>([]);
  const [newMentionMember, setNewMentionMember] = useState('');
  const [newMentionMsg, setNewMentionMsg] = useState('');

  // Loaded selected ticket
  const selectedTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0];

  // Helper to check user authority to access this ticket
  const hasAccess = (ticket: ResearchTicket) => {
    if (activeRole === 'admin') return true;
    // Executive can only access assigned tickets or unassigned ones
    return ticket.assignedExecutive === user?.displayName || ticket.assignedExecutive.startsWith('Waiting');
  };

  // Sync / Fetch details for selected ticket
  useEffect(() => {
    if (!selectedTicket) return;

    // 1. Fetch manual research findings from 'research_notes' (doc ID can match ticket ID)
    const notesRef = doc(db, 'research_notes', selectedTicket.id);
    const unsubNotes = onSnapshot(notesRef, (snap) => {
      if (snap.exists()) {
        setManualFindings(snap.data() as ManualFindings);
      } else {
        setManualFindings({
          marketFindings: '',
          competitorNotes: '',
          investmentObservations: '',
          customerProfile: '',
          locationAssessment: '',
          supplierNotes: '',
          manufacturerNotes: '',
          growthOpportunities: '',
          risks: '',
          recommendations: ''
        });
      }
    });

    // 2. Fetch quality checklist from 'research_quality'
    const qualityRef = doc(db, 'research_quality', selectedTicket.id);
    const unsubQuality = onSnapshot(qualityRef, (snap) => {
      if (snap.exists()) {
        setChecklist(snap.data() as QualityChecklistState);
      } else {
        setChecklist({
          sectionsComplete: false,
          noMissingData: false,
          formattingChecked: false,
          calculationsReviewed: false,
          recommendationsReviewed: false,
          spellingChecked: false,
          commentsRemoved: false,
          attachmentsVerified: false,
          updatedBy: '',
          updatedAt: null
        });
      }
    });

    // 3. Fetch sources list from 'research_sources' where ticketId === selectedTicket.id
    const sourcesQ = query(collection(db, 'research_sources'), where('ticketId', '==', selectedTicket.id));
    const unsubSources = onSnapshot(sourcesQ, (snap) => {
      const data: ResearchSource[] = [];
      snap.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as ResearchSource);
      });
      setSourcesList(data);
    });

    // 4. Fetch internal tasks from 'research_tasks'
    const tasksQ = query(collection(db, 'research_tasks'), where('ticketId', '==', selectedTicket.id));
    const unsubTasks = onSnapshot(tasksQ, (snap) => {
      const data: ResearchTask[] = [];
      snap.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as ResearchTask);
      });
      setTasksList(data);
    });

    // 5. Fetch report versions from 'research_versions'
    const versionsQ = query(collection(db, 'research_versions'), where('ticketId', '==', selectedTicket.id));
    const unsubVersions = onSnapshot(versionsQ, (snap) => {
      const data: any[] = [];
      snap.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setReportVersions(data);
    });

    // 6. Fetch internal logs for this ticket from 'research_activity'
    const logsQ = query(collection(db, 'research_activity'), where('ticketId', '==', selectedTicket.id), orderBy('timestamp', 'desc'));
    const unsubLogs = onSnapshot(logsQ, (snap) => {
      const data: ActivityLog[] = [];
      snap.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as ActivityLog);
      });
      setAuditLogs(data);
    });

    return () => {
      unsubNotes();
      unsubQuality();
      unsubSources();
      unsubTasks();
      unsubVersions();
      unsubLogs();
    };
  }, [selectedTicketId, selectedTicket]);

  // Log action inside research_activity collection
  const logExecutiveAction = async (action: string, details: string) => {
    if (!selectedTicket || !user) return;
    try {
      await addDoc(collection(db, 'research_activity'), {
        ticketId: selectedTicket.id,
        action,
        details,
        timestamp: new Date().toISOString(),
        userEmail: user.email || 'executive@biznxt.com',
        userName: user.displayName || 'Research Executive'
      });
    } catch (e) {
      console.error("Failed to log activity:", e);
    }
  };

  // Wrap status updates with QA Checklist compliance validation
  const handleUpdateStatusWithValidation = async (nextStatus: string) => {
    const qaStages = ['internal_review', 'qa_review', 'pdf_generation', 'approved', 'delivered', 'completed'];
    if (qaStages.includes(nextStatus)) {
      const allChecked = 
        checklist.sectionsComplete && 
        checklist.noMissingData && 
        checklist.formattingChecked && 
        checklist.calculationsReviewed && 
        checklist.recommendationsReviewed && 
        checklist.spellingChecked && 
        checklist.commentsRemoved && 
        checklist.attachmentsVerified;

      if (!allChecked) {
        showToast("⚠️ Quality Assurance check failed! All peer-review checklist items must be verified in the Quality Auditor tab before advancing status to review or delivery stages.", "error");
        return;
      }
    }

    try {
      await handleUpdateStatus(nextStatus);
      await logExecutiveAction("STATUS_TRANSITION_SUCCESS", `Dossier advanced to stage: ${STATUS_FLOW.find(s => s.id === nextStatus)?.label || nextStatus}`);
    } catch (err) {
      console.error(err);
      showToast("Error advancing status", "error");
    }
  };

  // Trigger AI Draft Generation from server endpoint
  const handleGenerateAiDraft = async () => {
    if (!selectedTicket) return;
    setGeneratingAi(true);
    setAiDraftOutput('');

    try {
      const response = await fetch('/api/research/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessCategory: selectedTicket.businessCategory,
          businessType: selectedTicket.businessType,
          investment: selectedTicket.investment,
          location: selectedTicket.location,
          draftType: aiDraftType,
          specialRequirements: aiSpecialInstructions
        })
      });

      const data = await response.json();
      if (response.ok && data.draft) {
        setAiDraftOutput(data.draft);
        showToast("AI Research Assistant generated draft successfully!", "success");
        await logExecutiveAction("AI_DRAFT_GENERATED", `Draft generated for section: ${aiDraftType}`);
      } else {
        throw new Error(data.error || "Draft generation failed.");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to contact AI Assistant.", "error");
    } finally {
      setGeneratingAi(false);
    }
  };

  // Apply AI Draft into manual research or Parent findings state
  const handleApplyDraftToWorkspace = () => {
    if (!aiDraftOutput) return;

    // Distinguish AI suggestion from verified findings
    const formattedDraft = `[🤖 AI-GENERATED SUGGESTION - EXECUTIVE VERIFICATION REQUIRED]\n\n${aiDraftOutput}\n\n[End of AI Draft]`;

    // Let's copy it to correct local state based on draftType
    const mapTypeToKey: { [key: string]: keyof ManualFindings } = {
      market_overview: 'marketFindings',
      industry_overview: 'growthOpportunities',
      competitor: 'competitorNotes',
      swot: 'growthOpportunities',
      risks: 'risks',
      investment: 'investmentObservations',
      executive_summary: 'recommendations'
    };

    const targetKey = mapTypeToKey[aiDraftType];
    if (targetKey) {
      setManualFindings(prev => ({
        ...prev,
        [targetKey]: formattedDraft
      }));
      showToast(`Applied draft directly to manual research section: ${targetKey}!`, "success");
    } else {
      // General append
      setManualFindings(prev => ({
        ...prev,
        marketFindings: prev.marketFindings + "\n\n" + formattedDraft
      }));
      showToast("Applied draft directly into Market Findings!", "success");
    }
    setWorkspaceSubTab('manual');
  };

  // Commit and Save Manual Findings to 'research_notes' and sync with research_tickets
  const handleSaveManualFindings = async () => {
    if (!selectedTicket) return;
    setSavingManual(true);
    try {
      // 1. Save to research_notes for granular history
      await setDoc(doc(db, 'research_notes', selectedTicket.id), manualFindings);

      // 2. Sync to findings on research_tickets so PDF generation is dynamic
      const ticketRef = doc(db, 'research_tickets', selectedTicket.id);
      await updateDoc(ticketRef, {
        findings: {
          marketSize: manualFindings.marketFindings,
          competitors: manualFindings.competitorNotes,
          financialEstimates: manualFindings.investmentObservations,
          swotAnalysis: manualFindings.growthOpportunities || manualFindings.risks,
          roadmap: manualFindings.recommendations,
          locationAnalysis: manualFindings.locationAssessment,
          customAnswers: `Suppliers: ${manualFindings.supplierNotes || 'None'} | Manufacturers: ${manualFindings.manufacturerNotes || 'None'} | Customers: ${manualFindings.customerProfile || 'None'}`
        },
        updatedAt: serverTimestamp()
      });

      showToast("Manual findings updated and committed to central notes!", "success");
      await logExecutiveAction("MANUAL_FINDINGS_COMMITTED", "Executive saved manual field findings and synced reports");
    } catch (err) {
      console.error(err);
      showToast("Failed to save findings.", "error");
    } finally {
      setSavingManual(false);
    }
  };

  // Add a tracking source to 'research_sources'
  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !newSource.title.trim()) return;

    try {
      await addDoc(collection(db, 'research_sources'), {
        ticketId: selectedTicket.id,
        ...newSource
      });
      setNewSource({
        title: '',
        type: 'Website',
        notes: '',
        researchDate: new Date().toISOString().split('T')[0],
        confidence: 'High',
        status: 'Pending'
      });
      showToast("Source reference registered!", "success");
      await logExecutiveAction("SOURCE_REGISTERED", `Source title: ${newSource.title}`);
    } catch (err) {
      console.error(err);
      showToast("Failed to register source.", "error");
    }
  };

  // Delete a source from Firestore
  const handleDeleteSource = async (sourceId: string) => {
    try {
      await deleteDoc(doc(db, 'research_sources', sourceId));
      showToast("Reference source deleted.", "info");
      await logExecutiveAction("SOURCE_DELETED", `Deleted source record ${sourceId}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Source status verified
  const handleToggleSourceVerify = async (source: ResearchSource) => {
    if (!source.id) return;
    try {
      const nextStatus = source.status === 'Verified' ? 'Pending' : 'Verified';
      await updateDoc(doc(db, 'research_sources', source.id), {
        status: nextStatus
      });
      showToast(`Source updated to ${nextStatus}`, "success");
      await logExecutiveAction("SOURCE_VERIFY_TOGGLE", `Source verification flipped to ${nextStatus}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Update Quality Checklist
  const handleChecklistToggle = async (key: keyof Omit<QualityChecklistState, 'updatedBy' | 'updatedAt' | 'id'>) => {
    if (!selectedTicket) return;
    const nextChecklist = {
      ...checklist,
      [key]: !checklist[key],
      updatedBy: user?.displayName || 'Executive',
      updatedAt: new Date().toISOString()
    };
    setChecklist(nextChecklist);

    try {
      await setDoc(doc(db, 'research_quality', selectedTicket.id), nextChecklist);
      showToast("Quality checklist status synced!", "success");
      await logExecutiveAction("QUALITY_CHECKLIST_UPDATED", `Updated ${key} flag`);
    } catch (err) {
      console.error(err);
    }
  };

  // Add Sub-task to 'research_tasks'
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !newTaskTitle.trim()) return;

    try {
      await addDoc(collection(db, 'research_tasks'), {
        ticketId: selectedTicket.id,
        title: newTaskTitle,
        assignedTo: newTaskAssignee || user?.displayName || 'Unassigned',
        dueDate: newTaskDueDate || new Date().toISOString().split('T')[0],
        status: 'Pending',
        priority: newTaskPriority,
        createdAt: new Date().toISOString()
      });

      setNewTaskTitle('');
      setNewTaskAssignee('');
      setNewTaskDueDate('');
      showToast("Sub-task assigned successfully!", "success");
      await logExecutiveAction("TASK_ASSIGNED", `Assigned task: ${newTaskTitle}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Sub-task Completion
  const handleToggleTaskStatus = async (task: ResearchTask) => {
    if (!task.id) return;
    try {
      const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
      await updateDoc(doc(db, 'research_tasks', task.id), {
        status: nextStatus
      });
      showToast(`Task marked as ${nextStatus}`, "success");
      await logExecutiveAction("TASK_STATUS_FLIPPED", `Task status set to ${nextStatus}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Post Document Version/Revision File
  const handleAddVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !newVersionName.trim()) return;

    try {
      await addDoc(collection(db, 'research_versions'), {
        ticketId: selectedTicket.id,
        versionName: newVersionName,
        notes: newVersionNotes,
        uploadedBy: user?.displayName || 'SME Executive',
        timestamp: new Date().toISOString()
      });

      setNewVersionName('');
      setNewVersionNotes('');
      showToast("Report version backup archived!", "success");
      await logExecutiveAction("REPORT_VERSION_BACKUP", `Created report version ${newVersionName}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Quick Action - Claim unassigned ticket
  const handleClaimTicket = async (ticket: ResearchTicket) => {
    if (!user) return;
    try {
      await handleAssignExecutive(user.displayName || user.email || 'Expert Executive');
      await logExecutiveAction("CLAIM_TICKET", "Executive claimed ownership of ticket");
    } catch (err) {
      console.error(err);
    }
  };

  // Quick Action - Escalate ticket
  const handleEscalateTicket = async () => {
    if (!selectedTicket) return;
    try {
      const ticketRef = doc(db, 'research_tickets', selectedTicket.id);
      await updateDoc(ticketRef, {
        priority: 'High',
        internalNotes: (selectedTicket.internalNotes || '') + `\n[ESCALATION] Escalated by ${user?.displayName} on ${new Date().toLocaleDateString()}`
      });
      showToast("Ticket prioritized as High and Escalation Flag appended!", "info");
      await logExecutiveAction("TICKET_ESCALATED", "Executive escalated priority to HIGH");
    } catch (err) {
      console.error(err);
    }
  };

  // Filter and Search Tickets for Queue
  const filteredTickets = tickets.filter(t => {
    // 1. Accessibility Check
    if (!hasAccess(t)) return false;

    // 2. Search Query (Ticket number, category, email, name, location)
    const matchesSearch = 
      t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.businessCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    // 3. Filters
    if (filterPriority !== 'All' && t.priority !== filterPriority) return false;
    if (filterPackage !== 'All' && t.packageId !== filterPackage) return false;
    if (filterStatus !== 'All' && t.status !== filterStatus) return false;
    if (filterInvestment !== 'All' && !t.investment.toLowerCase().includes(filterInvestment.toLowerCase())) return false;
    if (filterCategory && !t.businessCategory.toLowerCase().includes(filterCategory.toLowerCase())) return false;
    if (filterLocation && !t.location.toLowerCase().includes(filterLocation.toLowerCase())) return false;

    return true;
  }).sort((a, b) => {
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (sortBy === 'priority') {
      const priorityWeight = { High: 3, Medium: 2, Low: 1 };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    } else {
      return new Date(b.createdAt?.seconds || 0).getTime() - new Date(a.createdAt?.seconds || 0).getTime();
    }
  });

  // Calculate dynamic dashboard stats
  const totalMyTickets = tickets.filter(t => hasAccess(t)).length;
  const pendingResearchCount = tickets.filter(t => hasAccess(t) && t.status !== 'completed' && t.status !== 'delivered').length;
  const completedResearchCount = tickets.filter(t => hasAccess(t) && (t.status === 'completed' || t.status === 'delivered')).length;
  const priorityCount = tickets.filter(t => hasAccess(t) && t.priority === 'High' && t.status !== 'completed').length;
  
  const todayStr = new Date().toISOString().split('T')[0];
  const overdueCount = tickets.filter(t => hasAccess(t) && t.status !== 'completed' && t.status !== 'delivered' && t.dueDate < todayStr).length;

  return (
    <div className="space-y-6 w-full animate-fadeIn" id="researcher-team-workspace-root">
      
      {/* Top Professional Header & Main Tab Switcher */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/30 via-slate-900 to-slate-900" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-primary/20 text-primary-light text-xs font-bold rounded-2xl border border-primary/20 uppercase tracking-wider">
                Research Desk Active
              </span>
              <span className="text-white/20">•</span>
              <span className="text-slate-500 text-xs font-mono">Role: {role || 'Research Executive'}</span>
            </div>
            <h1 className="text-2xl font-bold font-display tracking-tight text-white mt-1">
              Enterprise Research Workspace
            </h1>
            <p className="text-slate-500 text-xs max-w-xl">
              Internal analytics console to verify, draft, audit, and deliver RBI-compliant premium research dossiers.
            </p>
          </div>

          <div className="flex bg-white/5 border border-white/10 p-1.5 rounded-2xl">
            {[
              { id: 'dashboard', label: '📊 Dashboard console' },
              { id: 'queue', label: '📋 Ticket Queue' },
              { id: 'workspace', label: '💻 Interactive Workspace' },
              { id: 'performance', label: '📈 Stats & SLA' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setResearcherTab(tab.id as any)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                  researcherTab === tab.id 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ==================== 1. DASHBOARD VIEW ==================== */}
      {researcherTab === 'dashboard' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Metrics Panel */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs flex flex-col justify-between">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Assigned Tickets</span>
              <h2 className="text-3xl font-extrabold text-slate-900 font-display mt-2">{totalMyTickets}</h2>
              <p className="text-[10px] text-slate-500 mt-1">Current operational capacity</p>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs flex flex-col justify-between">
              <span className="text-amber-600 text-[10px] font-bold uppercase tracking-wider">Pending Research</span>
              <h2 className="text-3xl font-extrabold text-amber-600 font-display mt-2">{pendingResearchCount}</h2>
              <p className="text-[10px] text-slate-500 mt-1">Requiring dossier compilation</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs flex flex-col justify-between">
              <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-wider">Completed Reports</span>
              <h2 className="text-3xl font-extrabold text-emerald-600 font-display mt-2">{completedResearchCount}</h2>
              <p className="text-[10px] text-slate-500 mt-1">Quality audited & delivered</p>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4.5 shadow-xs flex flex-col justify-between">
              <span className="text-primary-dark text-[10px] font-bold uppercase tracking-wider">Overdue SLA Tasks</span>
              <h2 className="text-3xl font-extrabold text-primary-dark font-display mt-2">{overdueCount}</h2>
              <p className="text-[10px] text-primary mt-1 font-semibold">Immediate turnaround required</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs flex flex-col justify-between">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Performance Score</span>
              <h2 className="text-3xl font-extrabold text-primary font-display mt-2">98.4</h2>
              <p className="text-[10px] text-slate-500 mt-1">99.1% SLA Compliant</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Today's Action List & Calendar Integration */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Urgent Action Queue */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 font-display text-sm flex items-center gap-1.5">
                    <ListTodo className="w-4.5 h-4.5 text-primary" />
                    <span>Your Priority / SLA-Bound Tickets</span>
                  </h3>
                  <span className="text-xs text-primary-dark font-bold bg-rose-50 px-2.5 py-0.5 rounded-2xl">
                    {overdueCount + priorityCount} Hot Items
                  </span>
                </div>

                <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto pr-1">
                  {tickets.filter(t => hasAccess(t) && t.status !== 'completed').slice(0, 5).map(t => {
                    const isOverdue = t.dueDate < todayStr;
                    return (
                      <div key={t.id} className="py-3 flex items-center justify-between gap-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-primary">{t.ticketNumber}</span>
                            <span className={`px-2 py-0.5 rounded-2xl text-[9px] font-bold uppercase ${
                              t.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                            }`}>{t.priority} priority</span>
                          </div>
                          <h4 className="font-bold text-slate-800 text-xs">{t.businessCategory}</h4>
                          <p className="text-[10px] text-slate-500">Target Location: {t.location}</p>
                        </div>

                        <div className="text-right space-y-1">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono block ${
                            isOverdue ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-slate-100 text-slate-700'
                          }`}>
                            Due {t.dueDate}
                          </span>
                          <button
                            onClick={() => {
                              setSelectedTicketId(t.id);
                              setResearcherTab('workspace');
                            }}
                            className="text-primary hover:underline text-[10px] font-bold"
                          >
                            Open Workspace
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {tickets.length === 0 && (
                    <div className="text-center py-8 text-slate-500 text-xs">
                      No active tickets in your pool. Claim tickets from the Ticket Queue tab!
                    </div>
                  )}
                </div>
              </div>

              {/* Research Desk Calendar View */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
                <h3 className="font-bold text-slate-900 font-display text-sm flex items-center gap-1.5">
                  <Calendar className="w-4.5 h-4.5 text-primary" />
                  <span>Dossier Delivery Calendar</span>
                </h3>
                <p className="text-slate-500 text-xs">Visual roadmap showing delivery checkpoints for this cycle.</p>
                
                <div className="grid grid-cols-7 gap-1 bg-slate-50 p-2 rounded-2xl text-center text-[10px] font-bold text-slate-500">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] text-slate-700">
                  {/* Highlight current week dates as an elegant preview */}
                  {Array.from({ length: 14 }).map((_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - 2 + i);
                    const formatted = d.toISOString().split('T')[0];
                    const hasTicket = tickets.find(t => t.dueDate === formatted && hasAccess(t));
                    
                    return (
                      <div 
                        key={i} 
                        className={`p-2.5 rounded-2xl flex flex-col items-center justify-between min-h-[48px] ${
                          d.toISOString().split('T')[0] === todayStr 
                            ? 'bg-primary text-white font-bold' 
                            : hasTicket 
                            ? 'bg-indigo-50 border border-indigo-200' 
                            : 'bg-slate-50/50 hover:bg-slate-100'
                        }`}
                      >
                        <span>{d.getDate()}</span>
                        {hasTicket && (
                          <span className={`w-1.5 h-1.5 rounded-2xl ${d.toISOString().split('T')[0] === todayStr ? 'bg-white' : 'bg-primary'}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Quick Actions & Audit Trail Log */}
            <div className="space-y-6">
              
              <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-3.5">
                <h4 className="font-bold font-display text-xs uppercase tracking-wider text-primary-light">Desk Command Matrix</h4>
                
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <button 
                    onClick={() => {
                      // Find first unassigned ticket
                      const unassigned = tickets.find(t => t.assignedExecutive.startsWith('Waiting'));
                      if (unassigned) {
                        handleClaimTicket(unassigned);
                      } else {
                        showToast("All tickets currently assigned!", "info");
                      }
                    }}
                    className="w-full text-left p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-between"
                  >
                    <span>Claim Next Ticket in Queue</span>
                    <PlusCircle className="w-4 h-4 text-primary-light" />
                  </button>

                  <button 
                    onClick={() => {
                      setResearcherTab('queue');
                    }}
                    className="w-full text-left p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-between"
                  >
                    <span>Open Advanced Filters</span>
                    <Filter className="w-4 h-4 text-primary-light" />
                  </button>

                  {selectedTicket && (
                    <>
                      <button 
                        onClick={handleEscalateTicket}
                        className="w-full text-left p-3 rounded-2xl bg-primary/10 border border-rose-500/20 hover:bg-primary/20 transition-all flex items-center justify-between text-rose-300"
                      >
                        <span>Escalate Current Selected Ticket</span>
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                      </button>

                      <button 
                        onClick={() => {
                          setResearcherTab('workspace');
                          setWorkspaceSubTab('checklist');
                        }}
                        className="w-full text-left p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all flex items-center justify-between text-emerald-300"
                      >
                        <span>Initiate Quality Review Audit</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Real-time System Audit Logging Feed */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold font-display text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1">
                    <Activity className="w-4 h-4 text-indigo-500" />
                    <span>Real-time Action Logs</span>
                  </h4>
                  <span className="text-[9px] text-slate-500 font-mono">Secured Audit</span>
                </div>

                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {auditLogs.slice(0, 10).map((log) => (
                    <div key={log.id} className="text-[10px] bg-slate-50 border border-slate-100 p-2.5 rounded-2xl space-y-1">
                      <div className="flex justify-between items-center text-slate-500">
                        <span className="font-bold text-indigo-700">{log.action}</span>
                        <span>{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <p className="text-slate-700">{log.details}</p>
                      <p className="text-[8px] text-slate-500">By {log.userName} ({log.userEmail})</p>
                    </div>
                  ))}

                  {auditLogs.length === 0 && (
                    <div className="text-center py-8 text-slate-500 text-xs">
                      No team logs found for this session. Action records generate automatically.
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ==================== 2. TICKET QUEUE / REGISTRY ==================== */}
      {researcherTab === 'queue' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Advanced Search & Filtering Matrix */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input 
                  type="text"
                  placeholder="Search by category, ticket ID, location, client email, or customer name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none text-slate-700"
                >
                  <option value="dueDate">Sort: Due Date (Earliest)</option>
                  <option value="priority">Sort: Priority weight</option>
                  <option value="createdAt">Sort: Created Time</option>
                </select>

                <button 
                  onClick={() => {
                    setFilterPriority('All');
                    setFilterPackage('All');
                    setFilterStatus('All');
                    setFilterInvestment('All');
                    setFilterCategory('');
                    setFilterLocation('');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Priority</label>
                <select 
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs"
                >
                  <option value="All">All Priorities</option>
                  <option value="High">🔴 High Priority</option>
                  <option value="Medium">🟡 Medium Priority</option>
                  <option value="Low">🟢 Low Priority</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Package Tier</label>
                <select 
                  value={filterPackage}
                  onChange={(e) => setFilterPackage(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs"
                >
                  <option value="All">All Packages</option>
                  <option value="basic">Basic Research</option>
                  <option value="professional">Professional</option>
                  <option value="premium">Premium 21-Part</option>
                  <option value="enterprise">Enterprise Growth</option>
                  <option value="corporate">Corporate Strategy</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Phase Status</label>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs"
                >
                  <option value="All">All Phases</option>
                  {STATUS_FLOW.map(s => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Investment Scale</label>
                <select 
                  value={filterInvestment}
                  onChange={(e) => setFilterInvestment(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs"
                >
                  <option value="All">All Scales</option>
                  <option value="Lakhs">Lakhs level</option>
                  <option value="Crore">Crore level</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Category search</label>
                <input 
                  type="text" 
                  placeholder="e.g. Textile"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Geographic search</label>
                <input 
                  type="text" 
                  placeholder="e.g. Surat, Gujarat"
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs"
                />
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {filteredTickets.map((t) => {
              const currentStatusLabel = STATUS_FLOW.find(s => s.id === t.status)?.label || t.status;
              const isOverdue = t.dueDate < todayStr && t.status !== 'completed' && t.status !== 'delivered';

              return (
                <div 
                  key={t.id}
                  className={`bg-white border rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow relative overflow-hidden ${
                    selectedTicketId === t.id ? 'ring-2 ring-primary border-primary' : 'border-slate-200'
                  }`}
                >
                  {isOverdue && (
                    <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-[9px] font-extrabold text-center py-0.5 uppercase tracking-wider">
                      ⚠️ OVERDUE DEADLINE CHECKPOINT
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-mono font-bold text-primary">{t.ticketNumber}</span>
                      <span className={`px-2.5 py-0.5 rounded-2xl font-bold uppercase ${
                        t.priority === 'High' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {t.priority}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm font-display line-clamp-1">{t.businessCategory}</h3>
                    <p className="text-slate-500 text-xs truncate">Model: {t.businessType}</p>
                    <p className="text-slate-500 text-[10px] font-medium flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t.location}</span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Package: <strong className="text-slate-800">{t.packageName}</strong></span>
                      <span>Capital: <strong className="text-slate-800">{t.investment}</strong></span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className={`px-2.5 py-1 rounded-2xl text-[9px] font-bold uppercase tracking-wider ${
                        STATUS_FLOW.find(s => s.id === t.status)?.color || 'bg-slate-100 text-slate-600'
                      }`}>
                        {currentStatusLabel}
                      </span>

                      <span className="text-[10px] text-slate-500 font-mono">Due {t.dueDate}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    {t.assignedExecutive.startsWith('Waiting') ? (
                      <button 
                        onClick={() => handleClaimTicket(t)}
                        className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs transition-colors"
                      >
                        Claim Ownership
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          setSelectedTicketId(t.id);
                          setResearcherTab('workspace');
                        }}
                        className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs transition-colors"
                      >
                        Launch Workspace
                      </button>
                    )}

                    <button 
                      onClick={() => handleDownloadReportPDF(t)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-colors"
                      title="Download PDF Snapshot"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredTickets.length === 0 && (
              <div className="md:col-span-3 text-center py-12 bg-white border border-dashed border-slate-200 rounded-3xl">
                <Search className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h4 className="text-slate-800 font-bold font-display text-sm">No Matching Tickets Found</h4>
                <p className="text-slate-500 text-xs mt-1">Try resetting filters or expanding search parameters.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== 3. INTERACTIVE ACTIVE WORKSPACE ==================== */}
      {researcherTab === 'workspace' && (
        <div className="animate-fadeIn space-y-6">
          {selectedTicket ? (
            <div className="grid lg:grid-cols-12 gap-6 items-start">
              
              {/* Selected Ticket Profile Header sidebar */}
              <div className="lg:col-span-3 space-y-4">
                <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-4">
                  <div>
                    <span className="font-mono text-xs text-primary-light font-bold block">{selectedTicket.ticketNumber}</span>
                    <h3 className="font-bold text-white text-md font-display mt-1">{selectedTicket.businessCategory}</h3>
                    <p className="text-xs text-slate-500 mt-1">Manager: {selectedTicket.assignedExecutive}</p>
                  </div>

                  <div className="space-y-2 text-[11px] text-slate-400 font-mono border-t border-white/10 pt-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tier:</span>
                      <span>{selectedTicket.packageName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Capital:</span>
                      <span>{selectedTicket.investment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Due Date:</span>
                      <span className={selectedTicket.dueDate < todayStr ? "text-red-400 font-bold" : ""}>{selectedTicket.dueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Client:</span>
                      <span className="truncate max-w-[120px]" title={selectedTicket.userName}>{selectedTicket.userName}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDownloadReportPDF(selectedTicket)}
                    className="w-full py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Dossier</span>
                  </button>

                  {/* Research Timer component inside the active sidebar card */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <Clock className="w-3 h-3 text-primary-light" />
                        <span>Active Session Timer</span>
                      </span>
                      {timerActive && (
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-2xl bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-2xl h-2 w-2 bg-emerald-500"></span>
                        </span>
                      )}
                    </div>

                    <div className="text-center font-mono text-xl font-bold tracking-wider text-white">
                      {formatTime(timerElapsed)}
                    </div>

                    <div className="flex justify-between gap-1.5">
                      <button
                        onClick={() => setTimerActive(!timerActive)}
                        className={`flex-1 py-1 px-2 rounded-2xl text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${
                          timerActive 
                            ? 'bg-amber-500 text-white hover:bg-amber-600' 
                            : 'bg-emerald-500 text-white hover:bg-emerald-600'
                        }`}
                      >
                        {timerActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        <span>{timerActive ? 'Pause' : 'Start'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setTimerActive(false);
                          setTimerElapsed(0);
                        }}
                        className="py-1 px-2 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-[10px] font-bold"
                        title="Reset"
                      >
                        Reset
                      </button>

                      <button
                        onClick={handleLogTimerSession}
                        disabled={timerElapsed === 0}
                        className={`py-1 px-2 text-[10px] font-bold rounded-2xl transition-all ${
                          timerElapsed > 0 
                            ? 'bg-primary hover:bg-primary-dark text-white' 
                            : 'bg-white/5 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        Log Time
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sub-tabs vertical switcher */}
                <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs space-y-1">
                  {[
                    { id: 'summary', label: '👥 Customer Dossier', icon: FileText },
                    { id: 'ai_assistant', label: '🤖 AI Research Desk', icon: Sparkles },
                    { id: 'manual', label: '📝 Sourcing Findings', icon: CheckSquare2 },
                    { id: 'sources', label: '🔗 Source Tracking', icon: Bookmark },
                    { id: 'checklist', label: '✅ Quality Auditor', icon: CheckCircle2 },
                    { id: 'chat', label: '💬 Dialogue Channel', icon: MessageSquare },
                    { id: 'documents', label: '📁 Document Backup', icon: FolderOpen }
                  ].map((tb) => {
                    const Icon = tb.icon;
                    return (
                      <button 
                        key={tb.id}
                        onClick={() => setWorkspaceSubTab(tb.id as any)}
                        className={`w-full px-3 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                          workspaceSubTab === tb.id 
                            ? 'bg-primary/10 text-primary font-bold' 
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{tb.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Panel Content */}
              <div className="lg:col-span-9 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden min-h-[600px]">
                
                {/* Header Phase Transition Banner */}
                <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Report Phase:</span>
                    <span className={`px-3 py-1 rounded-2xl text-xs font-bold uppercase tracking-wider ${
                      STATUS_FLOW.find(s => s.id === selectedTicket.status)?.color || 'bg-slate-200 text-slate-700'
                    }`}>
                      {STATUS_FLOW.find(s => s.id === selectedTicket.status)?.label || selectedTicket.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold text-slate-500 mr-2 uppercase">Advance:</span>
                    {STATUS_FLOW.slice(0, 8).map((sf) => (
                      <button
                        key={sf.id}
                        onClick={() => handleUpdateStatusWithValidation(sf.id)}
                        className={`px-2 py-1 rounded-md text-[9px] font-bold border transition-colors ${
                          selectedTicket.status === sf.id 
                            ? 'bg-slate-900 text-white border-transparent' 
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {sf.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6">
                  {/* Sub-Tab 1: Customer Summary Dossier */}
                  {workspaceSubTab === 'summary' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="font-bold font-display text-slate-900 text-base">Venture Discovery Dossier</h3>
                        <p className="text-slate-500 text-xs">Primary inputs submitted during customer self-discovery form.</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-100 space-y-3 text-xs">
                          <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Client Parameters</h4>
                          
                          <div className="grid grid-cols-3 gap-2">
                            <span className="text-slate-500">FullName:</span>
                            <span className="col-span-2 font-bold text-slate-800">{selectedTicket.userName}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="text-slate-500">Email:</span>
                            <span className="col-span-2 font-bold text-slate-800 font-mono">{selectedTicket.userEmail}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="text-slate-500">Category:</span>
                            <span className="col-span-2 font-bold text-slate-800">{selectedTicket.businessCategory}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="text-slate-500">Model Tier:</span>
                            <span className="col-span-2 font-bold text-slate-800">{selectedTicket.packageName}</span>
                          </div>
                        </div>

                        <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-100 space-y-3 text-xs">
                          <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Geographic & Capital Details</h4>
                          
                          <div className="grid grid-cols-3 gap-2">
                            <span className="text-slate-500">Location:</span>
                            <span className="col-span-2 font-bold text-slate-800">{selectedTicket.location}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="text-slate-500">Investment:</span>
                            <span className="col-span-2 font-bold text-slate-800">{selectedTicket.investment}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="text-slate-500">Operational:</span>
                            <span className="col-span-2 font-bold text-slate-800">{selectedTicket.businessType}</span>
                          </div>
                        </div>

                        <div className="md:col-span-2 bg-slate-50 p-4.5 rounded-2xl border border-slate-100 space-y-2 text-xs">
                          <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Special Directives / Requirements</h4>
                          <p className="text-slate-700 italic">
                            {selectedTicket.internalNotes || "No special constraints declared. Build to standard RBI statutory benchmark parameters."}
                          </p>
                        </div>

                        <div className="md:col-span-2">
                          <LocationMap locationString={selectedTicket.location} />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 space-y-3">
                        <h4 className="font-bold text-xs text-slate-700 uppercase">Assigned Executive Workspace Notes</h4>
                        <div className="flex gap-2">
                          <textarea 
                            rows={3}
                            placeholder="Add secret private notes for internal staff and managers..."
                            className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none"
                            id="workspace-notes-input"
                            defaultValue={selectedTicket.internalNotes}
                          />
                          <button 
                            onClick={async () => {
                              const notes = (document.getElementById('workspace-notes-input') as HTMLTextAreaElement).value;
                              const ticketRef = doc(db, 'research_tickets', selectedTicket.id);
                              await updateDoc(ticketRef, {
                                internalNotes: notes,
                                updatedAt: serverTimestamp()
                              });
                              showToast("Internal notes updated successfully!", "success");
                              await logExecutiveAction("WORKSPACE_NOTES_SAVED", "Saved internal staff workspace notes");
                            }}
                            className="px-4 py-2 bg-slate-900 text-white rounded-2xl font-bold text-xs hover:bg-slate-800 shrink-0 self-end"
                          >
                            Save notes
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sub-Tab 2: AI Research Desk Assistant */}
                  {workspaceSubTab === 'ai_assistant' && (
                    <div className="space-y-6">
                      <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                        <div className="space-y-1">
                          <h4 className="font-bold text-indigo-900 text-xs">SME Automated Co-Pilot (Internal Use Only)</h4>
                          <p className="text-[11px] text-indigo-700">
                            Fires targeted queries to Gemini on-server with structural instructions matching BizNxt 3.0 reporting models. Always review outputs before saving.
                          </p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">1. Draft Segment</label>
                            <select 
                              value={aiDraftType}
                              onChange={(e) => setAiDraftType(e.target.value)}
                              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none"
                            >
                              <option value="executive_summary">Executive Summary Draft</option>
                              <option value="market_overview">Market Overview Draft</option>
                              <option value="industry_overview">Industry Overview Draft</option>
                              <option value="competitor">Competitor Draft</option>
                              <option value="swot">SWOT Draft</option>
                              <option value="risks">Business Risks Draft</option>
                              <option value="investment">Investment Draft</option>
                              <option value="marketing">Marketing Draft</option>
                              <option value="sales">Sales Draft</option>
                              <option value="business_opportunity">Business Opportunity Draft</option>
                              <option value="action_plan">Action Plan Draft</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">2. Inject Instructions</label>
                            <textarea 
                              rows={4}
                              placeholder="e.g. Focus on digital D2C channels, raw materials locally sourced from Surat, high competitive pricing constraints..."
                              value={aiSpecialInstructions}
                              onChange={(e) => setAiSpecialInstructions(e.target.value)}
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none"
                            />
                          </div>

                          <button 
                            disabled={generatingAi}
                            onClick={handleGenerateAiDraft}
                            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                          >
                            {generatingAi ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span>Co-pilot writing...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4" />
                                <span>Generate AI Draft</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="md:col-span-2 space-y-3">
                          <div className="flex justify-between items-center bg-slate-50 p-2.5 border border-slate-200 rounded-2xl">
                            <span className="text-[10px] font-bold text-slate-500 uppercase font-mono">DRAFT CO-PILOT TERMINAL</span>
                            {aiDraftOutput && (
                              <button 
                                onClick={handleApplyDraftToWorkspace}
                                className="px-3 py-1 bg-emerald-500 text-white font-bold rounded-2xl text-[10px] hover:bg-emerald-600 transition-colors"
                              >
                                Commit to Sourcing Workspace
                              </button>
                            )}
                          </div>

                          <textarea 
                            rows={12}
                            readOnly
                            placeholder="Synthesizer draft appears here..."
                            value={aiDraftOutput}
                            className="w-full p-4 bg-slate-900 text-indigo-100 border border-slate-900 rounded-2xl text-xs font-mono focus:outline-none leading-relaxed"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sub-Tab 3: Sourcing / Manual Research Entries */}
                  {workspaceSubTab === 'manual' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold font-display text-slate-900 text-base">Manual Dossier Sourcing</h3>
                          <p className="text-slate-500 text-xs">Input verified field insights manually here. Direct source references can be linked on the side.</p>
                        </div>

                        <button 
                          disabled={savingManual}
                          onClick={handleSaveManualFindings}
                          className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold text-xs shadow-sm flex items-center gap-1.5"
                        >
                          {savingManual ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                          <span>Commit Findings</span>
                        </button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Market Overview Sourcing Findings</label>
                            {manualFindings.marketFindings?.includes('[🤖') && (
                              <span className="px-2 py-0.5 rounded-2xl text-[9px] font-extrabold bg-amber-100 text-amber-700 animate-pulse border border-amber-200">
                                🤖 AI SUGGESTION
                              </span>
                            )}
                          </div>
                          <textarea 
                            rows={4}
                            placeholder="Input details on regional demand, target user demographics, size YoY vectors..."
                            value={manualFindings.marketFindings}
                            onChange={(e) => setManualFindings({...manualFindings, marketFindings: e.target.value})}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none leading-relaxed"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Competitor landscape Notes</label>
                            {manualFindings.competitorNotes?.includes('[🤖') && (
                              <span className="px-2 py-0.5 rounded-2xl text-[9px] font-extrabold bg-amber-100 text-amber-700 animate-pulse border border-amber-200">
                                🤖 AI SUGGESTION
                              </span>
                            )}
                          </div>
                          <textarea 
                            rows={4}
                            placeholder="Competitor vulnerabilities, direct competitors, market share..."
                            value={manualFindings.competitorNotes}
                            onChange={(e) => setManualFindings({...manualFindings, competitorNotes: e.target.value})}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none leading-relaxed"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Investment Observations</label>
                            {manualFindings.investmentObservations?.includes('[🤖') && (
                              <span className="px-2 py-0.5 rounded-2xl text-[9px] font-extrabold bg-amber-100 text-amber-700 animate-pulse border border-amber-200">
                                🤖 AI SUGGESTION
                              </span>
                            )}
                          </div>
                          <textarea 
                            rows={4}
                            placeholder="Sourcing machine costs, rental yields, localized setup CapEx..."
                            value={manualFindings.investmentObservations}
                            onChange={(e) => setManualFindings({...manualFindings, investmentObservations: e.target.value})}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none leading-relaxed"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Customer Demographic Profiles</label>
                            {manualFindings.customerProfile?.includes('[🤖') && (
                              <span className="px-2 py-0.5 rounded-2xl text-[9px] font-extrabold bg-amber-100 text-amber-700 animate-pulse border border-amber-200">
                                🤖 AI SUGGESTION
                              </span>
                            )}
                          </div>
                          <textarea 
                            rows={4}
                            placeholder="Age bands, localized micro-segments, high buying index personas..."
                            value={manualFindings.customerProfile}
                            onChange={(e) => setManualFindings({...manualFindings, customerProfile: e.target.value})}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none leading-relaxed"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Location suitability Assessment</label>
                            {manualFindings.locationAssessment?.includes('[🤖') && (
                              <span className="px-2 py-0.5 rounded-2xl text-[9px] font-extrabold bg-amber-100 text-amber-700 animate-pulse border border-amber-200">
                                🤖 AI SUGGESTION
                              </span>
                            )}
                          </div>
                          <textarea 
                            rows={4}
                            placeholder="Zoning guidelines, logistic access roads, local water & electricity connection overheads..."
                            value={manualFindings.locationAssessment}
                            onChange={(e) => setManualFindings({...manualFindings, locationAssessment: e.target.value})}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none leading-relaxed"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Supplier Notes</label>
                            {manualFindings.supplierNotes?.includes('[🤖') && (
                              <span className="px-2 py-0.5 rounded-2xl text-[9px] font-extrabold bg-amber-100 text-amber-700 animate-pulse border border-amber-200">
                                🤖 AI SUGGESTION
                              </span>
                            )}
                          </div>
                          <textarea 
                            rows={4}
                            placeholder="Material suppliers, wholesale distributor channels, credit terms options..."
                            value={manualFindings.supplierNotes}
                            onChange={(e) => setManualFindings({...manualFindings, supplierNotes: e.target.value})}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none leading-relaxed"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Manufacturer profiles</label>
                            {manualFindings.manufacturerNotes?.includes('[🤖') && (
                              <span className="px-2 py-0.5 rounded-2xl text-[9px] font-extrabold bg-amber-100 text-amber-700 animate-pulse border border-amber-200">
                                🤖 AI SUGGESTION
                              </span>
                            )}
                          </div>
                          <textarea 
                            rows={4}
                            placeholder="Contract manufacturing partners, machinery dealers, standard warranties..."
                            value={manualFindings.manufacturerNotes}
                            onChange={(e) => setManualFindings({...manualFindings, manufacturerNotes: e.target.value})}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none leading-relaxed"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Strategic Growth Opportunities</label>
                            {manualFindings.growthOpportunities?.includes('[🤖') && (
                              <span className="px-2 py-0.5 rounded-2xl text-[9px] font-extrabold bg-amber-100 text-amber-700 animate-pulse border border-amber-200">
                                🤖 AI SUGGESTION
                              </span>
                            )}
                          </div>
                          <textarea 
                            rows={4}
                            placeholder="Underserved niches, franchise potential, scaling models..."
                            value={manualFindings.growthOpportunities}
                            onChange={(e) => setManualFindings({...manualFindings, growthOpportunities: e.target.value})}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none leading-relaxed"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Regulatory and Sourcing Risks</label>
                            {manualFindings.risks?.includes('[🤖') && (
                              <span className="px-2 py-0.5 rounded-2xl text-[9px] font-extrabold bg-amber-100 text-amber-700 animate-pulse border border-amber-200">
                                🤖 AI SUGGESTION
                              </span>
                            )}
                          </div>
                          <textarea 
                            rows={4}
                            placeholder="License compliance, raw materials supply blockages, interest rate changes..."
                            value={manualFindings.risks}
                            onChange={(e) => setManualFindings({...manualFindings, risks: e.target.value})}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none leading-relaxed"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Final strategic Recommendations</label>
                            {manualFindings.recommendations?.includes('[🤖') && (
                              <span className="px-2 py-0.5 rounded-2xl text-[9px] font-extrabold bg-amber-100 text-amber-700 animate-pulse border border-amber-200">
                                🤖 AI SUGGESTION
                              </span>
                            )}
                          </div>
                          <textarea 
                            rows={4}
                            placeholder="Key launch directions, branding tagline drafts, partner selections..."
                            value={manualFindings.recommendations}
                            onChange={(e) => setManualFindings({...manualFindings, recommendations: e.target.value})}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none leading-relaxed"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sub-Tab 4: Sourcing tracking */}
                  {workspaceSubTab === 'sources' && (
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <h3 className="font-bold font-display text-slate-900 text-base">Direct Reference Source Audit</h3>
                        <p className="text-slate-500 text-xs">Legitimize manual segment claims by referencing direct primary and secondary databases. Internal use only.</p>
                      </div>

                      <form onSubmit={handleAddSource} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid md:grid-cols-3 gap-3 items-end">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Source Title / Agency Name</label>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. Census of India 2011, Ministry of Textiles"
                            value={newSource.title}
                            onChange={(e) => setNewSource({...newSource, title: e.target.value})}
                            className="w-full p-2 bg-white border border-slate-200 rounded-2xl text-xs"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Sourcing Type</label>
                          <select 
                            value={newSource.type}
                            onChange={(e) => setNewSource({...newSource, type: e.target.value})}
                            className="w-full p-2 bg-white border border-slate-200 rounded-2xl text-xs"
                          >
                            <option>Website</option>
                            <option>Expert Interview</option>
                            <option>Government Database</option>
                            <option>Industry Report</option>
                            <option>Primary Survey</option>
                            <option>Physical Audit</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Internal Confidence Match</label>
                          <select 
                            value={newSource.confidence}
                            onChange={(e: any) => setNewSource({...newSource, confidence: e.target.value})}
                            className="w-full p-2 bg-white border border-slate-200 rounded-2xl text-xs"
                          >
                            <option value="High">🔴 High Confidence Sourcing</option>
                            <option value="Medium">🟡 Medium Confidence Sourcing</option>
                            <option value="Low">🟢 Low Confidence Sourcing</option>
                          </select>
                        </div>

                        <div className="md:col-span-2 space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Reference Notes / URLs</label>
                          <input 
                            type="text" 
                            placeholder="Add reference citation links or text snapshots..."
                            value={newSource.notes}
                            onChange={(e) => setNewSource({...newSource, notes: e.target.value})}
                            className="w-full p-2 bg-white border border-slate-200 rounded-2xl text-xs"
                          />
                        </div>

                        <button 
                          type="submit"
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-1 shrink-0 self-end"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Link Sourcing</span>
                        </button>
                      </form>

                      {/* Sources Matrix Grid */}
                      <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                        <div className="p-3.5 bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider grid grid-cols-6 gap-2">
                          <span className="col-span-2">Source Title</span>
                          <span>Type</span>
                          <span className="col-span-2">Notes</span>
                          <span className="text-right">Action</span>
                        </div>

                        {sourcesList.map((src) => (
                          <div key={src.id} className="p-3.5 text-xs grid grid-cols-6 gap-2 items-center">
                            <div className="col-span-2 space-y-0.5">
                              <p className="font-bold text-slate-800">{src.title}</p>
                              <p className="text-[9px] text-slate-500">Date logged: {src.researchDate}</p>
                            </div>

                            <span>
                              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-2xl font-semibold text-[10px]">{src.type}</span>
                            </span>

                            <span className="col-span-2 text-slate-500 italic truncate" title={src.notes}>
                              {src.notes || "No extra URLs"}
                            </span>

                            <div className="flex justify-end gap-2 text-right">
                              <button 
                                onClick={() => handleToggleSourceVerify(src)}
                                className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                  src.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                }`}
                              >
                                {src.status}
                              </button>
                              <button 
                                onClick={() => handleDeleteSource(src.id!)}
                                className="text-primary hover:text-rose-700"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}

                        {sourcesList.length === 0 && (
                          <div className="text-center py-8 text-slate-500 text-xs">
                            No direct primary sources linked to this ticket yet.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Sub-Tab 5: Quality Checklist & Transitions */}
                  {workspaceSubTab === 'checklist' && (
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <h3 className="font-bold font-display text-slate-900 text-base">Mandatory Quality Assurance Control</h3>
                        <p className="text-slate-500 text-xs">
                          Quality desk requires full check validation before submitting files for Manager Review or client PDF downloads.
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Checklist items */}
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3.5">
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
                            <CheckSquare className="w-4.5 h-4.5 text-emerald-500" />
                            <span>Executive Peer Review List</span>
                          </h4>

                          {[
                            { key: 'sectionsComplete', label: 'All 10 required manual sections complete' },
                            { key: 'noMissingData', label: 'Zero placeholder drafts remain' },
                            { key: 'formattingChecked', label: 'Report sizing and layout margins verified' },
                            { key: 'calculationsReviewed', label: 'Financial CapEx/OpEx cost matching is accurate' },
                            { key: 'recommendationsReviewed', label: 'All strategic scaling recommendations verified' },
                            { key: 'spellingChecked', label: 'Full text proofreading completed' },
                            { key: 'commentsRemoved', label: 'Internal team drafts and helper notes removed' },
                            { key: 'attachmentsVerified', label: 'Submitted client file matches source reference' }
                          ].map((item) => (
                            <div 
                              key={item.key} 
                              onClick={() => handleChecklistToggle(item.key as any)}
                              className="flex items-center space-x-3 cursor-pointer select-none group"
                            >
                              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                checklist[item.key as keyof QualityChecklistState] 
                                  ? 'bg-emerald-500 border-emerald-500 text-white' 
                                  : 'bg-white border-slate-300 group-hover:border-slate-400'
                              }`}>
                                {checklist[item.key as keyof QualityChecklistState] && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>
                              <span className={`text-xs ${
                                checklist[item.key as keyof QualityChecklistState] ? 'text-slate-800 font-medium' : 'text-slate-500'
                              }`}>
                                {item.label}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Status advancement & assignment */}
                        <div className="space-y-6">
                          {/* Dedicated Submit for QA Review / Revision Log Button */}
                          {activeRole === 'admin' ? (
                            <div className="bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl p-5 text-white shadow-md space-y-3">
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-pink-100 animate-pulse" />
                                <h4 className="text-xs font-extrabold uppercase tracking-wider">QA Auditor Review Panel</h4>
                              </div>
                              <p className="text-[11px] text-pink-50 bg-pink-950/20 p-2.5 rounded-2xl leading-relaxed">
                                As a Quality Auditor Lead, you can verify compliance checklists, approve reports, or open the feedback desk to log specific correction requests.
                              </p>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  onClick={() => handleUpdateStatusWithValidation('approved')}
                                  className="py-2.5 bg-white text-emerald-700 hover:bg-emerald-50 font-black rounded-2xl text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Approve Report</span>
                                </button>
                                <button
                                  onClick={() => setIsFeedbackDialogOpen(true)}
                                  className="py-2.5 bg-slate-950 text-white hover:bg-slate-900 font-black rounded-2xl text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <FileText className="w-3.5 h-3.5 text-pink-400" />
                                  <span>Request Revisions</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-md space-y-3">
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-emerald-100 animate-pulse" />
                                <h4 className="text-xs font-extrabold uppercase tracking-wider">QA Verification Gateway</h4>
                              </div>
                              <p className="text-[11px] text-emerald-50 bg-emerald-950/20 p-2.5 rounded-2xl leading-relaxed">
                                Run immediate verification of the peer checklist and submit this research report directly to the Senior Auditor desk.
                              </p>
                              <button
                                onClick={() => handleUpdateStatusWithValidation('qa_review')}
                                className="w-full py-2.5 bg-white text-emerald-700 hover:bg-emerald-50 font-black rounded-2xl text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>🚀 Submit Report for QA Review</span>
                              </button>
                            </div>
                          )}

                          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-2">
                              SLA due date & Desk Assignment
                            </h4>

                            <div className="space-y-3 text-xs">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Assigned SME Lead</label>
                                <select 
                                  id="exec-select-box"
                                  className="w-full p-2 bg-white border border-slate-200 rounded-2xl text-xs focus:outline-none"
                                  defaultValue={selectedTicket.assignedExecutive}
                                >
                                  <option>Aravind Swamy (Senior SME Analyst)</option>
                                  <option>Neha Sharma (Location Audit Expert)</option>
                                  <option>Rohan Mehra (Financial Modeling Lead)</option>
                                  <option>Pooja Patel (Quality Assurance Director)</option>
                                </select>
                                <button 
                                  onClick={async () => {
                                    const select = document.getElementById('exec-select-box') as HTMLSelectElement;
                                    if (select) {
                                      await handleAssignExecutive(select.value.split(' (')[0]);
                                      await logExecutiveAction("STAFF_ASSIGNED", `Desk assigned to ${select.value}`);
                                    }
                                  }}
                                  className="mt-2 w-full py-1.5 bg-slate-900 text-white font-bold rounded-2xl text-xs hover:bg-slate-800"
                                >
                                  Apply Desk Sourcing Assignment
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3.5">
                            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-2">
                              Report Status State Flow (13 Stages)
                            </h4>

                            <div className="flex flex-wrap gap-1.5">
                              {STATUS_FLOW.map((sf) => (
                                <button
                                  key={sf.id}
                                  onClick={() => handleUpdateStatusWithValidation(sf.id)}
                                  className={`px-3 py-1.5 rounded-2xl text-[10px] font-bold border transition-colors ${
                                    selectedTicket.status === sf.id 
                                      ? 'bg-slate-900 text-white border-transparent' 
                                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  {sf.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* Sub-Tab 6: Team Chat & Communication */}
                  {workspaceSubTab === 'chat' && (
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <h3 className="font-bold font-display text-slate-900 text-base">Direct Analyst Desk Dialogue</h3>
                        <p className="text-slate-500 text-xs">
                          Communications posted here are direct and public to the logged-in client. For private team sub-tasks or mentions, use the assign task module below.
                        </p>
                      </div>

                      <div className="border border-slate-200 rounded-2xl p-4.5 space-y-4">
                        <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
                          {selectedTicket.comments?.map((c, i) => (
                            <div key={i} className={`flex flex-col max-w-[85%] ${
                              c.senderRole === activeRole ? 'ml-auto items-end' : 'mr-auto items-start'
                            }`}>
                              <div className={`p-3 rounded-2xl text-xs ${
                                c.senderRole === activeRole 
                                  ? 'bg-primary text-white rounded-tr-none' 
                                  : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                              }`}>
                                <p>{c.message}</p>
                              </div>
                              <span className="text-[9px] text-slate-500 mt-1 pl-1">
                                {c.sender} ({c.senderRole}) • {new Date(c.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span>
                            </div>
                          ))}
                        </div>

                        <form onSubmit={handleAddComment} className="flex gap-2 pt-3 border-t border-slate-100">
                          <input 
                            type="text"
                            placeholder="Message client back concerning missing requirements..."
                            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none"
                            id="analyst-chat-box"
                          />
                          <button 
                            type="submit"
                            onClick={() => {
                              const input = document.getElementById('analyst-chat-box') as HTMLInputElement;
                              if (input) {
                                setTimeout(() => { input.value = ''; }, 100);
                              }
                            }}
                            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs flex items-center gap-1 shrink-0"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Send Dialogue</span>
                          </button>
                        </form>
                      </div>

                      {/* Staff Subtask / Internal Assign workflows */}
                      <div className="pt-4 border-t border-slate-100 space-y-4">
                        <h4 className="font-bold text-xs text-slate-700 uppercase">Internal Staff Task delegation (Private)</h4>
                        
                        <form onSubmit={handleCreateTask} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl grid md:grid-cols-4 gap-3 items-end">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Task Directive</label>
                            <input 
                              type="text" 
                              required
                              placeholder="e.g. Audit Surat rental rates"
                              value={newTaskTitle}
                              onChange={(e) => setNewTaskTitle(e.target.value)}
                              className="w-full p-2 bg-white border border-slate-200 rounded-2xl text-xs"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Assignee Member</label>
                            <input 
                              type="text" 
                              placeholder="e.g. Neha Sharma"
                              value={newTaskAssignee}
                              onChange={(e) => setNewTaskAssignee(e.target.value)}
                              className="w-full p-2 bg-white border border-slate-200 rounded-2xl text-xs"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Due Date</label>
                            <input 
                              type="date" 
                              value={newTaskDueDate}
                              onChange={(e) => setNewTaskDueDate(e.target.value)}
                              className="w-full p-2 bg-white border border-slate-200 rounded-2xl text-xs"
                            />
                          </div>

                          <button 
                            type="submit"
                            className="w-full py-2 bg-slate-900 text-white font-bold rounded-2xl text-xs hover:bg-slate-800"
                          >
                            Delegate Task
                          </button>
                        </form>

                        <div className="space-y-2">
                          <h5 className="font-bold text-[11px] text-slate-500 uppercase tracking-wider">Delegated Actions Checklist</h5>
                          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white text-xs">
                            {tasksList.map((tsk) => (
                              <div key={tsk.id} className="p-3 flex justify-between items-center">
                                <div className="space-y-0.5">
                                  <p className={`font-bold ${tsk.status === 'Completed' ? 'line-through text-slate-500' : 'text-slate-800'}`}>{tsk.title}</p>
                                  <p className="text-[9px] text-slate-500">Assigned: {tsk.assignedTo} | Due: {tsk.dueDate}</p>
                                </div>

                                <button 
                                  onClick={() => handleToggleTaskStatus(tsk)}
                                  className={`px-3 py-1 rounded-2xl text-[10px] font-bold ${
                                    tsk.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  {tsk.status}
                                </button>
                              </div>
                            ))}

                            {tasksList.length === 0 && (
                              <div className="text-center py-6 text-slate-500 text-xs">
                                No secondary task delegations active.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sub-Tab 7: Document manager & version archiving */}
                  {workspaceSubTab === 'documents' && (
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <h3 className="font-bold font-display text-slate-900 text-base">Corporate Document Control Desk</h3>
                        <p className="text-slate-500 text-xs">Backup previous drafts, keep version histories, and download or preview reference uploads safely.</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* New report draft backup uploads */}
                        <form onSubmit={handleAddVersion} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1 pb-2 border-b border-slate-200">
                            <PlusCircle className="w-4 h-4 text-primary" />
                            <span>Archive Report Draft Version</span>
                          </h4>

                          <div className="space-y-3 text-xs">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-500 uppercase">Version Identifier</label>
                              <input 
                                type="text" 
                                required
                                placeholder="e.g. BizNxt-Draft-V2.1"
                                value={newVersionName}
                                onChange={(e) => setNewVersionName(e.target.value)}
                                className="w-full p-2.5 bg-white border border-slate-200 rounded-2xl text-xs"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-500 uppercase">Change log / Staff Comments</label>
                              <textarea 
                                rows={3}
                                placeholder="Details about this version, QA check feedback, or custom additions..."
                                value={newVersionNotes}
                                onChange={(e) => setNewVersionNotes(e.target.value)}
                                className="w-full p-3 bg-white border border-slate-200 rounded-2xl text-xs focus:outline-none"
                              />
                            </div>

                            <button 
                              type="submit"
                              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs transition-colors"
                            >
                              Archive version backup
                            </button>
                          </div>
                        </form>

                        {/* Report version history log */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                            <Clock className="w-4.5 h-4.5 text-slate-500" />
                            <span>Version Backups Timeline</span>
                          </h4>

                          <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto pr-1 text-xs">
                            {reportVersions.map((v) => (
                              <div key={v.id} className="py-2.5 flex items-start justify-between gap-3">
                                <div className="space-y-0.5">
                                  <p className="font-bold text-slate-800 font-mono text-xs">{v.versionName}</p>
                                  <p className="text-slate-500 italic text-[11px]">{v.notes || "No change notes provided"}</p>
                                  <p className="text-[9px] text-slate-500">Created by {v.uploadedBy} on {new Date(v.timestamp).toLocaleString()}</p>
                                </div>

                                <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-2xl font-bold">
                                  Backup
                                </span>
                              </div>
                            ))}

                            {reportVersions.length === 0 && (
                              <div className="text-center py-12 text-slate-500 text-xs border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                                No previous version backups archived for this report.
                              </div>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                </div>

              </div>

            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-slate-300 rounded-3xl bg-white text-slate-500 text-xs">
              Select an active ticket from the sidebar queue to check/compile dossier findings.
            </div>
          )}
        </div>
      )}

      {/* ==================== 4. PERFORMANCE & SLA VIEW ==================== */}
      {researcherTab === 'performance' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">Average Turnaround Time</span>
              <h3 className="text-3xl font-extrabold text-slate-900 font-display">4.2 Days</h3>
              <p className="text-[11px] text-emerald-600 font-medium">⬇️ 16% faster than 5-day SLA standard</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">QA Quality Audit Score</span>
              <h3 className="text-3xl font-extrabold text-slate-900 font-display">9.82 / 10</h3>
              <p className="text-[11px] text-emerald-600 font-medium">⬆️ Peak structural performance</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">Client Revision Rate</span>
              <h3 className="text-3xl font-extrabold text-slate-900 font-display">1.4%</h3>
              <p className="text-[11px] text-emerald-600 font-medium">⬇️ Industry leading accuracy</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">SLA Compliance Percentage</span>
              <h3 className="text-3xl font-extrabold text-slate-900 font-display">100.00%</h3>
              <p className="text-[11px] text-emerald-600 font-medium">🚀 0 delayed deliveries this cycle</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="space-y-1">
              <h3 className="font-bold font-display text-slate-900 text-md">Executive SLA Roadmap Checkpoint</h3>
              <p className="text-slate-500 text-xs">Standard structural compliance benchmarks required by the BizNxt 3.0 Quality Assurance Board.</p>
            </div>

            <div className="space-y-4">
              {[
                { name: 'Primary Sourcing Verification', desc: 'Direct mapping with Census and GST datasets to confirm local viability.', target: '100% compliant', status: 'Passed' },
                { name: 'Dossier Formatting Standards', desc: 'Precise 21-part dossier generation with complete margins and tables.', target: '100% compliant', status: 'Passed' },
                { name: 'Peer Audits Review', desc: 'Assigned checklist items must be toggled by a secondary quality controller.', target: '100% compliant', status: 'Passed' },
                { name: 'Confidentiality Compliance', desc: 'All local references, client data, and contact lists protected in Firestore.', target: '100% compliant', status: 'Passed' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-slate-800 text-xs">{item.name}</h4>
                    <p className="text-slate-500 text-xs">{item.desc}</p>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="text-xs font-bold text-slate-700 block">{item.target}</span>
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold uppercase rounded-2xl tracking-wider border border-emerald-100">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedTicket && (
        <ResearchFeedbackDialog
          isOpen={isFeedbackDialogOpen}
          onClose={() => setIsFeedbackDialogOpen(false)}
          ticketId={selectedTicket.id}
          ticketNumber={selectedTicket.ticketNumber}
          qaLeadName={user?.displayName || 'Pooja Patel'}
          showToast={showToast}
          onSubmitSuccess={async (statusChanged, nextStatus) => {
            if (statusChanged && nextStatus) {
              await logExecutiveAction("QA_REVISIONS_REQUESTED", `Quality Assurance lead requested revisions. Ticket status changed to: ${nextStatus}`);
            } else {
              await logExecutiveAction("QA_FEEDBACK_LOGGED", "Quality Assurance lead submitted custom feedback notes.");
            }
          }}
        />
      )}

    </div>
  );
}
