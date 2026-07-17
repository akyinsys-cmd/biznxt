import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle, 
  Building, 
  ShieldCheck, 
  Briefcase, 
  Sparkles, 
  ArrowRight, 
  Plus, 
  FileText, 
  TrendingUp, 
  IndianRupee, 
  Clock, 
  Star, 
  MapPin, 
  Upload, 
  ExternalLink,
  ChevronRight,
  DollarSign,
  UserCheck,
  Percent,
  Check,
  AlertCircle,
  FileSpreadsheet,
  Layers,
  ChevronDown,
  Globe,
  Award,
  BookOpen,
  Send,
  MessageSquare
} from 'lucide-react';
import { db } from '../lib/firebase';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  where,
  setDoc,
  serverTimestamp,
  getDocs
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
// PARTNER SYSTEM METADATA & CONSTANTS
// ============================================================================
const PARTNER_TYPES = [
  'Manufacturer', 'OEM Manufacturer', 'White Label Manufacturer', 'Private Label Manufacturer',
  'Raw Material Supplier', 'Packaging Company', 'Printing Company', 'Logistics Company',
  'Import Partner', 'Export Partner', 'CA', 'CS', 'Lawyer', 'Trademark Expert',
  'GST Consultant', 'Business Consultant', 'Marketing Agency', 'SEO Agency',
  'Google Ads Agency', 'Meta Ads Agency', 'Website Development Company', 'Flutter Development Company',
  'AI Automation Partner', 'Photography Studio', 'Product Branding Agency', 'Recruitment Agency',
  'Insurance Broker', 'Business Loan Advisor', 'NBFC Partner', 'Bank Partner',
  'Warehouse Provider', 'Factory Broker', 'Industrial Real Estate Agent', 'Dubai Consultant',
  'International Expansion Consultant', 'Government Scheme Expert', 'Investment Advisor'
];

const LOCATIONS = {
  countries: ['India', 'United Arab Emirates'],
  states: ['Maharashtra', 'Delhi NCR', 'Karnataka', 'Haryana', 'Dubai'],
  cities: ['Mumbai', 'Delhi', 'Gurgaon', 'Bangalore', 'Noida', 'Dubai']
};

const LANGUAGES = ['English', 'Hindi', 'Marathi', 'Kannada', 'Tamil', 'Arabic'];

// ============================================================================
// COMPONENT MAIN EXPORT
// ============================================================================
export default function Partners() {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<'directory' | 'onboarding' | 'dashboard'>('directory');
  
  // Real-time Firestore sync states
  const [dbPartners, setDbPartners] = useState<any[]>([]);
  const [dbLeads, setDbLeads] = useState<any[]>([]);
  const [dbQuotes, setDbQuotes] = useState<any[]>([]);
  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [dbPayments, setDbPayments] = useState<any[]>([]);
  const [dbReviews, setDbReviews] = useState<any[]>([]);

  // Simulation & Selection States
  const [simulatedPartnerId, setSimulatedPartnerId] = useState<string>('');
  const [matchingWizardOpen, setMatchingWizardOpen] = useState(false);

  // Directory Search/Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterCity, setFilterCity] = useState('all');
  const [filterMinRating, setFilterMinRating] = useState(0);

  // Onboarding Form State
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [onboardingForm, setOnboardingForm] = useState({
    companyName: '',
    businessType: 'CA',
    ownerName: '',
    gstNumber: '',
    pan: '',
    officeAddress: '',
    factoryAddress: '',
    serviceAreas: 'India',
    website: '',
    email: user?.email || '',
    phone: '',
    whatsapp: '',
    yearsInBusiness: 3,
    teamSize: 10,
    certifications: '',
    languages: ['English', 'Hindi'],
    slaAccepted: false
  });

  // Matching Wizard Form State
  const [matchStep, setMatchStep] = useState(1);
  const [matchForm, setMatchForm] = useState({
    businessType: 'CA',
    requiredServices: '',
    industry: 'Foodtech & QSR',
    budget: 50000,
    country: 'India',
    city: 'Mumbai',
    language: 'English',
    timelineDays: 14
  });
  const [matchResults, setMatchResults] = useState<any[]>([]);

  // Lead Generation state inside Directory/Match
  const [selectedLeadPartner, setSelectedLeadPartner] = useState<any | null>(null);
  const [leadForm, setLeadForm] = useState({
    clientName: user?.displayName || '',
    clientEmail: user?.email || '',
    requirements: ''
  });

  // Partner dashboard - selected lead / active quote creation
  const [selectedLeadDetails, setSelectedLeadDetails] = useState<any | null>(null);
  const [newQuoteForm, setNewQuoteForm] = useState({
    amount: 15000,
    taxes: 2700,
    discount: 0,
    terms: '50% advance, 50% on milestone complete.'
  });

  // Project task update form
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // ============================================================================
  // FIRESTORE SYNC LISTENERS
  // ============================================================================
  useEffect(() => {
    const unsubPartners = onSnapshot(collection(db, 'partners'), (snap) => {
      const items: any[] = [];
      snap.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      setDbPartners(items);
      // Auto-select first partner for dashboard simulation if none is selected
      if (items.length > 0 && !simulatedPartnerId) {
        setSimulatedPartnerId(items[0].id);
      }
    });

    const unsubLeads = onSnapshot(collection(db, 'partner_leads'), (snap) => {
      const items: any[] = [];
      snap.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      setDbLeads(items);
    });

    const unsubQuotes = onSnapshot(collection(db, 'partner_quotes'), (snap) => {
      const items: any[] = [];
      snap.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      setDbQuotes(items);
    });

    const unsubProjects = onSnapshot(collection(db, 'partner_projects'), (snap) => {
      const items: any[] = [];
      snap.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      setDbProjects(items);
    });

    const unsubPayments = onSnapshot(collection(db, 'partner_payments'), (snap) => {
      const items: any[] = [];
      snap.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      setDbPayments(items);
    });

    const unsubReviews = onSnapshot(collection(db, 'partner_reviews'), (snap) => {
      const items: any[] = [];
      snap.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      setDbReviews(items);
    });

    return () => {
      unsubPartners();
      unsubLeads();
      unsubQuotes();
      unsubProjects();
      unsubPayments();
      unsubReviews();
    };
  }, [simulatedPartnerId]);

  // Static fallback partners to populate initial directory if Firestore is clean
  const staticPartners = [
    {
      id: 'static-1',
      companyName: 'Kothari & Associates LLP',
      businessType: 'CA',
      ownerName: 'CA Piyush Kothari',
      rating: 4.9,
      yearsInBusiness: 12,
      officeAddress: 'Fort, Mumbai, MH',
      city: 'Mumbai',
      country: 'India',
      status: 'Verified',
      website: 'www.kotharica.in',
      commissionRate: 15,
      languages: ['English', 'Hindi', 'Gujarati']
    },
    {
      id: 'static-2',
      companyName: 'Supreme Polymer Molders',
      businessType: 'Manufacturer',
      ownerName: 'Vikas Deshmukh',
      rating: 4.7,
      yearsInBusiness: 8,
      officeAddress: 'Okhla Phase III, New Delhi',
      city: 'Delhi',
      country: 'India',
      status: 'Verified',
      website: 'www.suprememolders.com',
      commissionRate: 10,
      languages: ['English', 'Hindi']
    },
    {
      id: 'static-3',
      companyName: 'Apex Brand Consultants',
      businessType: 'Marketing Agency',
      ownerName: 'Sneha Rao',
      rating: 4.8,
      yearsInBusiness: 5,
      officeAddress: 'Indiranagar, Bangalore, KA',
      city: 'Bangalore',
      country: 'India',
      status: 'Verified',
      website: 'www.apexbrand.co',
      commissionRate: 12,
      languages: ['English', 'Kannada', 'Hindi']
    },
    {
      id: 'static-4',
      companyName: 'Al-Maktoum Expansion Consultants',
      businessType: 'Dubai Consultant',
      ownerName: 'Tareq Al-Jamil',
      rating: 5.0,
      yearsInBusiness: 15,
      officeAddress: 'Sheikh Zayed Rd, Dubai',
      city: 'Dubai',
      country: 'United Arab Emirates',
      status: 'Verified',
      website: 'www.almaktoumconsulting.ae',
      commissionRate: 8,
      languages: ['English', 'Arabic']
    }
  ];

  // Combined Directory list
  const allPartnersList = useMemo(() => {
    const firestoreIds = new Set(dbPartners.map(p => p.id));
    const filteredStatic = staticPartners.filter(sp => !firestoreIds.has(sp.id));
    return [...filteredStatic, ...dbPartners];
  }, [dbPartners]);

  // Filtered partners based on user input
  const filteredPartners = useMemo(() => {
    return allPartnersList.filter(p => {
      const matchSearch = p.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.ownerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.businessType?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = filterType === 'all' ? true : p.businessType === filterType;
      const matchCountry = filterCountry === 'all' ? true : p.country === filterCountry;
      const matchCity = filterCity === 'all' ? true : p.city === filterCity;
      const matchRating = (p.rating || 4.5) >= filterMinRating;

      return matchSearch && matchType && matchCountry && matchCity && matchRating;
    });
  }, [allPartnersList, searchQuery, filterType, filterCountry, filterCity, filterMinRating]);

  // Selected Active Partner under Dashboard
  const currentPartner = useMemo(() => {
    return allPartnersList.find(p => p.id === simulatedPartnerId) || allPartnersList[0];
  }, [allPartnersList, simulatedPartnerId]);

  // Filtered Leads specific to the Active Partner
  const partnerLeads = useMemo(() => {
    return dbLeads.filter(l => l.partnerId === currentPartner?.id);
  }, [dbLeads, currentPartner]);

  // Active Projects specific to the Partner
  const partnerProjects = useMemo(() => {
    return dbProjects.filter(p => p.partnerId === currentPartner?.id);
  }, [dbProjects, currentPartner]);

  // Quotes specific to the Partner
  const partnerQuotes = useMemo(() => {
    return dbQuotes.filter(q => q.partnerId === currentPartner?.id);
  }, [dbQuotes, currentPartner]);

  // Payments specific to the Partner
  const partnerPayments = useMemo(() => {
    return dbPayments.filter(p => p.partnerId === currentPartner?.id);
  }, [dbPayments, currentPartner]);

  // Overall statistics for active partner
  const partnerStats = useMemo(() => {
    const totalRevenue = partnerPayments
      .filter(p => p.status === 'Paid')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    const activeProjsCount = partnerProjects.filter(p => p.status !== 'Completed').length;
    const completedProjsCount = partnerProjects.filter(p => p.status === 'Completed').length;
    const winRate = partnerLeads.length > 0 
      ? Math.round((partnerLeads.filter(l => l.status === 'Won').length / partnerLeads.length) * 100)
      : 75; // standard fallback
    const csat = 4.8;
    const responseTime = 18; // minutes

    return { totalRevenue, activeProjsCount, completedProjsCount, winRate, csat, responseTime };
  }, [partnerLeads, partnerProjects, partnerPayments]);

  // ============================================================================
  // FORM SUBMISSION FUNCTIONS
  // ============================================================================
  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardingForm.slaAccepted) {
      error('Please read and accept the SLA agreement terms.');
      return;
    }

    try {
      const partnerRef = await addDoc(collection(db, 'partners'), {
        companyName: onboardingForm.companyName,
        businessType: onboardingForm.businessType,
        ownerName: onboardingForm.ownerName,
        gstNumber: onboardingForm.gstNumber,
        pan: onboardingForm.pan,
        status: 'Pending KYC', // Goes to Admin Registry for Approval
        createdAt: new Date().toISOString(),
        rating: 5.0,
        commissionRate: 10,
        city: onboardingForm.serviceAreas?.[0] || 'National',
        country: 'India',
        email: onboardingForm.email,
        phone: onboardingForm.phone
      });

      await addDoc(collection(db, 'partner_profiles'), {
        partnerId: partnerRef.id,
        officeAddress: onboardingForm.officeAddress,
        factoryAddress: onboardingForm.factoryAddress,
        serviceAreas: onboardingForm.serviceAreas,
        website: onboardingForm.website,
        email: onboardingForm.email,
        phone: onboardingForm.phone,
        whatsapp: onboardingForm.whatsapp,
        yearsInBusiness: onboardingForm.yearsInBusiness,
        teamSize: onboardingForm.teamSize,
        certifications: onboardingForm.certifications,
        languages: onboardingForm.languages
      });

      // Insert Simulated KYC Documents
      await addDoc(collection(db, 'partner_documents'), {
        partnerId: partnerRef.id,
        docType: 'GST Certificate',
        docUrl: 'https://gst.gov.in/portal/certificate_sample.pdf',
        verified: false,
        uploadedAt: new Date().toISOString()
      });

      await addDoc(collection(db, 'partner_documents'), {
        partnerId: partnerRef.id,
        docType: 'PAN Card',
        docUrl: 'https://incometax.gov.in/pan_sample.png',
        verified: false,
        uploadedAt: new Date().toISOString()
      });

      success('Onboarding filed successfully! KYC status: Pending Admin Review.');
      setSimulatedPartnerId(partnerRef.id);
      setActiveTab('dashboard');
      setOnboardingStep(1);
      setOnboardingForm({
        companyName: '',
        businessType: 'CA',
        ownerName: '',
        gstNumber: '',
        pan: '',
        officeAddress: '',
        factoryAddress: '',
        serviceAreas: 'India',
        website: '',
        email: user?.email || '',
        phone: '',
        whatsapp: '',
        yearsInBusiness: 3,
        teamSize: 10,
        certifications: '',
        languages: ['English', 'Hindi'],
        slaAccepted: false
      });
    } catch (err) {
      error('Failed to submit onboarding files.');
    }
  };

  const handleMatchEngine = () => {
    // Recommendation logic: find matching business type and location
    const matched = allPartnersList.filter(p => {
      const typeMatch = p.businessType === matchForm.businessType;
      const locationMatch = p.country === matchForm.country || p.city === matchForm.city;
      return typeMatch || locationMatch;
    }).sort((a, b) => (b.rating || 5.0) - (a.rating || 5.0));

    setMatchResults(matched.slice(0, 3));
    setMatchStep(2);
  };

  const triggerLeadGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadPartner) return;

    try {
      const leadRef = await addDoc(collection(db, 'partner_leads'), {
        partnerId: selectedLeadPartner.id,
        partnerName: selectedLeadPartner.companyName,
        clientName: leadForm.clientName,
        clientEmail: leadForm.clientEmail,
        requirements: leadForm.requirements || `Venture Launch inquiry for services regarding: ${selectedLeadPartner.businessType}`,
        status: 'New Lead',
        assignedAt: new Date().toISOString()
      });

      success(`Routing successful! Match notified: ${selectedLeadPartner.companyName}`);
      setSelectedLeadPartner(null);
      setMatchingWizardOpen(false);
      setMatchStep(1);
    } catch (err) {
      error('Failed to dispatch matched lead.');
    }
  };

  // ============================================================================
  // PARTNER WORKSPACE MUTATIONS
  // ============================================================================
  const updateLeadStatus = async (leadId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'partner_leads', leadId), { status });
      success(`Lead status updated to: ${status}`);

      // If lead is Won, automatically spawn a Partner Project delivery node!
      if (status === 'Won') {
        const lead = dbLeads.find(l => l.id === leadId);
        const quote = dbQuotes.find(q => q.leadId === leadId && q.status === 'Accepted');
        
        await addDoc(collection(db, 'partner_projects'), {
          partnerId: currentPartner?.id,
          leadId,
          projectName: `${lead?.clientName} - ${currentPartner?.businessType} Delivery`,
          completionPercentage: 10,
          status: 'Planning',
          updatedAt: new Date().toISOString(),
          tasks: [
            { id: 't1', title: 'Onboarding & Scope Alignment', completed: true },
            { id: 't2', title: 'KYC & Primary Document Verification', completed: false },
            { id: 't3', title: 'Operational Delivery & Execution Board', completed: false },
            { id: 't4', title: 'Final Review & Legal Advisory Sign-off', completed: false }
          ]
        });

        // Spawn associated Milestone Advance Payment
        await addDoc(collection(db, 'partner_payments'), {
          partnerId: currentPartner?.id,
          amount: Math.round((quote?.amount || 25000) * 0.5),
          type: 'Advance',
          status: 'Pending',
          date: new Date().toISOString(),
          clientName: lead?.clientName
        });
      }
    } catch (err) {
      error('Failed to transition lead node.');
    }
  };

  const createQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadDetails) return;

    try {
      const amount = Number(newQuoteForm.amount);
      const taxes = Math.round(amount * 0.18); // standard 18% GST

      const quoteRef = await addDoc(collection(db, 'partner_quotes'), {
        partnerId: currentPartner?.id,
        leadId: selectedLeadDetails.id,
        amount,
        taxes,
        discount: Number(newQuoteForm.discount),
        status: 'Sent',
        accepted: false,
        createdAt: new Date().toISOString(),
        terms: newQuoteForm.terms
      });

      await updateDoc(doc(db, 'partner_leads', selectedLeadDetails.id), {
        status: 'Quotation Sent'
      });

      success('Quotation proposal dispatched successfully!');
      setSelectedLeadDetails(null);
    } catch (err) {
      error('Failed to save quote ledger.');
    }
  };

  const simulateCustomerApproval = async (quoteId: string, leadId: string) => {
    try {
      await updateDoc(doc(db, 'partner_quotes', quoteId), {
        status: 'Accepted',
        accepted: true
      });
      await updateDoc(doc(db, 'partner_leads', leadId), {
        status: 'Won'
      });
      success('Customer accepted quotation proposal! Project initiated.');
    } catch (err) {
      error('Approval simulation failed.');
    }
  };

  const toggleProjectTask = async (projId: string, taskId: string) => {
    const proj = dbProjects.find(p => p.id === projId);
    if (!proj) return;

    const nextTasks = proj.tasks.map((t: any) => {
      if (t.id === taskId) return { ...t, completed: !t.completed };
      return t;
    });

    const completedCount = nextTasks.filter((t: any) => t.completed).length;
    const completionPercentage = Math.round((completedCount / nextTasks.length) * 100);
    const status = completionPercentage === 100 ? 'Completed' : 'Execution';

    try {
      await updateDoc(doc(db, 'partner_projects', projId), {
        tasks: nextTasks,
        completionPercentage,
        status,
        updatedAt: new Date().toISOString()
      });
      success('Milestone delivery task status updated.');

      // If fully complete, update payment status
      if (completionPercentage === 100) {
        const matchingPendingPay = partnerPayments.find(p => p.partnerId === currentPartner?.id && p.status === 'Pending');
        if (matchingPendingPay) {
          await updateDoc(doc(db, 'partner_payments', matchingPendingPay.id), {
            status: 'Paid'
          });
          success('Net project payout cleared to partner ledger.');
        }
      }
    } catch (err) {
      error('Failed to update project progress.');
    }
  };

  const addProjectTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !newTaskTitle.trim()) return;

    const nextTasks = [
      ...selectedProject.tasks,
      { id: `t-${Date.now()}`, title: newTaskTitle.trim(), completed: false }
    ];

    const completedCount = nextTasks.filter((t: any) => t.completed).length;
    const completionPercentage = Math.round((completedCount / nextTasks.length) * 100);

    try {
      await updateDoc(doc(db, 'partner_projects', selectedProject.id), {
        tasks: nextTasks,
        completionPercentage,
        updatedAt: new Date().toISOString()
      });
      setNewTaskTitle('');
      setSelectedProject(null);
      success('Additional execution task appended.');
    } catch (err) {
      error('Failed to append milestone task.');
    }
  };

  return (
    <div className="flex-1 bg-slate-900 min-h-screen text-slate-100 font-sans pb-24">
      {/* Dynamic Header / Hero Area */}
      <div className="relative overflow-hidden pt-20 pb-20 border-b border-slate-800 bg-radial from-slate-900 via-slate-950 to-slate-950">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-dark rounded-2xl blur-[160px] mix-blend-screen" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600 rounded-2xl blur-[140px] mix-blend-screen" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-primary/10 border border-rose-500/30 rounded-full text-rose-400 text-xs font-bold uppercase tracking-wider mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Enterprise Service Ecosystem</span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white tracking-tight mb-6">
            BizNxt <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-500">Partner Network</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-3xl mx-auto mb-8 font-light">
            Empowering global businesses with verified, vetted experts. Automating registrations, compliance, raw sourcing, packaging, and high-growth marketing.
          </p>

          {/* Tab Selector */}
          <div className="flex justify-center mt-12">
            <div className="bg-slate-950 p-1.5 rounded-2xl border border-slate-800/80 flex items-center space-x-1.5">
              <button
                onClick={() => setActiveTab('directory')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all ${activeTab === 'directory' ? 'bg-primary-dark text-white shadow' : 'text-slate-500 hover:text-white'}`}
              >
                <Search className="w-4 h-4" />
                <span>Search & Match</span>
              </button>
              <button
                onClick={() => setActiveTab('onboarding')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all ${activeTab === 'onboarding' ? 'bg-primary-dark text-white shadow' : 'text-slate-500 hover:text-white'}`}
              >
                <Award className="w-4 h-4" />
                <span>Partner Onboarding</span>
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all ${activeTab === 'dashboard' ? 'bg-primary-dark text-white shadow' : 'text-slate-500 hover:text-white'}`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Command Center</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <AnimatePresence mode="wait">
          {/* ===================================================================
              DIRECTORY AND SMART MATCHING VIEW
              =================================================================== */}
          {activeTab === 'directory' && (
            <motion.div 
              key="directory"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Dynamic Search Controls */}
              <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex flex-col lg:flex-row gap-4 items-center justify-between shadow-lg">
                <div className="flex-1 relative w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Search by company name, specialization, CA, OEM manufacturer..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap gap-3 items-center w-full lg:w-auto">
                  <select 
                    className="bg-slate-900 border border-slate-800 rounded-full px-4 py-3 text-xs font-semibold text-slate-400 focus:outline-none"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">All Specializations</option>
                    {PARTNER_TYPES.map(pt => <option key={pt} value={pt}>{pt}</option>)}
                  </select>

                  <select 
                    className="bg-slate-900 border border-slate-800 rounded-full px-4 py-3 text-xs font-semibold text-slate-400 focus:outline-none"
                    value={filterCity}
                    onChange={(e) => setFilterCity(e.target.value)}
                  >
                    <option value="all">All Cities</option>
                    {LOCATIONS.cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>

                  <button 
                    onClick={() => {
                      setMatchStep(1);
                      setMatchingWizardOpen(true);
                    }}
                    className="w-full sm:w-auto flex items-center justify-center space-x-1.5 bg-gradient-to-r from-primary to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-md"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Smart Match AI</span>
                  </button>
                </div>
              </div>

              {/* Partners Listing Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPartners.map(p => (
                  <div 
                    key={p.id}
                    className="bg-slate-950 border border-slate-800/80 rounded-3xl p-6 hover:border-slate-700 transition-all flex flex-col justify-between relative group shadow-sm"
                  >
                    {p.status === 'Verified' && (
                      <div className="absolute top-4 right-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center space-x-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>VERIFIED</span>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] bg-primary/10 text-rose-400 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {p.businessType}
                        </span>
                        <h3 className="text-xl font-display font-bold text-white mt-3 group-hover:text-rose-400 transition-colors">
                          {p.companyName}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center space-x-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span>{p.officeAddress || p.city || 'National'}</span>
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 border-t border-b border-slate-900 py-3 text-xs">
                        <div>
                          <span className="text-slate-500 block">Experience</span>
                          <span className="font-semibold text-white">{p.yearsInBusiness || 4} Years</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Primary Contact</span>
                          <span className="font-semibold text-white">{p.ownerName}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <div className="flex items-center space-x-1 text-amber-400 font-bold">
                          <Star className="w-4 h-4 fill-current" />
                          <span>{p.rating || 5.0}</span>
                        </div>
                        <span className="text-slate-500">{p.languages?.slice(0, 2).join(', ') || 'English, Hindi'}</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-900">
                      <button 
                        onClick={() => {
                          setSelectedLeadPartner(p);
                          setLeadForm({ ...leadForm, requirements: `Launch alignment needed for specialized services: ${p.businessType}.` });
                        }}
                        className="w-full py-3 bg-slate-900 hover:bg-primary-dark text-white rounded-2xl text-xs font-semibold transition-all flex items-center justify-center space-x-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Get Consultation</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredPartners.length === 0 && (
                <div className="text-center py-24 bg-slate-950 rounded-3xl border border-slate-800">
                  <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white">No Partners Matching</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    Try adjusting your search query, state, or filter criteria. You can also use the Smart Match AI engine to dynamically trigger automated referrals.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* ===================================================================
              PARTNER ONBOARDING WIZARD
              =================================================================== */}
          {activeTab === 'onboarding' && (
            <motion.div 
              key="onboarding"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-3xl mx-auto"
            >
              <div className="bg-slate-950 rounded-3xl border border-slate-800 p-8 space-y-8 shadow-2xl relative">
                {/* Step indicator header */}
                <div className="flex items-center justify-between border-b border-slate-900 pb-6">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-white">SME & Service Partner Onboarding</h2>
                    <p className="text-xs text-slate-500 mt-1">Submit registration credentials to unlock assigned leads and project boards.</p>
                  </div>
                  <div className="text-xs font-mono font-bold bg-primary/10 text-rose-400 px-3 py-1 rounded-full">
                    STEP {onboardingStep} OF 3
                  </div>
                </div>

                <form onSubmit={handleOnboardingSubmit} className="space-y-6">
                  {onboardingStep === 1 && (
                    <div className="space-y-4">
                      <h3 className="font-bold text-white text-sm uppercase tracking-wider">Step 1: Corporate Profile Details</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs text-slate-500">Company / Agency Name</label>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. Kothari Molders Pvt Ltd"
                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                            value={onboardingForm.companyName}
                            onChange={(e) => setOnboardingForm({...onboardingForm, companyName: e.target.value})}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-slate-500">Partner Specialization Type</label>
                          <select 
                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none"
                            value={onboardingForm.businessType}
                            onChange={(e) => setOnboardingForm({...onboardingForm, businessType: e.target.value})}
                          >
                            {PARTNER_TYPES.map(pt => <option key={pt} value={pt}>{pt}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs text-slate-500">Owner / Director Principal Name</label>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. CA Piyush Kothari"
                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none"
                            value={onboardingForm.ownerName}
                            onChange={(e) => setOnboardingForm({...onboardingForm, ownerName: e.target.value})}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-slate-500">Corporate Website (Optional)</label>
                          <input 
                            type="text" 
                            placeholder="e.g. www.kotharipackaging.com"
                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none"
                            value={onboardingForm.website}
                            onChange={(e) => setOnboardingForm({...onboardingForm, website: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs text-slate-500">Years Active</label>
                          <input 
                            type="number" 
                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none"
                            value={onboardingForm.yearsInBusiness}
                            onChange={(e) => setOnboardingForm({...onboardingForm, yearsInBusiness: Number(e.target.value)})}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-slate-500">Team Size</label>
                          <input 
                            type="number" 
                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none"
                            value={onboardingForm.teamSize}
                            onChange={(e) => setOnboardingForm({...onboardingForm, teamSize: Number(e.target.value)})}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-slate-500">Primary Contact Email</label>
                          <input 
                            type="email" 
                            required
                            placeholder="contact@agency.com"
                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none"
                            value={onboardingForm.email}
                            onChange={(e) => setOnboardingForm({...onboardingForm, email: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <button 
                          type="button" 
                          onClick={() => setOnboardingStep(2)}
                          className="flex items-center space-x-1.5 bg-primary-dark hover:bg-rose-700 text-white font-bold px-6 py-3 rounded-full text-xs transition-all"
                        >
                          <span>Save & Continue</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {onboardingStep === 2 && (
                    <div className="space-y-4">
                      <h3 className="font-bold text-white text-sm uppercase tracking-wider">Step 2: Legal Registrations & Tax</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs text-slate-500">GST Registration Number</label>
                          <input 
                            type="text" 
                            placeholder="e.g. 27AAAAA1111A1Z1"
                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none"
                            value={onboardingForm.gstNumber}
                            onChange={(e) => setOnboardingForm({...onboardingForm, gstNumber: e.target.value})}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-slate-500">Company Permanent Account Number (PAN)</label>
                          <input 
                            type="text" 
                            placeholder="e.g. ABCDE1234F"
                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none"
                            value={onboardingForm.pan}
                            onChange={(e) => setOnboardingForm({...onboardingForm, pan: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">Office Headquarter Address</label>
                        <textarea 
                          rows={2}
                          placeholder="Complete registered operational HQ address..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none"
                          value={onboardingForm.officeAddress}
                          onChange={(e) => setOnboardingForm({...onboardingForm, officeAddress: e.target.value})}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs text-slate-500">Mobile Phone</label>
                          <input 
                            type="text" 
                            required
                            placeholder="+91 99887 76655"
                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none"
                            value={onboardingForm.phone}
                            onChange={(e) => setOnboardingForm({...onboardingForm, phone: e.target.value})}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-slate-500">WhatsApp Number</label>
                          <input 
                            type="text" 
                            placeholder="+91 99887 76655"
                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none"
                            value={onboardingForm.whatsapp}
                            onChange={(e) => setOnboardingForm({...onboardingForm, whatsapp: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between pt-4">
                        <button 
                          type="button" 
                          onClick={() => setOnboardingStep(1)}
                          className="text-slate-500 hover:text-white text-xs font-semibold"
                        >
                          Back to Step 1
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setOnboardingStep(3)}
                          className="flex items-center space-x-1.5 bg-primary-dark hover:bg-rose-700 text-white font-bold px-6 py-3 rounded-full text-xs transition-all"
                        >
                          <span>Save & Continue</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {onboardingStep === 3 && (
                    <div className="space-y-6">
                      <h3 className="font-bold text-white text-sm uppercase tracking-wider">Step 3: Verification Uploads & Service Level SLA</h3>

                      {/* Document upload fields (simulate) */}
                      <div className="space-y-3">
                        <label className="text-xs text-slate-500">Simulate Document KYC Attachment (GST / Trade License / PAN)</label>
                        <div className="border border-dashed border-slate-800 hover:border-rose-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-900">
                          <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                          <span className="text-xs font-bold block text-white">Drag & drop or browse document file</span>
                          <span className="text-[10px] text-slate-500 block mt-1">PDF, PNG or JPG format (Max size 10MB)</span>
                        </div>
                      </div>

                      {/* SLA Acceptance check */}
                      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
                        <h4 className="font-bold text-white flex items-center space-x-1">
                          <ShieldCheck className="w-4 h-4 text-primary" />
                          <span>BizNxt Partner SLA Agreement</span>
                        </h4>
                        <p className="text-slate-500 leading-relaxed text-[11px]">
                          By proceeding, you verify that all supplied GST/PAN information and certifications are valid. You agree to BizNxt's standard 10% platform facilitation commission on successful invoice fulfillment. Leads assigned must be acknowledged within 24 hours or risk re-assignment.
                        </p>
                        <label className="flex items-start space-x-2 text-white font-bold cursor-pointer pt-2">
                          <input 
                            type="checkbox" 
                            className="mt-0.5 rounded text-primary-dark focus:ring-rose-500 focus:ring-offset-0 bg-slate-900 border-slate-800"
                            checked={onboardingForm.slaAccepted}
                            onChange={(e) => setOnboardingForm({...onboardingForm, slaAccepted: e.target.checked})}
                          />
                          <span>I accept all facilitation and service levels specified in this SLA contract.</span>
                        </label>
                      </div>

                      <div className="flex justify-between pt-4">
                        <button 
                          type="button" 
                          onClick={() => setOnboardingStep(2)}
                          className="text-slate-500 hover:text-white text-xs font-semibold"
                        >
                          Back to Step 2
                        </button>
                        <button 
                          type="submit"
                          className="flex items-center space-x-1.5 bg-gradient-to-r from-primary to-amber-500 text-white font-bold px-8 py-3.5 rounded-full text-xs transition-all shadow-md"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Submit Onboarding Application</span>
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </motion.div>
          )}

          {/* ===================================================================
              PARTNER INTERACTIVE COMMAND CENTER (DASHBOARD)
              =================================================================== */}
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8 animate-fade-in"
            >
              {/* Partner simulation banner and selector */}
              <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                    <UserCheck className="w-5 h-5 text-primary" />
                    <span>Command Center: Simulated Partner Account Mode</span>
                  </h3>
                  <p className="text-xs text-slate-500">Easily switch between different active registered partner accounts to test real-time lead coordination, quotations, and task completion boards.</p>
                </div>

                <select 
                  className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-400 focus:outline-none w-full md:w-64"
                  value={simulatedPartnerId}
                  onChange={(e) => setSimulatedPartnerId(e.target.value)}
                >
                  {allPartnersList.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.companyName} ({p.businessType}) - {p.status}
                    </option>
                  ))}
                </select>
              </div>

              {/* KYC alert banner if partner is pending */}
              {currentPartner?.status !== 'Verified' && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-start space-x-3 text-amber-400">
                  <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                  <div className="text-xs space-y-1">
                    <span className="font-bold block">Account Status: Pending KYC Verification</span>
                    <p className="text-slate-500">Your agency is in verification review. Open the <span className="font-semibold text-white">BizNxt OS Dashboard (Operational Hub)</span> as Admin/Manager to approve and verify this agency immediately.</p>
                  </div>
                </div>
              )}

              {/* Core metrics grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
                  <span className="text-xs text-slate-500 uppercase font-mono tracking-wider block">Fulfillment Revenue</span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl sm:text-3xl font-display font-bold text-white">
                      ₹{(partnerStats.totalRevenue || 45000).toLocaleString('en-IN')}
                    </span>
                    <div className="p-2 bg-emerald-500/10 rounded-2xl text-emerald-400">
                      <IndianRupee className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
                  <span className="text-xs text-slate-500 uppercase font-mono tracking-wider block">Active projects</span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl sm:text-3xl font-display font-bold text-white">
                      {partnerStats.activeProjsCount}
                    </span>
                    <div className="p-2 bg-primary/10 rounded-2xl text-rose-400">
                      <Briefcase className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
                  <span className="text-xs text-slate-500 uppercase font-mono tracking-wider block">Lead Conversion</span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl sm:text-3xl font-display font-bold text-white">
                      {partnerStats.winRate}%
                    </span>
                    <div className="p-2 bg-indigo-500/10 rounded-2xl text-indigo-400">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
                  <span className="text-xs text-slate-500 uppercase font-mono tracking-wider block">QA Quality Rating</span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl sm:text-3xl font-display font-bold text-white">
                      ★ {currentPartner?.rating || 4.8}
                    </span>
                    <div className="p-2 bg-amber-500/10 rounded-2xl text-amber-400">
                      <Star className="w-5 h-5 fill-current" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Main dashboard work split layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left col: Leads tracking & quote management (size 7) */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Lead hub */}
                  <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                    <div>
                      <h3 className="font-bold text-white text-base">Assigned Business Leads Pipeline</h3>
                      <p className="text-xs text-slate-500">Live matched client inquiries routed directly through the platform.</p>
                    </div>

                    <div className="divide-y divide-slate-900 text-xs">
                      {partnerLeads.map(lead => {
                        const associatedQuote = partnerQuotes.find(q => q.leadId === lead.id);
                        return (
                          <div key={lead.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-sm text-white">{lead.clientName}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  lead.status === 'New Lead' ? 'bg-indigo-500/10 text-indigo-400' :
                                  lead.status === 'Quotation Sent' ? 'bg-amber-500/10 text-amber-400' :
                                  lead.status === 'Won' ? 'bg-emerald-500/10 text-emerald-400' :
                                  'bg-slate-800 text-slate-500'
                                }`}>
                                  {lead.status}
                                </span>
                              </div>
                              <p className="text-slate-500 text-[11px] leading-relaxed max-w-sm">{lead.requirements}</p>
                              <span className="text-[10px] text-slate-500 block">Assigned: {new Date(lead.assignedAt).toLocaleDateString()}</span>
                            </div>

                            <div className="flex items-center space-x-2 shrink-0">
                              {lead.status === 'New Lead' && (
                                <>
                                  <button 
                                    onClick={() => updateLeadStatus(lead.id, 'Accepted')}
                                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-full text-[10px] transition-colors"
                                  >
                                    Accept Lead
                                  </button>
                                  <button 
                                    onClick={() => updateLeadStatus(lead.id, 'Rejected')}
                                    className="text-slate-500 hover:text-rose-400 font-bold text-[10px] px-2 py-1"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}

                              {lead.status === 'Accepted' && (
                                <button 
                                  onClick={() => {
                                    setSelectedLeadDetails(lead);
                                    setNewQuoteForm({
                                      amount: 15000,
                                      taxes: 2700,
                                      discount: 0,
                                      terms: '50% advance, 50% on project delivery.'
                                    });
                                  }}
                                  className="bg-primary-dark hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-full text-[10px] transition-colors flex items-center space-x-1"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Prepare Quotation</span>
                                </button>
                              )}

                              {lead.status === 'Quotation Sent' && associatedQuote && (
                                <div className="space-y-1.5 text-right">
                                  <span className="font-semibold text-slate-500 block">₹{associatedQuote.amount.toLocaleString('en-IN')} Quote</span>
                                  <button 
                                    onClick={() => simulateCustomerApproval(associatedQuote.id, lead.id)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-full text-[10px] transition-colors flex items-center space-x-1"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Simulate Client Approval</span>
                                  </button>
                                </div>
                              )}

                              {lead.status === 'Won' && (
                                <span className="text-emerald-400 font-bold flex items-center space-x-1">
                                  <Check className="w-4 h-4" />
                                  <span>PROJECT ACTIVE</span>
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {partnerLeads.length === 0 && (
                        <div className="py-8 text-center text-slate-500">
                          No assigned business leads. Open the <span className="font-semibold text-rose-400">Search & Match</span> tab above and use the Smart Match AI or Directory consultation buttons to generate live referrals.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quote preparer Modal section */}
                  {selectedLeadDetails && (
                    <div className="bg-slate-950 p-6 rounded-3xl border border-rose-500/40 shadow-xl space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                        <div>
                          <h4 className="font-bold text-white text-sm">Prepare Quotation proposal</h4>
                          <p className="text-[11px] text-slate-500">Dispatch legal/operational fee structure proposal to client.</p>
                        </div>
                        <button 
                          onClick={() => setSelectedLeadDetails(null)}
                          className="text-slate-500 hover:text-white font-bold text-xs"
                        >
                          Cancel
                        </button>
                      </div>

                      <form onSubmit={createQuote} className="grid grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <label className="text-slate-500">Professional Fee Amount (INR)</label>
                          <input 
                            type="number" 
                            required
                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-white focus:outline-none"
                            value={newQuoteForm.amount}
                            onChange={(e) => setNewQuoteForm({...newQuoteForm, amount: Number(e.target.value)})}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-500">GST Tax (18% auto-calc)</label>
                          <input 
                            type="number" 
                            disabled
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-4 py-3 text-slate-500 focus:outline-none"
                            value={Math.round(newQuoteForm.amount * 0.18)}
                          />
                        </div>

                        <div className="col-span-2 space-y-1">
                          <label className="text-slate-500">Standard Payout Milestones & Terms</label>
                          <input 
                            type="text" 
                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-white focus:outline-none"
                            value={newQuoteForm.terms}
                            onChange={(e) => setNewQuoteForm({...newQuoteForm, terms: e.target.value})}
                          />
                        </div>

                        <div className="col-span-2 flex justify-end">
                          <button 
                            type="submit"
                            className="bg-primary-dark hover:bg-rose-700 text-white font-bold px-5 py-2.5 rounded-full transition-all"
                          >
                            Dispatch Quote proposal
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Payment invoices ledger */}
                  <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                    <div>
                      <h3 className="font-bold text-white text-base">Invoicing, Taxes, & Facilitation Commission Ledger</h3>
                      <p className="text-xs text-slate-500">Invoice receipt records and facilitation facilitators commission payouts.</p>
                    </div>

                    <div className="divide-y divide-slate-900 text-xs">
                      {partnerPayments.map(payment => (
                        <div key={payment.id} className="py-3 flex items-center justify-between">
                          <div className="space-y-1">
                            <span className="font-bold text-white block">₹{payment.amount?.toLocaleString('en-IN')} Milestone payment</span>
                            <span className="text-slate-500 block text-[10px]">Recipient: {payment.clientName} | Type: {payment.type}</span>
                          </div>
                          <div className="flex items-center space-x-3 text-right">
                            <div className="space-y-1">
                              <span className="text-slate-500 block text-[10px]"> facilitating commission: 10%</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${payment.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                {payment.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}

                      {partnerPayments.length === 0 && (
                        <div className="py-6 text-center text-slate-500">
                          No invoicing ledgers recorded. Payout pipelines are generated dynamically upon client approval of milestone quotes.
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Right col: Active projects boards & analytics (size 5) */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Delivery project board */}
                  <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                    <div>
                      <h3 className="font-bold text-white text-base">Active Project Milestones</h3>
                      <p className="text-xs text-slate-500">Collaborative board representing specific partner task fulfillments.</p>
                    </div>

                    <div className="space-y-6">
                      {partnerProjects.map(proj => (
                        <div key={proj.id} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <h4 className="font-bold text-sm text-white">{proj.projectName}</h4>
                              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Status: {proj.status}</span>
                            </div>
                            <span className="text-xs font-mono font-bold text-rose-400 bg-primary/10 px-2.5 py-1 rounded">
                              {proj.completionPercentage}% Complete
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="w-full h-1.5 bg-slate-950 rounded-2xl overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-primary to-amber-500 transition-all duration-300"
                              style={{ width: `${proj.completionPercentage}%` }}
                            />
                          </div>

                          {/* Task list inside project */}
                          <div className="space-y-2.5 pt-2 text-xs">
                            {proj.tasks?.map((t: any) => (
                              <label key={t.id} className="flex items-start space-x-2.5 text-slate-400 cursor-pointer hover:text-white transition-colors">
                                <input 
                                  type="checkbox" 
                                  className="mt-0.5 rounded text-primary-dark focus:ring-rose-500 focus:ring-offset-0 bg-slate-950 border-slate-800"
                                  checked={t.completed}
                                  onChange={() => toggleProjectTask(proj.id, t.id)}
                                />
                                <span className={t.completed ? 'line-through text-slate-500' : ''}>{t.title}</span>
                              </label>
                            ))}
                          </div>

                          {/* Add task trigger */}
                          <div className="pt-2">
                            <button 
                              onClick={() => setSelectedProject(proj)}
                              className="text-[11px] font-bold text-rose-400 hover:text-rose-300 flex items-center space-x-1"
                            >
                              <Plus className="w-4.5 h-4.5" />
                              <span>Append Milestone Task</span>
                            </button>
                          </div>
                        </div>
                      ))}

                      {partnerProjects.length === 0 && (
                        <div className="py-8 text-center text-slate-500">
                          No active project boards. Win assigned leads to generate collaborative milestone boards.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Add project task inline modal */}
                  {selectedProject && (
                    <div className="bg-slate-950 p-4 rounded-2xl border border-rose-500/40 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">Append Task - {selectedProject.projectName}</span>
                        <button onClick={() => setSelectedProject(null)} className="text-slate-500 hover:text-white">Cancel</button>
                      </div>
                      <form onSubmit={addProjectTask} className="flex gap-2 text-xs">
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Environmental CTE NOC filed"
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-full px-3 py-2 text-white focus:outline-none"
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                        />
                        <button 
                          type="submit"
                          className="bg-primary-dark hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-full transition-all shrink-0"
                        >
                          Add
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Performance charts */}
                  <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                    <div>
                      <h3 className="font-bold text-white text-base">Monthly Facilitation Revenue</h3>
                      <p className="text-xs text-slate-500">Aggregated payments cleared through BizNxt facilitating accounts.</p>
                    </div>

                    <div className="h-52 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                          { month: 'Apr', revenue: 24000 },
                          { month: 'May', revenue: 45000 },
                          { month: 'Jun', revenue: 68000 },
                          { month: 'Jul', revenue: partnerStats.totalRevenue || 85000 }
                        ]}>
                          <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#F43F5E" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                          <XAxis dataKey="month" stroke="#64748B" fontSize={10} tickLine={false} />
                          <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', color: '#FFF', borderRadius: '12px', fontSize: '11px' }}
                          />
                          <Area type="monotone" dataKey="revenue" stroke="#F43F5E" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ===================================================================
          SMART MATCH AI OVERLAY WIZARD
          =================================================================== */}
      <AnimatePresence>
        {matchingWizardOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-2xl relative shadow-2xl overflow-hidden"
            >
              {/* Abstract decorative blur */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-2xl blur-2xl" />

              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-white text-base">BizNxt AI Smart-Match Engine</h3>
                </div>
                <button 
                  onClick={() => setMatchingWizardOpen(false)}
                  className="text-slate-500 hover:text-white font-bold text-xs"
                >
                  Close
                </button>
              </div>

              {matchStep === 1 ? (
                <div className="space-y-6 pt-4">
                  <p className="text-xs text-slate-500">Answer a few dynamic scope questions to automatically filter and recommend the top vetted SME partners across our global network.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-slate-500">What specific partner service is required?</label>
                      <select 
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white focus:outline-none"
                        value={matchForm.businessType}
                        onChange={(e) => setMatchForm({...matchForm, businessType: e.target.value})}
                      >
                        {PARTNER_TYPES.map(pt => <option key={pt} value={pt}>{pt}</option>)}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-500">Target Industry Sector</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white focus:outline-none"
                        value={matchForm.industry}
                        onChange={(e) => setMatchForm({...matchForm, industry: e.target.value})}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-500">Venture Budget Scope (INR)</label>
                      <input 
                        type="number" 
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white focus:outline-none"
                        value={matchForm.budget}
                        onChange={(e) => setMatchForm({...matchForm, budget: Number(e.target.value)})}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-500">Preferred Language</label>
                      <select 
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white focus:outline-none"
                        value={matchForm.language}
                        onChange={(e) => setMatchForm({...matchForm, language: e.target.value})}
                      >
                        {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-slate-500">Detail your project requirements briefly</label>
                      <textarea 
                        rows={2}
                        placeholder="e.g. We need private label eco-friendly packaging boxes delivered to Gurgaon with GST compliance audit complete."
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white focus:outline-none"
                        value={matchForm.requiredServices}
                        onChange={(e) => setMatchForm({...matchForm, requiredServices: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button 
                      onClick={handleMatchEngine}
                      className="bg-gradient-to-r from-primary to-amber-500 text-white font-bold px-6 py-3 rounded-full text-xs transition-all flex items-center space-x-1.5 shadow-md"
                    >
                      <Sparkles className="w-4.5 h-4.5" />
                      <span>Run AI Matching Shards</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 pt-4 text-xs">
                  <p className="text-[11px] text-slate-500">Recommendation Complete! Below are the top verified matching partners based on your budget, localization, and language compatibility.</p>
                  
                  <div className="space-y-3.5">
                    {matchResults.map(partner => (
                      <div 
                        key={partner.id}
                        className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <span className="font-bold text-sm text-white block">{partner.companyName}</span>
                          <span className="text-slate-500 text-[11px] block">{partner.officeAddress} | rating: ★ {partner.rating}</span>
                          <span className="text-[10px] text-rose-400 bg-primary/10 px-2 py-0.5 rounded uppercase font-bold">Recommended Match</span>
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedLeadPartner(partner);
                            setLeadForm({
                              clientName: user?.displayName || '',
                              clientEmail: user?.email || '',
                              requirements: matchForm.requiredServices || `AI Match generated inquiry regarding ${partner.businessType}.`
                            });
                          }}
                          className="bg-primary-dark hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-full text-[11px] transition-colors self-end sm:self-center"
                        >
                          Select & Inquire
                        </button>
                      </div>
                    ))}

                    {matchResults.length === 0 && (
                      <div className="text-center py-6 text-slate-500">
                        No precise match found. Try broadening your budget scale or choosing national coverage areas.
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between pt-4">
                    <button 
                      onClick={() => setMatchStep(1)}
                      className="text-slate-500 hover:text-white text-xs font-semibold"
                    >
                      Refine Questions
                    </button>
                    <button 
                      onClick={() => setMatchingWizardOpen(false)}
                      className="text-slate-500 hover:text-white font-semibold text-xs"
                    >
                      Finish
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================================================================
          CONSULTATION REFERRAL FORM OVERLAY
          =================================================================== */}
      <AnimatePresence>
        {selectedLeadPartner && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md relative shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="font-bold text-white text-base">Request Professional Consultation</h3>
                <button 
                  onClick={() => setSelectedLeadPartner(null)}
                  className="text-slate-500 hover:text-white font-bold text-xs"
                >
                  Close
                </button>
              </div>

              <form onSubmit={triggerLeadGeneration} className="space-y-4 pt-4 text-xs">
                <p className="text-slate-500 text-[11px]">Dispatching private referral to <span className="font-semibold text-white">{selectedLeadPartner.companyName}</span>. Your success manager coordinates this dispatch node.</p>
                
                <div className="space-y-1">
                  <label className="text-slate-500">Your Full Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white focus:outline-none"
                    value={leadForm.clientName}
                    onChange={(e) => setLeadForm({...leadForm, clientName: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500">Your Email Address</label>
                  <input 
                    type="email" 
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white focus:outline-none"
                    value={leadForm.clientEmail}
                    onChange={(e) => setLeadForm({...leadForm, clientEmail: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500">Describe Your Requirements</label>
                  <textarea 
                    rows={3}
                    required
                    placeholder="We need assistance with company incorporation, factory sourcing, or legal setup details..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white focus:outline-none"
                    value={leadForm.requirements}
                    onChange={(e) => setLeadForm({...leadForm, requirements: e.target.value})}
                  />
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    className="w-full bg-primary-dark hover:bg-rose-700 text-white font-bold py-3.5 rounded-2xl transition-all shadow-md"
                  >
                    Dispatch Secure Referral Node
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
