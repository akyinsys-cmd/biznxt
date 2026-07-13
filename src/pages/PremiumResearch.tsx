import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  ArrowRight, 
  DollarSign, 
  Clock, 
  Award, 
  Users, 
  BookOpen, 
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
  IndianRupee, 
  TrendingUp, 
  HelpCircle,
  FileDown,
  RefreshCw,
  Send,
  Eye,
  CheckCircle2,
  Trash2,
  Lock,
  UserCheck
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { logActivity } from '../lib/activity';
import ResearchTeamWorkspace from '../components/ResearchTeamWorkspace';
import ResearchDashboard from '../components/ResearchDashboard';
import { triggerPaymentSuccessWorkflow } from '../services/researchWorkflowService';
import { notifyResearchStageUpdate } from '../services/ResearchService';
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
  setDoc
} from 'firebase/firestore';
import { db, analytics, logErrorToCrashlytics } from '../lib/firebase';
import { logEvent } from 'firebase/analytics';
import LocationMap from '../components/LocationMap';
import { triggerHapticFeedback } from '../lib/vibration';
import { formDraftsDB } from '../lib/indexedDB';

// Types
export interface ResearchPackage {
  id: string;
  name: string;
  price: string;
  priceVal: number;
  timeline: string;
  scope: string[];
  deliverables: string[];
  support: string;
  revision: string;
  badge?: string;
  color: string;
}

export interface ResearchRequest {
  id?: string;
  userId: string;
  userEmail: string;
  userName: string;
  packageId: string;
  packageName: string;
  businessCategory: string;
  investment: string;
  country: string;
  state: string;
  city: string;
  pinCode: string;
  targetCustomers: string;
  businessType: string; // Manufacturing, Trading, Import, Export, White Label, Private Label, OEM
  businessGoal: string;
  specialRequirements: string;
  uploadedDocuments: { name: string; size: string; category: string }[];
  createdAt: any;
}

export interface ResearchTicket {
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
  status: string; // See STATUS_FLOW below
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

// 13 Status Stages
const STATUS_FLOW = [
  { id: 'payment_received', label: 'Payment Received', color: 'bg-emerald-500 text-white' },
  { id: 'waiting_assignment', label: 'Waiting Assignment', color: 'bg-amber-500 text-white' },
  { id: 'assigned', label: 'Assigned', color: 'bg-indigo-500 text-white' },
  { id: 'research_started', label: 'Research Started', color: 'bg-blue-500 text-white' },
  { id: 'market_research', label: 'Market Research', color: 'bg-cyan-500 text-white' },
  { id: 'competitor_analysis', label: 'Competitor Analysis', color: 'bg-sky-500 text-white' },
  { id: 'financial_analysis', label: 'Financial Analysis', color: 'bg-teal-500 text-white' },
  { id: 'internal_review', label: 'Internal Review', color: 'bg-purple-500 text-white' },
  { id: 'qa_review', label: 'QA Review', color: 'bg-pink-500 text-white' },
  { id: 'pdf_generation', label: 'PDF Generation', color: 'bg-violet-500 text-white' },
  { id: 'approved', label: 'Approved', color: 'bg-emerald-600 text-white' },
  { id: 'delivered', label: 'Delivered', color: 'bg-primary text-white' },
  { id: 'completed', label: 'Completed', color: 'bg-slate-700 text-white' }
];

const PACKAGES: ResearchPackage[] = [
  {
    id: 'basic',
    name: 'Basic Research',
    price: '₹499',
    priceVal: 499,
    timeline: '3 Days',
    badge: 'Startup Starter',
    color: 'from-blue-50 to-indigo-50 border-blue-200 text-blue-700',
    scope: ['Core Market Analysis', '2 Competitor Profiles', 'Basic SWOT Analysis', 'Standard CapEx Projections'],
    deliverables: ['Executive Summary', 'Market Overview', 'SWOT Analysis', 'Marketing Strategy', 'Launch Roadmap'],
    support: 'Email Support',
    revision: '1 Free Revision'
  },
  {
    id: 'professional',
    name: 'Professional Research',
    price: '₹19,999',
    priceVal: 19999,
    timeline: '5 Days',
    badge: 'SME Favorite',
    color: 'from-cyan-50 to-blue-50 border-cyan-200 text-cyan-700',
    scope: ['Detailed Market Demographics', '5 Detailed Competitor Profiles', 'Local Legal & Compliance Guide', 'Investment Cost Analysis'],
    deliverables: ['Executive Summary', 'Market Overview', 'Competitor Analysis', 'Financial Analysis', 'SWOT Analysis', 'Marketing Strategy', 'Sales Strategy', 'Launch Roadmap'],
    support: 'Chat & Email Support',
    revision: '2 Free Revisions'
  },
  {
    id: 'premium',
    name: 'Premium Research',
    price: '₹9,999',
    priceVal: 9999,
    timeline: '7 Days',
    badge: 'Popular • Enterprise Growth',
    color: 'from-indigo-50 to-violet-50 border-indigo-200 text-indigo-700',
    scope: ['Comprehensive Primary & Secondary Data', '10 In-depth Competitor Profiles', '3 Location Suitability Micro-studies', 'Comprehensive Financial Projections (CapEx, OpEx, Working Capital)'],
    deliverables: ['Full 21-part PDF Report', 'Location Intelligence Audit', 'Working Capital & Break-even Model', '90-Day Step-by-Step Action Plan', 'Recommended Services Integration', 'Appendices & Direct Datasets'],
    support: 'Dedicated Analyst, 24/7 Priority Support',
    revision: 'Unlimited Revisions (14 days)'
  },
  {
    id: 'enterprise',
    name: 'Enterprise Research',
    price: '₹19,999',
    priceVal: 19999,
    timeline: '10 Days',
    badge: 'Executive Standard',
    color: 'from-purple-50 to-pink-50 border-purple-200 text-purple-700',
    scope: ['Pan-India Industrial Value Mapping', 'Full Manufacturing Cost-Breakdowns', 'Wholesale Margin Analyses', 'Customs, Tariff, and Export-Import Audit'],
    deliverables: ['Full 21-part Report + Clean Investor Pitch Deck', 'Supply Chain Map & Vendor Selection Layout', 'Exhaustive Risk Mitigation Matrix', 'Dedicated Legal Regulatory Review Document'],
    support: 'Dedicated Senior Analyst, Weekly Review Calls',
    revision: 'Unlimited Revisions (30 days)'
  },
  {
    id: 'corporate',
    name: 'Corporate Research',
    price: '₹49,999',
    priceVal: 49999,
    timeline: '15 Days',
    badge: 'Global Strategy',
    color: 'from-slate-50 to-zinc-50 border-slate-300 text-slate-800',
    scope: ['Pan-India Primary Field Survey', 'Full Competitor Brand Perception Audits', 'Raw Structured Dataset Export', 'Comprehensive Regulatory Counsel Briefing'],
    deliverables: ['Complete Corporate Strategy Suite', 'M&A Opportunity Map', 'Interactive Dynamic Financial Simulator Sheet', 'Raw Primary Datasets & Expert Interviews Log'],
    support: 'Executive Director Supervision, Daily Consultation Calls',
    revision: 'Lifetime Revisions (60 days)'
  }
];

export default function PremiumResearch() {
  const { user, role } = useAuth();
  const { showToast } = useToast();
  
  // Simulated or Active perspective role (Customer, Researcher, QA Reviewer)
  const [activeRole, setActiveRole] = useState<'customer' | 'researcher' | 'admin'>('customer');
  
  // Set default role perspective based on Auth role if available
  useEffect(() => {
    if (role === 'admin' || role === 'superadmin') {
      setActiveRole('admin');
    } else if (role === 'researcher') {
      setActiveRole('researcher');
    } else {
      setActiveRole('customer');
    }
  }, [role]);

  // Firestore Sync State
  const [tickets, setTickets] = useState<ResearchTicket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Flow State (Customer)
  const [currentStep, setCurrentStep] = useState<number>(1); // 1: Select Package, 2: Request Form, 3: Upload Docs, 4: Payment & Review, 5: Ticket Success
  const [selectedPackage, setSelectedPackage] = useState<ResearchPackage>(PACKAGES[2]); // Default Premium
  
  // Request Form Fields
  const [formFields, setFormFields] = useState({
    businessCategory: '',
    investment: '₹10 Lakhs - ₹25 Lakhs',
    country: 'India',
    state: '',
    city: '',
    pinCode: '',
    targetCustomers: '',
    businessType: 'Manufacturing',
    businessGoal: '',
    specialRequirements: ''
  });

  // Draft loading and saving
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const draft = await formDraftsDB.getDraft('premium_research_form');
        if (draft) {
          setFormFields(draft);
          showToast('Draft loaded from local storage.', 'success');
        }
      } catch (err) {
        console.warn('Failed to load draft from IndexedDB:', err);
      }
    };
    loadDraft();
  }, []);

  useEffect(() => {
    const saveDraft = async () => {
      try {
        await formDraftsDB.saveDraft('premium_research_form', formFields);
      } catch (err) {
        console.warn('Failed to save draft to IndexedDB:', err);
      }
    };
    // Debounce or just save directly since this is simple
    const timeout = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timeout);
  }, [formFields]);

  const handleNextStep = (step: number) => {
    triggerHapticFeedback('light');
    setCurrentStep(step);
  };

  // Files State
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string; category: string }[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileCategory, setSelectedFileCategory] = useState('Business Documents');

  // Checkout Modal / Payment state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'razorpay' | 'stripe' | 'paytm'>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);

  // Research Ticket Details
  const [newTicketNo, setNewTicketNo] = useState('');
  const [newOrderId, setNewOrderId] = useState('');

  // Team View States
  const [internalNoteInput, setInternalNoteInput] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [selectedTicketTab, setSelectedTicketTab] = useState<'status' | 'findings' | 'comments' | 'documents'>('status');

  // Findings Input (For Researchers)
  const [findingsFields, setFindingsFields] = useState({
    marketSize: '',
    competitors: '',
    financialEstimates: '',
    swotAnalysis: '',
    roadmap: '',
    locationAnalysis: '',
    customAnswers: ''
  });

  // Firestore Snapshot Sync
  useEffect(() => {
    if (!user) return;

    let q;
    if (activeRole === 'customer') {
      // Customers can only view their own tickets
      q = query(collection(db, 'research_tickets'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    } else {
      // Researchers and Admins can view everything
      q = query(collection(db, 'research_tickets'), orderBy('createdAt', 'desc'));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ticketsData: ResearchTicket[] = [];
      snapshot.forEach((doc) => {
        ticketsData.push({ id: doc.id, ...doc.data() } as ResearchTicket);
      });
      setTickets(ticketsData);
      setLoadingTickets(false);
    }, (error) => {
      console.error("Error listening to research tickets:", error);
      // Fallback placeholder data if Firestore permissions or collection is not ready yet
      setLoadingTickets(false);
    });

    return () => unsubscribe();
  }, [user, activeRole]);

  // Load ticket details when selected
  const selectedTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0];

  useEffect(() => {
    if (selectedTicket && selectedTicket.findings) {
      setFindingsFields({
        marketSize: selectedTicket.findings.marketSize || '',
        competitors: selectedTicket.findings.competitors || '',
        financialEstimates: selectedTicket.findings.financialEstimates || '',
        swotAnalysis: selectedTicket.findings.swotAnalysis || '',
        roadmap: selectedTicket.findings.roadmap || '',
        locationAnalysis: selectedTicket.findings.locationAnalysis || '',
        customAnswers: selectedTicket.findings.customAnswers || ''
      });
    } else {
      setFindingsFields({
        marketSize: '',
        competitors: '',
        financialEstimates: '',
        swotAnalysis: '',
        roadmap: '',
        locationAnalysis: '',
        customAnswers: ''
      });
    }
  }, [selectedTicketId, selectedTicket]);

  // Drag & Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const newFiles = Array.from(files).map(file => ({
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      category: selectedFileCategory
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
    showToast(`Successfully added document: ${files[0].name}`, 'success');
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Payment Simulation & Firestore Writes
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast("Please log in to continue.", "error");
      return;
    }

    setProcessingPayment(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const result = await triggerPaymentSuccessWorkflow({
        user: {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'Enterprise User'
        },
        selectedPackage: {
          id: selectedPackage.id,
          name: selectedPackage.name,
          price: selectedPackage.price,
          priceVal: selectedPackage.priceVal,
          timeline: selectedPackage.timeline
        },
        formFields: {
          businessCategory: formFields.businessCategory,
          businessType: formFields.businessType,
          investment: formFields.investment,
          city: formFields.city,
          state: formFields.state,
          country: formFields.country,
          pinCode: formFields.pinCode
        },
        uploadedFiles,
        paymentMethod
      });

      // Update local states
      setNewTicketNo(result.ticketNo);
      setNewOrderId(result.orderId);
      setProcessingPayment(false);
      setShowPaymentModal(false);
      handleNextStep(5); // Move to Success confirm screen
      showToast("Payment processed & Research ticket generated successfully!", "success");
      
      // Track in Firebase Analytics
      if (analytics) {
        logEvent(analytics, 'research_purchased', {
          ticketNo: result.ticketNo,
          orderId: result.orderId,
          packageName: selectedPackage.name,
          price: selectedPackage.price,
          currency: 'INR'
        });
        logEvent(analytics, 'payment_success', {
          itemType: 'research',
          itemId: selectedPackage.id,
          amount: selectedPackage.priceVal,
          method: paymentMethod
        });
      }

      // Log Action
      logActivity(user.uid, 'ordered_premium_research', { ticketNo: result.ticketNo, packageName: selectedPackage.name });

    } catch (error) {
      console.error("Firestore operation failed:", error);
      showToast("Error processing order. Please check Firebase Rules configuration.", "error");
      setProcessingPayment(false);
    }
  };

  // Update Status Flow (Researchers & Admins)
  const handleUpdateStatus = async (nextStatus: string) => {
    if (!selectedTicket) return;
    try {
      const ticketRef = doc(db, 'research_tickets', selectedTicket.id);
      
      const newComment = {
        sender: user?.displayName || 'Expert Executive',
        senderRole: activeRole,
        message: `Stage transitioned to: ${STATUS_FLOW.find(s => s.id === nextStatus)?.label || nextStatus}`,
        timestamp: new Date().toISOString()
      };

      const historyLog = {
        ticketId: selectedTicket.id,
        ticketNumber: selectedTicket.ticketNumber,
        previousStatus: selectedTicket.status,
        newStatus: nextStatus,
        updatedBy: user?.displayName || 'Executive',
        createdAt: serverTimestamp()
      };

      await updateDoc(ticketRef, {
        status: nextStatus,
        updatedAt: serverTimestamp(),
        comments: [...(selectedTicket.comments || []), newComment]
      });

      // Log in research_history
      await addDoc(collection(db, 'research_history'), historyLog);

      // Create notification for customer
      await addDoc(collection(db, 'notifications'), {
        userId: selectedTicket.userId,
        title: `Research Update: ${STATUS_FLOW.find(s => s.id === nextStatus)?.label}`,
        message: `Your business research report for ${selectedTicket.businessCategory} is now at the "${STATUS_FLOW.find(s => s.id === nextStatus)?.label}" phase.`,
        type: 'info',
        read: false,
        createdAt: serverTimestamp()
      });

      // Special QA workflow transition
      if (nextStatus === 'qa_review') {
        // 1. Find and update research_orders document status to 'research_qa'
        if (selectedTicket.orderId) {
          try {
            const ordersQ = query(collection(db, 'research_orders'), where('orderId', '==', selectedTicket.orderId));
            const ordersSnap = await getDocs(ordersQ);
            ordersSnap.forEach(async (orderDoc) => {
              await updateDoc(doc(db, 'research_orders', orderDoc.id), {
                status: 'research_qa',
                updatedAt: serverTimestamp()
              });
            });
          } catch (err) {
            console.error("Failed to update research_orders status:", err);
          }
        }

        // 2. Send notification to the assigned QA Lead
        const qaLeadName = selectedTicket.assignedQALead || 'Pooja Patel (Quality Assurance Director)';
        try {
          await addDoc(collection(db, 'notifications'), {
            userId: qaLeadName, // Assigned QA Lead identifier
            title: 'New Report Submitted for QA Review',
            message: `Report for Ticket ${selectedTicket.ticketNumber} (${selectedTicket.businessCategory}) has been submitted for QA audit.`,
            type: 'warning',
            read: false,
            createdAt: serverTimestamp()
          });
        } catch (err) {
          console.error("Failed to send QA lead notification:", err);
        }
      }

      // Trigger external Email and WhatsApp alerts for specific stages
      if (nextStatus === 'qa_review' || nextStatus === 'completed') {
        notifyResearchStageUpdate(
          selectedTicket.id,
          selectedTicket.ticketNumber,
          selectedTicket.userEmail || user?.email || '',
          selectedTicket.userName || user?.displayName || '',
          nextStatus
        );
      }

      showToast(`Status updated to ${STATUS_FLOW.find(s => s.id === nextStatus)?.label}`, 'success');
    } catch (err) {
      console.error(err);
      showToast("Error updating status. Verify permissions.", "error");
    }
  };

  // Assign Executive
  const handleAssignExecutive = async (executiveName: string) => {
    if (!selectedTicket) return;
    try {
      const ticketRef = doc(db, 'research_tickets', selectedTicket.id);
      await updateDoc(ticketRef, {
        assignedExecutive: executiveName,
        status: 'assigned',
        updatedAt: serverTimestamp()
      });
      showToast(`Assigned successfully to ${executiveName}`, 'success');
    } catch (err) {
      console.error(err);
      showToast("Assignment failed.", "error");
    }
  };

  // Save Findings
  const handleSaveFindings = async () => {
    if (!selectedTicket) return;
    try {
      const ticketRef = doc(db, 'research_tickets', selectedTicket.id);
      await updateDoc(ticketRef, {
        findings: findingsFields,
        updatedAt: serverTimestamp()
      });
      showToast("Research findings saved successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to save findings.", "error");
    }
  };

  // Save Internal Notes
  const handleSaveInternalNotes = async () => {
    if (!selectedTicket) return;
    try {
      const ticketRef = doc(db, 'research_tickets', selectedTicket.id);
      await updateDoc(ticketRef, {
        internalNotes: internalNoteInput,
        updatedAt: serverTimestamp()
      });
      showToast("Internal notes updated successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to update internal notes.", "error");
    }
  };

  // Add Public Chat Comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !selectedTicket) return;

    try {
      const ticketRef = doc(db, 'research_tickets', selectedTicket.id);
      const newComment = {
        sender: user?.displayName || 'User',
        senderRole: activeRole,
        message: commentInput,
        timestamp: new Date().toISOString()
      };

      await updateDoc(ticketRef, {
        comments: [...(selectedTicket.comments || []), newComment],
        updatedAt: serverTimestamp()
      });

      // Write to research_comments collection
      await addDoc(collection(db, 'research_comments'), {
        ticketId: selectedTicket.id,
        senderId: user?.uid || '',
        senderName: user?.displayName || 'User',
        senderRole: activeRole,
        message: commentInput,
        createdAt: serverTimestamp()
      });

      setCommentInput('');
      showToast("Message added successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to post message.", "error");
    }
  };

  const handleSendCommentDirect = async (message: string) => {
    const activeId = selectedTicketId || (tickets.length > 0 ? tickets[0].id : null);
    if (!activeId) return;
    const ticketDoc = tickets.find(t => t.id === activeId);
    if (!ticketDoc) return;
    try {
      const ticketRef = doc(db, 'research_tickets', activeId);
      const newComment = {
        sender: user?.displayName || 'User',
        senderRole: activeRole,
        message: message,
        timestamp: new Date().toISOString()
      };
      await updateDoc(ticketRef, {
        comments: [...(ticketDoc.comments || []), newComment],
        updatedAt: serverTimestamp()
      });
      // Also write to research_comments collection
      await addDoc(collection(db, 'research_comments'), {
        ticketId: activeId,
        senderId: user?.uid || '',
        senderName: user?.displayName || 'User',
        senderRole: activeRole,
        message: message,
        createdAt: serverTimestamp()
      });
      showToast("Message sent to analyst successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to send message.", "error");
    }
  };

  // Complete PDF report generation matching requested 21-part structure!
  const handleDownloadReportPDF = (ticket: ResearchTicket) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const primaryColor = [37, 99, 235]; // #2563eb
    const darkSlate = [15, 23, 42]; // #0f172a
    const lightSlate = [248, 250, 252]; // #f8fafc

    const businessName = ticket.businessCategory || "Premium Venture";
    const type = ticket.businessType || "Manufacturing";
    const loc = ticket.location || "India";
    const cap = ticket.investment || "₹25 Lakhs";
    
    // Cover Page
    doc.setFillColor(darkSlate[0], darkSlate[1], darkSlate[2]);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Draw decorative gold/blue lines
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 100, 12, 100, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(28);
    doc.text("BIZNXT 3.0", 30, 80);
    
    doc.setFontSize(22);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("PREMIUM BUSINESS FEASIBILITY", 30, 95);
    doc.text("& MARKET RESEARCH REPORT", 30, 107);
    
    doc.setFillColor(51, 65, 85);
    doc.rect(30, 120, 150, 1, 'F');
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(200, 200, 200);
    doc.text(`Venture Scope: ${businessName} (${type})`, 30, 135);
    doc.text(`Proposed Location: ${loc}`, 30, 145);
    doc.text(`Estimated CapEx Target: ${cap}`, 30, 155);
    
    doc.setFont("Helvetica", "italic");
    doc.setFontSize(11);
    doc.setTextColor(150, 150, 150);
    doc.text(`Ticket Number: ${ticket.ticketNumber}`, 30, 220);
    doc.text(`Order ID: ${ticket.orderId}`, 30, 230);
    doc.text(`Date of Issue: ${new Date().toISOString().split('T')[0]}`, 30, 240);
    doc.text("Certified Enterprise Grade Document • Strictly Confidential", 30, 250);
    
    // Add page tracker function
    let pageNum = 1;
    const addHeaderFooter = (title: string) => {
      doc.addPage();
      pageNum++;
      
      // Elegant running header
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("BIZNXT 3.0 PREMIUM RESEARCH MATRIX", 20, 15);
      
      doc.setFont("Helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(title.toUpperCase(), 120, 15);
      
      doc.setFillColor(226, 232, 240);
      doc.rect(20, 18, 170, 0.5, 'F');
      
      // Running Footer
      doc.rect(20, 275, 170, 0.5, 'F');
      doc.setFontSize(8);
      doc.text("STRICTLY CONFIDENTIAL • BIZNXT PREMIUM INTELLIGENCE", 20, 282);
      doc.text(`Page ${pageNum} of 8`, 175, 282);
    };

    // Helper to format structured paragraphs
    const addSectionBlock = (yStart: number, header: string, bodyText: string) => {
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
      doc.text(header, 20, yStart);
      
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      const splitLines = doc.splitTextToSize(bodyText, 170);
      doc.text(splitLines, 20, yStart + 6);
      return yStart + 12 + (splitLines.length * 4.5);
    };

    // PAGE 2: Table of Contents & Executive Summary
    addHeaderFooter("Table of Contents");
    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
    doc.text("1. Table of Contents & Structure", 20, 30);
    
    const indexItems = [
      "1. Cover Page & Structure Guide",
      "2. Executive Summary & Core Opportunities",
      "3. Detailed Market Overview & Industry Dimensions",
      "4. Location Intelligence & Geographic Suite",
      "5. Competitor Overview & Competitive Landscapes",
      "6. Investment Estimates, Working Capital & Revenue Projections",
      "7. Break-even Analyses & SWOT Matrix Risks",
      "8. Sales/Marketing Launch, Legal Limits & Databases"
    ];
    
    let indexY = 40;
    indexItems.forEach((item, index) => {
      doc.setFont("Helvetica", index === 1 ? "bold" : "normal");
      doc.setFontSize(11);
      doc.text(item, 25, indexY);
      doc.text(". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .", 75, indexY);
      doc.text(`Page 0${index + 1}`, 175, indexY);
      indexY += 10;
    });

    addSectionBlock(
      130, 
      "2. Executive Summary", 
      `This enterprise research validates the feasibility for launching a high-growth "${type}" business model in the "${businessName}" space. Rooted in structured localized statistics within ${loc}, the sector exhibits robust demand drivers including expanding middle-class consumption budgets and digital service integration. With a target CapEx pool of ${cap}, the break-even model shows positive net cash balance occurring swiftly by year two.`
    );

    // PAGE 3: Business Opportunity & Market Overview
    addHeaderFooter("Market Overview");
    
    let y3 = 30;
    y3 = addSectionBlock(
      y3,
      "3. Business Opportunity",
      `The target landscape within ${loc} presents an untapped goldmine for a modernized "${type}" operation. Market entry barriers are neutralized through superior automation, high-quality white-label alternatives, and scalable logistics pipelines. There is a distinct, measurable market void for a service prioritizing customer trust, localized compliance, and strict supply chain reliability.`
    );

    y3 = addSectionBlock(
      y3,
      "4. Market Overview",
      ticket.findings?.marketSize || 
      `The broad market is exhibiting a year-over-year expansion rate of 14.8%. The addressable market is valued at roughly ₹450 Crores, with active demand scaling heavily in urban and semi-urban clusters. Demographic filters indicate a high customer concentration in the 22-45 age bracket, characterized by tech literacy and rising disposable income indices.`
    );

    y3 = addSectionBlock(
      y3,
      "5. Industry Overview",
      `Under India's MSME initiatives, CGTMSE credit schemes, and regional state industrial plans, the industry is entering a highly subsidized consolidation phase. Organized players comprise only 28% of the market share, leaving a massive 72% fragmentation tier ready for capture by structured, digitally integrated brands like BizNxt clients.`
    );

    // PAGE 4: Location Intelligence & Competition
    addHeaderFooter("Location Intelligence");
    
    let y4 = 30;
    y4 = addSectionBlock(
      y4,
      "6. Location Intelligence",
      ticket.findings?.locationAnalysis ||
      `Geographic analysis for "${loc}" reveals optimal traffic patterns, proximity to logistical transport hubs, and localized labor density. The PIN Code zone correlates with low commercial rental yields relative to footfall potential, providing an immediate 18% savings on operational overhead. Infrastructure capacity (power, high-speed fiber, water lines) is verified ready.`
    );

    y4 = addSectionBlock(
      y4,
      "7. Competition Overview",
      ticket.findings?.competitors ||
      `Direct competition includes 3-4 unorganized local players and 1 major regional franchise brand. The major competitor suffers from long order backlogs, outdated service delivery protocols, and weak digital branding. Positioning BIZNXT's customized "${type}" setup directly targets this service speed void.`
    );

    // PAGE 5: Investment Estimate & Capital Modeling
    addHeaderFooter("Financial Structure");
    
    let y5 = 30;
    y5 = addSectionBlock(
      y5,
      "8. Investment Estimate (CapEx Breakdown)",
      `Total project CapEx setup is estimated at ${cap}. Primary capital utilization involves:
• Infrastructure, Interiors & Setup: 35%
• Machinery, Licenses, & Hardware: 40%
• Brand Marketing & Launch Acquisition: 15%
• Unforeseen Contingency Pool: 10%`
    );

    y5 = addSectionBlock(
      y5,
      "9. Working Capital Model",
      `Working capital targets are modeled for an optimal 90-day cash cycle. Net monthly OpEx is pegged at 18% of CapEx. Recommended dynamic reserves stand at 4 months of buffer liquidity to neutralize seasonal demand variations during raw material supply disruptions.`
    );

    y5 = addSectionBlock(
      y5,
      "10. Revenue Assumptions",
      ticket.findings?.financialEstimates ||
      `• Moderate-Case Scenario: Year 1 gross revenue reaches ₹48 Lakhs, scaling to ₹1.2 Crores by Year 2.
• Target Net Operating Profit Margin: 24.5% after accounting for localized cost of goods sold (COGS) and client acquisition funnels.`
    );

    // PAGE 6: Break-even & SWOT Analysis
    addHeaderFooter("Risk Analysis");
    
    let y6 = 30;
    y6 = addSectionBlock(
      y6,
      "11. Break-even Scenarios",
      `Standard break-even analysis indicates the venture crosses the critical cash-neutral benchmark in Month 11 post-launch. Max cumulative loss is projected to bottom out in Month 5 before swinging into a positive cash-generation curve.`
    );

    y6 = addSectionBlock(
      y6,
      "12. Business Risks",
      `• Supply Chain Congestion: Raw material pricing fluctuation. (Mitigated through multi-vendor supply arrangements).
• Talent Attrition: Regulatory talent gaps. (Mitigated via standardized digital operational playbooks and performance incentives).`
    );

    y6 = addSectionBlock(
      y6,
      "13. SWOT Analysis Matrix",
      ticket.findings?.swotAnalysis ||
      `• STRENGTHS: Customized localized branding, modern logistics framework, low operational cost structure.
• WEAKNESSES: New brand trust cycle, localized regulatory registration lead times.
• OPPORTUNITIES: Strategic partnerships with regional SMEs, scaling into B2B exports.
• THREATS: Aggressive pricing tactics from legacy competitors, rapid changes in regional tax laws.`
    );

    // PAGE 7: Marketing & Sales Strategies
    addHeaderFooter("Growth Blueprint");
    
    let y7 = 30;
    y7 = addSectionBlock(
      y7,
      "14. Marketing Strategy",
      `The launch campaign integrates digital micro-targeting across localized social platforms combined with high-impact community offline launches. Hyperlocal SEO optimization and regional MSME business listings will drive direct customer discovery pipelines from Day 1.`
    );

    y7 = addSectionBlock(
      y7,
      "15. Sales Strategy",
      `Focus on highly competitive subscription service agreements, bulk client onboardings, and loyalty structures. Offering a frictionless 100% digital billing/checkout interface (powered by BizNxt's platform tools) increases client retention metrics by 32%.`
    );

    y7 = addSectionBlock(
      y7,
      "16. Launch Roadmap",
      ticket.findings?.roadmap ||
      `• Weeks 1-2: Legal entity formation, state MSME filing, licensing, physical space acquisition.
• Weeks 3-4: Tech integrations, vendor tie-ups, core setup, initial branding.
• Weeks 5-6: Beta run, staff dry runs, digital launch, localized SEO go-live.`
    );

    // PAGE 8: Action Plan, Recommendations & Disclaimer
    addHeaderFooter("Operational Steps");
    
    let y8 = 30;
    y8 = addSectionBlock(
      y8,
      "17. 90-Day Action Plan",
      `• Days 1-30: Secure structural permissions, complete GST & trademark filings, deploy physical interior setups.
• Days 31-60: Onboard initial staff, initiate localized digital marketing, launch soft-launch service operations.
• Days 61-90: Scale client acquisition, initiate regional brand expansion reviews, optimize working capital margins.`
    );

    y8 = addSectionBlock(
      y8,
      "18. Recommended Services Integration",
      `To optimize launch timeline, the client is highly advised to immediately activate these platform modules:
1. BizNxt MSME Registration Desk
2. Unified UPI payment gateway credentials
3. CGTMSE Business Loan Eligibility tool`
    );

    y8 = addSectionBlock(
      y8,
      "19. Appendices",
      `Includes detailed regional demographics spreadsheets, commercial rent index metrics, direct vendor catalogs, and primary market questionnaire datasets archived under BizNxt Ticket: ${ticket.ticketNumber}.`
    );

    y8 = addSectionBlock(
      y8,
      "20. Disclaimer & Legal Limits",
      "BIZNXT 3.0 research documents are prepared as objective informational models based on secondary data feeds and localized samples. Final corporate decisions, risk allocations, and regulatory reviews are the sole responsibility of the client. BizNxt holds no liability for specific investment returns."
    );

    y8 = addSectionBlock(
      y8,
      "21. Sourcing References & Verified Databases",
      "• MCA Business Registers, Ministry of Corporate Affairs, Govt of India\n• MSME Samadhaan database registers & CGTMSE credit schemes lists\n• National Sample Survey Office (NSSO) regional retail indices\n• Google Maps Places API location-density footprint maps\n• RBI Financial stability annual bulletins and industrial reports."
    );

    doc.save(`BIZNXT_Premium_Research_${ticket.ticketNumber}.pdf`);
    showToast(`PDF Report generated for Ticket ${ticket.ticketNumber}!`, 'success');
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      {/* Simulation Persona Bar */}
      <div className="bg-slate-900 text-white px-4 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 text-xs font-medium z-40">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2.5 h-2.5 rounded-2xl bg-primary animate-pulse" />
          <span className="text-slate-400">BizNxt 3.0 Platform Tester Dashboard:</span>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setActiveRole('customer')}
            className={`px-3 py-1 rounded-md transition-all ${activeRole === 'customer' ? 'bg-primary text-white shadow' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'}`}
          >
            Customer Hub
          </button>
          <button 
            onClick={() => {
              setActiveRole('researcher');
              setSelectedTicketId(tickets[0]?.id || null);
            }}
            className={`px-3 py-1 rounded-md transition-all ${activeRole === 'researcher' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'}`}
          >
            Research Team
          </button>
          <button 
            onClick={() => {
              setActiveRole('admin');
              setSelectedTicketId(tickets[0]?.id || null);
            }}
            className={`px-3 py-1 rounded-md transition-all ${activeRole === 'admin' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'}`}
          >
            Quality Team (QA / Admin)
          </button>
        </div>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Banner */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary rounded-2xl">
                Core Revenue Module
              </span>
              <span className="text-slate-500 text-xs">•</span>
              <span className="text-xs text-slate-500 font-mono">Enterprise Level 3.0</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-slate-900 mt-1">
              Premium Business Research Engine
            </h1>
            <p className="text-slate-500 mt-1">
              Obtain verified, custom, enterprise-grade business research reports designed by top financial analysts.
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-500">Current active view</p>
              <p className="text-sm font-bold text-slate-800 capitalize">{activeRole} Workspace</p>
            </div>
            <div className={`p-2.5 rounded-2xl ${
              activeRole === 'customer' ? 'bg-primary/10 text-primary' : 
              activeRole === 'researcher' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              <Shield className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* ======================= CUSTOMER WORKSPACE ======================= */}
        {activeRole === 'customer' && (
          <div className="space-y-12">
            
            {/* Step Wizard Header */}
            {currentStep < 5 && (
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between">
                  {[
                    { step: 1, label: 'Select Package' },
                    { step: 2, label: 'Venture Details' },
                    { step: 3, label: 'Upload Files' },
                    { step: 4, label: 'Payment' }
                  ].map((s) => (
                    <div key={s.step} className="flex flex-col items-center flex-1 relative">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition-all border ${
                        currentStep === s.step 
                          ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-110' 
                          : currentStep > s.step 
                          ? 'bg-emerald-500 border-emerald-500 text-white' 
                          : 'bg-white border-slate-200 text-slate-500'
                      }`}>
                        {currentStep > s.step ? <Check className="w-5 h-5" /> : s.step}
                      </div>
                      <span className={`text-xs mt-2 font-medium ${currentStep === s.step ? 'text-primary font-bold' : 'text-slate-500'}`}>
                        {s.label}
                      </span>
                      {s.step < 4 && (
                        <div className={`absolute top-5 left-[calc(50%+20px)] right-[calc(-50%+20px)] h-[2px] -z-10 ${
                          currentStep > s.step ? 'bg-emerald-500' : 'bg-slate-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Packages */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-fadeIn">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900 font-display">Choose Research Package</h2>
                  <p className="text-slate-500 text-sm">
                    Select a curated corporate package matching your budget and investment depth. All reports are verified by our Quality Assurance desk.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                  {PACKAGES.map((pkg) => {
                    const isPremium = pkg.id === 'premium';
                    return (
                      <div 
                        key={pkg.id} 
                        onClick={() => setSelectedPackage(pkg)}
                        className={`cursor-pointer rounded-3xl p-6 transition-all hover:scale-[1.02] flex flex-col justify-between relative ${
                          selectedPackage.id === pkg.id 
                            ? 'bg-white border-2 border-primary shadow-[8px_8px_16px_#c3cad5,-8px_-8px_16px_#ffffff]' 
                            : 'bg-white border border-slate-200 shadow-[4px_4px_8px_#c3cad5,-4px_-4px_8px_#ffffff]'
                        }`}
                      >
                        {pkg.badge && (
                          <span className={`absolute -top-3 left-4 px-2 py-0.5 text-[10px] font-bold rounded-2xl border ${pkg.color}`}>
                            {pkg.badge}
                          </span>
                        )}
                        
                        <div>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{pkg.id} tier</p>
                          <h3 className="text-xl font-bold text-slate-900 mt-2 font-display">{pkg.name}</h3>
                          
                          <div className="my-4">
                            <span className="text-3xl font-extrabold text-slate-900">{pkg.price}</span>
                            <span className="text-xs text-slate-500 block mt-1">One-time processing fee</span>
                          </div>

                          <div className="space-y-3 py-4 border-t border-slate-100 text-xs">
                            <div className="flex items-center text-slate-600 font-medium">
                              <Clock className="w-3.5 h-3.5 text-primary mr-1.5 shrink-0" />
                              <span>Timeline: {pkg.timeline}</span>
                            </div>
                            <div className="flex items-center text-slate-600 font-medium">
                              <Shield className="w-3.5 h-3.5 text-accent mr-1.5 shrink-0" />
                              <span>Support: {pkg.support}</span>
                            </div>
                            <div className="flex items-center text-slate-600 font-medium">
                              <Star className="w-3.5 h-3.5 text-yellow-500 mr-1.5 shrink-0" />
                              <span>{pkg.revision}</span>
                            </div>
                          </div>

                          <div className="space-y-2 pt-2 text-xs">
                            <p className="font-bold text-slate-700">What's Included:</p>
                            <ul className="space-y-2 text-slate-500 pl-1">
                              {pkg.deliverables.slice(0, 3).map((d, i) => (
                                <li key={i} className="flex items-start gap-1">
                                  <Check className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                                  <span>{d}</span>
                                </li>
                              ))}
                              {pkg.deliverables.length > 3 && (
                                <li className="text-primary font-semibold text-[10px] pl-4">+{pkg.deliverables.length - 3} more strategic files</li>
                              )}
                            </ul>
                          </div>
                        </div>

                        <div className="mt-8 pt-4 border-t border-slate-100 space-y-3">
                          <button 
                            className={`w-full py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                              selectedPackage.id === pkg.id 
                                ? 'bg-primary text-white shadow-md' 
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {selectedPackage.id === pkg.id ? 'Selected' : 'Book Now'}
                          </button>
                          
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = '/contact';
                            }}
                            className="w-full py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50"
                          >
                            Talk to Expert
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Package details review */}
                <div className="bg-slate-100 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary hidden sm:block">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 font-display">Reviewing Selected Package: {selectedPackage.name}</h4>
                      <p className="text-xs text-slate-500 max-w-xl">
                        Comprehensive evaluation targeting: {selectedPackage.scope.join(', ')}. Guaranteed delivery by specialized research analyst within {selectedPackage.timeline}.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      handleNextStep(2);
                      if (analytics) {
                        logEvent(analytics, 'research_started', {
                          packageId: selectedPackage.id,
                          packageName: selectedPackage.name,
                          price: selectedPackage.price
                        });
                      }
                    }}
                    className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-sm transition-colors whitespace-nowrap self-end md:self-auto"
                  >
                    <span>Proceed to Business Form</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Request Form */}
            {currentStep === 2 && (
              <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
                <div className="bg-slate-900 text-white p-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent pointer-events-none" />
                  <h3 className="text-xl font-bold font-display">1. Describe Your Venture Scope</h3>
                  <p className="text-slate-500 text-xs mt-1">Our research deck tailors localized industry models directly from your fields.</p>
                </div>
                
                <form onSubmit={(e) => { e.preventDefault(); handleNextStep(3); }} className="p-8 space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Business Category *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Cloud Kitchen, EV Charging Hub, Agritech Export"
                        value={formFields.businessCategory}
                        onChange={(e) => setFormFields({...formFields, businessCategory: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Target CapEx Investment *</label>
                      <select 
                        value={formFields.investment}
                        onChange={(e) => setFormFields({...formFields, investment: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      >
                        <option>₹2 Lakhs - ₹5 Lakhs</option>
                        <option>₹5 Lakhs - ₹10 Lakhs</option>
                        <option>₹10 Lakhs - ₹25 Lakhs</option>
                        <option>₹25 Lakhs - ₹50 Lakhs</option>
                        <option>₹50 Lakhs - ₹1 Crore</option>
                        <option>₹1 Crore - ₹5 Crores</option>
                        <option>₹5 Crores +</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Country *</label>
                      <input 
                        type="text" 
                        required
                        value={formFields.country}
                        onChange={(e) => setFormFields({...formFields, country: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">State *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Karnataka"
                        value={formFields.state}
                        onChange={(e) => setFormFields({...formFields, state: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">City / Location *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Bangalore"
                        value={formFields.city}
                        onChange={(e) => setFormFields({...formFields, city: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">PIN Code / postal Code *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. 560001"
                        value={formFields.pinCode}
                        onChange={(e) => setFormFields({...formFields, pinCode: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Business Type *</label>
                      <select 
                        value={formFields.businessType}
                        onChange={(e) => setFormFields({...formFields, businessType: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      >
                        <option>Manufacturing</option>
                        <option>Trading</option>
                        <option>Import</option>
                        <option>Export</option>
                        <option>White Label</option>
                        <option>Private Label</option>
                        <option>OEM (Original Equipment Manufacturer)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Target Customers / Audience Demographics *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. B2B Corporate clients, Gen-Z fitness enthusiasts, Hyperlocal residents"
                      value={formFields.targetCustomers}
                      onChange={(e) => setFormFields({...formFields, targetCustomers: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Primary Business Goal *</label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="Describe what you want to achieve (e.g. Validate local demand, secure bank loan, benchmark major competitor pricing structures)"
                      value={formFields.businessGoal}
                      onChange={(e) => setFormFields({...formFields, businessGoal: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Special Requirements / Custom Directives (Optional)</label>
                    <textarea 
                      rows={2}
                      placeholder="List any specific datasets or compliance frameworks you absolutely need included in the final report."
                      value={formFields.specialRequirements}
                      onChange={(e) => setFormFields({...formFields, specialRequirements: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-100">
                    <button 
                      type="button"
                      onClick={() => handleNextStep(1)}
                      className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back to Packages</span>
                    </button>
                    
                    <button 
                      type="submit"
                      className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <span>Proceed to Document Upload</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 3: Document Upload */}
            {currentStep === 3 && (
              <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
                <div className="bg-slate-900 text-white p-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent pointer-events-none" />
                  <h3 className="text-xl font-bold font-display">2. Support Files & Reference Documents</h3>
                  <p className="text-slate-500 text-xs mt-1">Provide reference documents, space site layouts, trademark receipts or other context parameters.</p>
                </div>

                <div className="p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="w-full sm:w-1/2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Document Category</label>
                      <select 
                        value={selectedFileCategory}
                        onChange={(e) => setSelectedFileCategory(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none"
                      >
                        <option>Business Documents</option>
                        <option>Identity Proof</option>
                        <option>Reference Files</option>
                        <option>Site / Space Images</option>
                        <option>Other Documents</option>
                      </select>
                    </div>
                    <div className="text-xs text-slate-500 text-center sm:text-left">
                      Select document type first before drag & drop.
                    </div>
                  </div>

                  {/* Drag and Drop Container */}
                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all ${
                      dragActive ? 'border-primary bg-primary/5' : 'border-slate-300 hover:border-slate-400 bg-slate-50'
                    }`}
                  >
                    <Upload className="w-10 h-10 text-slate-500 mb-3" />
                    <p className="text-sm font-bold text-slate-800">Drag & Drop your file here</p>
                    <p className="text-xs text-slate-500 mt-1">Supports PDF, DOCX, JPEG, PNG up to 10MB</p>
                    
                    <div className="mt-4">
                      <input 
                        type="file" 
                        id="file-upload" 
                        multiple 
                        onChange={handleFileInput}
                        className="hidden" 
                      />
                      <label 
                        htmlFor="file-upload"
                        className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl text-xs cursor-pointer shadow-sm transition-colors"
                      >
                        Select File Manually
                      </label>
                    </div>
                  </div>

                  {/* Uploaded File List */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Queue for Upload:</h4>
                      <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                        {uploadedFiles.map((f, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3.5 text-xs">
                            <div className="flex items-center space-x-2.5">
                              <FileText className="w-4 h-4 text-primary shrink-0" />
                              <div className="truncate max-w-[280px]">
                                <p className="font-bold text-slate-800 truncate">{f.name}</p>
                                <p className="text-[10px] text-slate-500">{f.size} • <span className="text-indigo-600 font-medium">{f.category}</span></p>
                              </div>
                            </div>
                            <button 
                              type="button"
                              onClick={() => removeUploadedFile(idx)}
                              className="p-1.5 text-slate-500 hover:text-red-500 rounded-2xl hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between pt-4 border-t border-slate-100">
                    <button 
                      type="button"
                      onClick={() => handleNextStep(2)}
                      className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back to Details</span>
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => handleNextStep(4)}
                      className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <span>Proceed to Payment</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Summary & Payment Select */}
            {currentStep === 4 && (
              <div className="max-w-3xl mx-auto grid md:grid-cols-5 gap-6 items-start animate-fadeIn">
                
                {/* Summary column */}
                <div className="md:col-span-3 bg-white border border-slate-200 rounded-3xl p-6 space-y-6">
                  <h3 className="text-lg font-bold font-display text-slate-900 border-b border-slate-100 pb-3">
                    Order Verification & Summary
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-slate-500 font-medium">Business Category</p>
                      <p className="font-bold text-slate-800 mt-0.5">{formFields.businessCategory || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 font-medium">Target CapEx Target</p>
                      <p className="font-bold text-slate-800 mt-0.5">{formFields.investment}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 font-medium">Geographic Location</p>
                      <p className="font-bold text-slate-800 mt-0.5">
                        {formFields.city || 'Delhi'}, {formFields.state || 'DL'} ({formFields.pinCode || '110001'})
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 font-medium">Model Classification</p>
                      <p className="font-bold text-slate-800 mt-0.5">{formFields.businessType}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 text-xs space-y-2">
                    <p className="font-bold text-slate-700">Identified Objectives:</p>
                    <p className="text-slate-600 italic">"{formFields.businessGoal || 'Secure custom feasibility validations and SWOT analytics matrices.'}"</p>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-700">Uploaded Attachments ({uploadedFiles.length})</p>
                      <div className="flex flex-wrap gap-2">
                        {uploadedFiles.map((f, i) => (
                          <span key={i} className="px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-2xl text-[10px] font-semibold max-w-[180px] truncate">
                            {f.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between pt-4 border-t border-slate-100">
                    <button 
                      type="button"
                      onClick={() => handleNextStep(3)}
                      className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back to Files</span>
                    </button>
                  </div>
                </div>

                {/* Checkout card */}
                <div className="md:col-span-2 bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xl">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent opacity-50 pointer-events-none" />
                  
                  <h3 className="text-lg font-bold font-display relative z-10">Premium Bill Desk</h3>
                  <p className="text-slate-500 text-xs mt-1 relative z-10">Instant order processing upon verification.</p>

                  <div className="my-6 py-4 border-y border-white/10 relative z-10 space-y-3">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>{selectedPackage.name} tier</span>
                      <span className="font-mono">{selectedPackage.price}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>SME Validation Charge</span>
                      <span className="text-emerald-400 font-bold">FREE</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold pt-3 border-t border-white/5">
                      <span>Total Amount</span>
                      <span className="text-primary-light font-mono text-base">{selectedPackage.price}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6 relative z-10">
                    <p className="text-xs font-bold text-slate-400">Select Secure Gateway:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'upi', label: 'UPI / GPay' },
                        { id: 'razorpay', label: 'Razorpay' },
                        { id: 'paytm', label: 'Paytm Business' },
                        { id: 'stripe', label: 'Stripe' }
                      ].map((pay) => (
                        <button 
                          key={pay.id}
                          onClick={() => setPaymentMethod(pay.id as any)}
                          className={`py-2 rounded-2xl text-[10px] font-bold border transition-all ${
                            paymentMethod === pay.id 
                              ? 'bg-white text-slate-900 border-white font-extrabold' 
                              : 'bg-white/5 text-slate-500 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {pay.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      if (!formFields.businessCategory.trim()) {
                        showToast("Please enter a Business Category in Step 2.", "error");
                        handleNextStep(2);
                        return;
                      }
                      setShowPaymentModal(true);
                    }}
                    className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 relative z-10"
                  >
                    <span>Authorize Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[10px] text-slate-500 mt-4 text-center">
                    Authorized and secured via RBI-compliant 256-bit encryption pipelines.
                  </p>
                </div>
              </div>
            )}

            {/* Step 5: Order Created Success Screen */}
            {currentStep === 5 && (
              <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-6 shadow-xl animate-scaleUp">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-md">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>

                <div className="space-y-2">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-2xl border border-emerald-100">
                    Active Ticket Live
                  </span>
                  <h2 className="text-2xl font-bold font-display text-slate-900 mt-2">
                    Research Order Completed Successfully
                  </h2>
                  <p className="text-slate-500 text-xs">
                    Your payment of <span className="font-bold text-slate-800">{selectedPackage.price}</span> has been processed. Our expert SME research desk has initiated work.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-3 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Order ID:</span>
                    <span className="font-bold text-slate-800">{newOrderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Research Ticket:</span>
                    <span className="font-bold text-primary">{newTicketNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target Delivery:</span>
                    <span className="font-bold text-slate-800">In {selectedPackage.timeline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status Phase:</span>
                    <span className="font-bold text-amber-600">Payment Received</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button 
                    onClick={() => {
                      handleNextStep(1);
                      setUploadedFiles([]);
                      setFormFields({
                        businessCategory: '',
                        investment: '₹10 Lakhs - ₹25 Lakhs',
                        country: 'India',
                        state: '',
                        city: '',
                        pinCode: '',
                        targetCustomers: '',
                        businessType: 'Manufacturing',
                        businessGoal: '',
                        specialRequirements: ''
                      });
                    }}
                    className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl text-xs transition-all"
                  >
                    Request Another Research
                  </button>
                  <button 
                    onClick={() => {
                      // Look up the freshly generated ticket from tickets state
                      const freshTicket = tickets.find(t => t.ticketNumber === newTicketNo);
                      if (freshTicket) {
                        setSelectedTicketId(freshTicket.id);
                      }
                      // Keep customer role, we just scroll down to status checker or refresh snap
                      showToast("Directing to active trackers below...", "info");
                    }}
                    className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl text-xs transition-all shadow-sm"
                  >
                    Track Progress
                  </button>
                </div>
              </div>
            )}

            {/* Customer Tracking / Existing Tickets Section */}
            <div className="pt-8 border-t border-slate-200 space-y-6">
              <div className="flex items-center space-x-2.5 mb-6">
                <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                <h3 className="text-xl font-bold text-slate-900 font-display">Active Research Workspaces</h3>
              </div>
              <ResearchDashboard
                tickets={tickets}
                selectedTicketId={selectedTicketId}
                setSelectedTicketId={setSelectedTicketId}
                user={user}
                handleDownloadReportPDF={handleDownloadReportPDF}
                handleSendComment={handleSendCommentDirect}
                STATUS_FLOW={STATUS_FLOW}
              />
            </div>

          </div>
        )}

        {/* ======================= TEAM/EXECUTIVE WORKSPACE ======================= */}
        {(activeRole === 'researcher' || activeRole === 'admin') && (
          <ResearchTeamWorkspace 
            tickets={tickets} 
            selectedTicketId={selectedTicketId} 
            setSelectedTicketId={setSelectedTicketId} 
            user={user} 
            role={role} 
            activeRole={activeRole} 
            showToast={showToast} 
            handleUpdateStatus={handleUpdateStatus} 
            handleAssignExecutive={handleAssignExecutive} 
            handleSaveFindings={handleSaveFindings} 
            handleSaveInternalNotes={handleSaveInternalNotes} 
            handleAddComment={handleAddComment} 
            handleDownloadReportPDF={handleDownloadReportPDF} 
            STATUS_FLOW={STATUS_FLOW} />
        )}

        {/* Disable legacy researcher view content */}
        {false && (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Active Tickets Registry Sidebar */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <h3 className="font-bold text-slate-900 font-display text-sm">Enterprise Research Tickets</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Control panel for assigned market studies.</p>
                
                <div className="mt-4 space-y-2.5 max-h-[600px] overflow-y-auto">
                  {tickets.map((t) => {
                    const isActive = selectedTicketId === t.id;
                    const statusLabel = STATUS_FLOW.find(s => s.id === t.status)?.label || t.status;
                    return (
                      <div 
                        key={t.id}
                        onClick={() => setSelectedTicketId(t.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          isActive 
                            ? 'border-indigo-600 bg-indigo-50/20 shadow-sm' 
                            : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-mono font-bold text-indigo-700">{t.ticketNumber}</span>
                          <span className="text-slate-500">{t.dueDate}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs mt-1.5 truncate">{t.businessCategory}</h4>
                        <div className="flex items-center justify-between mt-3 text-[10px]">
                          <span className="text-slate-500 truncate max-w-[120px]">By: {t.userName}</span>
                          <span className={`px-2 py-0.5 rounded-2xl font-bold uppercase ${
                            STATUS_FLOW.find(s => s.id === t.status)?.color || 'bg-slate-200 text-slate-600'
                          }`}>
                            {statusLabel}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {tickets.length === 0 && (
                    <div className="text-center py-8 text-slate-500 text-xs">
                      No tickets placed yet. Use the Customer Hub to purchase a research package.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Active Executive Controller Page */}
            <div className="lg:col-span-8">
              {selectedTicket ? (
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm space-y-6">
                  
                  {/* Status Banner */}
                  <div className="bg-slate-900 text-white p-6 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />
                    
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs text-primary-light font-bold">{selectedTicket.ticketNumber}</span>
                          <span className="text-white/20">•</span>
                          <span className="text-xs text-slate-400 font-medium">Assigned Executive: {selectedTicket.assignedExecutive}</span>
                        </div>
                        <h3 className="text-lg font-bold font-display mt-1">{selectedTicket.businessCategory}</h3>
                        <p className="text-xs text-slate-500 mt-1">Requested by: <span className="text-white font-bold">{selectedTicket.userName}</span> ({selectedTicket.userEmail})</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleDownloadReportPDF(selectedTicket)}
                          className="px-3.5 py-1.5 bg-white/15 hover:bg-white/20 text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Generate/Preview PDF</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions Matrix */}
                  <div className="px-6 space-y-6">
                    
                    {/* Status Step Updater */}
                    <div className="border border-slate-200 rounded-2xl p-5 space-y-3.5">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span>Status Step Controller</span>
                        </h4>
                        <span className="text-[10px] text-slate-500 font-mono">Current stage index: {STATUS_FLOW.findIndex(s => s.id === selectedTicket.status) + 1}/13</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {STATUS_FLOW.map((sf, index) => {
                          const isActive = selectedTicket.status === sf.id;
                          return (
                            <button 
                              key={sf.id}
                              onClick={() => handleUpdateStatus(sf.id)}
                              className={`px-3 py-1.5 rounded-2xl text-[10px] font-bold border transition-all ${
                                isActive 
                                  ? `${sf.color} border-transparent ring-2 ring-slate-800 ring-offset-2 scale-105` 
                                  : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100 hover:text-slate-800'
                              }`}
                            >
                              {index + 1}. {sf.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Executive Assignment & Priority Block */}
                    <div className="grid md:grid-cols-2 gap-4">
                      
                      {/* Assign Field */}
                      <div className="border border-slate-200 rounded-2xl p-4 space-y-2.5">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Assign Executive / Desk</h4>
                        <div className="flex gap-2">
                          <select 
                            id="exec-assign-select"
                            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none"
                            defaultValue={selectedTicket.assignedExecutive.startsWith('Waiting') ? 'Aravind Swamy' : selectedTicket.assignedExecutive}
                          >
                            <option>Aravind Swamy (Senior SME Analyst)</option>
                            <option>Neha Sharma (Location Audit Expert)</option>
                            <option>Rohan Mehra (Financial Modeling Lead)</option>
                            <option>Pooja Patel (Quality Assurance Director)</option>
                          </select>
                          <button 
                            onClick={() => {
                              const sel = document.getElementById('exec-assign-select') as HTMLSelectElement;
                              if (sel) handleAssignExecutive(sel.value.split(' (')[0]);
                            }}
                            className="px-3 py-2 bg-slate-900 text-white font-bold text-xs rounded-2xl hover:bg-slate-800 transition-colors shrink-0"
                          >
                            Assign
                          </button>
                        </div>
                      </div>

                      {/* Internal Notes */}
                      <div className="border border-slate-200 rounded-2xl p-4 space-y-2.5">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Internal Team Notes</h4>
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            placeholder="Add secret private notes..."
                            value={internalNoteInput}
                            onChange={(e) => setInternalNoteInput(e.target.value)}
                            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none"
                          />
                          <button 
                            onClick={handleSaveInternalNotes}
                            className="px-3 py-2 bg-slate-900 text-white font-bold text-xs rounded-2xl hover:bg-slate-800 transition-colors shrink-0"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Custom Market Findings Inputs */}
                    <div className="border border-slate-200 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          <TrendingUp className="w-4 h-4 text-indigo-500" />
                          <span>SME Research Data Inputs</span>
                        </h4>
                        <span className="text-[10px] text-slate-500">Populates the dynamic segments of the 21-part PDF</span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Market Overview Draft Findings</label>
                          <textarea 
                            rows={3}
                            placeholder="Input details concerning regional size, YoY growth vectors, target demand curves..."
                            value={findingsFields.marketSize}
                            onChange={(e) => setFindingsFields({...findingsFields, marketSize: e.target.value})}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Competitor Analysis Draft Findings</label>
                          <textarea 
                            rows={3}
                            placeholder="Input details on top competitor vulnerabilities, regional market share, benchmark pricing..."
                            value={findingsFields.competitors}
                            onChange={(e) => setFindingsFields({...findingsFields, competitors: e.target.value})}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Geographic Location Suitability</label>
                          <textarea 
                            rows={3}
                            placeholder="Input localized rental yields, logistical road connectivity details, labor cost advantages..."
                            value={findingsFields.locationAnalysis}
                            onChange={(e) => setFindingsFields({...findingsFields, locationAnalysis: e.target.value})}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Financial Capital Projections</label>
                          <textarea 
                            rows={3}
                            placeholder="CapEx breakdowns, monthly operational margins, working capital timelines..."
                            value={findingsFields.financialEstimates}
                            onChange={(e) => setFindingsFields({...findingsFields, financialEstimates: e.target.value})}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">SWOT Matrix Details</label>
                          <textarea 
                            rows={2}
                            placeholder="Key internal Strengths/Weaknesses and external Opportunities/Threats."
                            value={findingsFields.swotAnalysis}
                            onChange={(e) => setFindingsFields({...findingsFields, swotAnalysis: e.target.value})}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex justify-end">
                        <button 
                          onClick={handleSaveFindings}
                          className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl text-xs shadow-sm transition-colors"
                        >
                          Commit Findings to Report
                        </button>
                      </div>
                    </div>

                    {/* Dialogue Box */}
                    <div className="border border-slate-200 rounded-2xl p-5 space-y-4">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4 text-indigo-500" />
                        <span>Analyst Dialogue Desk</span>
                      </h4>

                      <div className="space-y-3 max-h-[180px] overflow-y-auto pr-2">
                        {selectedTicket.comments?.map((c, i) => (
                          <div key={i} className={`flex flex-col max-w-[85%] ${
                            c.senderRole === activeRole ? 'ml-auto items-end' : 'mr-auto items-start'
                          }`}>
                            <div className={`p-2.5 rounded-2xl text-xs ${
                              c.senderRole === activeRole 
                                ? 'bg-primary text-white rounded-tr-none' 
                                : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                            }`}>
                              <p>{c.message}</p>
                            </div>
                            <span className="text-[9px] text-slate-500 mt-1">
                              {c.sender} ({c.senderRole}) • {new Date(c.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                        ))}
                      </div>

                      <form onSubmit={handleAddComment} className="flex gap-2 pt-3 border-t border-slate-100">
                        <input 
                          type="text"
                          placeholder="Type response back to client..."
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none"
                        />
                        <button 
                          type="submit"
                          className="px-4 py-2 bg-slate-900 text-white rounded-2xl font-bold text-xs hover:bg-slate-800 transition-colors shrink-0"
                        >
                          Send Message
                        </button>
                      </form>
                    </div>

                  </div>

                  <div className="h-4" />
                </div>
              ) : (
                <div className="border border-dashed border-slate-300 rounded-3xl p-12 text-center bg-white text-slate-500 text-xs">
                  No active research ticket selected. Pick a ticket from the registry sidebar.
                </div>
              )}
            </div>

          </div>
        )}

      </div>
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-scaleUp">
            
            <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
              <div>
                <h4 className="font-bold font-display text-sm">Secure Payment Gate</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Order ID generated • Encrypted pipeline</p>
              </div>
              <span className="px-2.5 py-0.5 bg-primary/20 text-primary-light text-[10px] font-bold rounded-2xl">
                {selectedPackage.price}
              </span>
            </div>

            <form onSubmit={handlePaymentSubmit} className="p-6 space-y-6">
              
              {/* UPI fields */}
              {paymentMethod === 'upi' && (
                <div className="space-y-4 text-center">
                  <div className="w-40 h-40 bg-slate-50 border border-slate-200 rounded-2xl mx-auto flex items-center justify-center relative overflow-hidden">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=biznxt@upi&pn=BizNxt&am=${selectedPackage.priceVal}`} 
                      alt="UPI QR Code" 
                      className="w-32 h-32" 
                    />
                    <div className="absolute bottom-1 bg-slate-900 text-[8px] text-white font-bold px-2 py-0.5 rounded-2xl uppercase tracking-wider">
                      Scan with UPI app
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-left">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Or Enter Virtual Payment Address (VPA)</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. success@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Paytm Business fields */}
              {paymentMethod === 'paytm' && (
                <div className="space-y-4 text-center">
                  <div className="w-40 h-40 bg-slate-50 border border-slate-200 rounded-2xl mx-auto flex items-center justify-center relative overflow-hidden">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=paytmqr://pay?pa=biznxt@paytm&pn=BizNxt&am=${selectedPackage.priceVal}`} 
                      alt="Paytm QR Code" 
                      className="w-32 h-32 object-contain mix-blend-multiply"
                    />
                  </div>
                  <p className="text-xs font-semibold text-slate-500">
                    Scan with <span className="font-bold text-slate-800">Paytm Business</span> to pay ₹{selectedPackage.priceVal.toLocaleString()}
                  </p>
                  
                  <div className="pt-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Or Enter Paytm Number / VPA</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. 9876543210@paytm"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-center"
                    />
                  </div>
                </div>
              )}

              {/* Razorpay / Stripe fields */}
              {(paymentMethod === 'razorpay' || paymentMethod === 'stripe') && (
                <div className="space-y-4 text-left">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Cardholder Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Aravind Swamy"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Card Number</label>
                    <input 
                      type="text" 
                      required
                      maxLength={19}
                      placeholder="e.g. 4111 2222 3333 4444"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Expiry Date</label>
                      <input 
                        type="text" 
                        required
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Security Code (CVV)</label>
                      <input 
                        type="password" 
                        required
                        maxLength={4}
                        placeholder="***"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none text-center"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={processingPayment}
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  {processingPayment ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Submit Payment</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
