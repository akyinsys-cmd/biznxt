import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  Briefcase, 
  Search, 
  Filter, 
  ShieldCheck, 
  CheckCircle2, 
  Plus, 
  FileText, 
  Layers, 
  Settings, 
  User, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  BarChart3, 
  MoreVertical, 
  Download, 
  Check, 
  Trash, 
  PlusCircle, 
  FolderOpen, 
  MessageSquare, 
  Calendar, 
  ChevronRight, 
  AlertTriangle, 
  Star, 
  X, 
  FileSpreadsheet, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  Upload, 
  ShieldAlert, 
  PieChart, 
  HelpCircle, 
  Send, 
  ListTodo, 
  CheckSquare, 
  History,
  Rocket,
  PlusSquare,
  Eye,
  Headset,
  Info,
  CheckCircle,
  FileCheck
} from 'lucide-react';
import { db, analytics } from '../lib/firebase';
import { logEvent } from 'firebase/analytics';
import { ValueComparisonModal } from '../components/widgets/ValueComparisonModal';
import { subscribeToPricingConfig } from '../lib/pricingService';
import { calculateBizNxtPrice } from '../utils/pricing';
import { logUserActivity } from '../components/widgets/UserActivityLogger';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line, 
  PieChart as RechartsPieChart, 
  Pie as RechartsPie, 
  Cell 
} from 'recharts';

// ============================================================================
// METADATA & CONSTANTS
// ============================================================================
const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'business_research', label: 'Business Research' },
  { id: 'gst_services', label: 'GST Services' },
  { id: 'income_tax', label: 'Income Tax Services' },
  { id: 'trade_license', label: 'Trade License' },
];

const PACKAGES: any[] = [];

const MANAGERS = [
  { name: 'Amit Sharma', role: 'Principal Business Success Manager', email: 'amit.sharma@biznxt.online', rating: 4.9 },
  { name: 'Rohan Mehta', role: 'Senior Venture Growth Director', email: 'rohan.mehta@biznxt.online', rating: 4.8 },
  { name: 'Priya Iyer', role: 'Global Compliance Lead Coordinator', email: 'priya.iyer@biznxt.online', rating: 5.0 }
];

// ============================================================================
// DYNAMIC PRE-SEEDED CATALOG DATA
// ============================================================================
const SEED_SERVICES = [
  // BUSINESS RESEARCH PLANS
  {
    id: 'res-basic',
    category: 'business_research',
    subCategory: 'Business Research',
    title: 'Basic Research',
    description: 'Entry level business research overview with local market feasibility insights.',
    overview: 'Essential research to help you understand market potential and basic competition.',
    deliverables: 'Business Feasibility Overview, Basic Market Overview, Local Competition Snapshot, Investment Estimate, Business Suitability Summary, PDF Report',
    timeline: '24–48 Hours',
    estimatedDuration: 2,
    price: 499,
    benchmark_price: 499,
    biznxt_price: 499,
    premium_features_list: [
      { text: "Business Feasibility Overview", highlight: "Understand if your idea works." },
      { text: "Local Competition Snapshot", highlight: "Know your immediate competitors." },
      { text: "Investment Estimate", highlight: "Initial capital requirement." }
    ],
    discount: 0,
    requiredDocuments: 'Basic idea brief, target location.',
    eligibility: 'Any aspiring founder.',
    faqs: [], terms: '', cancellationPolicy: '', refundPolicy: '', dependencies: '', addOnServices: '', relatedServices: [], recommendedNextServices: []
  },
  {
    id: 'res-pro',
    category: 'business_research',
    subCategory: 'Business Research',
    title: 'Professional Research',
    description: 'Detailed market analysis including location assessment and customer demand.',
    overview: 'In-depth research providing competition analysis and growth opportunities.',
    deliverables: 'Everything in Basic, Detailed Market Research, Competition Analysis, Location Assessment, Customer Demand Analysis, Business Risks, Growth Opportunities, Investment Planning, Professional PDF Report',
    timeline: '3-5 Days',
    estimatedDuration: 5,
    price: 4999,
    benchmark_price: 4999,
    biznxt_price: 4999,
    premium_features_list: [
      { text: "Detailed Market Research", highlight: "Deep dive into your industry." },
      { text: "Location Assessment", highlight: "Optimal business placement." },
      { text: "Investment Planning", highlight: "Financial strategy and budgeting." }
    ],
    discount: 0,
    requiredDocuments: 'Detailed business plan, target audience profile.',
    eligibility: 'Startups and expanding businesses.',
    faqs: [], terms: '', cancellationPolicy: '', refundPolicy: '', dependencies: '', addOnServices: '', relatedServices: [], recommendedNextServices: []
  },
  {
    id: 'res-prem',
    category: 'business_research',
    subCategory: 'Business Research',
    title: 'Premium Research',
    description: 'Advanced analysis with SWOT, launch roadmap, and marketing suggestions.',
    overview: 'Comprehensive research with actionable strategies for market entry.',
    deliverables: 'Everything in Professional, Advanced Business Analysis, Industry Insights, SWOT Analysis, Launch Roadmap, Marketing Suggestions, Financial Planning Overview, Growth Strategy, Executive Summary, Premium PDF Report',
    timeline: '7-10 Days',
    estimatedDuration: 10,
    price: 9999,
    benchmark_price: 9999,
    biznxt_price: 9999,
    premium_features_list: [
      { text: "SWOT Analysis", highlight: "Strengths, Weaknesses, Opportunities, Threats." },
      { text: "Launch Roadmap", highlight: "Step-by-step execution plan." },
      { text: "Growth Strategy", highlight: "Long-term scaling tactics." }
    ],
    discount: 0,
    requiredDocuments: 'Business goals, competitive landscape assumptions.',
    eligibility: 'Businesses ready to launch or scale.',
    faqs: [], terms: '', cancellationPolicy: '', refundPolicy: '', dependencies: '', addOnServices: '', relatedServices: [], recommendedNextServices: []
  },
  {
    id: 'res-ent',
    category: 'business_research',
    subCategory: 'Business Research',
    title: 'Enterprise Research',
    description: 'Comprehensive research covering multi-location expansion and operational planning.',
    overview: 'Enterprise-level strategic research with executive presentation.',
    deliverables: 'Everything in Premium, Comprehensive Research, Multi-location Analysis, Expansion Assessment, Operational Planning, Risk Assessment, Priority Consultation, Executive Presentation, Premium Business Report',
    timeline: '14-21 Days',
    estimatedDuration: 21,
    price: 19999,
    benchmark_price: 19999,
    biznxt_price: 19999,
    premium_features_list: [
      { text: "Multi-location Analysis", highlight: "Assess potential in various markets." },
      { text: "Operational Planning", highlight: "Supply chain and logistics strategy." },
      { text: "Executive Presentation", highlight: "Ready for stakeholder meetings." }
    ],
    discount: 0,
    requiredDocuments: 'Expansion goals, current operational metrics.',
    eligibility: 'Mid to large enterprises.',
    faqs: [], terms: '', cancellationPolicy: '', refundPolicy: '', dependencies: '', addOnServices: '', relatedServices: [], recommendedNextServices: []
  },
  {
    id: 'res-corp',
    category: 'business_research',
    subCategory: 'Business Research',
    title: 'Corporate Research',
    description: 'Enterprise-grade research with dedicated team and custom business intelligence.',
    overview: 'Ultimate research package providing industry benchmarking and priority support.',
    deliverables: 'Everything in Enterprise, Dedicated Research Team, Custom Business Intelligence, Industry Benchmarking, Advanced Market Study, Executive Presentation, Priority Support, Dedicated Business Success Manager',
    timeline: '30+ Days',
    estimatedDuration: 30,
    price: 49999,
    benchmark_price: 49999,
    biznxt_price: 49999,
    premium_features_list: [
      { text: "Dedicated Research Team", highlight: "A team focused solely on your project." },
      { text: "Custom Business Intelligence", highlight: "Tailored data and analytics." },
      { text: "Dedicated BSM", highlight: "Ongoing personalized support." }
    ],
    discount: 0,
    requiredDocuments: 'Corporate objectives, existing market data.',
    eligibility: 'Corporations and large enterprises.',
    faqs: [], terms: '', cancellationPolicy: '', refundPolicy: '', dependencies: '', addOnServices: '', relatedServices: [], recommendedNextServices: []
  },

  // GST SERVICES
  {
    id: 'gst-reg',
    category: 'gst_services',
    subCategory: 'Registration',
    title: 'GST Registration + Initial Filing Support Package',
    description: 'Complete GST registration and assistance with your first filing.',
    overview: 'Get your business compliant quickly with our comprehensive registration support.',
    deliverables: 'GST Registration, Initial Filing Assistance, Document Guidance, Application Tracking, Professional Support',
    timeline: '5-7 Days',
    estimatedDuration: 7,
    price: 4999,
    benchmark_price: 4999,
    biznxt_price: 4999,
    premium_features_list: [
      { text: "Application Tracking", highlight: "Real-time updates on your application." },
      { text: "Professional Support", highlight: "Expert guidance throughout the process." }
    ],
    discount: 0,
    requiredDocuments: 'PAN, Aadhaar, Business Address Proof, Bank Details.',
    eligibility: 'Any business requiring GST registration.',
    faqs: [], terms: '', cancellationPolicy: '', refundPolicy: '', dependencies: '', addOnServices: '', relatedServices: [], recommendedNextServices: []
  },
  {
    id: 'gst-filing',
    category: 'gst_services',
    subCategory: 'Compliance',
    title: 'GST Filing Package',
    description: 'Regular GST filing support to keep your business compliant.',
    overview: 'Avoid penalties with our timely and accurate GST return preparation.',
    deliverables: 'Regular GST Filing Support, Compliance Assistance, Return Preparation Support, Email Support, Priority Handling',
    timeline: 'Monthly',
    estimatedDuration: 30,
    price: 9999,
    benchmark_price: 9999,
    biznxt_price: 9999,
    premium_features_list: [
      { text: "Return Preparation Support", highlight: "Accurate calculation of tax liabilities." },
      { text: "Priority Handling", highlight: "Fast-tracked processing of your returns." }
    ],
    discount: 0,
    requiredDocuments: 'Sales and Purchase Invoices, Bank Statements.',
    eligibility: 'GST registered businesses.',
    faqs: [], terms: '', cancellationPolicy: '', refundPolicy: '', dependencies: '', addOnServices: '', relatedServices: [], recommendedNextServices: []
  },
  {
    id: 'gst-annual',
    category: 'gst_services',
    subCategory: 'Compliance',
    title: 'Annual GST + ITR Package',
    description: 'Comprehensive annual package covering both GST and Income Tax returns.',
    overview: 'Complete peace of mind for your yearly tax obligations with a dedicated executive.',
    deliverables: 'GST Compliance Support, ITR Filing Support, Dedicated Executive, Priority Support',
    timeline: 'Annual',
    estimatedDuration: 365,
    price: 29999,
    benchmark_price: 29999,
    biznxt_price: 29999,
    premium_features_list: [
      { text: "Dedicated Executive", highlight: "Single point of contact for all tax matters." },
      { text: "Complete Tax Coverage", highlight: "Handles both indirect and direct taxes." }
    ],
    discount: 0,
    requiredDocuments: 'Financial Statements, Invoices, Bank Records, Previous Returns.',
    eligibility: 'Businesses requiring annual tax compliance.',
    faqs: [], terms: '', cancellationPolicy: '', refundPolicy: '', dependencies: '', addOnServices: '', relatedServices: [], recommendedNextServices: []
  },

  // INCOME TAX SERVICES
  {
    id: 'it-filing',
    category: 'income_tax',
    subCategory: 'Tax Returns',
    title: 'ITR Filing',
    description: 'Professional assistance with filing your Income Tax Return.',
    overview: 'Ensure accurate tax reporting and maximize your deductions.',
    deliverables: 'Return Preparation, Document Review, Professional Filing Assistance, Acknowledgement Support',
    timeline: '3-5 Days',
    estimatedDuration: 5,
    price: 4999,
    benchmark_price: 4999,
    biznxt_price: 4999,
    premium_features_list: [
      { text: "Document Review", highlight: "Thorough check of all financial documents." },
      { text: "Acknowledgement Support", highlight: "Confirmation of successful filing." }
    ],
    discount: 0,
    requiredDocuments: 'Form 16, Bank Statements, Investment Proofs.',
    eligibility: 'Individuals and businesses.',
    faqs: [], terms: '', cancellationPolicy: '', refundPolicy: '', dependencies: '', addOnServices: '', relatedServices: [], recommendedNextServices: []
  },
  {
    id: 'it-ca-assisted',
    category: 'income_tax',
    subCategory: 'Tax Planning',
    title: 'CA Assisted Tax Filing',
    description: 'Dedicated CA assistance for complex tax situations and planning.',
    overview: 'Expert advice to optimize your tax liabilities and ensure strict compliance.',
    deliverables: 'Dedicated CA Assistance, Tax Planning Support, Compliance Review, Priority Support',
    timeline: '7-10 Days',
    estimatedDuration: 10,
    price: 18999,
    benchmark_price: 18999,
    biznxt_price: 18999,
    premium_features_list: [
      { text: "Tax Planning Support", highlight: "Strategies to minimize tax legally." },
      { text: "Compliance Review", highlight: "Audit of previous tax filings." }
    ],
    discount: 0,
    requiredDocuments: 'Detailed Financial Records, Asset Details, Previous ITRs.',
    eligibility: 'High net worth individuals and complex business structures.',
    faqs: [], terms: '', cancellationPolicy: '', refundPolicy: '', dependencies: '', addOnServices: '', relatedServices: [], recommendedNextServices: []
  },
  {
    id: 'it-ca-managed',
    category: 'income_tax',
    subCategory: 'Tax Compliance',
    title: 'CA Managed Tax Compliance',
    description: 'Complete annual tax management by a dedicated Chartered Accountant.',
    overview: 'Outsource your entire tax department to our expert CA professionals.',
    deliverables: 'Dedicated CA, Annual Compliance Assistance, Tax Review, Professional Support, Priority Service',
    timeline: 'Annual',
    estimatedDuration: 365,
    price: 24999,
    benchmark_price: 24999,
    biznxt_price: 24999,
    premium_features_list: [
      { text: "Dedicated CA", highlight: "Your personal financial advisor." },
      { text: "Annual Compliance", highlight: "Year-round monitoring and filing." }
    ],
    discount: 0,
    requiredDocuments: 'All financial data throughout the year.',
    eligibility: 'Businesses seeking end-to-end tax management.',
    faqs: [], terms: '', cancellationPolicy: '', refundPolicy: '', dependencies: '', addOnServices: '', relatedServices: [], recommendedNextServices: []
  },

  // TRADE LICENSE
  {
    id: 'tl-ka',
    category: 'trade_license',
    subCategory: 'Local Registration',
    title: 'Trade License - Karnataka',
    description: 'Assistance in obtaining a trade license from local authorities in Karnataka.',
    overview: 'Mandatory license for operating a commercial establishment in Karnataka.',
    deliverables: 'Application Filing, Document Compilation, Follow-up with Authorities, License Procurement',
    timeline: '15-20 Days',
    estimatedDuration: 20,
    price: 14999,
    benchmark_price: 14999,
    biznxt_price: 14999,
    premium_features_list: [
      { text: "End-to-End Assistance", highlight: "We handle the bureaucracy." },
      { text: "Pricing & Requirements Note", highlight: "Varies depending on local authority and documentation." }
    ],
    discount: 0,
    requiredDocuments: 'Rental Agreement, ID Proof, Property Tax Receipt, NOC from Owner.',
    eligibility: 'Businesses operating in Karnataka.',
    faqs: [], terms: '', cancellationPolicy: '', refundPolicy: '', dependencies: '', addOnServices: '', relatedServices: [], recommendedNextServices: []
  },
  {
    id: 'tl-tn',
    category: 'trade_license',
    subCategory: 'Local Registration',
    title: 'Trade License - Tamil Nadu',
    description: 'Assistance in obtaining a trade license from local authorities in Tamil Nadu.',
    overview: 'Mandatory license for operating a commercial establishment in Tamil Nadu.',
    deliverables: 'Application Filing, Document Compilation, Follow-up with Authorities, License Procurement',
    timeline: '15-20 Days',
    estimatedDuration: 20,
    price: 9999,
    benchmark_price: 9999,
    biznxt_price: 9999,
    premium_features_list: [
      { text: "End-to-End Assistance", highlight: "We handle the bureaucracy." },
      { text: "Pricing & Requirements Note", highlight: "Varies depending on local authority and documentation." }
    ],
    discount: 0,
    requiredDocuments: 'Rental Agreement, ID Proof, Property Tax Receipt, NOC from Owner.',
    eligibility: 'Businesses operating in Tamil Nadu.',
    faqs: [], terms: '', cancellationPolicy: '', refundPolicy: '', dependencies: '', addOnServices: '', relatedServices: [], recommendedNextServices: []
  },
  {
    id: 'tl-ts',
    category: 'trade_license',
    subCategory: 'Local Registration',
    title: 'Trade License - Telangana',
    description: 'Assistance in obtaining a trade license from local authorities in Telangana.',
    overview: 'Mandatory license for operating a commercial establishment in Telangana.',
    deliverables: 'Application Filing, Document Compilation, Follow-up with Authorities, License Procurement',
    timeline: '15-20 Days',
    estimatedDuration: 20,
    price: 9999,
    benchmark_price: 9999,
    biznxt_price: 9999,
    premium_features_list: [
      { text: "End-to-End Assistance", highlight: "We handle the bureaucracy." },
      { text: "Pricing & Requirements Note", highlight: "Varies depending on local authority and documentation." }
    ],
    discount: 0,
    requiredDocuments: 'Rental Agreement, ID Proof, Property Tax Receipt, NOC from Owner.',
    eligibility: 'Businesses operating in Telangana.',
    faqs: [], terms: '', cancellationPolicy: '', refundPolicy: '', dependencies: '', addOnServices: '', relatedServices: [], recommendedNextServices: []
  }
];

// ============================================================================
// COMPONENT MAIN RENDER
// ============================================================================
export default function Services() {
  const { user } = useAuth();
  const { success, error, confirm } = useToast();

  // Navigation & Role Tabs
  const [activeTab, setActiveTab] = useState<'explore' | 'my-orders' | 'bsm' | 'admin' | 'analytics'>('explore');
  
  // Real-time synced Firestore state
  const [dbServices, setDbServices] = useState<any[]>([]);
  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [dbPartnersList, setDbPartnersList] = useState<any[]>([]);
  const [dbTasks, setDbTasks] = useState<any[]>([]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [pricingConfig, setPricingConfig] = useState({ enableAutomatedAdjustment: true });
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [compareService, setCompareService] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Modal / Detail views
  const [viewingService, setViewingService] = useState<any | null>(null);
  
  // Order intake state machine
  const [bookingService, setBookingService] = useState<any | null>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [intakeForm, setIntakeForm] = useState({
    businessName: '',
    industry: 'Foodtech & QSR',
    briefNotes: '',
    selectedAddOns: [] as string[],
    documents: [] as any[]
  });
  
  // Simulated file upload states
  const [isUploading, setIsUploading] = useState(false);
  
  // Checkout simulation
  const [paymentStep, setPaymentStep] = useState<'checkout' | 'processing' | 'success'>('checkout');

  // Admin CRUD states
  const [isEditingService, setIsEditingService] = useState<boolean>(false);
  const [adminServiceForm, setAdminServiceForm] = useState<any>({
    id: '',
    title: '',
    category: 'legal',
    subCategory: '',
    description: '',
    overview: '',
    deliverables: '',
    timeline: '',
    estimatedDuration: 7,
    price: 9999,
    benchmark_price: 9999,
    biznxt_price: 9999,
    premium_features_list: [
      { text: "Dedicated Success Manager", highlight: "1-on-1 proactive guidance and project tracking." },
      { text: "Expert Quality Assurance", highlight: "Multi-point manual review by senior professionals." },
      { text: "Business Health Scoring", highlight: "AI-driven compliance and regulatory tracking." }
    ],
    discount: 2000,
    requiredDocuments: '',
    eligibility: '',
    terms: '',
    faqs: [{ q: '', a: '' }],
    cancellationPolicy: '',
    refundPolicy: '',
    dependencies: '',
    addOnServices: ''
  });

  // Task Creation states (BSM View)
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any | null>(null);
  const [bsmTaskTitle, setBsmTaskTitle] = useState('');
  const [bsmTaskAssignee, setBsmTaskAssignee] = useState('Core Admin Team');
  const [bsmTaskPriority, setBsmTaskPriority] = useState('Medium');

  // Chat simulator state
  const [chatMessage, setChatMessage] = useState('');

  // ============================================================================
  // DATABASE RETRIEVAL & SELF-SEEDING ON SNAPSHOTS
  // ============================================================================
  useEffect(() => {
    // 1. Sync Services
    const unsubServices = onSnapshot(collection(db, 'service_catalog'), (snap) => {
      const items: any[] = [];
      snap.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      setDbServices(items);

      // Auto-Seed if database catalog is empty to avoid blank screen!
      if (items.length === 0 && snap.metadata.fromCache === false) {
        console.log('Database empty! Triggering automatic catalog self-seeding...');
        triggerAutoSeeding();
      }
    });

    // 2. Sync Orders
    const unsubOrders = onSnapshot(collection(db, 'service_orders'), (snap) => {
      const items: any[] = [];
      snap.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      setDbOrders(items);
    });

    // 3. Sync Partners (Expert assignments)
    const unsubPartners = onSnapshot(collection(db, 'partners'), (snap) => {
      const items: any[] = [];
      snap.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      setDbPartnersList(items);
    });

    // 4. Sync Global Tasks
    const unsubTasks = onSnapshot(collection(db, 'service_tasks'), (snap) => {
      const items: any[] = [];
      snap.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      setDbTasks(items);
    });

    return () => {
      unsubServices();
      unsubOrders();
      unsubPartners();
      unsubTasks();
    };
  }, []);

  const triggerAutoSeeding = async () => {
    try {
      for (const service of SEED_SERVICES) {
        await setDoc(doc(db, 'service_catalog', service.id), {
          ...service,
          createdAt: new Date().toISOString(),
          isActive: true
        });
      }
      success('BizNxt catalog auto-seeded with 7+ enterprise-grade services!');
    } catch (err) {
      console.error('Seeding failure', err);
    }
  };

  // ============================================================================
  // SERVICES FILTERED VIEW
  // ============================================================================
  const filteredCatalog = useMemo(() => {
    return dbServices.filter(s => {
      const matchSearch = s.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.subCategory?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = selectedCategory === 'all' ? true : s.category === selectedCategory;
      const isActive = s.isActive !== false;
      return matchSearch && matchCategory && isActive;
    });
  }, [dbServices, searchQuery, selectedCategory]);

  // Combined fallback catalog to ensure visual content if first load is pending
  const visibleCatalog = useMemo(() => {
    if (filteredCatalog.length > 0) return filteredCatalog;
    // If database sync hasn't resolved, use seeded array as fallback to maintain UI response
    return SEED_SERVICES.filter(s => {
      const matchSearch = s.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = selectedCategory === 'all' ? true : s.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [filteredCatalog, searchQuery, selectedCategory]);

  // Customer Filter: retrieve orders belonging to current user email
  const userOrders = useMemo(() => {
    if (!user?.email) return [];
    return dbOrders.filter(o => o.clientEmail === user.email);
  }, [dbOrders, user]);

  // BSM Filter: retrieve orders assigned to selected success manager (or all if none specified)
  const bsmOrders = useMemo(() => {
    return dbOrders;
  }, [dbOrders]);

  // ============================================================================
  // ORDER INTAKE CONTROLLER
  // ============================================================================
  const handleStartBooking = (service: any) => {
    setBookingService(service);
    setBookingStep(1);
    setPaymentStep('checkout');
    setIntakeForm({
      businessName: '',
      industry: 'E-commerce & Retail',
      briefNotes: '',
      selectedAddOns: [],
      documents: []
    });
  };

  const simulateDocumentUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      const simulatedDoc = {
        name: `KYC_Attachment_${Date.now() % 1000}.pdf`,
        type: 'Business Document',
        uploadedAt: new Date().toISOString(),
        url: 'https://mca.gov.in/registration_doc.pdf'
      };
      setIntakeForm(prev => ({
        ...prev,
        documents: [...prev.documents, simulatedDoc]
      }));
      setIsUploading(false);
      success('Document uploaded and checksum verified!');
    }, 1200);
  };

  const handleCreateOrder = async () => {
    if (!bookingService) return;
    setPaymentStep('processing');

    setTimeout(async () => {
      try {
        const assignedManager = MANAGERS[Math.floor(Math.random() * MANAGERS.length)];
        const totalAmount = bookingService.price - (bookingService.discount || 0);

        const orderRef = await addDoc(collection(db, 'service_orders'), {
          serviceId: bookingService.id,
          serviceTitle: bookingService.title,
          category: bookingService.category,
          clientName: user?.displayName || 'Venture Founder',
          clientEmail: user?.email || 'founder@gmail.com',
          businessName: intakeForm.businessName || 'My Startup Venture',
          industry: intakeForm.industry,
          briefNotes: intakeForm.briefNotes,
          price: totalAmount,
          timeline: bookingService.timeline,
          status: 'Confirmed', // Direct checkout confirmation
          bsmName: assignedManager.name,
          bsmRole: assignedManager.role,
          bsmEmail: assignedManager.email,
          createdAt: new Date().toISOString(),
          documentsSubmitted: intakeForm.documents,
          chatHistory: [
            { sender: 'BSM', text: `Welcome to BizNxt OS! I am ${assignedManager.name}, your Business Success Manager. I have reviewed your submission. Let's schedule our scope alignment kick-off.`, time: new Date().toISOString() }
          ]
        });

        // Auto create standard checklist tasks in tasks collection
        const defaultTasks = [
          { title: 'Corporate KYC & Registry Verification', priority: 'High', days: 2 },
          { title: 'Execution Scope Alignment Meeting', priority: 'Medium', days: 4 },
          { title: 'Final Operational Delivery Review', priority: 'High', days: 8 }
        ];

        for (const t of defaultTasks) {
          await addDoc(collection(db, 'service_tasks'), {
            orderId: orderRef.id,
            title: t.title,
            priority: t.priority,
            status: 'Pending',
            assignedPartner: 'Core Admin Team',
            dueDate: new Date(Date.now() + t.days * 86400000).toISOString().split('T')[0],
            completed: false
          });
        }

        setPaymentStep('success');
        success('Service purchased successfully! Project board initialized.');

        // Track in Firebase Analytics
        if (analytics) {
          logEvent(analytics, 'service_purchased', {
            orderId: orderRef.id,
            serviceId: bookingService.id,
            serviceTitle: bookingService.title,
            category: bookingService.category,
            price: totalAmount,
            currency: 'INR'
          });
          logEvent(analytics, 'payment_success', {
            itemType: 'service',
            itemId: bookingService.id,
            itemName: bookingService.title,
            amount: totalAmount,
            method: 'upi_razorpay_stripe'
          });
        }
      } catch (err) {
        error('Order generation failure.');
        setPaymentStep('checkout');
      }
    }, 2000);
  };

  const handleBookingPackage = (pkg: any) => {
    // Packages bundle checkout
    setBookingService({
      id: pkg.id,
      title: pkg.title,
      price: pkg.price,
      discount: 0,
      timeline: pkg.duration,
      category: 'legal',
      requiredDocuments: 'Company Founder identity proofs, Rent Agreements, Brand details.'
    });
    setBookingStep(1);
    setPaymentStep('checkout');
    setIntakeForm({
      businessName: '',
      industry: 'Multi-service Operations',
      briefNotes: `Purchased through Bundle: ${pkg.title}`,
      selectedAddOns: [],
      documents: []
    });
  };

  // ============================================================================
  // BSM CONTROL ACTIONS
  // ============================================================================
  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'service_orders', orderId), { status });
      success(`Order status advanced to: ${status}`);
    } catch (err) {
      error('Failed to change workflow node.');
    }
  };

  const assignPartnerToOrder = async (orderId: string, partnerName: string) => {
    try {
      await updateDoc(doc(db, 'service_orders', orderId), { 
        assignedPartner: partnerName,
        status: 'Assigned'
      });
      success(`Sovereign expert assigned: ${partnerName}`);
    } catch (err) {
      error('Failed to bind partner agency.');
    }
  };

  const addBsmTask = async (orderId: string) => {
    if (!bsmTaskTitle.trim()) return;
    try {
      await addDoc(collection(db, 'service_tasks'), {
        orderId,
        title: bsmTaskTitle.trim(),
        priority: bsmTaskPriority,
        status: 'Pending',
        assignedPartner: bsmTaskAssignee,
        dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
        completed: false
      });
      setBsmTaskTitle('');
      success('Execution board milestone appended.');
    } catch (err) {
      error('Failed to append task.');
    }
  };

  const toggleTaskStatus = async (taskId: string, isCompleted: boolean) => {
    try {
      await updateDoc(doc(db, 'service_tasks', taskId), {
        completed: !isCompleted,
        status: !isCompleted ? 'Completed' : 'Pending'
      });
      success('Task completion flag toggled.');
    } catch (err) {
      error('Failed to update task.');
    }
  };

  const sendBsmChatMessage = async (order: any) => {
    if (!chatMessage.trim()) return;
    const nextChat = [
      ...(order.chatHistory || []),
      { sender: activeTab === 'bsm' ? 'BSM' : 'Customer', text: chatMessage.trim(), time: new Date().toISOString() }
    ];

    try {
      await updateDoc(doc(db, 'service_orders', order.id), { chatHistory: nextChat });
      setChatMessage('');
      success('Message dispatched.');
    } catch (err) {
      error('Failed to write message.');
    }
  };

  // ============================================================================
  // ADMIN CATALOG CRUD
  // ============================================================================
  const handleOpenCreateService = () => {
    setIsEditingService(false);
    setAdminServiceForm({
      id: `s-${Date.now() % 1000}`,
      title: '',
      category: 'legal',
      subCategory: 'Compliance',
      description: '',
      overview: '',
      deliverables: '',
      timeline: '7 Days',
      estimatedDuration: 7,
      price: 9999,
    benchmark_price: 9999,
    biznxt_price: 9999,
    premium_features_list: [
      { text: "Dedicated Success Manager", highlight: "1-on-1 proactive guidance and project tracking." },
      { text: "Expert Quality Assurance", highlight: "Multi-point manual review by senior professionals." },
      { text: "Business Health Scoring", highlight: "AI-driven compliance and regulatory tracking." }
    ],
      discount: 2000,
      requiredDocuments: 'Identity PAN Card, Rent agreement',
      eligibility: 'Standard business entities',
      terms: 'Standard facilitation terms apply',
      faqs: [{ q: 'Is support included?', a: 'Yes, 1 month of complimentary monitoring is standard.' }],
      cancellationPolicy: 'Refund possible prior to portal submission.',
      refundPolicy: 'Money back guarantee if file fails.'
    });
  };

  const handleEditService = (service: any) => {
    setIsEditingService(true);
    setAdminServiceForm(service);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const saveData = {
        ...adminServiceForm,
        service_id: adminServiceForm.id,
        service_name: adminServiceForm.title,
        createdAt: new Date().toISOString(),
        isActive: true
      };
      
      // Ensure premium features are stored as string labels if they are objects
      if (adminServiceForm.premium_features_list && Array.isArray(adminServiceForm.premium_features_list)) {
        saveData.premium_features_list = adminServiceForm.premium_features_list.map((f: any) => typeof f === 'string' ? f : (f.text || f.name || 'Premium Feature'));
      }

      await setDoc(doc(db, 'service_catalog', adminServiceForm.id), saveData);
      if (adminServiceForm.benchmark_price !== undefined || adminServiceForm.biznxt_price !== undefined) {
        logUserActivity('Catalog Pricing Updated', `Updated pricing for ${adminServiceForm.id} (Bench: ${adminServiceForm.benchmark_price}, Premium: ${adminServiceForm.biznxt_price})`, user?.email || 'Admin Desk');
      }
      success(isEditingService ? 'Service updated successfully!' : 'New specialized service added to catalog!');
      setAdminServiceForm(null);
    } catch (err) {
      error('Failed to save service records.');
    }
  };

  const handleDeleteService = async (id: string) => {
    confirm({
      title: 'Decommission Service',
      message: 'Are you sure you want to completely remove this service from the dynamic marketplace catalog?',
      confirmText: 'Decommission',
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'service_catalog', id));
          success('Service decommissioned from active catalog.');
        } catch (err) {
          error('Failed to delete catalog item.');
        }
      }
    });
  };

  // ============================================================================
  // ANALYTICS GRAPH PRE-COMPUTATIONS
  // ============================================================================
  const categoryChartData = useMemo(() => {
    const counts: { [key: string]: number } = {};
    CATEGORIES.forEach(c => {
      if (c.id !== 'all') counts[c.label] = 0;
    });

    dbOrders.forEach(o => {
      const catObj = CATEGORIES.find(c => c.id === o.category);
      if (catObj) {
        counts[catObj.label] = (counts[catObj.label] || 0) + o.price;
      }
    });

    return Object.keys(counts).map(k => ({
      name: k,
      Revenue: counts[k]
    }));
  }, [dbOrders]);

  const volumeChartData = useMemo(() => {
    const statuses: { [key: string]: number } = {};
    dbOrders.forEach(o => {
      statuses[o.status] = (statuses[o.status] || 0) + 1;
    });

    return Object.keys(statuses).map(k => ({
      status: k,
      Orders: statuses[k]
    }));
  }, [dbOrders]);

  return (
    <div className="flex-1 bg-slate-900 min-h-screen text-slate-100 font-sans pb-24">
      {/* Dynamic Header */}
      <div className="relative overflow-hidden pt-20 pb-16 border-b border-slate-800 bg-radial from-slate-900 via-slate-950 to-slate-950">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 rounded-2xl blur-[140px] mix-blend-screen" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-600 rounded-2xl blur-[120px] mix-blend-screen" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-xs font-bold uppercase tracking-wider mb-4"
              >
                <Rocket className="w-3.5 h-3.5" />
                <span>Enterprise Execution Engine 3.0</span>
              </motion.div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
                Business Services <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Marketplace</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-500 max-w-2xl mt-2 font-light">
                Secure, end-to-end operational execution for global launches. Track legal filings, custom software milestones, and brand supply chains.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-slate-950 p-1 rounded-2xl border border-slate-800/80 flex flex-wrap gap-1">
              {[
                { id: 'explore', label: 'Explore Marketplace' },
                { id: 'my-orders', label: `My Orders (${userOrders.length})` },
                { id: 'bsm', label: 'Success Workspace' },
                { id: 'admin', label: 'Admin Desk' },
                { id: 'analytics', label: 'SLA Analytics' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all ${
                    activeTab === tab.id 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-500 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <AnimatePresence mode="wait">
          
          {/* ===================================================================
              EXPLORE MARKETPLACE & CATLOG VIEW
              =================================================================== */}
          {activeTab === 'explore' && (
            <motion.div 
              key="explore"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-12"
            >
              {/* Dynamic Packages / Bundles Rail */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-xl font-display font-bold text-white">Consolidated Launch Bundles</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {PACKAGES.map(pkg => (
                    <div 
                      key={pkg.id}
                      className="bg-slate-950/90 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-6 relative overflow-hidden group shadow-lg flex flex-col justify-between"
                    >
                      <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wide">
                        {pkg.tag}
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="text-lg font-bold text-white font-display group-hover:text-emerald-400 transition-colors">
                          {pkg.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2">{pkg.description}</p>
                        
                        <div className="space-y-1.5 py-3">
                          <span className="text-[10px] text-slate-500 font-bold block">SERVICES INCLUDED:</span>
                          {pkg.servicesIncluded.map((serv, index) => (
                            <div key={index} className="flex items-center space-x-1.5 text-xs text-slate-400">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span className="truncate">{serv}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-slate-900 pt-4 mt-4 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 line-through block">₹{pkg.originalPrice.toLocaleString()}</span>
                          <span className="text-xl font-bold text-white">₹{pkg.price.toLocaleString()}</span>
                        </div>
                        <button 
                          onClick={() => handleBookingPackage(pkg)}
                          className="px-4 py-2 bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 text-white text-xs font-bold rounded-full transition-all flex items-center space-x-1"
                        >
                          <span>Buy Package</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid Filter Bar */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="relative w-full lg:flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Search by compliance, SEO, Shopify development..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3.5 py-1.5 rounded-2xl text-[11px] font-semibold transition-all border ${
                        selectedCategory === cat.id 
                          ? 'bg-blue-600 border-blue-600 text-white' 
                          : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Service Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {visibleCatalog.map(service => {
                  const hasDiscount = (service.discount || 0) > 0;
                  const benchmarkPrice = service.benchmark_price || service.price - (service.discount || 0);
                  const finalPrice = pricingConfig.enableAutomatedAdjustment ? (service.biznxt_price || calculateBizNxtPrice(benchmarkPrice, true)) : benchmarkPrice;

                  return (
                    <div 
                      key={service.id}
                      className="bg-slate-900 rounded-3xl p-8 shadow-[8px_8px_16px_#0f172a,-8px_-8px_16px_#1e293b,inset_2px_2px_4px_rgba(255,255,255,0.05),inset_-2px_-2px_4px_rgba(0,0,0,0.2)] border border-slate-700/50 transition-all hover:scale-[1.02] flex flex-col justify-between group relative"
                    >
                      {hasDiscount && (
                        <span className="absolute top-6 right-6 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-bold px-3 py-1 rounded-2xl">
                          SAVE ₹{(service.discount || 0).toLocaleString()}
                        </span>
                      )}

                      <div className="space-y-6">
                        <div>
                          <span className="text-[10px] bg-slate-800 text-blue-400 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            {service.subCategory || service.category}
                          </span>
                          <h3 className="text-xl font-bold text-white font-display mt-4 group-hover:text-blue-400 transition-colors">
                            {service.title}
                          </h3>
                          <div className="mt-4 flex flex-col gap-1">
                            <span className="text-3xl font-black text-white">₹{finalPrice.toLocaleString()}</span>
                            {<span className="text-xs text-slate-500 line-through">₹{benchmarkPrice.toLocaleString()} Market Price</span>}
                          </div>
                          
                          <p className="text-sm text-slate-400 mt-4 leading-relaxed">
                            {service.description}
                          </p>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-800">
                          <div>
                            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">What's Included</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">{service.deliverables}</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Timeline</h4>
                              <div className="flex items-center text-xs text-slate-300 font-medium">
                                <Clock className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                                {service.timeline || '7 Days'}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Documents Req.</h4>
                              <div className="flex items-center text-xs text-slate-300 font-medium">
                                <FileText className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                                {service.requiredDocuments ? 'Yes' : 'None'}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {service.premium_features_list && service.premium_features_list.length > 0 && (
                          <div className="mt-2 space-y-2 bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
                            {service.premium_features_list.slice(0, 3).map((feat: any, i: number) => (
                              <div key={i} className="group/tooltip relative flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span className="text-xs text-slate-300 font-medium cursor-help border-b border-dashed border-slate-700 hover:border-emerald-500 transition-colors">
                                  {feat.text}
                                </span>
                                {/* Tooltip */}
                                <div className="absolute left-0 bottom-full mb-2 hidden group-hover/tooltip:block w-64 bg-slate-800 text-white text-[10px] p-3 rounded-2xl shadow-xl z-10 border border-slate-700">
                                  <div className="font-bold text-emerald-400 mb-1 uppercase tracking-wider text-[9px]">Benefit</div>
                                  {feat.highlight}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col gap-3">
                        <button 
                          onClick={() => handleStartBooking(service)}
                          className="w-full py-4 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-2xl transition-colors flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(193,18,31,0.39)]"
                        >
                          Book Now <ArrowRight className="w-4 h-4" />
                        </button>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <button 
                            onClick={() => window.location.href = '/contact'}
                            className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-full transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Headset className="w-3.5 h-3.5" /> Talk to Expert
                          </button>
                          
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setCompareService(service);
                              setCompareModalOpen(true);
                            }}
                            className="py-3 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white text-xs font-bold rounded-full transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Shield className="w-3.5 h-3.5" /> Compare Plans
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ===================================================================
              MY ORDERS / PROJECT EXECUTION TRACKER
              =================================================================== */}
          {activeTab === 'my-orders' && (
            <motion.div 
              key="my-orders"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {userOrders.length === 0 ? (
                <div className="text-center py-20 bg-slate-950 rounded-full border border-slate-800">
                  <FolderOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white">No Active Orders</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    You have not subscribed to any premium BizNxt launch services yet. Explore our marketplace to secure verified company registration, tax filings, or custom software MVP execution.
                  </p>
                  <button 
                    onClick={() => setActiveTab('explore')}
                    className="mt-6 px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-full"
                  >
                    Browse Services Marketplace
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Orders selection list */}
                  <div className="space-y-4 lg:col-span-1">
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Active Service Projects</h2>
                    {userOrders.map(order => {
                      const orderTasks = dbTasks.filter(t => t.orderId === order.id);
                      const completedTasks = orderTasks.filter(t => t.completed).length;
                      const progressPct = orderTasks.length > 0 
                        ? Math.round((completedTasks / orderTasks.length) * 100) 
                        : 0;

                      return (
                        <div 
                          key={order.id}
                          onClick={() => setSelectedOrderDetails(order)}
                          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                            selectedOrderDetails?.id === order.id 
                              ? 'bg-slate-950 border-blue-500/80 shadow' 
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] bg-slate-900 text-blue-400 font-bold px-2 py-0.5 rounded uppercase">
                              {order.category}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              ID: {order.id.slice(0, 5)}...
                            </span>
                          </div>
                          
                          <h3 className="text-md font-bold text-white mt-2 truncate">
                            {order.serviceTitle}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1">
                            Manager: <span className="text-slate-400 font-semibold">{order.bsmName || 'Admin Desk'}</span>
                          </p>

                          <div className="mt-4 space-y-1.5">
                            <div className="flex justify-between text-[11px] text-slate-500">
                              <span>Execution Progress</span>
                              <span className="text-white font-mono font-bold">{progressPct}%</span>
                            </div>
                            <div className="w-full bg-slate-900 h-1.5 rounded-2xl overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full transition-all" 
                                style={{ width: `${progressPct}%` }}
                              />
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-slate-900 flex justify-between items-center text-[11px]">
                            <span className="text-slate-500">Timeline: {order.timeline || '10 Days'}</span>
                            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded font-bold uppercase">
                              {order.status || 'Confirmed'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Selected Active Order Details Board */}
                  <div className="lg:col-span-2 space-y-6">
                    {selectedOrderDetails ? (
                      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-900 pb-4 gap-2">
                          <div>
                            <h2 className="text-xl font-bold font-display text-white">{selectedOrderDetails.serviceTitle}</h2>
                            <p className="text-xs text-slate-500 mt-1">Venture profile: {selectedOrderDetails.businessName} • {selectedOrderDetails.industry}</p>
                          </div>
                          <span className="px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold uppercase">
                            {selectedOrderDetails.status || 'Active'}
                          </span>
                        </div>

                        {/* Interactive Tasks Checklist Board */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                            <ListTodo className="w-4 h-4 text-blue-400" />
                            <span>Execution Checklist</span>
                          </h4>
                          <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800 space-y-2">
                            {dbTasks.filter(t => t.orderId === selectedOrderDetails.id).length === 0 ? (
                              <p className="text-xs text-slate-500 py-4 text-center">Milestones checklist is being configured by your BSM...</p>
                            ) : (
                              dbTasks.filter(t => t.orderId === selectedOrderDetails.id).map(task => (
                                <div key={task.id} className="flex items-center justify-between p-2.5 hover:bg-slate-900 rounded-2xl text-xs">
                                  <div className="flex items-center space-x-3">
                                    <input 
                                      type="checkbox" 
                                      checked={task.completed}
                                      onChange={() => toggleTaskStatus(task.id, task.completed)}
                                      className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0 cursor-pointer"
                                    />
                                    <span className={task.completed ? 'line-through text-slate-500' : 'text-slate-400 font-medium'}>
                                      {task.title}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                                      task.priority === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-slate-800 text-slate-500'
                                    }`}>
                                      {task.priority}
                                    </span>
                                    <span className="text-[10px] text-slate-500">Due: {task.dueDate}</span>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Document Locker / Secure Vault */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                            <FolderOpen className="w-4 h-4 text-emerald-400" />
                            <span>Project Document Locker & Deliverables</span>
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Vault files */}
                            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                              <span className="text-[10px] text-slate-500 font-bold block">SUBMITTED IDENTIFICATION/KYC</span>
                              {selectedOrderDetails.documentsSubmitted?.length === 0 ? (
                                <p className="text-xs text-slate-600 py-3">No compliance files attached yet.</p>
                              ) : (
                                selectedOrderDetails.documentsSubmitted?.map((doc: any, i: number) => (
                                  <div key={i} className="flex items-center justify-between text-xs bg-slate-950 p-2.5 rounded-2xl border border-slate-800/80">
                                    <div className="flex items-center space-x-2 truncate">
                                      <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                                      <span className="truncate text-slate-400">{doc.name}</span>
                                    </div>
                                    <a href={doc.url} download className="text-blue-400 hover:underline">
                                      <Download className="w-3.5 h-3.5" />
                                    </a>
                                  </div>
                                ))
                              )}
                            </div>

                            {/* Secure deliverables */}
                            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
                              <div>
                                <span className="text-[10px] text-slate-500 font-bold block">VERIFIED EXPORTER & ADVISORY DELIVERABLES</span>
                                <div className="text-xs bg-slate-950 p-3 rounded-2xl border border-slate-800/80 mt-2 flex items-center space-x-3">
                                  <FileCheck className="w-8 h-8 text-emerald-400 shrink-0" />
                                  <div>
                                    <span className="font-semibold block text-slate-200">Advisory_Signoff_Pack.pdf</span>
                                    <span className="text-[10px] text-slate-500 block">Digitally signed • Version 1.2</span>
                                  </div>
                                </div>
                              </div>
                              <button 
                                onClick={() => success('Final advisory sign-off package successfully downloaded.')}
                                className="w-full mt-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-2xl transition-colors flex items-center justify-center space-x-1"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Download Project Deliverables</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Manager Messenger Chat */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                            <MessageSquare className="w-4 h-4 text-indigo-400" />
                            <span>Message Your Assigned Success Manager</span>
                          </h4>
                          <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 space-y-4">
                            {/* Manager card info */}
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-600 rounded-2xl flex items-center justify-center text-xs font-bold text-white uppercase">
                                  {selectedOrderDetails.bsmName?.slice(0, 2) || 'BS'}
                                </div>
                                <div>
                                  <span className="text-xs font-bold text-white block">{selectedOrderDetails.bsmName || 'Success Advisor'}</span>
                                  <span className="text-[10px] text-slate-500 block">{selectedOrderDetails.bsmRole}</span>
                                </div>
                              </div>
                              <button 
                                onClick={() => success('SLA video meeting invite dispatched to calendar.')}
                                className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 rounded border border-slate-800 text-[10px] font-bold text-slate-400"
                              >
                                Schedule Scope Call
                              </button>
                            </div>

                            {/* Chat history logs */}
                            <div className="space-y-2.5 max-h-48 overflow-y-auto">
                              {(selectedOrderDetails.chatHistory || []).map((msg: any, i: number) => (
                                <div key={i} className={`flex flex-col ${msg.sender === 'Customer' ? 'items-end' : 'items-start'}`}>
                                  <div className={`p-2.5 rounded-2xl text-xs max-w-sm ${
                                    msg.sender === 'Customer' 
                                      ? 'bg-blue-600 text-white rounded-br-none' 
                                      : 'bg-slate-800 text-slate-400 rounded-bl-none'
                                  }`}>
                                    {msg.text}
                                  </div>
                                  <span className="text-[9px] text-slate-600 mt-1">
                                    {msg.time ? new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Text inputs */}
                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                placeholder="Query about tax compliance schedules..."
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendBsmChatMessage(selectedOrderDetails)}
                                className="flex-1 bg-slate-950 border border-slate-800 rounded-full px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                              <button 
                                onClick={() => sendBsmChatMessage(selectedOrderDetails)}
                                className="p-2 bg-primary hover:bg-primary-dark text-white rounded-2xl"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>
                    ) : (
                      <div className="text-center py-24 bg-slate-950 rounded-full border border-slate-800">
                        <Info className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                        <h3 className="text-md font-bold text-slate-400">Select an active project board</h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Click on any corporate registration, Shopify storefront setup, or Dubai license filing on the left panel to access live compliance checklists, download final advisory reports, and message success managers.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ===================================================================
              BUSINESS SUCCESS MANAGER VIEW
              =================================================================== */}
          {activeTab === 'bsm' && (
            <motion.div 
              key="bsm"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Stats Bar */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex items-center space-x-4">
                  <div className="p-3 bg-blue-500/10 rounded-2xl">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-bold">Assigned Accounts</span>
                    <span className="text-xl font-bold text-white">{bsmOrders.length} Ventures</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex items-center space-x-4">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-bold">Fulfill Rate</span>
                    <span className="text-xl font-bold text-white">96.8%</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex items-center space-x-4">
                  <div className="p-3 bg-indigo-500/10 rounded-2xl">
                    <DollarSign className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-bold">SLA Compliance</span>
                    <span className="text-xl font-bold text-white">100% Correct</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex items-center space-x-4">
                  <div className="p-3 bg-amber-500/10 rounded-2xl">
                    <ShieldAlert className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-bold">Live Risk Flags</span>
                    <span className="text-xl font-bold text-white">0 Warning</span>
                  </div>
                </div>
              </div>

              {/* BSM Order Queue Management */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold font-display text-white">Client Portfolio & Workflow Router</h3>
                  <span className="text-xs text-slate-500">Live feed matching customer documents to designated sovereign legal partners.</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500 font-bold uppercase">
                        <th className="py-3 px-4">Client / Venture</th>
                        <th className="py-3 px-4">Ordered Service</th>
                        <th className="py-3 px-4">Documents File</th>
                        <th className="py-3 px-4">Expert Partner Assignment</th>
                        <th className="py-3 px-4">SLA Step Status</th>
                        <th className="py-3 px-4 text-right">Fulfillment Nodes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bsmOrders.map(order => {
                        return (
                          <tr key={order.id} className="border-b border-slate-900 hover:bg-slate-900/40 transition-colors">
                            <td className="py-4 px-4 font-semibold text-white">
                              {order.clientName}
                              <span className="text-[10px] text-slate-500 block">{order.businessName}</span>
                            </td>
                            <td className="py-4 px-4 text-slate-400">
                              {order.serviceTitle}
                              <span className="text-[10px] text-blue-400 block uppercase tracking-wider">{order.category}</span>
                            </td>
                            <td className="py-4 px-4">
                              {order.documentsSubmitted?.length > 0 ? (
                                <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">
                                  <FileText className="w-3.5 h-3.5" />
                                  <span>{order.documentsSubmitted.length} Files</span>
                                </span>
                              ) : (
                                <span className="text-slate-600 italic">None attached</span>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              <select 
                                value={order.assignedPartner || ''}
                                onChange={(e) => assignPartnerToOrder(order.id, e.target.value)}
                                className="bg-slate-900 border border-slate-800 text-xs text-slate-400 rounded px-2 py-1 focus:outline-none"
                              >
                                <option value="">Select Expert Partner</option>
                                {dbPartnersList.map(p => (
                                  <option key={p.id} value={p.companyName || p.name}>{p.companyName || p.name}</option>
                                ))}
                                <option value="Kothari & Associates LLP">Kothari & Associates LLP (Static CA)</option>
                                <option value="Supreme Polymer Molders">Supreme Polymer Molders (Static OEM)</option>
                              </select>
                            </td>
                            <td className="py-4 px-4 uppercase font-bold font-mono">
                              <span className={`px-2.5 py-1 rounded text-[10px] ${
                                order.status === 'Confirmed' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                order.status === 'Assigned' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                                'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              }`}>
                                {order.status || 'Confirmed'}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right space-x-2">
                              <button 
                                onClick={() => updateOrderStatus(order.id, 'In Progress')}
                                className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-bold rounded text-slate-400"
                              >
                                Trigger Work
                              </button>
                              <button 
                                onClick={() => updateOrderStatus(order.id, 'Completed')}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded"
                              >
                                Approve QA
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {bsmOrders.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-600 italic">
                            No service orders routed from front page yet. Use booking CTA inside explore panel first.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ===================================================================
              ADMIN DECK: CREATE & CONFIGURE SERVICES
              =================================================================== */}
          {activeTab === 'admin' && (
            <motion.div 
              key="admin"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold font-display text-white">Dynamic Catalog Controls</h3>
                  <p className="text-xs text-slate-500">Enable, decommission, alter pricing, or append custom deliverables to the main venture registration registry.</p>
                </div>
                <button 
                  onClick={handleOpenCreateService}
                  className="flex items-center space-x-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Service Item</span>
                </button>
              </div>

              {/* Service Form Editor overlay / component block */}
              {adminServiceForm && (
                <div className="bg-slate-950 p-6 rounded-2xl border border-blue-500/40 space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      {isEditingService ? `Modify Catalog Record: ${adminServiceForm.id}` : 'Create Brand New Dynamic Marketplace Service'}
                    </h4>
                    <button onClick={() => setAdminServiceForm(null)} className="text-slate-500 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveService} className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                    <div className="space-y-1">
                      <label className="text-slate-500 font-bold block mb-1">Unique Service ID</label>
                      <input 
                        type="text" 
                        required
                        disabled={isEditingService}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                        value={adminServiceForm.id}
                        onChange={(e) => setAdminServiceForm({...adminServiceForm, id: e.target.value})}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-500 font-bold block mb-1">Service Title Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. MSME Trade Registration"
                        className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                        value={adminServiceForm.title}
                        onChange={(e) => setAdminServiceForm({...adminServiceForm, title: e.target.value})}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-500 font-bold block mb-1">Business Vertical Category</label>
                      <select 
                        className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                        value={adminServiceForm.category}
                        onChange={(e) => setAdminServiceForm({...adminServiceForm, category: e.target.value})}
                      >
                        {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-500 font-bold block mb-1">Subcategory Specialist Node</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                        value={adminServiceForm.subCategory}
                        onChange={(e) => setAdminServiceForm({...adminServiceForm, subCategory: e.target.value})}
                      />
                    </div>

                    
                    <div className="space-y-1">
                      <label className="text-slate-500 font-bold block mb-1">Benchmark Price (INR)</label>
                      <input 
                        type="number" 
                        required
                        className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                        value={adminServiceForm.benchmark_price || adminServiceForm.price || 0}
                        onChange={(e) => setAdminServiceForm({...adminServiceForm, benchmark_price: Number(e.target.value)})}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-500 font-bold block mb-1">BizNxt Premium Price (INR)</label>
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          required
                          className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                          value={adminServiceForm.biznxt_price || adminServiceForm.price || 0}
                          onChange={(e) => setAdminServiceForm({...adminServiceForm, biznxt_price: Number(e.target.value)})}
                        />
                        <button 
                          type="button"
                          onClick={() => {
                            const suggested = calculateBizNxtPrice(adminServiceForm.benchmark_price || adminServiceForm.price || 0, pricingConfig.enableAutomatedAdjustment);
                            setAdminServiceForm({...adminServiceForm, biznxt_price: suggested});
                          }}
                          className="px-3 py-2 bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 rounded text-xs whitespace-nowrap"
                        >
                          Auto Calc
                        </button>
                      </div>
                    </div>


                    <div className="space-y-1">
                      <label className="text-slate-500 font-bold block mb-1">Direct Promo Discount (INR)</label>
                      <input 
                        type="number" 
                        required
                        className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                        value={adminServiceForm.discount}
                        onChange={(e) => setAdminServiceForm({...adminServiceForm, discount: Number(e.target.value)})}
                      />
                    </div>

                    <div className="space-y-1 md:col-span-3">
                      <label className="text-slate-500 font-bold block mb-1">Standard Short Description</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                        value={adminServiceForm.description}
                        onChange={(e) => setAdminServiceForm({...adminServiceForm, description: e.target.value})}
                      />
                    </div>

                    <div className="space-y-1 md:col-span-3">
                      <label className="text-slate-500 font-bold block mb-1">Premium Features (Comma Separated)</label>
                      <textarea 
                        rows={2}
                        placeholder="e.g. Dedicated Success Manager, Expert Review"
                        className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                        value={(adminServiceForm.premium_features_list || []).map(f => typeof f === 'string' ? f : (f.text || f.name)).join(', ')}
                        onChange={(e) => setAdminServiceForm({...adminServiceForm, premium_features_list: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                      />
                    </div>

                    <div className="space-y-1 md:col-span-3">
                      <label className="text-slate-500 font-bold block mb-1">SLA Guarantee Deliverables (Comma Separated)</label>
                      <textarea 
                        rows={2}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                        value={adminServiceForm.deliverables}
                        onChange={(e) => setAdminServiceForm({...adminServiceForm, deliverables: e.target.value})}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-500 font-bold block mb-1">SLA Completion Duration</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                        value={adminServiceForm.timeline}
                        onChange={(e) => setAdminServiceForm({...adminServiceForm, timeline: e.target.value})}
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-slate-500 font-bold block mb-1">Required Documents Intake List (Comma Separated)</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                        value={adminServiceForm.requiredDocuments}
                        onChange={(e) => setAdminServiceForm({...adminServiceForm, requiredDocuments: e.target.value})}
                      />
                    </div>

                    <div className="md:col-span-3 flex justify-end gap-3 pt-3">
                      <button 
                        type="button" 
                        onClick={() => setAdminServiceForm(null)}
                        className="px-4 py-2 bg-slate-900 text-slate-500 rounded-full"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="px-6 py-2 bg-primary text-white rounded-full font-bold"
                      >
                        Save Dynamic Record
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Dynamic catalog listing */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Live Active Services List</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dbServices.map(service => (
                    <div key={service.id} className="flex justify-between items-center p-3.5 bg-slate-900 rounded-2xl border border-slate-800">
                      <div>
                        <span className="font-bold text-white text-sm">{service.title}</span>
                        <div className="flex space-x-3 text-[10px] text-slate-500 mt-1">
                          <span>ID: {service.id}</span>
                          <span>Category: <span className="text-blue-400 uppercase">{service.category}</span></span>
                          <span>Price: ₹{service.price}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditService(service)}
                          className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-2xl text-slate-500"
                        >
                          <Settings className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteService(service.id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-2xl"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ===================================================================
              SLA ANALYTICS DASHBOARD
              =================================================================== */}
          {activeTab === 'analytics' && (
            <motion.div 
              key="analytics"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Revenue share */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Live Billing Revenue by Vertical</span>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                        <YAxis stroke="#64748b" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                        <Bar dataKey="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Workflow velocity */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Execution Queue Velocity Status</span>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={volumeChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="status" stroke="#64748b" fontSize={10} />
                        <YAxis stroke="#64748b" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                        <Bar dataKey="Orders" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ===================================================================
          MODAL: SERVICE VIEW LANDING DETAILS
          =================================================================== */}
      <AnimatePresence>
        {viewingService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6"
            >
              <div className="flex justify-between items-start border-b border-slate-900 pb-4">
                <div>
                  <span className="text-[10px] bg-slate-900 text-blue-400 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    {viewingService.subCategory || viewingService.category}
                  </span>
                  <h3 className="text-2xl font-bold font-display text-white mt-1">{viewingService.title}</h3>
                </div>
                <button 
                  onClick={() => setViewingService(null)}
                  className="p-1 text-slate-500 hover:text-white rounded-2xl"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-400">
                <div className="md:col-span-2 space-y-4">
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-white text-sm">Service Overview</h4>
                    <p className="leading-relaxed">{viewingService.overview || viewingService.description}</p>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-bold text-white text-sm">Expected Deliverables</h4>
                    <p className="leading-relaxed bg-slate-900 p-3 rounded-2xl text-slate-200">{viewingService.deliverables}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900 p-3 rounded-2xl">
                      <span className="text-[10px] text-slate-500 font-bold block uppercase">Required Documents</span>
                      <p className="text-slate-200 mt-1">{viewingService.requiredDocuments || 'Founder KYC details'}</p>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-2xl">
                      <span className="text-[10px] text-slate-500 font-bold block uppercase">Eligibility Criteria</span>
                      <p className="text-slate-200 mt-1">{viewingService.eligibility || 'All active legal entities'}</p>
                    </div>
                  </div>

                  {viewingService.faqs && viewingService.faqs.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-white text-sm">Frequently Asked Questions</h4>
                      {viewingService.faqs.map((faq: any, i: number) => (
                        <div key={i} className="bg-slate-900/60 p-3 rounded-2xl space-y-1">
                          <span className="font-bold text-slate-200 block">Q: {faq.q}</span>
                          <span className="text-slate-500 block">{faq.a}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right panel pricing & buy */}
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wide">Fulfillment Guarantee</span>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Completion Duration</span>
                        <span className="text-white font-semibold">{viewingService.timeline || '10 Days'}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Internal QA Audit</span>
                        <span className="text-emerald-400 font-semibold">Included</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Assigned Manager</span>
                        <span className="text-blue-400 font-semibold">Yes</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                      <span className="text-[10px] text-slate-500 block uppercase">SECURE TRANSACT TAX FEE</span>
                      <span className="text-3xl font-bold font-display text-white">
                        ₹{(viewingService.price - (viewingService.discount || 0)).toLocaleString()}
                      </span>
                      {viewingService.discount > 0 && (
                        <span className="text-xs text-slate-500 line-through block mt-0.5">
                          ₹{viewingService.price.toLocaleString()} original fee
                        </span>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setViewingService(null);
                      handleStartBooking(viewingService);
                    }}
                    className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-2xl shadow-lg transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Purchase Subscription</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================================================================
          MODAL: ORDER BOOKING / REQUIREMENTS INTAKE INTAKE
          =================================================================== */}
      <AnimatePresence>
        {bookingService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl p-6 sm:p-8 space-y-6"
            >
              <div className="flex justify-between items-start border-b border-slate-900 pb-3">
                <div>
                  <h3 className="text-lg font-bold font-display text-white">Checkout Configuration</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{bookingService.title}</p>
                </div>
                <button 
                  onClick={() => setBookingService(null)}
                  className="p-1 text-slate-500 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {paymentStep === 'checkout' && (
                <div className="space-y-4 text-xs text-slate-400">
                  <div className="space-y-1">
                    <label className="text-slate-500 font-bold">Venture Corporate Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Acme Sourcing Pvt Ltd"
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={intakeForm.businessName}
                      onChange={(e) => setIntakeForm({...intakeForm, businessName: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-500 font-bold">Project Brief & Specialized Instructions</label>
                    <textarea 
                      rows={3}
                      placeholder="e.g. Need urgent registration filings with dual director setup."
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-white focus:outline-none"
                      value={intakeForm.briefNotes}
                      onChange={(e) => setIntakeForm({...intakeForm, briefNotes: e.target.value})}
                    />
                  </div>

                  {/* Dynamic checklist doc uploader */}
                  <div className="space-y-2">
                    <label className="text-slate-500 font-bold block">Prerequisite Documents Upload</label>
                    <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-3">
                      <span className="text-[10px] text-slate-500 font-bold block">REQUISITE CHECKLIST: {bookingService.requiredDocuments || 'PAN, Aadhaar Card, Address Proof'}</span>
                      
                      <div className="flex justify-between items-center gap-4">
                        <button 
                          type="button" 
                          onClick={simulateDocumentUpload}
                          disabled={isUploading}
                          className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 rounded font-bold transition-all text-[10px]"
                        >
                          {isUploading ? 'Verifying PDF...' : 'Attach Document File'}
                        </button>
                        <span className="text-[10px] text-slate-500">PDF or PNG (Max 10MB)</span>
                      </div>

                      {intakeForm.documents.map((doc: any, i: number) => (
                        <div key={i} className="flex items-center space-x-1.5 text-[10px] text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{doc.name} (Uploaded Successfully)</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Gateway Selection */}
                  <div className="space-y-3 pt-2">
                    <label className="text-slate-500 font-bold block text-[11px] uppercase tracking-wider">Select Payment Gateway</label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex flex-col items-center justify-center p-3 border border-slate-700 bg-slate-900 rounded-2xl cursor-pointer hover:border-blue-500 transition-colors">
                        <input type="radio" name="paymentGateway" value="razorpay" className="sr-only peer" defaultChecked />
                        <div className="w-full flex items-center justify-between mb-2">
                          <span className="font-bold text-white text-xs">Razorpay</span>
                          <div className="w-4 h-4 rounded-full border border-slate-600 peer-checked:border-blue-500 peer-checked:border-4 transition-all"></div>
                        </div>
                        <span className="text-[10px] text-slate-500 text-center">UPI, Cards, Net Banking, Wallets</span>
                      </label>
                      <label className="flex flex-col items-center justify-center p-3 border border-slate-700 bg-slate-900 rounded-2xl cursor-pointer hover:border-blue-500 transition-colors">
                        <input type="radio" name="paymentGateway" value="paytm" className="sr-only peer" />
                        <div className="w-full flex items-center justify-between mb-2">
                          <span className="font-bold text-white text-xs">Paytm Business</span>
                          <div className="w-4 h-4 rounded-full border border-slate-600 peer-checked:border-blue-500 peer-checked:border-4 transition-all"></div>
                        </div>
                        <span className="text-[10px] text-slate-500 text-center">UPI, Cards, Net Banking, Wallets</span>
                      </label>
                    </div>
                  </div>

                  {/* Summary receipt details */}
                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800/80 space-y-2">
                    <div className="flex justify-between text-slate-500">
                      <span>Facilitation Cost</span>
                      <span>₹{(bookingService.price - (bookingService.discount || 0)).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Estimated Duration</span>
                      <span>{bookingService.timeline || '10 Days'}</span>
                    </div>
                    <div className="flex justify-between text-white font-bold border-t border-slate-800 pt-2 text-sm">
                      <span>Total Net Payout</span>
                      <span>₹{(bookingService.price - (bookingService.discount || 0)).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex justify-end pt-3">
                    <button 
                      onClick={handleCreateOrder}
                      className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-full transition-all"
                    >
                      Clear Checkout Payment
                    </button>
                  </div>
                </div>
              )}

              {paymentStep === 'processing' && (
                <div className="text-center py-12 space-y-4">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Filing Payment Transaction</h4>
                    <p className="text-xs text-slate-500 mt-1">Establishing secure blockchain ledger escrow entries...</p>
                  </div>
                </div>
              )}

              {paymentStep === 'success' && (
                <div className="text-center py-12 space-y-4">
                  <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Subscription Verified</h4>
                    <p className="text-xs text-slate-500 mt-1">Assigned success director is scheduling scope checks.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setBookingService(null);
                      setActiveTab('my-orders');
                    }}
                    className="mt-6 px-6 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-bold rounded-full"
                  >
                    Manage Project Board
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ValueComparisonModal isOpen={compareModalOpen} onClose={() => setCompareModalOpen(false)} service={compareService} />
    </div>
  );
}
