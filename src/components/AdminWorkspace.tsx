import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  TrendingUp, 
  IndianRupee, 
  FileText, 
  Settings, 
  Key, 
  Database, 
  Shield, 
  Activity, 
  FileSpreadsheet, 
  Cpu, 
  LifeBuoy, 
  Calendar, 
  DollarSign, 
  Check, 
  BookOpen, 
  Bell, 
  Percent, 
  MapPin, 
  Sparkles, 
  RefreshCw, 
  Play, 
  Send, 
  Upload, 
  Clock, 
  ArrowRight, 
  Lock, 
  Unlock, 
  Sliders,
  ChevronRight,
  Filter,
  Eye,
  Phone,
  Mail,
  Smartphone,
  ExternalLink,
  Map,
  ShieldAlert,
  Archive,
  Menu,
  Terminal,
  Paperclip,
  Rocket,
  Star,
  X
} from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { logUserActivity } from './widgets/UserActivityLogger';
import { PricingAdminConfig } from './widgets/PricingAdminConfig';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  where,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// ============================================================================
// ENTERPRISE SEED SCHEMAS & INITIAL SYSTEM STATE
// ============================================================================
interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'Active' | 'Suspended';
  assignedManager?: string;
  createdDate: string;
  panVerified: boolean;
}

interface BsmRecord {
  id: string;
  name: string;
  email: string;
  assignedCount: number;
  kpiCompleted: number;
  kpiCsat: number;
  kpiRevenue: number;
  averageCompletionDays: number;
  status: 'Active' | 'OnLeave';
}

interface ServiceRecord {
  id: string;
  name: string;
  category: string;
  pricing: number;
  timeline: string;
  slaDays: number;
  status: 'Active' | 'Inactive';
  requiredDocs: string[];
}

interface PartnerRecord {
  id: string;
  name: string;
  type: 'CA' | 'Lawyer' | 'Manufacturer' | 'Marketing' | 'Bank';
  rating: number;
  commissionRate: number;
  status: 'Verified' | 'Pending';
  city: string;
}

interface SupportTicket {
  id: string;
  clientName: string;
  issue: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Resolved';
  createdAt: string;
}

const REVENUE_DATA = [
  { month: 'Jan', revenue: 4500000, registrations: 340 },
  { month: 'Feb', revenue: 5200000, registrations: 410 },
  { month: 'Mar', revenue: 6800000, registrations: 590 },
  { month: 'Apr', revenue: 8100000, registrations: 720 },
  { month: 'May', revenue: 9500000, registrations: 890 },
  { month: 'Jun', revenue: 14200000, registrations: 1140 },
];

const SECTOR_DATA = [
  { name: 'EV Mobility', value: 35 },
  { name: 'Foodtech & QSR', value: 25 },
  { name: 'BioTech Spares', value: 15 },
  { name: 'Agri Cold-Chain', value: 15 },
  { name: 'E-Commerce', value: 10 },
];

const COLORS = ['#C1121F', '#8B5CF6', '#16A34A', '#D62828', '#F59E0B'];

export function AdminWorkspace() {
  const { user } = useAuth();
  const { success, error, confirm } = useToast();
  
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Dynamic States for interactive CRUD operations
  const [systemUsers, setSystemUsers] = useState<UserRecord[]>([]);
  const [bsms, setBsms] = useState<BsmRecord[]>([]);
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [partners, setPartners] = useState<PartnerRecord[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [clientProjects, setClientProjects] = useState<any[]>([]);
  const [riskAlerts, setRiskAlerts] = useState<any[]>([]);

  // Search & Filter controls
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  
  // AI Control State
  const [geminiModel, setGeminiModel] = useState('gemini-2.5-flash');
  const [temperature, setTemperature] = useState(0.2);
  const [promptTestingText, setPromptTestingText] = useState('Create a manufacturing audit brief for a bio-plastic bottle packaging company.');
  const [aiResponseText, setAiResponseText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Modal / Input forms triggers
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showAddPartnerModal, setShowAddPartnerModal] = useState(false);

  // Form Fields
  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '', role: 'customer' });
  const [newService, setNewService] = useState({ name: '', category: 'Legal', pricing: 15000, timeline: '10 Days', slaDays: 10, requiredDocs: '' });
  const [newPartner, setNewPartner] = useState({ name: '', type: 'CA', commissionRate: 10, city: 'Mumbai' });

  // System Configuration parameters
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [backupTriggered, setBackupTriggered] = useState(false);
  const [tokenUsage, setTokenUsage] = useState(842910);
  const [systemTheme, setSystemTheme] = useState('Slate Light');

  // Logs state
  const [auditLogs, setAuditLogs] = useState<string[]>([
    '02:14 UTC - Super Admin verified tax modules for state of Haryana',
    '02:45 UTC - BSM assigned Ketan Sharma to CA partner Rajesh Mehta',
    '03:01 UTC - System generated monthly auto-reconciliation GST files',
    '03:10 UTC - AI pipeline prompt version updated to V3.2'
  ]);

  // Load Database Seed Info and Sync Live Database Elements
  useEffect(() => {
    // 1. Setup initial dynamic data representing realistic systems or fetch
    setSystemUsers([
      { id: 'usr-1', name: 'Ketan Sharma', email: 'ketan@sharma-ventures.com', phone: '+91 98112 00412', role: 'customer', status: 'Active', assignedManager: 'Rahul Verma', createdDate: '2026-06-11', panVerified: true },
      { id: 'usr-2', name: 'Dr. Sneha Roy', email: 'sneha@biotech-spares.in', phone: '+91 88776 55431', role: 'customer', status: 'Active', assignedManager: 'Rahul Verma', createdDate: '2026-06-14', panVerified: true },
      { id: 'usr-3', name: 'Rajesh Mehta', email: 'rajesh@mehtallp.com', phone: '+91 98765 43210', role: 'ca', status: 'Active', createdDate: '2026-04-10', panVerified: true },
      { id: 'usr-4', name: 'Rohan Deshmukh', email: 'rohan@deshmukh-mfg.co', phone: '+91 77665 44321', role: 'manufacturer', status: 'Active', createdDate: '2026-05-20', panVerified: true },
      { id: 'usr-5', name: 'Amit Jha', email: 'amit@biznxt.online', phone: '+91 90088 11223', role: 'bsm', status: 'Active', createdDate: '2026-02-01', panVerified: true }
    ]);

    setBsms([
      { id: 'bsm-1', name: 'Rahul Verma', email: 'rahul.verma@biznxt.online', assignedCount: 8, kpiCompleted: 14, kpiCsat: 4.8, kpiRevenue: 1250000, averageCompletionDays: 24, status: 'Active' },
      { id: 'bsm-2', name: 'Priya Iyer', email: 'priya.iyer@biznxt.online', assignedCount: 11, kpiCompleted: 19, kpiCsat: 4.9, kpiRevenue: 2100000, averageCompletionDays: 19, status: 'Active' },
      { id: 'bsm-3', name: 'Vikram Aditya', email: 'vikram.aditya@biznxt.online', assignedCount: 6, kpiCompleted: 9, kpiCsat: 4.7, kpiRevenue: 850000, averageCompletionDays: 28, status: 'Active' }
    ]);

    setServices([
      { id: 'srv-1', name: 'Private Limited Registration', category: 'Incorporation', pricing: 14999, timeline: '7 Days', slaDays: 7, status: 'Active', requiredDocs: ['PAN Card', 'Aadhaar Card', 'NOC Address proof'] },
      { id: 'srv-2', name: 'GST Filing & Audit Setup', category: 'Taxation', pricing: 4999, timeline: '3 Days', slaDays: 3, status: 'Active', requiredDocs: ['Business Certificate', 'PAN', 'Bank Statement'] },
      { id: 'srv-3', name: 'Trademark & Brand Protection', category: 'IPR Legal', pricing: 8500, timeline: '15 Days', slaDays: 15, status: 'Active', requiredDocs: ['Brand Logo', 'Signed Power of Attorney'] },
      { id: 'srv-4', name: 'Pollution Board Consent (CTE)', category: 'Compliance', pricing: 24999, timeline: '30 Days', slaDays: 30, status: 'Active', requiredDocs: ['Project Report', 'Site Blueprint', 'Raw Materials list'] }
    ]);

    setPartners([
      { id: 'prt-1', name: 'Kothari & Associates Co.', type: 'CA', rating: 4.9, commissionRate: 15, status: 'Verified', city: 'Mumbai' },
      { id: 'prt-2', name: 'Supreme Molders & Extrusions', type: 'Manufacturer', rating: 4.7, commissionRate: 8, status: 'Verified', city: 'Noida' },
      { id: 'prt-3', name: 'Alpha Brand Catalysts', type: 'Marketing', rating: 4.8, commissionRate: 12, status: 'Verified', city: 'Bangalore' },
      { id: 'prt-4', name: 'HDFC Capital Desk', type: 'Bank', rating: 4.5, commissionRate: 5, status: 'Verified', city: 'National' }
    ]);

    setTickets([
      { id: 'tkt-101', clientName: 'Ketan Sharma', issue: 'NOC signature mismatches from Delhi office', priority: 'High', status: 'Open', createdAt: '2026-07-09' },
      { id: 'tkt-102', clientName: 'Amara BioTech', issue: 'GST portal API failure on state code override', priority: 'Medium', status: 'Open', createdAt: '2026-07-10' },
      { id: 'tkt-103', clientName: 'Pune Cold Chain Ltd', issue: 'Industrial tariff calculator precision error', priority: 'Low', status: 'Resolved', createdAt: '2026-07-08' }
    ]);

    // Live sync Firebase client projects
    const unsubProjects = onSnapshot(collection(db, 'client_projects'), (snap) => {
      const items: any[] = [];
      snap.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setClientProjects(items);
    });

    // Live sync risk alerts
    const unsubAlerts = onSnapshot(collection(db, 'risk_alerts'), (snap) => {
      const items: any[] = [];
      snap.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setRiskAlerts(items);
    });

    // Live sync partner registrations
    const unsubPartners = onSnapshot(collection(db, 'partners'), (snap) => {
      const items: any[] = [];
      snap.forEach((doc) => {
        const d = doc.data();
        items.push({
          id: doc.id,
          name: d.companyName || d.name,
          type: d.businessType || 'CA',
          rating: d.rating || 4.8,
          commissionRate: d.commissionRate || 10,
          status: d.status || 'Pending KYC',
          city: d.city || d.officeAddress || 'National',
          isReal: true,
          ...d
        });
      });
      setPartners(prev => {
        const staticOnes = prev.filter(p => !(p as any).isReal);
        return [...staticOnes, ...items];
      });
    });

    return () => {
      unsubProjects();
      unsubAlerts();
      unsubPartners();
    };
  }, []);

  // System Wide Activity Logger
  const addLog = (log: string) => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    setAuditLogs(prev => [`${time} UTC - ${log}`, ...prev.slice(0, 15)]);
    
    // Track in Firestore UserActivityLogger
    if (auth.currentUser) {
      logUserActivity('Admin Action', log, auth.currentUser.email || 'Admin');
    }
  };

  // ============================================================================
  // USER WORKFLOW TRIGGERS
  // ============================================================================
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) {
      error('Please fill required user details.');
      return;
    }
    const created: UserRecord = {
      id: 'usr-' + (systemUsers.length + 1),
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone || '+91 99999 88888',
      role: newUser.role,
      status: 'Active',
      createdDate: new Date().toISOString().split('T')[0],
      panVerified: true
    };
    setSystemUsers(prev => [created, ...prev]);
    addLog(`New user account registered manually: ${created.name} (${created.role.toUpperCase()})`);
    success(`User ${created.name} created successfully.`);
    setShowAddUserModal(false);
    setNewUser({ name: '', email: '', phone: '', role: 'customer' });
  };

  const toggleUserStatus = (userId: string, currentStatus: 'Active' | 'Suspended') => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    setSystemUsers(prev => prev.map(u => u.id === userId ? { ...u, status: nextStatus } : u));
    addLog(`User status overridden for ID ${userId} to ${nextStatus}`);
    success(`User status changed to ${nextStatus}`);
  };

  const handleResetPassword = (email: string) => {
    success(`Password reset link and OTP bypass code generated for ${email}`);
    addLog(`Credentials reset signal emitted for email target: ${email}`);
  };

  // ============================================================================
  // SERVICE CATALOG CREATION
  // ============================================================================
  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.name || !newService.pricing) {
      error('Please input service description and cost parameters.');
      return;
    }
    const created: ServiceRecord = {
      id: 'srv-' + (services.length + 1),
      name: newService.name,
      category: newService.category,
      pricing: Number(newService.pricing),
      timeline: newService.timeline,
      slaDays: Number(newService.slaDays),
      status: 'Active',
      requiredDocs: newService.requiredDocs ? newService.requiredDocs.split(',').map(d => d.trim()) : ['PAN', 'Aadhaar']
    };
    setServices(prev => [...prev, created]);
    addLog(`Operational service capability node published: ${created.name}`);
    success(`Service catalog updated with: ${created.name}`);
    setShowAddServiceModal(false);
    setNewService({ name: '', category: 'Legal', pricing: 15000, timeline: '10 Days', slaDays: 10, requiredDocs: '' });
  };

  const toggleServiceStatus = (serviceId: string, currentStatus: 'Active' | 'Inactive') => {
    const nextStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    setServices(prev => prev.map(s => s.id === serviceId ? { ...s, status: nextStatus } : s));
    addLog(`Service capability toggle initiated for ${serviceId} to ${nextStatus}`);
    success(`Service status modified to ${nextStatus}`);
  };

  // ============================================================================
  // PARTNERS ALLOCATION & COMMISSIONS
  // ============================================================================
  const handleCreatePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartner.name) {
      error('Name is mandatory for partner indexing.');
      return;
    }
    const created: PartnerRecord = {
      id: 'prt-' + (partners.length + 1),
      name: newPartner.name,
      type: newPartner.type as any,
      rating: 5.0,
      commissionRate: Number(newPartner.commissionRate),
      status: 'Verified',
      city: newPartner.city
    };
    setPartners(prev => [...prev, created]);
    addLog(`SME Vendor partner verified & registered: ${created.name}`);
    success(`Partner registry synchronized: ${created.name}`);
    setShowAddPartnerModal(false);
    setNewPartner({ name: '', type: 'CA', commissionRate: 10, city: 'Mumbai' });
  };

  // ============================================================================
  // AI INTERACTIVE PROMPT ENGINE (SIMULATED VIA SERVER-READY GEMINI PATTERNS)
  // ============================================================================
  const handleTestAiPrompt = async () => {
    if (!promptTestingText.trim()) return;
    setIsAiLoading(true);
    addLog(`AI Pipeline trigger issued using Model: ${geminiModel}`);
    try {
      // Simulate real prompt output with highly polished structuring
      setTimeout(() => {
        setAiResponseText(`[GEMINI CONTEXT PARSER] Model: ${geminiModel} | ConfigTemp: ${temperature}\n\n` + 
          `🚀 EXECUTING STRUCTURAL OUTLINE FOR: "${promptTestingText}"\n\n` +
          `1. LEGAL MANDATE OVERVIEW\n` +
          `   - Company Entity Type: Private Limited proposed.\n` +
          `   - Regulatory SLA checks: FSSAI packaging norms under section 4.1.\n\n` +
          `2. STEP-BY-STEP WORKFLOW SCHEDULER\n` +
          `   - Day 1-3: Collect and verify vendor raw certifications via CA partner desk.\n` +
          `   - Day 4-10: Trigger custom physical test blueprints inside regional packaging facility.\n\n` +
          `3. SYSTEM ACTIONABLE ADVICE\n` +
          `   - Automatically assign tasks to "Supreme Molders & Extrusions" with 8% referral commission.\n` +
          `   - Estimated SLA Time: 12 Days (AI Confidence Score: 98.4%)`);
        
        setTokenUsage(prev => prev + 432);
        addLog(`AI prompt processed. 432 tokens deducted from monthly balance.`);
        setIsAiLoading(false);
        success('Gemini Sandbox response modeled successfully.');
      }, 1500);
    } catch (err) {
      setIsAiLoading(false);
      error('Failed to parse model execution.');
    }
  };

  // ============================================================================
  // ADMIN SYSTEM CONFIG UTILITIES
  // ============================================================================
  const handleToggleMaintenance = () => {
    const nextVal = !maintenanceMode;
    setMaintenanceMode(nextVal);
    addLog(`Maintenance mode overrides: Site Live status = ${!nextVal}`);
    success(nextVal ? 'Site put in operations lock state' : 'Site fully live again!');
  };

  const handleBackupDatabase = () => {
    setBackupTriggered(true);
    addLog('Automated Firebase Firestore storage snapshots dumped safely to Cloud storage');
    success('Firestore snapshot backup generated successfully.');
    setTimeout(() => setBackupTriggered(false), 3000);
  };

  // Filtering System users
  const filteredUsers = systemUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
                          u.email.toLowerCase().includes(userSearch.toLowerCase()) || 
                          u.phone.includes(userSearch);
    const matchesRole = userRoleFilter === 'all' ? true : u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-[#F6F8FC] text-slate-800 font-sans overflow-hidden">
      
      {/* ==========================================
          SIDE NAV / CONTROL TABS BAR
          ========================================== */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={`w-80 bg-white/50 backdrop-blur-[40px] flex flex-col border-r border-slate-200/50 shrink-0 relative z-50 ${sidebarOpen ? 'block' : 'hidden md:flex'}`}
      >
        <div className="p-8 flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-xl shadow-primary/20">
              <span className="font-black text-white text-lg tracking-tighter">NXT</span>
            </div>
            <div>
              <h1 className="font-black text-slate-900 text-xl tracking-tighter leading-none">BizNxt OS</h1>
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-1.5 opacity-80">Admin Neural 5.0</p>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-500 hover:text-primary transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation lists */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar">
          <div className="px-6 py-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Operational Nexus</span>
          </div>
          
          <div className="space-y-1 px-2">
            {[
              { id: 'dashboard', icon: LayoutDashboard, label: 'Control Center' },
              { id: 'users', icon: Users, label: 'User Directory' },
              { id: 'bsm', icon: Briefcase, label: 'BSM Platform' },
              { id: 'services', icon: Sliders, label: 'Service Catalog' },
              { id: 'pricing', icon: Percent, label: 'Pricing Matrix' },
              { id: 'partners', icon: FileSpreadsheet, label: 'Partner Hub' },
              { id: 'knowledge', icon: BookOpen, label: 'Knowledge Base' },
              { id: 'finance', icon: IndianRupee, label: 'Finance Control' },
              { id: 'support', icon: LifeBuoy, label: 'Help Desk' },
              { id: 'ai', icon: Sparkles, label: 'AI Control Panel' },
              { id: 'firebase', icon: Database, label: 'Data Integrity' },
              { id: 'security', icon: Shield, label: 'Security Vault' },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full group relative flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all duration-300 ${
                  activeTab === item.id 
                    ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20' 
                    : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <item.icon size={20} className={activeTab === item.id ? 'text-primary' : 'group-hover:scale-110 transition-transform duration-300'} />
                <span className="text-[13px] font-black tracking-tight">{item.label}</span>
                {activeTab === item.id && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute left-0 w-1.5 h-6 bg-primary rounded-r-full"
                  />
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* System Health */}
        <div className="p-6 m-4 bg-slate-50 rounded-[2rem] border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Link</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-2xl animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
              <span className="text-[10px] font-black text-emerald-600">ONLINE</span>
            </span>
          </div>
          <div className="space-y-3">
            <div className="h-1.5 w-full bg-slate-200 rounded-2xl overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '88%' }}
                className="h-full bg-primary"
              />
            </div>
            <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <span>CPU Node</span>
              <span>88% Efficiency</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ==========================================
          MAIN OPERATIONS CONTENT STAGE
          ========================================== */}
      <div className="flex-1 flex flex-col min-w-0 relative h-screen">
        
        {/* TOP STATUS BAR ACCENTS */}
        <header className="h-24 px-10 flex items-center justify-between shrink-0 bg-white/40 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-40">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 shadow-sm text-slate-500 hover:text-primary hover:border-primary/20 transition-all active:scale-95"
            >
              <Menu size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] font-mono">Operations Command</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter capitalize flex items-center gap-3">
                {activeTab.replace('_', ' ')} Registry
                <span className="text-sm font-black px-3 py-1 bg-slate-100 rounded-2xl text-slate-500 tracking-normal normal-case">
                  v5.0.2 Stable
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex flex-col text-right mr-4">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Operator</span>
              <span className="text-sm font-black text-slate-900 tracking-tight">{user?.email || 'Super Admin'}</span>
            </div>

            <button 
              onClick={handleBackupDatabase}
              disabled={backupTriggered}
              className="h-12 px-6 bg-slate-900 text-white text-[10px] font-black rounded-2xl uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center gap-3"
            >
              <Database size={16} />
              {backupTriggered ? 'Snapshotting...' : 'Sync Backup'}
            </button>

            <button 
              onClick={handleToggleMaintenance}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-xl active:scale-95 ${
                maintenanceMode 
                  ? 'bg-primary text-white shadow-primary/20' 
                  : 'bg-white border border-slate-100 text-slate-500 shadow-slate-900/5 hover:text-primary'
              }`}
            >
              <ShieldAlert size={20} />
            </button>
          </div>
        </header>

        {/* CONTAINER VIEWPORTS */}
        <main className="flex-1 overflow-y-auto no-scrollbar p-10 bg-[#F6F8FC]">

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              
              {/* =====================================================================
                  TAB A: OPERATIONAL HUB (DASHBOARD)
                  ===================================================================== */}
              {activeTab === 'dashboard' && (
                <div className="space-y-12">
                  {/* System overview KPIs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    
                    <motion.div 
                      whileHover={{ y: -5 }}
                      className="glass-card p-10 rounded-3xl relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-all"></div>
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary/20">
                          <IndianRupee size={28} />
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">↑ 18.2%</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Monthly Runrate</h4>
                        <div className="text-3xl font-black text-slate-900 tracking-tighter">1.42 Cr</div>
                      </div>
                    </motion.div>

                    <motion.div 
                      whileHover={{ y: -5 }}
                      className="glass-card p-10 rounded-3xl relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-all"></div>
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary/20">
                          <Briefcase size={28} />
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Ops</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Active Portfolios</h4>
                        <div className="text-3xl font-black text-slate-900 tracking-tighter">
                          {clientProjects.length > 0 ? clientProjects.length : '18'} Launch
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      whileHover={{ y: -5 }}
                      className="glass-card p-10 rounded-3xl relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl -mr-10 -mt-10 group-hover:bg-emerald-500/10 transition-all"></div>
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20">
                          <Users size={28} />
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">+310 Week</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Network Scale</h4>
                        <div className="text-3xl font-black text-slate-900 tracking-tighter">
                          {(systemUsers.length + 1420).toLocaleString()}
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      whileHover={{ y: -5 }}
                      className="glass-card p-10 rounded-3xl relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl -mr-10 -mt-10 group-hover:bg-amber-500/10 transition-all"></div>
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-amber-500/20">
                          <CheckCircle size={28} />
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-black text-primary uppercase tracking-widest">{riskAlerts.length} Risks</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">SLA Compliance</h4>
                        <div className="text-3xl font-black text-slate-900 tracking-tighter">96.8%</div>
                      </div>
                    </motion.div>

                  </div>

                  {/* Growth charts and analytical splits */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* Primary Growth chart */}
                    <div className="lg:col-span-8 glass-card p-12 rounded-[3.5rem]">
                      <div className="flex items-center justify-between mb-12">
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Velocity Metrics</h3>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Gross Network Revenue Flow</p>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Revenue (INR)</span>
                          </div>
                          <select className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none">
                            <option>Q2 2026</option>
                            <option>Q1 2026</option>
                          </select>
                        </div>
                      </div>
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#F43F5E" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                              dataKey="month" 
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                              dy={15}
                            />
                            <YAxis 
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                              tickFormatter={(val) => `₹${val/100000}L`}
                            />
                            <Tooltip 
                              contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                              formatter={(value: any) => [`₹${(value).toLocaleString('en-IN')}`, 'Revenue']} 
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#F43F5E" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Right: Sector Demand Splits */}
                    <div className="lg:col-span-4 glass-card p-12 rounded-[3.5rem] flex flex-col">
                      <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-2">Trend Matrix</h3>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10">Sectoral Dominance</p>
                      
                      <div className="h-[250px] mb-10 relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={SECTOR_DATA}
                              cx="50%"
                              cy="50%"
                              innerRadius={70}
                              outerRadius={100}
                              paddingAngle={8}
                              dataKey="value"
                              stroke="none"
                            >
                              {SECTOR_DATA.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Top Focus</span>
                          <span className="text-xl font-black text-slate-900 tracking-tighter">Mobility</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {SECTOR_DATA.map((item, idx) => (
                          <div key={item.name} className="flex justify-between items-center group">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                              <span className="text-[12px] font-black text-slate-600 uppercase tracking-tight group-hover:text-slate-900 transition-colors">{item.name}</span>
                            </div>
                            <span className="text-[12px] font-black text-slate-900 font-mono">{item.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Lower grid: live audit trail and operational alerts */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* Operations live logs */}
                    <div className="lg:col-span-7 glass-card p-12 rounded-[3.5rem]">
                      <div className="flex items-center justify-between mb-10">
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Neural Audit</h3>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Live System Telemetry</p>
                        </div>
                        <button 
                          onClick={() => {
                            addLog('Force system sync check triggered across database shards');
                            success('Platform state synced.');
                          }} 
                          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-500 hover:text-primary transition-all border border-slate-100"
                        >
                          <RefreshCw size={20} />
                        </button>
                      </div>

                      <div className="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar">
                        {auditLogs.map((log, index) => (
                          <motion.div 
                            key={index} 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-start gap-4 p-5 rounded-[1.5rem] bg-slate-50/50 border border-slate-100 group hover:border-rose-200 transition-all"
                          >
                            <div className="w-8 h-8 bg-white rounded-2xl flex items-center justify-center text-slate-500 shadow-sm">
                              <Terminal size={14} />
                            </div>
                            <span className="text-[11px] font-bold text-slate-600 font-mono tracking-tight leading-relaxed">{log}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Right side: quick status widgets */}
                    <div className="lg:col-span-5 glass-card p-12 rounded-[3.5rem] flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-2">Geo Scale</h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10">Regional Node Load</p>
                      </div>
                      
                      <div className="space-y-8 mb-10">
                        {[
                          { label: 'Noida & NCR', value: 38, color: 'bg-primary' },
                          { label: 'Mumbai & Pune', value: 28, color: 'bg-primary' },
                          { label: 'Bangalore & South', value: 19, color: 'bg-emerald-500' },
                        ].map((geo) => (
                          <div key={geo.label} className="space-y-3">
                            <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                              <span>{geo.label}</span>
                              <span className="font-mono">{geo.value}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2.5 rounded-2xl overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${geo.value}%` }}
                                className={`h-full ${geo.color} rounded-2xl`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-8 bg-rose-50 rounded-[2.5rem] border border-primary/20/50 flex items-start gap-5">
                        <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm shrink-0">
                          <AlertTriangle size={20} />
                        </div>
                        <div>
                          <p className="text-[11px] font-black text-rose-900 uppercase tracking-widest mb-1">Critical SLA Breach</p>
                          <p className="text-[12px] font-medium text-rose-700 leading-snug">
                            4 CA tasks approaching deadline in West Zone. Immediate node redistribution required.
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* =====================================================================
                  TAB B: USER MANAGEMENT DIRECTORY
                  ===================================================================== */}
              {activeTab === 'users' && (
                <div className="space-y-10">
                  
                  {/* Search and control filter line */}
                  <div className="glass-card p-10 rounded-3xl flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="flex flex-1 items-center gap-6 bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5">
                      <Search className="text-slate-500" size={24} />
                      <input 
                        type="text" 
                        placeholder="Neural search user directory..." 
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="bg-transparent border-none outline-none w-full text-sm font-bold text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3">
                        <Filter size={18} className="text-primary" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Role Protocol:</span>
                      </div>
                      <select 
                        value={userRoleFilter} 
                        onChange={(e) => setUserRoleFilter(e.target.value)}
                        className="bg-slate-900 text-white border-none rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest outline-none shadow-xl shadow-slate-900/20"
                      >
                        <option value="all">All Access Levels</option>
                        <option value="customer">Customer Node</option>
                        <option value="bsm">BSM Executive</option>
                        <option value="ca">CA Partner</option>
                        <option value="manufacturer">Manufacturer</option>
                      </select>

                      <button 
                        onClick={() => setShowAddUserModal(true)}
                        className="h-14 px-8 bg-primary text-white text-[10px] font-black rounded-2xl uppercase tracking-widest hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 flex items-center gap-3 active:scale-95"
                      >
                        <Plus size={18} />
                        Onboard User
                      </button>
                    </div>
                  </div>

                  {/* Users Master Table */}
                  <div className="glass-card rounded-[3.5rem] overflow-hidden">
                    <div className="overflow-x-auto no-scrollbar">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-10 py-8 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Identity Node</th>
                            <th className="px-10 py-8 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol / Status</th>
                            <th className="px-10 py-8 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Communication Channel</th>
                            <th className="px-10 py-8 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Timeline</th>
                            <th className="px-10 py-8 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Admin Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {filteredUsers.map((u) => (
                            <motion.tr 
                              key={u.id} 
                              whileHover={{ backgroundColor: 'rgba(241, 245, 249, 0.5)' }}
                              className="transition-colors group"
                            >
                              <td className="px-10 py-8">
                                <div className="flex items-center gap-5">
                                  <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-slate-500 font-black text-lg shadow-sm group-hover:from-rose-50 group-hover:to-rose-100 group-hover:text-primary transition-all">
                                    {u.name.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="text-sm font-black text-slate-900 tracking-tight">{u.name}</div>
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">ID: {u.id}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-10 py-8">
                                <div className="space-y-2">
                                  <span className={`px-4 py-1.5 rounded-2xl text-[9px] font-black uppercase tracking-widest ${
                                    u.role === 'customer' ? 'bg-slate-50 text-slate-600' :
                                    u.role === 'bsm' ? 'bg-purple-50 text-purple-600' :
                                    'bg-emerald-50 text-emerald-600'
                                  }`}>
                                    {u.role} Access
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-2xl ${u.status === 'Active' ? 'bg-emerald-500' : 'bg-primary'}`}></div>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{u.status}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-10 py-8">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-[12px] font-bold text-slate-600">
                                    <Mail size={12} className="text-slate-500" />
                                    {u.email}
                                  </div>
                                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    <Phone size={12} className="text-slate-500" />
                                    {u.phone}
                                  </div>
                                </div>
                              </td>
                              <td className="px-10 py-8">
                                <div className="text-[12px] font-black text-slate-900">{new Date(u.createdDate).toLocaleDateString()}</div>
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Registered</div>
                              </td>
                              <td className="px-10 py-8">
                                <div className="flex items-center justify-end gap-3">
                                  <button 
                                    onClick={() => handleResetPassword(u.email)}
                                    className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-500 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                                    title="Reset Credentials"
                                  >
                                    <Key size={16} />
                                  </button>
                                  <button 
                                    onClick={() => toggleUserStatus(u.id, u.status)}
                                    className={`w-10 h-10 flex items-center justify-center rounded-2xl transition-all shadow-sm ${
                                      u.status === 'Active' 
                                        ? 'bg-rose-50 text-primary hover:bg-primary hover:text-white' 
                                        : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                                    }`}
                                    title={u.status === 'Active' ? 'Suspend Node' : 'Restore Node'}
                                  >
                                    {u.status === 'Active' ? <Lock size={16} /> : <Unlock size={16} />}
                                  </button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* =====================================================================
                  TAB C: BUSINESS SUCCESS MANAGER (BSM) PLATFORM HUB
                  ===================================================================== */}
              {activeTab === 'bsm' && (
                <div className="space-y-6">
                  
                  {/* Grid of BSM performance indicators */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {bsms.map(b => (
                      <div key={b.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-bold uppercase tracking-wider font-mono">Dedicated BSM</span>
                            <h4 className="text-lg font-bold text-slate-900 mt-1">{b.name}</h4>
                            <p className="text-xs text-slate-500 font-mono">{b.email}</p>
                          </div>
                          <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-2xl flex items-center">
                            ★ {b.kpiCsat} CSAT
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs">
                          <div>
                            <span className="text-slate-500 block font-medium">Assigned Clients</span>
                            <span className="text-lg font-bold text-slate-800">{b.assignedCount} portfolios</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block font-medium">Coordinated Speed</span>
                            <span className="text-lg font-bold text-slate-800">{b.averageCompletionDays} days avg.</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block font-medium">Completed Projects</span>
                            <span className="text-lg font-bold text-slate-800">{b.kpiCompleted} done</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block font-medium">Revenue Contributed</span>
                            <span className="text-lg font-bold text-slate-800 flex items-center">
                              <IndianRupee className="w-3.5 h-3.5 mr-0.5 text-slate-600" />
                              {(b.kpiRevenue / 100000).toFixed(1)}L
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs font-semibold">
                          <span className="text-slate-500">Status: {b.status}</span>
                          <button 
                            onClick={() => {
                              addLog(`Triggered load optimization re-balance query for BSM ${b.name}`);
                              success(`Client load optimized for ${b.name}.`);
                            }}
                            className="text-primary-dark hover:underline flex items-center space-x-1"
                          >
                            <span>Optimize Load</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Portfolio Assignments Matrix */}
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6">
                    <div className="flex items-center justify-between mb-12">
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Portfolio Command</h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Global Success Manager Orchestration</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-500 border border-slate-100">
                          <Filter size={20} />
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto no-scrollbar">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-10 py-8 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Client Venture</th>
                            <th className="px-10 py-8 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Roadmap Status</th>
                            <th className="px-10 py-8 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Vitality Score</th>
                            <th className="px-10 py-8 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Assigned Node</th>
                            <th className="px-10 py-8 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Reallocation</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {clientProjects.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="px-10 py-24 text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mx-auto mb-6">
                                  <Briefcase size={32} />
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Zero Active Portfolios</p>
                              </td>
                            </tr>
                          ) : (
                            clientProjects.map(proj => (
                              <motion.tr 
                                key={proj.id} 
                                whileHover={{ backgroundColor: 'rgba(241, 245, 249, 0.5)' }}
                                className="group transition-colors"
                              >
                                <td className="px-10 py-8">
                                  <div className="text-sm font-black text-slate-900 tracking-tight">{proj.businessName}</div>
                                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Client: {proj.clientName}</div>
                                </td>
                                <td className="px-10 py-8">
                                  <span className="px-4 py-1.5 rounded-2xl bg-rose-50 text-primary text-[10px] font-black uppercase tracking-widest">
                                    {proj.currentTimelineStep?.replace('_', ' ') || 'Consultation'}
                                  </span>
                                </td>
                                <td className="px-10 py-8">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 bg-slate-100 h-1.5 rounded-2xl overflow-hidden">
                                      <div className="bg-emerald-500 h-full" style={{ width: `${proj.businessScore || 85}%` }}></div>
                                    </div>
                                    <span className="text-[12px] font-black text-slate-900 font-mono">{proj.businessScore || 85}%</span>
                                  </div>
                                </td>
                                <td className="px-10 py-8">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-[10px] font-black">
                                      {bsms.find(b => b.id === proj.bsmId)?.name.charAt(0) || 'U'}
                                    </div>
                                    <span className="text-[12px] font-black text-slate-600 tracking-tight">
                                      {bsms.find(b => b.id === proj.bsmId)?.name || 'Unassigned'}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-10 py-8 text-right">
                                  <select 
                                    className="bg-white border border-slate-200 rounded-2xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                                    onChange={async (e) => {
                                      const nextBsm = e.target.value;
                                      await updateDoc(doc(db, 'client_projects', proj.id), { bsmId: nextBsm });
                                      addLog(`Transferred portfolio ${proj.businessName} to success manager: ${nextBsm}`);
                                      success('Success Manager reallocated.');
                                    }}
                                    defaultValue={proj.bsmId}
                                  >
                                    <option value="">Unassign</option>
                                    {bsms.map(b => (
                                      <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                  </select>
                                </td>
                              </motion.tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* =====================================================================
                  TAB D: SERVICE CATALOG (SERVICE & SLA)
                  ===================================================================== */}
              {activeTab === 'services' && (
                <div className="space-y-12">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Capabilities Ledger</h3>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Advanced Service Parameter Control</p>
                    </div>
                    <button 
                      onClick={() => setShowAddServiceModal(true)}
                      className="h-14 px-8 bg-slate-900 text-white text-[10px] font-black rounded-2xl uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-slate-900/20 flex items-center gap-3 active:scale-95"
                    >
                      <Plus size={18} />
                      Deploy New Service
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {services.map(s => (
                      <motion.div 
                        key={s.id} 
                        whileHover={{ y: -8 }}
                        className="glass-card p-10 rounded-3xl flex flex-col justify-between group"
                      >
                        <div className="space-y-8">
                          <div className="flex justify-between items-start">
                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-500 group-hover:bg-rose-50 group-hover:text-primary transition-colors border border-slate-100">
                              <Sliders size={28} />
                            </div>
                            <button 
                              onClick={() => toggleServiceStatus(s.id, s.status)}
                              className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                s.status === 'Active' 
                                  ? 'bg-emerald-50 text-emerald-500 border border-emerald-100' 
                                  : 'bg-rose-50 text-primary border border-primary/20'
                              }`}
                            >
                              {s.status}
                            </button>
                          </div>

                          <div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{s.category}</span>
                            <h4 className="text-2xl font-black text-slate-900 tracking-tighter mt-2">{s.name}</h4>
                            <div className="flex items-center gap-2 mt-4">
                              <span className="text-sm font-black text-slate-500 tracking-widest uppercase">Pricing Node</span>
                              <span className="text-xl font-black text-primary tracking-tighter font-mono">₹{s.pricing.toLocaleString('en-IN')}</span>
                            </div>
                          </div>

                          <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SLA Window</span>
                              <span className="text-[12px] font-black text-slate-900 uppercase tracking-tight">{s.timeline}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Grace Period</span>
                              <span className="text-[12px] font-black text-slate-900 uppercase tracking-tight">{s.slaDays} Days</span>
                            </div>
                            <div className="pt-4 border-t border-slate-100">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Required Documents</span>
                              <div className="flex flex-wrap gap-2">
                                {s.requiredDocs.map(doc => (
                                  <span key={doc} className="px-3 py-1 bg-white text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-100">
                                    {doc}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-8">
                          <button 
                            onClick={() => {
                              addLog(`Disabled workflow automated assignment rules on service: ${s.id}`);
                              success('Auto-assignment rules disabled.');
                            }}
                            className="py-4 bg-slate-50 text-slate-500 text-[10px] font-black rounded-2xl uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all active:scale-95 border border-slate-100"
                          >
                            Auto-Assign
                          </button>
                          <button 
                            onClick={() => {
                              addLog(`Initiated SLA policy re-indexing for ${s.name}`);
                              success('SLA parameters updated.');
                            }}
                            className="py-4 bg-slate-900 text-white text-[10px] font-black rounded-2xl uppercase tracking-widest hover:bg-primary-dark transition-all active:scale-95 shadow-xl shadow-slate-900/10"
                          >
                            Update Rules
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* =====================================================================
                  TAB E: PRICING ENGINE
                  ===================================================================== */}
              {activeTab === 'pricing' && (
                <div className="space-y-12">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 glass-card p-12 rounded-[3.5rem] space-y-10">
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Dynamic Pricing Matrix</h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">AI-Powered Revenue Optimization</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                          { label: 'Research Bundle', price: '24,999', desc: 'AI Modeling + Validation', icon: Sparkles, color: 'text-primary', bg: 'bg-primary/5' },
                          { label: 'Consulting Package', price: '49,999', desc: 'SME Live Consultancy', icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-50' },
                          { label: 'Full Launch Platform', price: '1,49,999', desc: 'Dedicated BSM + Legal', icon: Rocket, color: 'text-primary', bg: 'bg-rose-50' },
                        ].map((pkg) => (
                          <motion.div 
                            key={pkg.label}
                            whileHover={{ y: -5 }}
                            className="p-8 border border-slate-100 rounded-[2.5rem] space-y-6 relative overflow-hidden group"
                          >
                            <div className={`w-12 h-12 ${pkg.bg} ${pkg.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                              <pkg.icon size={24} />
                            </div>
                            <div>
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">{pkg.label}</span>
                              <div className="flex items-center gap-1 text-2xl font-black text-slate-900 tracking-tighter font-mono">
                                <IndianRupee size={20} className="text-slate-400" />
                                {pkg.price}
                              </div>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-4 opacity-0 group-hover:opacity-100 transition-opacity">{pkg.desc}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <PricingAdminConfig />
                    </div>

                    <div className="lg:col-span-4 glass-card p-12 rounded-[3.5rem] flex flex-col justify-between">
                      <div className="space-y-10">
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Vouchers</h3>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Campaign Distribution Node</p>
                        </div>

                        <div className="space-y-6">
                          {[
                            { code: 'BIZNXT5000', benefit: 'Flat ₹5,000 Off', redeemed: 142, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                            { code: 'SUPERFOUNDER', benefit: '15% Off Bundle', redeemed: 92, color: 'text-primary', bg: 'bg-rose-50' },
                          ].map((coupon) => (
                            <div key={coupon.code} className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] relative group overflow-hidden">
                              <div className="flex justify-between items-start relative z-10">
                                <div>
                                  <span className="text-xl font-black text-slate-900 tracking-tighter font-mono">{coupon.code}</span>
                                  <p className={`text-[10px] font-black ${coupon.color} uppercase tracking-widest mt-1`}>{coupon.benefit}</p>
                                </div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{coupon.redeemed} Redeemed</span>
                              </div>
                              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white rounded-2xl flex items-center justify-center text-slate-100 opacity-20 group-hover:scale-110 transition-transform">
                                <Percent size={48} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          addLog('New promotional voucher code campaign instantiated: DIWALI10');
                          success('Diwali coupon code published live.');
                        }}
                        className="h-16 w-full bg-slate-900 text-white text-[10px] font-black rounded-2xl uppercase tracking-widest hover:bg-primary-dark transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-3 mt-10"
                      >
                        <Plus size={18} />
                        Generate Voucher
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* =====================================================================
                  TAB F: PARTNER REGISTRY
                  ===================================================================== */}
              {activeTab === 'partners' && (
                <div className="space-y-12">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Alliance Ecosystem</h3>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">CAs, Legal SME, OEM & Financial Nodes</p>
                    </div>
                    <button 
                      onClick={() => setShowAddPartnerModal(true)}
                      className="h-14 px-8 bg-slate-900 text-white text-[10px] font-black rounded-2xl uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-slate-900/20 flex items-center gap-3 active:scale-95"
                    >
                      <Plus size={18} />
                      Register New Partner
                    </button>
                  </div>

                  <div className="glass-card rounded-[3.5rem] overflow-hidden border border-slate-100">
                    <div className="overflow-x-auto no-scrollbar">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-10 py-8 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Partner Agency</th>
                            <th className="px-10 py-8 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Specialization</th>
                            <th className="px-10 py-8 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Vitality Rating</th>
                            <th className="px-10 py-8 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Yield Commission</th>
                            <th className="px-10 py-8 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Regional Node</th>
                            <th className="px-10 py-8 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">KYC Status</th>
                            <th className="px-10 py-8 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Control</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {partners.map(p => (
                            <motion.tr 
                              key={p.id} 
                              whileHover={{ backgroundColor: 'rgba(241, 245, 249, 0.5)' }}
                              className="group transition-colors"
                            >
                              <td className="px-10 py-8">
                                <div className="text-sm font-black text-slate-900 tracking-tight">{p.name}</div>
                              </td>
                              <td className="px-10 py-8">
                                <span className="px-4 py-1.5 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
                                  {p.type}
                                </span>
                              </td>
                              <td className="px-10 py-8">
                                <div className="flex items-center gap-1 text-amber-500 font-black font-mono">
                                  <Star size={14} fill="currentColor" />
                                  {p.rating}
                                </div>
                              </td>
                              <td className="px-10 py-8">
                                <span className="text-[12px] font-black text-slate-900 font-mono">{p.commissionRate}%</span>
                              </td>
                              <td className="px-10 py-8">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{p.city}</span>
                              </td>
                              <td className="px-10 py-8">
                                <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${
                                  p.status === 'Verified' 
                                    ? 'bg-emerald-50 text-emerald-500 border-emerald-100' 
                                    : 'bg-amber-50 text-amber-500 border-amber-100'
                                }`}>
                                  {p.status}
                                </span>
                              </td>
                              <td className="px-10 py-8 text-right">
                                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {p.status === 'Pending KYC' && (
                                    <button 
                                      onClick={async () => {
                                        try {
                                          await updateDoc(doc(db, 'partners', p.id), { status: 'Verified' });
                                          addLog(`Approved and verified KYC for partner agency: ${p.name}`);
                                          success('Partner verified.');
                                        } catch (err) {
                                          error('Error updating partner status.');
                                        }
                                      }}
                                      className="w-10 h-10 bg-emerald-500 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                                      title="Verify KYC"
                                    >
                                      <Check size={18} />
                                    </button>
                                  )}
                                  <button 
                                    onClick={async () => {
                                      if ((p as any).isReal) {
                                        try {
                                          await deleteDoc(doc(db, 'partners', p.id));
                                          addLog(`Deregistered partner from Firestore: ${p.name}`);
                                          success('Partner de-registered.');
                                        } catch (err) {
                                          error('Failed to de-register partner.');
                                        }
                                      } else {
                                        addLog(`Removed partner agency index entry: ${p.name}`);
                                        setPartners(prev => prev.filter(item => item.id !== p.id));
                                        success('Partner index updated.');
                                      }
                                    }}
                                    className="w-10 h-10 bg-rose-50 text-primary rounded-2xl flex items-center justify-center hover:bg-primary hover:text-white transition-all active:scale-95 border border-primary/20"
                                    title="De-register"
                                  >
                                    <X size={18} />
                                  </button>
                                  <button className="w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-primary transition-all active:scale-95 shadow-lg shadow-slate-900/20">
                                    <ChevronRight size={18} />
                                  </button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* =====================================================================
                  TAB G: KNOWLEDGE BASE & GEO DATABASES
                  ===================================================================== */}
              {activeTab === 'knowledge' && (
                <div className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Industries Database */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">BizNxt Industry Classification Nodes</h4>
                        <p className="text-xs text-slate-500">Default business sectors supported on onboarding questionnaires.</p>
                      </div>

                      <div className="space-y-2">
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-800">Electric Vehicle spare parts manufacturing</span>
                          <span className="text-primary-dark font-bold bg-rose-50 px-2 py-0.5 rounded font-mono">14 Projects</span>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-800">Organic food processing & QSR chains</span>
                          <span className="text-primary-dark font-bold bg-rose-50 px-2 py-0.5 rounded font-mono">22 Projects</span>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-800">Bio-degradable eco-friendly packaging</span>
                          <span className="text-primary-dark font-bold bg-rose-50 px-2 py-0.5 rounded font-mono">11 Projects</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          addLog('Appended "Drone Delivery Logistics Solutions" to global categories');
                          success('Industry classification database updated.');
                        }}
                        className="bg-slate-800 hover:bg-slate-950 text-white w-full py-2.5 rounded-2xl text-xs font-semibold"
                      >
                        Append New Sector Classification
                      </button>
                    </div>

                    {/* Regional Geo/PIN code databases */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-bold text-slate-900 text-base">Regional PIN Code Coverage Shards</h4>
                          <p className="text-xs text-slate-500">Validate local state-wise GST rules automatically.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="p-2.5 border border-slate-100 rounded-2xl">
                            <span className="text-slate-500 block">Delhi NCR</span>
                            <span className="font-mono font-bold">110001 - 110096</span>
                          </div>
                          <div className="p-2.5 border border-slate-100 rounded-2xl">
                            <span className="text-slate-500 block">Haryana Hub</span>
                            <span className="font-mono font-bold">122001 - 122018</span>
                          </div>
                          <div className="p-2.5 border border-slate-100 rounded-2xl">
                            <span className="text-slate-500 block">Maharashtra Zone</span>
                            <span className="font-mono font-bold">400001 - 411045</span>
                          </div>
                          <div className="p-2.5 border border-slate-100 rounded-2xl">
                            <span className="text-slate-500 block">Karnataka Tech</span>
                            <span className="font-mono font-bold">560001 - 560100</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-150 text-xs text-slate-500 mt-4">
                        Each state-level PIN code range applies dynamic state taxes during corporate filing calculations.
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* =====================================================================
                  TAB H: FINANCE CONTROL LEDGERS
                  ===================================================================== */}
              {activeTab === 'finance' && (
                <div className="space-y-6">
                  
                  {/* Financial KPI stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-5 bg-white border border-slate-200 rounded-2xl">
                      <span className="text-xs text-slate-500 uppercase tracking-wider block font-bold">Invoiced Amount</span>
                      <div className="flex items-baseline space-x-1 mt-1">
                        <IndianRupee className="w-5 h-5 text-slate-800" />
                        <span className="text-2xl font-bold font-display text-slate-800">1.82 Cr</span>
                      </div>
                    </div>

                    <div className="p-5 bg-white border border-slate-200 rounded-2xl">
                      <span className="text-xs text-slate-500 uppercase tracking-wider block font-bold">Outstanding collections</span>
                      <div className="flex items-baseline space-x-1 mt-1 text-amber-600">
                        <IndianRupee className="w-5 h-5" />
                        <span className="text-2xl font-bold font-display">12.4 Lakhs</span>
                      </div>
                    </div>

                    <div className="p-5 bg-white border border-slate-200 rounded-2xl">
                      <span className="text-xs text-slate-500 uppercase tracking-wider block font-bold">Disbursed commission</span>
                      <div className="flex items-baseline space-x-1 mt-1 text-slate-600">
                        <IndianRupee className="w-5 h-5" />
                        <span className="text-2xl font-bold font-display">15.8 Lakhs</span>
                      </div>
                    </div>

                    <div className="p-5 bg-white border border-slate-200 rounded-2xl">
                      <span className="text-xs text-slate-500 uppercase tracking-wider block font-bold">Refunds reconciled</span>
                      <div className="flex items-baseline space-x-1 mt-1 text-slate-500">
                        <IndianRupee className="w-5 h-5" />
                        <span className="text-2xl font-bold font-display">1.2 Lakhs</span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Payments Ledger list */}
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-base">Invoices & Service Payments Logs</h3>
                      <button 
                        onClick={() => {
                          addLog('Exported financial ledger excel sheet BIZNXT_RECON_Q2_2026.xlsx');
                          success('Financial spreadsheet exported successfully.');
                        }}
                        className="text-xs text-primary-dark hover:underline flex items-center space-x-1"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Export Accounting Sheet</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto text-sm">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100">
                            <th className="px-6 py-3.5">Invoice Number</th>
                            <th className="px-6 py-3.5">Venture Client</th>
                            <th className="px-6 py-3.5">Billing Module</th>
                            <th className="px-6 py-3.5">Payment Type</th>
                            <th className="px-6 py-3.5">Amount</th>
                            <th className="px-6 py-3.5">Transaction Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                          <tr className="hover:bg-slate-50/50">
                            <td className="px-6 py-4 font-mono font-bold text-slate-900">INV-2026-8942</td>
                            <td className="px-6 py-4">Ketan Sharma</td>
                            <td className="px-6 py-4">Dedicated BSM Coordination</td>
                            <td className="px-6 py-4 text-xs font-semibold">Consulting Fee</td>
                            <td className="px-6 py-4 font-mono font-bold">₹1,49,999</td>
                            <td className="px-6 py-4">
                              <span className="inline-block px-2.5 py-0.5 rounded-2xl text-xs font-semibold bg-emerald-50 text-emerald-700">Settled</span>
                            </td>
                          </tr>

                          <tr className="hover:bg-slate-50/50">
                            <td className="px-6 py-4 font-mono font-bold text-slate-900">INV-2026-8910</td>
                            <td className="px-6 py-4">Dr. Sneha Roy</td>
                            <td className="px-6 py-4">Pollution Consent CTE Service</td>
                            <td className="px-6 py-4 text-xs font-semibold">SME Vendor Service</td>
                            <td className="px-6 py-4 font-mono font-bold">₹24,999</td>
                            <td className="px-6 py-4">
                              <span className="inline-block px-2.5 py-0.5 rounded-2xl text-xs font-semibold bg-emerald-50 text-emerald-700">Settled</span>
                            </td>
                          </tr>

                          <tr className="hover:bg-slate-50/50">
                            <td className="px-6 py-4 font-mono font-bold text-slate-900">INV-2026-7711</td>
                            <td className="px-6 py-4">Amara BioTech</td>
                            <td className="px-6 py-4">Trademark Registration Filing</td>
                            <td className="px-6 py-4 text-xs font-semibold">SME Vendor Service</td>
                            <td className="px-6 py-4 font-mono font-bold">₹8,500</td>
                            <td className="px-6 py-4">
                              <span className="inline-block px-2.5 py-0.5 rounded-2xl text-xs font-semibold bg-amber-50 text-amber-700">Awaiting Bank</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* =====================================================================
                  TAB I: CRM & SUPPORT HELP DESK
                  ===================================================================== */}
              {activeTab === 'support' && (
                <div className="space-y-6">
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Active support tickets */}
                    <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">Customer Support & Escalations Ticket Queue</h3>
                        <p className="text-xs text-slate-500">Live operational inquiries from clients in execution phase.</p>
                      </div>

                      <div className="space-y-3">
                        {tickets.map(t => (
                          <div key={t.id} className="p-4 border border-slate-100 rounded-2xl hover:border-slate-200 transition-all flex justify-between items-start">
                            <div className="space-y-1">
                              <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider block">ID: {t.id} • Created {t.createdAt}</span>
                              <h4 className="font-bold text-slate-900 text-sm">{t.issue}</h4>
                              <p className="text-xs text-slate-500">Client Account: {t.clientName}</p>
                            </div>
                            
                            <div className="flex flex-col items-end space-y-2">
                              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                t.priority === 'High' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {t.priority} Priority
                              </span>
                              
                              <button 
                                onClick={() => {
                                  addLog(`Resolved support ticket ${t.id} for client: ${t.clientName}`);
                                  setTickets(prev => prev.map(item => item.id === t.id ? { ...item, status: 'Resolved' } : item));
                                  success('Ticket marked as resolved.');
                                }}
                                disabled={t.status === 'Resolved'}
                                className={`text-xs px-2.5 py-1 rounded font-semibold ${
                                  t.status === 'Resolved' ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                                }`}
                              >
                                {t.status === 'Resolved' ? 'Resolved' : 'Close Ticket'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Chat simulator / Templates list */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-bold text-slate-900 text-base">Pre-approved CRM Templates</h3>
                          <p className="text-xs text-slate-500">Quick dispatch templates for customer service representatives.</p>
                        </div>

                        <div className="space-y-2.5 text-xs text-slate-600">
                          <p className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                            <strong>WhatsApp Dispatch (SLA Alert):</strong><br />
                            "Dear Entrepreneur, your corporate filing is currently in CA review. Please upload the physical address NOC within 24 hours to secure registration slot."
                          </p>

                          <p className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                            <strong>Email Ingestion (Payment due):</strong><br />
                            "Sub: Important update on your BizNxt feasibility study. The report was successfully generated by AI. Complete your outstanding balance payment of INR 4,999 to download."
                          </p>
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          addLog('Re-indexed pre-saved WhatsApp and email templates on regional SMS gateways');
                          success('Gateway dispatchers synced.');
                        }}
                        className="bg-slate-800 hover:bg-slate-950 text-white w-full py-2.5 rounded-2xl text-xs font-semibold mt-4"
                      >
                        Publish Custom Template
                      </button>
                    </div>

                  </div>

                </div>
              )}

              {/* =====================================================================
                  TAB J: AI CONTROL PANEL & GEMINI SANDBOX
                  ===================================================================== */}
              {activeTab === 'ai' && (
                <div className="space-y-6">
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left: AI prompt testing playground */}
                    <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">Gemini Engine Prompt & Confidence Sandbox</h3>
                        <p className="text-xs text-slate-500">Tune temperature, prompt context and run evaluation sandboxes.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Inference Model Designation</label>
                          <select 
                            value={geminiModel} 
                            onChange={(e) => setGeminiModel(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-xs outline-none focus:border-rose-500"
                          >
                            <option value="gemini-2.5-flash">Gemini 2.5 Flash (Production Default)</option>
                            <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep Research Complex)</option>
                            <option value="gemini-1.5-pro">Gemini 1.5 Pro (Legacy stable)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Temperature Tuning: {temperature}</label>
                          <input 
                            type="range" 
                            min="0.1" 
                            max="1.0" 
                            step="0.1" 
                            value={temperature}
                            onChange={(e) => setTemperature(Number(e.target.value))}
                            className="w-full accent-rose-500 my-3"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 block">Prompt Tester Context Input</label>
                        <textarea 
                          rows={3}
                          value={promptTestingText}
                          onChange={(e) => setPromptTestingText(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs outline-none focus:border-rose-500"
                          placeholder="Test structured instructions output..."
                        />
                      </div>

                      <button 
                        onClick={handleTestAiPrompt}
                        disabled={isAiLoading}
                        className="bg-primary-dark hover:bg-rose-700 text-white px-4 py-2 rounded-2xl text-xs font-semibold flex items-center space-x-2"
                      >
                        {isAiLoading ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Synthesizing...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Test Live Prompt</span>
                          </>
                        )}
                      </button>

                      {aiResponseText && (
                        <div className="p-4 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-2xl overflow-x-auto whitespace-pre-wrap max-h-60 border border-slate-800">
                          {aiResponseText}
                        </div>
                      )}
                    </div>

                    {/* Right: AI budget controls */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-bold text-slate-900 text-base">Token Usage & Cost Analytics</h3>
                          <p className="text-xs text-slate-500">Live tracker indexing API expenditures.</p>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl space-y-3">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500">API Balance State</span>
                            <span className="font-bold text-emerald-600">Nominal (84% left)</span>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] text-slate-500">
                              <span>Tokens Transacted</span>
                              <span>{tokenUsage.toLocaleString()} / 1,000,000</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2 rounded-2xl overflow-hidden">
                              <div className="bg-primary h-full rounded-2xl" style={{ width: `${(tokenUsage/1000000)*100}%` }}></div>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-200 flex justify-between text-xs text-slate-500">
                            <span>Estimated Monthly Invoice</span>
                            <span className="font-bold text-slate-900">₹8,412.00</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-rose-50 border border-primary/20 text-rose-800 rounded-2xl text-xs space-y-1">
                        <strong className="block">Safety Limit Overrides</strong>
                        <span>Token quotas automatically throttle user generation queries if confidence threshold falls below 85%.</span>
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* =====================================================================
                  TAB K: FIREBASE & STORAGE CONTROL
                  ===================================================================== */}
              {activeTab === 'firebase' && (
                <div className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Database collections list */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">Active Firestore Collections Overview</h4>
                        <p className="text-xs text-slate-500">Direct tracking of system shards and rule validation matching.</p>
                      </div>

                      <div className="space-y-2.5 font-mono text-xs">
                        <div className="p-2.5 bg-slate-50 rounded-2xl flex justify-between">
                          <span className="text-slate-500">client_projects</span>
                          <span className="font-bold text-slate-800">{clientProjects.length} docs synced</span>
                        </div>
                        <div className="p-2.5 bg-slate-50 rounded-2xl flex justify-between">
                          <span className="text-slate-500">project_tasks</span>
                          <span className="font-bold text-slate-800">Seeded Realtime</span>
                        </div>
                        <div className="p-2.5 bg-slate-50 rounded-2xl flex justify-between">
                          <span className="text-slate-500">risk_alerts</span>
                          <span className="font-bold text-slate-800">{riskAlerts.length} active alerts</span>
                        </div>
                        <div className="p-2.5 bg-slate-50 rounded-2xl flex justify-between">
                          <span className="text-slate-500">meetings</span>
                          <span className="font-bold text-slate-800">Indexed (Google Calendar ready)</span>
                        </div>
                      </div>
                    </div>

                    {/* Storage & Cloud functions */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-bold text-slate-900 text-base">Storage Buckets & Media Usage</h4>
                          <p className="text-xs text-slate-500">Secure digital asset folder allocations.</p>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span>Identity/PAN Documents</span>
                            <span className="font-bold">4.2 GB used</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Agreement PDFs & Contracts</span>
                            <span className="font-bold">1.8 GB used</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Market feasibility study assets</span>
                            <span className="font-bold">12.1 GB used</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl text-xs mt-4">
                        Database operations verified. All requests from client modules validated against strict sandbox firestore.rules.
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* =====================================================================
                  TAB L: SECURITY & AUDIT LOGS
                  ===================================================================== */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">Role Based Access Policies & Security Incidents</h3>
                      <p className="text-xs text-slate-500">Active protection algorithms monitoring administrative logins.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border border-slate-100 rounded-2xl">
                        <span className="text-xs text-slate-500 block mb-1">Blocked IP addresses</span>
                        <span className="text-2xl font-bold font-display text-slate-800">0 IPs</span>
                        <p className="text-[10px] text-slate-500 mt-1">Intrusion prevention nominal.</p>
                      </div>

                      <div className="p-4 border border-slate-100 rounded-2xl">
                        <span className="text-xs text-slate-500 block mb-1">Login Challenges Today</span>
                        <span className="text-2xl font-bold font-display text-slate-800">4 challenged</span>
                        <p className="text-[10px] text-slate-500 mt-1">Multi-factor OTP enforced.</p>
                      </div>

                      <div className="p-4 border border-slate-100 rounded-2xl">
                        <span className="text-xs text-slate-500 block mb-1">Active Admin Sessions</span>
                        <span className="text-2xl font-bold font-display text-slate-800">1 session</span>
                        <p className="text-[10px] text-slate-500 mt-1">Current local IP verified.</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 text-xs space-y-2">
                      <strong className="text-slate-800 block">Enforced Administrative Rules</strong>
                      <p className="text-slate-500 leading-relaxed">
                        Access control is strictly bound to Firestore roles (admin, superadmin, bsm, researcher). 
                        Unauthorized requests to retrieve raw PAN datasets trigger automated notification center warnings to regional directors.
                      </p>
                    </div>
                  </div>

                </div>
              )}

            </motion.div>
          </AnimatePresence>

        </main>
      </div>

      {/* =====================================================================
          MODAL: ADD NEW USER (OPERATIONS ACCOUNT CREATOR)
          ===================================================================== */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-lg">Manually Register Account</h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-slate-500 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-500 block mb-1 font-semibold">User Profile Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Ketan Sharma" 
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 outline-none focus:border-rose-500 text-slate-800"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1 font-semibold">Email Destination *</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@ventures.com" 
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 outline-none focus:border-rose-500 text-slate-800"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1 font-semibold">Mobile Registry (Optional)</label>
                <input 
                  type="text" 
                  placeholder="+91 98112 00412" 
                  value={newUser.phone}
                  onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 outline-none focus:border-rose-500 text-slate-800"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1 font-semibold">Enforced System Role Designation</label>
                <select 
                  value={newUser.role}
                  onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 outline-none focus:border-rose-500 text-slate-800 font-semibold"
                >
                  <option value="customer">Customer / Entrepreneur</option>
                  <option value="bsm">Business Success Manager (BSM)</option>
                  <option value="researcher">Research Executive</option>
                  <option value="ca">Chartered Accountant (CA)</option>
                  <option value="manufacturer">OEM Manufacturer Partner</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end space-x-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddUserModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-2xl font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-primary-dark hover:bg-rose-700 text-white px-4 py-2 rounded-2xl font-bold"
                >
                  Publish Account
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* =====================================================================
          MODAL: CREATE SERVICE CAPABILITY
          ===================================================================== */}
      {showAddServiceModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-lg">Publish Service Capability</h3>
              <button onClick={() => setShowAddServiceModal(false)} className="text-slate-500 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-500 block mb-1 font-semibold">Service Label Designation *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. BIS Certification & Lab Test Coordination" 
                  value={newService.name}
                  onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 outline-none focus:border-rose-500 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-500 block mb-1 font-semibold">SME Category</label>
                  <select 
                    value={newService.category}
                    onChange={(e) => setNewService(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 outline-none focus:border-rose-500 text-slate-800"
                  >
                    <option value="Incorporation">Incorporation</option>
                    <option value="Taxation">Taxation</option>
                    <option value="Legal">Legal</option>
                    <option value="Compliance">Compliance</option>
                    <option value="Manufacturing">Manufacturing</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-500 block mb-1 font-semibold">Client Pricing (INR) *</label>
                  <input 
                    type="number" 
                    required
                    placeholder="15000" 
                    value={newService.pricing}
                    onChange={(e) => setNewService(prev => ({ ...prev, pricing: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 outline-none focus:border-rose-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-500 block mb-1 font-semibold">SLA SLA Timeline string</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 10 Working Days" 
                    value={newService.timeline}
                    onChange={(e) => setNewService(prev => ({ ...prev, timeline: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 outline-none focus:border-rose-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-slate-500 block mb-1 font-semibold">SLA Warning Period (Days)</label>
                  <input 
                    type="number" 
                    placeholder="10" 
                    value={newService.slaDays}
                    onChange={(e) => setNewService(prev => ({ ...prev, slaDays: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 outline-none focus:border-rose-500 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-500 block mb-1 font-semibold">Mandatory Documents Checklist (Comma separated)</label>
                <input 
                  type="text" 
                  placeholder="Address Proof, Partnership Deed, Pan, Aadhaar" 
                  value={newService.requiredDocs}
                  onChange={(e) => setNewService(prev => ({ ...prev, requiredDocs: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 outline-none focus:border-rose-500 text-slate-800"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddServiceModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-2xl font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-primary-dark hover:bg-rose-700 text-white px-4 py-2 rounded-2xl font-bold"
                >
                  Publish Service Node
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* =====================================================================
          MODAL: REGISTER PARTNER AGENCY
          ===================================================================== */}
      {showAddPartnerModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-lg">Register Partner Agency</h3>
              <button onClick={() => setShowAddPartnerModal(false)} className="text-slate-500 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePartner} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-500 block mb-1 font-semibold">Agency Corporate Label *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Kothari & Partners Legal Desk" 
                  value={newPartner.name}
                  onChange={(e) => setNewPartner(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 outline-none focus:border-rose-500 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-500 block mb-1 font-semibold">Partner Sector Type</label>
                  <select 
                    value={newPartner.type}
                    onChange={(e) => setNewPartner(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 outline-none focus:border-rose-500 text-slate-800"
                  >
                    <option value="CA">Chartered Accountant (CA)</option>
                    <option value="Lawyer">Lawyer / IPR Legal Office</option>
                    <option value="Manufacturer">OEM / ODM Manufacturing Vendor</option>
                    <option value="Marketing">Marketing Agency</option>
                    <option value="Bank">Bank / NBFC Lending desk</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-500 block mb-1 font-semibold">Commission Split Rate (%)</label>
                  <input 
                    type="number" 
                    placeholder="10" 
                    value={newPartner.commissionRate}
                    onChange={(e) => setNewPartner(prev => ({ ...prev, commissionRate: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 outline-none focus:border-rose-500 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-500 block mb-1 font-semibold">Regional Coverage City</label>
                <input 
                  type="text" 
                  placeholder="e.g. Bangalore, Noida, Mumbai" 
                  value={newPartner.city}
                  onChange={(e) => setNewPartner(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 outline-none focus:border-rose-500 text-slate-800"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddPartnerModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-2xl font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-primary-dark hover:bg-rose-700 text-white px-4 py-2 rounded-2xl font-bold"
                >
                  Verify & Catalog Partner
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
