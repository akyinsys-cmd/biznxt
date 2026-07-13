import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { 
  BookOpen, 
  Award, 
  FileCheck, 
  Compass, 
  Calculator, 
  HelpCircle, 
  Bookmark, 
  Search, 
  ArrowRight, 
  Clock, 
  Share2, 
  CheckCircle2, 
  Download, 
  AlertTriangle, 
  Building, 
  Briefcase, 
  Percent, 
  Shield, 
  Activity, 
  Filter, 
  Calendar, 
  ChevronRight, 
  Plus, 
  Trash, 
  Play, 
  FileText, 
  Check, 
  ExternalLink, 
  X,
  Sparkles,
  RefreshCw,
  User,
  Folder,
  Sliders,
  ListTodo
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  ARTICLES, 
  COURSES, 
  LESSONS, 
  TEMPLATES, 
  SOPS, 
  CHECKLISTS, 
  SCHEMES, 
  LEARNING_PATHS,
  KNOWLEDGE_CATEGORIES
} from '../data/knowledgeData';
import { 
  KnowledgeArticle, 
  LearningCourse, 
  LearningLesson, 
  BusinessTemplate, 
  SopItem, 
  BusinessChecklist, 
  GovernmentScheme, 
  LearningPath 
} from '../types/knowledge';

// Simple simple markdown formatter to avoid react-markdown dependencies
function formatMarkdown(text: string) {
  if (!text) return null;
  return text.split('\n').map((line, i) => {
    if (line.startsWith('### ')) {
      return <h4 key={i} className="text-md font-bold text-slate-800 mt-4 mb-2">{line.replace('### ', '')}</h4>;
    }
    if (line.startsWith('## ')) {
      return <h3 key={i} className="text-lg font-bold text-slate-900 mt-5 mb-2 border-b border-slate-100 pb-1">{line.replace('## ', '')}</h3>;
    }
    if (line.startsWith('# ')) {
      return <h2 key={i} className="text-xl font-extrabold text-slate-950 mt-6 mb-3">{line.replace('# ', '')}</h2>;
    }
    if (line.startsWith('* ') || line.startsWith('- ')) {
      return (
        <li key={i} className="ml-5 list-disc text-slate-600 text-sm mb-1">
          {line.substring(2)}
        </li>
      );
    }
    if (line.trim() === '') return <div key={i} className="h-2" />;
    return <p key={i} className="text-slate-600 text-sm leading-relaxed mb-2">{line}</p>;
  });
}

export default function KnowledgeHub() {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  // Tab states
  const [activeTab, setActiveTab] = useState<'home' | 'paths' | 'articles' | 'templates' | 'schemes' | 'calculators' | 'assistant' | 'profile' | 'admin'>('home');
  
  // Data State managed locally (for Admin additions and Bookmarks/Progress persistence)
  const [articlesList, setArticlesList] = useState<KnowledgeArticle[]>(() => {
    const saved = localStorage.getItem('biz_knowledge_articles');
    return saved ? JSON.parse(saved) : ARTICLES;
  });
  const [coursesList, setCoursesList] = useState<LearningCourse[]>(() => {
    const saved = localStorage.getItem('biz_knowledge_courses');
    return saved ? JSON.parse(saved) : COURSES;
  });
  const [lessonsList, setLessonsList] = useState<LearningLesson[]>(() => {
    const saved = localStorage.getItem('biz_knowledge_lessons');
    return saved ? JSON.parse(saved) : LESSONS;
  });
  const [templatesList, setTemplatesList] = useState<BusinessTemplate[]>(() => {
    const saved = localStorage.getItem('biz_knowledge_templates');
    return saved ? JSON.parse(saved) : TEMPLATES;
  });
  const [sopsList, setSopsList] = useState<SopItem[]>(() => {
    const saved = localStorage.getItem('biz_knowledge_sops');
    return saved ? JSON.parse(saved) : SOPS;
  });
  const [schemesList, setSchemesList] = useState<GovernmentScheme[]>(() => {
    const saved = localStorage.getItem('biz_knowledge_schemes');
    return saved ? JSON.parse(saved) : SCHEMES;
  });
  const [pathsList, setPathsList] = useState<LearningPath[]>(() => {
    const saved = localStorage.getItem('biz_knowledge_paths');
    return saved ? JSON.parse(saved) : LEARNING_PATHS;
  });
  const [checklistsList, setChecklistsList] = useState<BusinessChecklist[]>(() => {
    const saved = localStorage.getItem('biz_knowledge_checklists');
    return saved ? JSON.parse(saved) : CHECKLISTS;
  });

  // User Interactive States
  const [bookmarkedArticles, setBookmarkedArticles] = useState<string[]>(() => {
    const saved = localStorage.getItem('biz_bookmarks_articles');
    return saved ? JSON.parse(saved) : [];
  });
  const [bookmarkedTemplates, setBookmarkedTemplates] = useState<string[]>(() => {
    const saved = localStorage.getItem('biz_bookmarks_templates');
    return saved ? JSON.parse(saved) : [];
  });
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    const saved = localStorage.getItem('biz_completed_lessons');
    return saved ? JSON.parse(saved) : [];
  });
  const [completedPaths, setCompletedPaths] = useState<string[]>(() => {
    const saved = localStorage.getItem('biz_completed_paths');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('biz_knowledge_articles', JSON.stringify(articlesList));
    localStorage.setItem('biz_knowledge_courses', JSON.stringify(coursesList));
    localStorage.setItem('biz_knowledge_lessons', JSON.stringify(lessonsList));
    localStorage.setItem('biz_knowledge_templates', JSON.stringify(templatesList));
    localStorage.setItem('biz_knowledge_sops', JSON.stringify(sopsList));
    localStorage.setItem('biz_knowledge_schemes', JSON.stringify(schemesList));
    localStorage.setItem('biz_knowledge_paths', JSON.stringify(pathsList));
    localStorage.setItem('biz_knowledge_checklists', JSON.stringify(checklistsList));
  }, [articlesList, coursesList, lessonsList, templatesList, sopsList, schemesList, pathsList, checklistsList]);

  useEffect(() => {
    localStorage.setItem('biz_bookmarks_articles', JSON.stringify(bookmarkedArticles));
    localStorage.setItem('biz_bookmarks_templates', JSON.stringify(bookmarkedTemplates));
    localStorage.setItem('biz_completed_lessons', JSON.stringify(completedLessons));
    localStorage.setItem('biz_completed_paths', JSON.stringify(completedPaths));
  }, [bookmarkedArticles, bookmarkedTemplates, completedLessons, completedPaths]);

  // General Filter and Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Specific view modals / sub-views
  const [activeArticle, setActiveArticle] = useState<KnowledgeArticle | null>(null);
  const [activeCourse, setActiveCourse] = useState<LearningCourse | null>(null);
  const [activeLesson, setActiveLesson] = useState<LearningLesson | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<BusinessTemplate | null>(null);
  const [activeSop, setActiveSop] = useState<SopItem | null>(null);
  
  // ----------------------------------------------------
  // CALCULATOR ENGINE STATES & CALCULATIONS
  // ----------------------------------------------------
  const [calcType, setCalcType] = useState<'breakeven' | 'investment' | 'profit' | 'gst' | 'emi' | 'roi' | 'valuation' | 'pricing' | 'cashflow'>('breakeven');
  
  // Break-even Calculator Inputs
  const [fixedCosts, setFixedCosts] = useState(250000);
  const [variableCostPerUnit, setVariableCostPerUnit] = useState(60);
  const [sellingPricePerUnit, setSellingPricePerUnit] = useState(150);
  
  // Investment Calculator Inputs
  const [capexEquipment, setCapexEquipment] = useState(500000);
  const [capexLicensing, setCapexLicensing] = useState(75000);
  const [opexRental, setOpexRental] = useState(30000);
  const [opexSalary, setOpexSalary] = useState(80000);
  const [opexMarketing, setOpexMarketing] = useState(40000);
  const [workingCapitalMonths, setWorkingCapitalMonths] = useState(6);

  // GST Calculator Inputs
  const [gstAmount, setGstAmount] = useState(10000);
  const [gstRate, setGstRate] = useState(18); // 5, 12, 18, 28
  const [gstMode, setGstMode] = useState<'add' | 'remove'>('add');

  // EMI Calculator Inputs
  const [loanAmount, setLoanAmount] = useState(500000);
  const [loanInterest, setLoanInterest] = useState(10.5); // per annum
  const [loanTenure, setLoanTenure] = useState(5); // years

  // ROI Calculator Inputs
  const [roiInitial, setRoiInitial] = useState(200000);
  const [roiGains, setRoiGains] = useState(350000);

  // Business Valuation Calculator Inputs
  const [valuationEbitda, setValuationEbitda] = useState(1200000);
  const [valuationMultiple, setValuationMultiple] = useState(3.5);

  // Profit Margin & Pricing Inputs
  const [costPrice, setCostPrice] = useState(1000);
  const [desiredMargin, setDesiredMargin] = useState(25);
  const [revenueInput, setRevenueInput] = useState(500000);
  const [cogsInput, setCogsInput] = useState(350000);

  // Cash Flow Inputs
  const [initialCash, setInitialCash] = useState(100000);
  const [monthlyInflow, setMonthlyInflow] = useState(200000);
  const [monthlyOutflow, setMonthlyOutflow] = useState(150000);

  // Calculate Break-even
  const marginPerUnit = sellingPricePerUnit - variableCostPerUnit;
  const breakEvenUnits = marginPerUnit > 0 ? Math.ceil(fixedCosts / marginPerUnit) : 0;
  const breakEvenSales = breakEvenUnits * sellingPricePerUnit;

  // Calculate Investment Setup
  const totalCapex = capexEquipment + capexLicensing;
  const monthlyOpex = opexRental + opexSalary + opexMarketing;
  const workingCapitalNeeded = monthlyOpex * workingCapitalMonths;
  const totalInitialInvestment = totalCapex + workingCapitalNeeded;

  // Calculate GST
  const calculatedGst = gstMode === 'add' 
    ? (gstAmount * gstRate) / 100 
    : gstAmount - (gstAmount * (100 / (100 + gstRate)));
  const calculatedTotalGst = gstMode === 'add' ? gstAmount + calculatedGst : gstAmount;
  const calculatedBaseGst = gstMode === 'add' ? gstAmount : gstAmount - calculatedGst;

  // Calculate EMI
  const monthlyRate = (loanInterest / 12) / 100;
  const totalMonths = loanTenure * 12;
  const calculatedEmi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  const totalPayable = calculatedEmi * totalMonths;
  const totalInterest = totalPayable - loanAmount;

  // Calculate ROI
  const netProfit = roiGains - roiInitial;
  const calculatedRoi = roiInitial > 0 ? ((netProfit / roiInitial) * 100).toFixed(2) : '0';

  // Calculate Business Valuation
  const calculatedValuation = valuationEbitda * valuationMultiple;

  // Calculate Profit Margin
  const grossProfit = revenueInput - cogsInput;
  const marginPercentage = (grossProfit / revenueInput) * 100;

  // Calculate Pricing
  const sellingPrice = costPrice / (1 - desiredMargin / 100);

  // Calculate Cash Flow (12 month projection)
  const monthlyNet = monthlyInflow - monthlyOutflow;
  const projection12Mo = initialCash + (monthlyNet * 12);

  // ----------------------------------------------------
  // GOVERNMENT SCHEMES STATE & FILTERS
  // ----------------------------------------------------
  const [schemeSearch, setSchemeSearch] = useState('');
  const [schemeSize, setSchemeSize] = useState<string>('All');
  const [schemeCategory, setSchemeCategory] = useState<string>('All');
  const [schemeState, setSchemeState] = useState<string>('All');
  const [schemeStartupOnly, setSchemeStartupOnly] = useState(false);
  const [schemeWomenOnly, setSchemeWomenOnly] = useState(false);

  const filteredSchemes = schemesList.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(schemeSearch.toLowerCase()) || 
                          s.overview.toLowerCase().includes(schemeSearch.toLowerCase());
    const matchesSize = schemeSize === 'All' || s.businessSize === schemeSize || s.businessSize === 'All';
    const matchesCategory = schemeCategory === 'All' || s.category === schemeCategory;
    const matchesState = schemeState === 'All' || (schemeState === 'Central' && s.state === 'Central') || (schemeState === 'State' && s.state !== 'Central');
    const matchesStartup = !schemeStartupOnly || s.businessSize === 'Startup';
    const matchesWomen = !schemeWomenOnly || s.overview.toLowerCase().includes('women');
    return matchesSearch && matchesSize && matchesCategory && matchesState && matchesStartup && matchesWomen;
  });

  // ----------------------------------------------------
  // AI ASSISTANT CHAT / ADVISOR ENGINE
  // ----------------------------------------------------
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<any | null>(null);

  const handleAskAi = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!aiQuestion.trim()) return;

    setAiLoading(true);
    setAiResponse(null);

    try {
      const res = await fetch('/api/knowledge/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: aiQuestion,
          category: categoryFilter,
          userProfile: user ? {
            displayName: user.displayName,
            email: user.email,
          } : null
        })
      });

      if (!res.ok) {
        throw new Error('Server returned an error answering your request.');
      }

      const data = await res.json();
      setAiResponse(data);
      showToast('AI response generated successfully!', 'success');
      
      // Log search/queries
      const searchLogs = JSON.parse(localStorage.getItem('biz_knowledge_search') || '[]');
      searchLogs.unshift({ query: aiQuestion, timestamp: new Date().toISOString() });
      localStorage.setItem('biz_knowledge_search', JSON.stringify(searchLogs.slice(0, 50)));

    } catch (err: any) {
      console.error(err);
      showToast('Error connecting to AI Assistant.', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  // ----------------------------------------------------
  // INTERACTIVE CHECKLIST ENGINE STATE
  // ----------------------------------------------------
  const [activeChecklistId, setActiveChecklistId] = useState<string>('chk-startup');
  const toggleChecklistItem = (checklistId: string, itemId: string) => {
    setChecklistsList(prev => prev.map(ch => {
      if (ch.id === checklistId) {
        return {
          ...ch,
          items: ch.items.map(item => item.id === itemId ? { ...item, completed: !item.completed } : item)
        };
      }
      return ch;
    }));
    showToast('Checklist state updated', 'info');
  };

  // ----------------------------------------------------
  // BOOKMARK OPERATIONS
  // ----------------------------------------------------
  const toggleBookmarkArticle = (id: string) => {
    setBookmarkedArticles(prev => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Article removed from bookmarks', 'info');
        return prev.filter(x => x !== id);
      } else {
        showToast('Article bookmarked successfully!', 'success');
        return [...prev, id];
      }
    });
  };

  const toggleBookmarkTemplate = (id: string) => {
    setBookmarkedTemplates(prev => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Template removed from bookmarks', 'info');
        return prev.filter(x => x !== id);
      } else {
        showToast('Template bookmarked successfully!', 'success');
        return [...prev, id];
      }
    });
  };

  // ----------------------------------------------------
  // LEARNING PATH PROGRESS & CERTIFICATION
  // ----------------------------------------------------
  const toggleLessonCompleted = (lessonId: string) => {
    setCompletedLessons(prev => {
      const isCompleted = prev.includes(lessonId);
      if (isCompleted) {
        return prev.filter(id => id !== lessonId);
      } else {
        showToast('Lesson marked complete!', 'success');
        return [...prev, lessonId];
      }
    });
  };

  const downloadCertificate = (pathTitle: string) => {
    // Generate a simple high quality layout print
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast('Please allow popups to download certificate', 'error');
      return;
    }
    printWindow.document.write(`
      <html>
        <head>
          <title>Certificate - ${pathTitle}</title>
          <style>
            body { font-family: 'Inter', sans-serif; background-color: #f8fafc; padding: 40px; display: flex; justify-content: center; align-items: center; min-height: 80vh; }
            .cert { border: 15px solid #1e293b; background: white; padding: 60px; max-width: 800px; text-align: center; border-radius: 8px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); }
            h1 { font-family: 'Space Grotesk', sans-serif; font-size: 3rem; color: #1e3a8a; margin-bottom: 5px; }
            h2 { font-size: 1.5rem; color: #475569; margin-top: 0; font-weight: 500; }
            .name { font-size: 2.2rem; color: #0f172a; border-bottom: 2px solid #e2e8f0; display: inline-block; padding: 10px 40px; margin: 30px 0; font-weight: bold; }
            .desc { font-size: 1.1rem; color: #64748b; line-height: 1.6; margin-bottom: 40px; }
            .footer-line { display: flex; justify-content: space-between; margin-top: 50px; border-t: 1px solid #f1f5f9; pt-20; }
            .sign { border-top: 1px solid #94a3b8; width: 180px; padding-top: 5px; font-size: 0.9rem; color: #64748b; }
            .logo { font-size: 1.5rem; font-weight: 800; color: #0284c7; margin-bottom: 40px; }
          </style>
        </head>
        <body>
          <div class="cert">
            <div class="logo">biznxt.online ACADEMY</div>
            <h2>CERTIFICATE OF ACCOMPLISHMENT</h2>
            <p>This is proudly presented to</p>
            <div class="name">${user?.displayName || 'Elite Entrepreneur'}</div>
            <p class="desc">for successfully completing the structured learning journey</p>
            <h1>${pathTitle}</h1>
            <p class="desc" style="margin-top: 20px;">Issued on ${new Date().toLocaleDateString('en-IN')} with certified platform curriculum standards.</p>
            <div class="footer-line">
              <div class="sign">Lead Sourcing SME</div>
              <div class="sign">Academic Dean, BizNxt</div>
            </div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // ----------------------------------------------------
  // ADMIN PANEL OPERATIONS
  // ----------------------------------------------------
  const [newArtTitle, setNewArtTitle] = useState('');
  const [newArtSummary, setNewArtSummary] = useState('');
  const [newArtContent, setNewArtContent] = useState('');
  const [newArtCategory, setNewArtCategory] = useState('Manufacturing');
  const [newArtDifficulty, setNewArtDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');

  const handleAddArticle = (e: FormEvent) => {
    e.preventDefault();
    if (!newArtTitle || !newArtSummary || !newArtContent) {
      showToast('All fields required', 'error');
      return;
    }

    const newArt: KnowledgeArticle = {
      id: `art-${Date.now()}`,
      title: newArtTitle,
      shortSummary: newArtSummary,
      fullArticle: newArtContent,
      featuredImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop",
      author: {
        name: user?.displayName || "Platform Editor",
        role: "Editorial Admin",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
        bio: "Curator of BizNxt Knowledge Network."
      },
      category: newArtCategory,
      tags: ["MSME", "Growth"],
      readingTime: Math.ceil(newArtContent.split(' ').length / 200),
      difficulty: newArtDifficulty,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setArticlesList(prev => [newArt, ...prev]);
    showToast('Article published successfully!', 'success');
    
    // Clear fields
    setNewArtTitle('');
    setNewArtSummary('');
    setNewArtContent('');
  };

  // Helper to count progress of path
  const getPathProgress = (path: LearningPath) => {
    const totalSteps = path.steps.length;
    let completed = 0;
    path.steps.forEach(s => {
      if (s.type === 'video' && completedLessons.includes(s.refId)) completed++;
      if (s.type === 'article' && bookmarkedArticles.includes(s.refId)) completed++;
      if (s.type === 'template' && bookmarkedTemplates.includes(s.refId)) completed++;
      if (s.type === 'checklist') {
        const checklist = checklistsList.find(c => c.id === s.refId);
        const allCompleted = checklist?.items.every(i => i.completed) ?? false;
        if (allCompleted) completed++;
      }
    });
    return totalSteps > 0 ? Math.round((completed / totalSteps) * 100) : 0;
  };

  return (
    <div className="flex-1 py-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-2xl uppercase tracking-wider">
            Academy & Research
          </span>
          <h1 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight mt-1.5">
            BizNxt Knowledge Hub
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Learn, plan, simulate, and scale your business with India's largest educational node.
          </p>
        </div>
        
        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200/60 max-w-full overflow-x-auto">
          {[
            { id: 'home', label: 'Explore', icon: Compass },
            { id: 'paths', label: 'Learning Paths', icon: Award },
            { id: 'articles', label: 'Guides', icon: BookOpen },
            { id: 'templates', label: 'Templates & SOPs', icon: FileCheck },
            { id: 'schemes', label: 'Govt Schemes', icon: Building },
            { id: 'calculators', label: 'Calculators', icon: Calculator },
            { id: 'assistant', label: 'AI Assistant', icon: Sparkles },
            { id: 'profile', label: 'My Progress', icon: Bookmark },
            { id: 'admin', label: 'Admin', icon: User }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                // Reset modals
                setActiveArticle(null);
                setActiveCourse(null);
                setActiveLesson(null);
                setActiveTemplate(null);
                setActiveSop(null);
              }}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-primary shadow-sm border border-white' 
                  : 'text-slate-600 hover:bg-white/45 hover:text-slate-900'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------------------------------- */}
      {/* 1. EXPLORE TAB (HOME) */}
      {/* ---------------------------------------------------------------------------- */}
      {activeTab === 'home' && (
        <div className="space-y-8">
          {/* Hero Banner Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-card border border-white/50 bg-gradient-to-br from-primary/10 via-white to-transparent p-8 rounded-3xl flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-primary font-semibold text-xs tracking-wider uppercase">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span>Interactive AI Guide</span>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-3">
                  Instantly solve complex licensing, export, or manufacturing setups.
                </h2>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed max-w-xl">
                  BizNxt Assistant scans legal codes, tax schedules, and factory specifications to design a hyper-customized corporate roadmap.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button 
                  onClick={() => setActiveTab('assistant')} 
                  className="neomorph-btn bg-primary text-white border-primary/20 px-5 py-2.5 text-xs font-bold flex items-center space-x-2"
                >
                  <span>Query AI Assistant</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setActiveTab('calculators')} 
                  className="neomorph-btn bg-white text-slate-700 border-slate-200 px-5 py-2.5 text-xs font-bold flex items-center space-x-2"
                >
                  <span>Launch Calculators</span>
                </button>
              </div>
            </div>

            {/* Quick Stats Widget / News */}
            <div className="glass-card border border-white p-6 rounded-3xl flex flex-col justify-between bg-white">
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Live Business Updates
                </h3>
                <div className="mt-3 space-y-3.5">
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100 flex items-start space-x-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-bold text-amber-900 block">FSSAI Renewal Deadline</span>
                      <span className="text-amber-700 mt-0.5 block">Audit inspections tightening for processing units under orange classification.</span>
                    </div>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-bold text-emerald-900 block">PMEGP Funding pool expanded</span>
                      <span className="text-emerald-700 mt-0.5 block">Central cabinet boosts credit guarantee budget for rural manufacturers.</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-3 mt-4 text-center">
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  BizNxt Feed • Live Sourcing Sync
                </span>
              </div>
            </div>
          </div>

          {/* Trending Articles Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Trending Industry Guides
              </h3>
              <button 
                onClick={() => setActiveTab('articles')} 
                className="text-xs font-bold text-primary flex items-center space-x-1 hover:underline"
              >
                <span>View all guides</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articlesList.slice(0, 3).map(art => (
                <div 
                  key={art.id} 
                  className="glass-card bg-white border border-slate-200/60 rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col"
                >
                  <img src={art.featuredImage} alt={art.title} className="w-full h-40 object-cover" />
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                        <span>{art.category}</span>
                        <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {art.readingTime} min read</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-2 hover:text-primary cursor-pointer line-clamp-2" onClick={() => { setActiveArticle(art); setActiveTab('articles'); }}>
                        {art.title}
                      </h4>
                      <p className="text-slate-500 text-xs mt-1.5 line-clamp-2">
                        {art.shortSummary}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img src={art.author.avatar} alt={art.author.name} className="w-6 h-6 rounded-2xl object-cover" />
                        <span className="text-[11px] font-semibold text-slate-600">{art.author.name}</span>
                      </div>
                      <button 
                        onClick={() => { setActiveArticle(art); setActiveTab('articles'); }} 
                        className="text-xs font-bold text-primary hover:underline flex items-center"
                      >
                        Read
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Learning Paths Section */}
          <div className="bg-[#EDF1F7]/60 p-8 rounded-3xl border border-slate-200/50">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Accelerated Learning Paths
                </h3>
                <p className="text-xs text-slate-500">Structured lessons mapped to specific startup/scale objectives.</p>
              </div>
              <button 
                onClick={() => setActiveTab('paths')} 
                className="text-xs font-bold text-primary flex items-center space-x-1 hover:underline"
              >
                <span>View all journeys</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pathsList.map(path => (
                <div key={path.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-2xl uppercase">
                      {path.steps.length} Steps
                    </span>
                    <h4 className="font-bold text-slate-900 text-base mt-2">{path.title}</h4>
                    <p className="text-slate-500 text-xs mt-1">{path.description}</p>
                    
                    <div className="mt-4 space-y-2">
                      {path.steps.map((st, idx) => (
                        <div key={idx} className="flex items-center text-xs text-slate-600 space-x-2">
                          <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="truncate flex-1">{st.title}</span>
                          <span className="text-[10px] font-mono text-slate-500 shrink-0">{st.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-medium text-slate-500 block">Progress</span>
                      <span className="text-sm font-bold text-slate-800">{getPathProgress(path)}% Completed</span>
                    </div>
                    <button 
                      onClick={() => setActiveTab('paths')} 
                      className="neomorph-btn bg-slate-100 text-slate-800 hover:bg-slate-200 text-xs font-bold px-4 py-2"
                    >
                      Enter Journey
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Government Schemes Block */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-card bg-white border border-slate-200/50 p-6 rounded-3xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-slate-950">
                  Featured Central Subsidies
                </h3>
                <button onClick={() => setActiveTab('schemes')} className="text-xs font-bold text-primary hover:underline">
                  Search Schemes
                </button>
              </div>
              <div className="space-y-4">
                {schemesList.slice(0, 2).map(sc => (
                  <div key={sc.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/50 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100/60 px-2 py-0.5 rounded-2xl uppercase">
                          {sc.category} • {sc.businessSize} Size
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm mt-1">{sc.name}</h4>
                        <p className="text-slate-500 text-xs mt-1 line-clamp-2">{sc.overview}</p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">Updated: {sc.lastUpdated}</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center">
                      <div className="flex flex-wrap gap-2">
                        {sc.benefits.slice(0, 2).map((b, idx) => (
                          <span key={idx} className="text-[10px] font-medium text-slate-600 bg-white border border-slate-100 px-2 py-0.5 rounded-md">
                            {b}
                          </span>
                        ))}
                      </div>
                      <button onClick={() => { setActiveTab('schemes'); setSchemeSearch(sc.name); }} className="text-xs font-bold text-primary hover:underline flex items-center">
                        Details <ChevronRight className="w-3 h-3 ml-0.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Templates Block */}
            <div className="glass-card bg-white border border-slate-200/50 p-6 rounded-3xl flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-950 mb-3">
                  Essential Blueprints
                </h3>
                <div className="space-y-2.5">
                  {templatesList.map(t => (
                    <div key={t.id} onClick={() => { setActiveTemplate(t); setActiveTab('templates'); }} className="p-3 hover:bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer flex justify-between items-center transition-colors">
                      <div>
                        <span className="text-[9px] font-mono text-primary uppercase block">{t.category}</span>
                        <span className="text-xs font-bold text-slate-800">{t.title}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => setActiveTab('templates')} className="neomorph-btn w-full mt-4 bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold py-2">
                Explore SOPs & Documents
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------------- */}
      {/* 2. LEARNING PATHS TAB */}
      {/* ---------------------------------------------------------------------------- */}
      {activeTab === 'paths' && (
        <div className="space-y-8">
          {/* Active Course/Lesson Overlay */}
          {activeCourse ? (
            <div className="glass-card bg-white border border-slate-200/60 p-6 rounded-3xl">
              <button 
                onClick={() => { setActiveCourse(null); setActiveLesson(null); }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 mb-4 flex items-center space-x-1"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                <span>Back to Paths</span>
              </button>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side: Course Detail and Lessons List */}
                <div className="lg:col-span-1 border-r border-slate-100 pr-6">
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-2xl uppercase">
                    {activeCourse.category}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-2">{activeCourse.title}</h2>
                  <p className="text-xs text-slate-500 mt-1">Instructor: {activeCourse.instructor}</p>
                  
                  <div className="mt-6 space-y-2">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Lessons</h3>
                    {lessonsList.filter(l => l.courseId === activeCourse.id).map(l => {
                      const isComplete = completedLessons.includes(l.id);
                      const isCurrent = activeLesson?.id === l.id;
                      return (
                        <div 
                          key={l.id} 
                          onClick={() => setActiveLesson(l)}
                          className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                            isCurrent 
                              ? 'bg-primary/5 border-primary/40' 
                              : 'bg-slate-50 border-slate-100 hover:bg-slate-100/50'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 min-w-0">
                            {isComplete ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <Play className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            )}
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-slate-800 block truncate">{l.title}</span>
                              <span className="text-[10px] text-slate-500 block">{l.duration}</span>
                            </div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Side: Active Lesson Video Screen and Study Notes */}
                <div className="lg:col-span-2 space-y-6">
                  {activeLesson ? (
                    <div>
                      {/* Video Player Frame */}
                      <div className="relative aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-900 shadow-md">
                        <iframe 
                          src={activeLesson.videoUrl} 
                          title={activeLesson.title}
                          className="absolute inset-0 w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        ></iframe>
                      </div>
                      
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-5">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">{activeLesson.title}</h3>
                          <p className="text-xs text-slate-500 mt-1">{activeLesson.summary}</p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => toggleLessonCompleted(activeLesson.id)}
                            className={`neomorph-btn text-xs font-bold px-4 py-2.5 flex items-center space-x-1.5 ${
                              completedLessons.includes(activeLesson.id)
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-primary text-white border-primary/20'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{completedLessons.includes(activeLesson.id) ? 'Completed' : 'Mark Complete'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Lesson Study Notes */}
                      <div className="mt-6 border-t border-slate-100 pt-5">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Study Notes & References</h4>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 overflow-hidden">
                          {formatMarkdown(activeLesson.notes)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <Play className="w-10 h-10 text-slate-400 mb-2 animate-bounce" />
                      <h3 className="text-sm font-bold text-slate-700">Select a lesson to begin</h3>
                      <p className="text-xs text-slate-500 mt-1">Pick from the left menu to start watching and tracking progress.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Slogan Banner */}
              <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="relative z-10">
                  <span className="text-[10px] font-mono bg-white/10 text-primary-light px-3 py-1 rounded-2xl uppercase">
                    BizNxt Academy
                  </span>
                  <h2 className="text-2xl font-extrabold tracking-tight mt-3">Structured Learning Paths</h2>
                  <p className="text-slate-400 text-xs mt-1 max-w-lg">
                    Follow pre-defined roadmaps to master complex export processes, factory setups, or digital D2C launches.
                  </p>
                </div>
                <div className="flex space-x-3 relative z-10 shrink-0">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center min-w-[80px]">
                    <span className="text-lg font-bold block">{completedLessons.length}</span>
                    <span className="text-[9px] text-slate-500 uppercase">Lessons Passed</span>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center min-w-[80px]">
                    <span className="text-lg font-bold block">
                      {pathsList.filter(p => getPathProgress(p) === 100).length}
                    </span>
                    <span className="text-[9px] text-slate-500 uppercase">Journeys Done</span>
                  </div>
                </div>
              </div>

              {/* Master Paths List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {pathsList.map(path => {
                  const progress = getPathProgress(path);
                  return (
                    <div key={path.id} className="glass-card bg-white border border-slate-200/50 p-6 rounded-2xl flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="p-2.5 bg-primary/10 text-primary rounded-2xl border border-primary/20">
                            <BookOpen className="w-5 h-5" />
                          </span>
                          {progress === 100 && (
                            <span className="flex items-center space-x-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-2xl">
                              <Award className="w-3.5 h-3.5" />
                              <span>Certified</span>
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mt-4">{path.title}</h3>
                        <p className="text-xs text-slate-500 mt-1">{path.description}</p>
                        
                        <div className="mt-5 space-y-2.5">
                          {path.steps.map((step, sIdx) => {
                            let isStepDone = false;
                            if (step.type === 'video' && completedLessons.includes(step.refId)) isStepDone = true;
                            if (step.type === 'article' && bookmarkedArticles.includes(step.refId)) isStepDone = true;
                            if (step.type === 'template' && bookmarkedTemplates.includes(step.refId)) isStepDone = true;
                            
                            return (
                              <div key={sIdx} className="flex items-center justify-between text-xs p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex items-center space-x-2.5 min-w-0">
                                  {isStepDone ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                  ) : (
                                    <div className="w-1.5 h-1.5 rounded-2xl bg-slate-300 shrink-0 ml-1.5 mr-1" />
                                  )}
                                  <span className="font-medium text-slate-700 truncate">{step.title}</span>
                                </div>
                                <span className="text-[10px] font-mono text-slate-500 capitalize shrink-0">{step.type} • {step.duration}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <div className="w-32 bg-slate-100 h-2 rounded-2xl overflow-hidden">
                            <div className="bg-primary h-full transition-all" style={{ width: `${progress}%` }} />
                          </div>
                          <span className="text-[10px] font-semibold text-slate-500 mt-1 block">{progress}% complete</span>
                        </div>
                        
                        <div className="flex space-x-2">
                          {progress === 100 && (
                            <button 
                              onClick={() => downloadCertificate(path.title)}
                              className="neomorph-btn bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold px-3 py-2 flex items-center space-x-1"
                            >
                              <Download className="w-3 h-3" />
                              <span>Certificate</span>
                            </button>
                          )}
                          <button 
                            onClick={() => {
                              // Find a course related to this path or open Course-1
                              const course = coursesList[0];
                              setActiveCourse(course);
                              const lessons = lessonsList.filter(l => l.courseId === course.id);
                              if (lessons.length > 0) setActiveLesson(lessons[0]);
                            }}
                            className="neomorph-btn bg-primary text-white border-primary/20 text-xs font-bold px-4 py-2"
                          >
                            Resume Lessons
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Video Library Course Grid */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-4">
                  All Courses
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {coursesList.map(course => (
                    <div key={course.id} className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between">
                      <div>
                        <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover" />
                        <div className="p-5">
                          <span className="text-[10px] font-mono text-primary uppercase block">{course.category}</span>
                          <h4 className="font-bold text-slate-900 text-sm mt-1.5">{course.title}</h4>
                          <p className="text-slate-500 text-xs mt-1 leading-relaxed line-clamp-2">{course.description}</p>
                          
                          <div className="flex items-center space-x-4 mt-4 text-[11px] text-slate-500 font-medium">
                            <span className="flex items-center"><Play className="w-3 h-3 mr-1" /> {course.lessonsCount} lessons</span>
                            <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {course.totalDuration}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-5 pt-0 border-t border-slate-50 mt-4">
                        <button 
                          onClick={() => {
                            setActiveCourse(course);
                            const lessons = lessonsList.filter(l => l.courseId === course.id);
                            if (lessons.length > 0) setActiveLesson(lessons[0]);
                          }}
                          className="neomorph-btn w-full bg-slate-50 border-slate-200 text-slate-700 text-xs font-bold py-2 hover:bg-slate-100"
                        >
                          Start Watching
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------------------------------- */}
      {/* 3. ARTICLES TAB (GUIDES) */}
      {/* ---------------------------------------------------------------------------- */}
      {activeTab === 'articles' && (
        <div className="space-y-6">
          {/* Active Article Screen Overlay */}
          {activeArticle ? (
            <div className="glass-card bg-white border border-slate-200/60 p-8 rounded-3xl">
              <button 
                onClick={() => setActiveArticle(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 mb-6 flex items-center space-x-1"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                <span>Back to Guides</span>
              </button>
              
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-4">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-2xl uppercase font-bold text-[10px]">
                    {activeArticle.category} • {activeArticle.subCategory}
                  </span>
                  <span>Last updated: {activeArticle.lastUpdated}</span>
                </div>
                
                <h1 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
                  {activeArticle.title}
                </h1>
                
                <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pb-6 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <img src={activeArticle.author.avatar} alt={activeArticle.author.name} className="w-10 h-10 rounded-2xl object-cover" />
                    <div>
                      <span className="text-sm font-bold text-slate-800 block leading-tight">{activeArticle.author.name}</span>
                      <span className="text-xs text-slate-500">{activeArticle.author.role}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => toggleBookmarkArticle(activeArticle.id)}
                      className={`p-2.5 rounded-2xl border transition-all ${
                        bookmarkedArticles.includes(activeArticle.id)
                          ? 'bg-amber-50 text-amber-600 border-amber-200'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500'
                      }`}
                      title="Bookmark Article"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        window.print();
                      }}
                      className="neomorph-btn bg-slate-50 border-slate-200 hover:bg-slate-100 text-xs font-bold px-4 py-2.5 flex items-center space-x-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>

                <div className="mt-8">
                  <img src={activeArticle.featuredImage} alt={activeArticle.title} className="w-full h-64 object-cover rounded-2xl mb-8 border border-slate-100 shadow-sm" />
                  
                  <div className="prose prose-slate max-w-none text-slate-700">
                    {formatMarkdown(activeArticle.fullArticle)}
                  </div>
                </div>

                {/* Author Card detail */}
                <div className="mt-12 bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-start space-x-4">
                  <img src={activeArticle.author.avatar} alt={activeArticle.author.name} className="w-12 h-12 rounded-2xl object-cover mt-1" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">About the Author: {activeArticle.author.name}</h4>
                    <p className="text-xs text-slate-500 mt-1">{activeArticle.author.bio}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Search & Topic filter */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/50">
                <div className="relative w-full md:max-w-md">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Search articles, legal codes, procedures..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                
                <div className="flex items-center space-x-2 w-full md:w-auto">
                  <Filter className="w-4 h-4 text-slate-500 shrink-0" />
                  <select 
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full md:w-48 p-2 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">All Categories</option>
                    {KNOWLEDGE_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articlesList.filter(art => {
                  const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                        art.shortSummary.toLowerCase().includes(searchQuery.toLowerCase());
                  const matchesCategory = !categoryFilter || art.category === categoryFilter || art.subCategory === categoryFilter;
                  return matchesSearch && matchesCategory;
                }).map(art => (
                  <div key={art.id} className="bg-white border border-slate-200/50 rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <div className="relative">
                        <img src={art.featuredImage} alt={art.title} className="w-full h-44 object-cover" />
                        <span className="absolute top-3 left-3 text-[9px] font-bold text-white bg-slate-900/80 px-2.5 py-1 rounded-2xl uppercase backdrop-blur-sm">
                          {art.category}
                        </span>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                          <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {art.readingTime} min</span>
                          <span>{art.difficulty}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm mt-2 line-clamp-2 hover:text-primary cursor-pointer" onClick={() => setActiveArticle(art)}>
                          {art.title}
                        </h3>
                        <p className="text-slate-500 text-xs mt-1.5 line-clamp-2">
                          {art.shortSummary}
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-5 pt-0 border-t border-slate-50 mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img src={art.author.avatar} alt={art.author.name} className="w-6 h-6 rounded-2xl object-cover" />
                        <span className="text-[10px] font-semibold text-slate-500">{art.author.name}</span>
                      </div>
                      <button 
                        onClick={() => setActiveArticle(art)}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        Read Blueprint
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------------------------------- */}
      {/* 4. TEMPLATES & SOPS TAB */}
      {/* ---------------------------------------------------------------------------- */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          {activeTemplate ? (
            <div className="glass-card bg-white border border-slate-200/60 p-8 rounded-3xl">
              <button 
                onClick={() => setActiveTemplate(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 mb-6 flex items-center space-x-1"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                <span>Back to Blueprints</span>
              </button>
              
              <div className="max-w-3xl mx-auto">
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-2xl uppercase">
                  {activeTemplate.category} Template
                </span>
                <h1 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight mt-3">
                  {activeTemplate.title}
                </h1>
                <p className="text-sm text-slate-500 mt-1">{activeTemplate.description}</p>
                
                <div className="mt-8 space-y-6">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Document Structure</h3>
                  {activeTemplate.structure.map((sect, sIdx) => (
                    <div key={sIdx} className="bg-slate-50 p-5 rounded-2xl border border-slate-200/40">
                      <h4 className="font-bold text-slate-800 text-sm">{sect.sectionName}</h4>
                      <ul className="mt-3 space-y-1.5">
                        {sect.points.map((pt, pIdx) => (
                          <li key={pIdx} className="text-xs text-slate-600 flex items-start space-x-2">
                            <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="mt-8 border-t border-slate-100 pt-6">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">SME Expert Tips</h3>
                  <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-100">
                    <ul className="space-y-1.5">
                      {activeTemplate.tips.map((tip, idx) => (
                        <li key={idx} className="text-xs text-amber-800 flex items-start space-x-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 flex justify-end space-x-3">
                  <button 
                    onClick={() => toggleBookmarkTemplate(activeTemplate.id)}
                    className="neomorph-btn bg-slate-50 border-slate-200 text-slate-700 text-xs font-bold px-4 py-2"
                  >
                    {bookmarkedTemplates.includes(activeTemplate.id) ? 'Saved' : 'Save Outline'}
                  </button>
                  <button 
                    onClick={() => {
                      window.print();
                    }}
                    className="neomorph-btn bg-primary text-white border-primary/20 text-xs font-bold px-4 py-2 flex items-center space-x-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Blueprint</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Interactive Checklist engine */}
              <div className="lg:col-span-1 glass-card bg-white border border-slate-200/50 p-6 rounded-3xl">
                <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
                  <ListTodo className="w-4 h-4 text-primary" />
                  <span>Interactive Checklist Engine</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Toggle regulatory & legal checklist steps to track launch readiness.</p>
                
                <div className="mt-4 flex space-x-2">
                  {checklistsList.map(ch => (
                    <button 
                      key={ch.id}
                      onClick={() => setActiveChecklistId(ch.id)}
                      className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-all ${
                        activeChecklistId === ch.id
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'bg-slate-50 text-slate-500 border border-slate-200/50'
                      }`}
                    >
                      {ch.title.split(' ')[0]}
                    </button>
                  ))}
                </div>

                <div className="mt-5 space-y-3">
                  {checklistsList.find(ch => ch.id === activeChecklistId)?.items.map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => toggleChecklistItem(activeChecklistId, item.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start space-x-3 ${
                        item.completed 
                          ? 'bg-emerald-50/50 border-emerald-200' 
                          : 'bg-slate-50 hover:bg-slate-100/50 border-slate-100'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={item.completed} 
                        onChange={() => {}} // toggled by parent div
                        className="rounded border-slate-300 text-primary focus:ring-primary mt-0.5"
                      />
                      <div>
                        <span className={`text-xs font-bold block ${item.completed ? 'text-emerald-900 line-through' : 'text-slate-800'}`}>
                          {item.task}
                        </span>
                        <span className="text-[10px] text-slate-500 mt-0.5 block">{item.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Columns: Templates & SOPs Library */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">Business Plans & Templates</h3>
                  <p className="text-xs text-slate-500">Industry outline formats required for formal regulatory approvals.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {templatesList.map(temp => (
                      <div key={temp.id} className="bg-white border border-slate-200/50 p-5 rounded-2xl flex flex-col justify-between">
                        <div>
                          <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-2xl uppercase">
                            {temp.category}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm mt-2">{temp.title}</h4>
                          <p className="text-slate-500 text-xs mt-1 leading-relaxed">{temp.description}</p>
                        </div>
                        <button 
                          onClick={() => setActiveTemplate(temp)}
                          className="neomorph-btn w-full mt-4 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold py-2"
                        >
                          View Outline Blueprint
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">Standard Operating Procedures (SOPs)</h3>
                  <p className="text-xs text-slate-500">Standardize your factory, sales funnel, and warehouse intake processes.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {sopsList.map(sop => (
                      <div key={sop.id} className="bg-white border border-slate-200/50 p-5 rounded-2xl flex flex-col justify-between">
                        <div>
                          <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-2xl uppercase">
                            {sop.category} SOP
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm mt-2">{sop.title}</h4>
                          <p className="text-slate-500 text-xs mt-1 line-clamp-2">{sop.purpose}</p>
                          
                          <div className="mt-3 space-y-1">
                            {sop.steps.slice(0, 2).map((st, idx) => (
                              <div key={idx} className="text-[11px] text-slate-600 flex items-center space-x-1.5">
                                <span className="font-bold text-primary shrink-0">Step {st.stepNo}:</span>
                                <span className="truncate">{st.title}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <button 
                          onClick={() => { setActiveSop(sop); }}
                          className="neomorph-btn w-full mt-4 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold py-2"
                        >
                          View Full SOP Checklist
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active SOP Detail Modal */}
          {activeSop && (
            <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-xl space-y-5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-2xl uppercase">
                      {activeSop.category} Department SOP
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 mt-2">{activeSop.title}</h2>
                  </div>
                  <button onClick={() => setActiveSop(null)} className="p-1 rounded-2xl bg-slate-100 hover:bg-slate-200">
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Purpose</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{activeSop.purpose}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Scope</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{activeSop.scope}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Responsibilities</h4>
                    <ul className="list-disc ml-4 text-xs text-slate-600 space-y-0.5 mt-1">
                      {activeSop.responsibilities.map((r, idx) => <li key={idx}>{r}</li>)}
                    </ul>
                  </div>
                  
                  <div className="border-t border-slate-100 pt-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Step-by-Step Procedure</h4>
                    <div className="space-y-3">
                      {activeSop.steps.map((st, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start space-x-3">
                          <span className="w-5 h-5 rounded-2xl bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {st.stepNo}
                          </span>
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">{st.title}</span>
                            <span className="text-xs text-slate-500 mt-0.5 block">{st.action}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button onClick={() => setActiveSop(null)} className="neomorph-btn bg-slate-900 text-white border-slate-950 text-xs font-bold px-5 py-2.5">
                    Close SOP
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------------------------------- */}
      {/* 5. GOVERNMENT SCHEMES SEARCH ENGINE */}
      {/* ---------------------------------------------------------------------------- */}
      {activeTab === 'schemes' && (
        <div className="space-y-6">
          {/* Top filtering controls */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/50 space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              Government Subsidies & Schemes Search Engine
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative col-span-1 md:col-span-2">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search PMEGP, Mudra, Credit guarantee schemes..."
                  value={schemeSearch}
                  onChange={(e) => setSchemeSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 text-sm focus:outline-none"
                />
              </div>

              <div>
                <select 
                  value={schemeSize} 
                  onChange={(e) => setSchemeSize(e.target.value)}
                  className="w-full p-2.5 rounded-2xl border border-slate-200 text-xs focus:outline-none"
                >
                  <option value="All">All Business Sizes</option>
                  <option value="Micro">Micro Enterprises</option>
                  <option value="Small">Small Enterprises</option>
                  <option value="Medium">Medium Enterprises</option>
                </select>
              </div>

              <div>
                <select 
                  value={schemeCategory} 
                  onChange={(e) => setSchemeCategory(e.target.value)}
                  className="w-full p-2.5 rounded-2xl border border-slate-200 text-xs focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  <option value="MSME">MSME Priority</option>
                  <option value="Women">Women Entrepreneurs</option>
                  <option value="Export">Agro / Export</option>
                  <option value="SC/ST">SC/ST Subsidies</option>
                  <option value="Technology">Technology & Patents</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSchemes.map(sch => (
              <div key={sch.id} className="glass-card bg-white border border-slate-200/50 p-6 rounded-3xl flex flex-col justify-between space-y-5">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-2xl uppercase">
                      {sch.category} • {sch.businessSize}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">Updated: {sch.lastUpdated}</span>
                  </div>
                  
                  <h3 className="text-base font-extrabold text-slate-900 mt-3">{sch.name}</h3>
                  <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">{sch.overview}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <span className="text-[9px] font-bold text-slate-500 uppercase block">Eligible Audience</span>
                      <ul className="list-disc ml-3 text-[10px] text-slate-600 mt-1 space-y-0.5">
                        {sch.eligibility.slice(0, 2).map((el, idx) => <li key={idx} className="truncate">{el}</li>)}
                      </ul>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <span className="text-[9px] font-bold text-slate-500 uppercase block">Key Benefits</span>
                      <ul className="list-disc ml-3 text-[10px] text-slate-600 mt-1 space-y-0.5">
                        {sch.benefits.slice(0, 2).map((ben, idx) => <li key={idx} className="truncate">{ben}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <a 
                    href={sch.officialSource} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                  
                  <button 
                    onClick={() => {
                      // Open detail overview modal
                      setActiveArticle({
                        id: sch.id,
                        title: sch.name,
                        shortSummary: sch.overview,
                        fullArticle: `## ${sch.name}

### 1. Overview
${sch.overview}

### 2. General Eligibility Rules
${sch.eligibility.map(e => `*   ${e}`).join('\n')}

### 3. Government Benefits & Subsidies
${sch.benefits.map(b => `*   ${b}`).join('\n')}

### 4. Required Supporting Documents
${sch.documentsRequired.map(d => `*   ${d}`).join('\n')}

### 5. Step-by-Step Application Guidance
${sch.applicationGuidance.map(g => `*   ${g}`).join('\n')}

---
**Disclaimer**: Standard terms applied by partnered commercial lending institutes. Check the official portal at ${sch.officialSource} for the most up to date schedules.`,
                        featuredImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop",
                        author: {
                          name: "BizNxt Policy Cell",
                          role: "MSME Analyst",
                          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
                          bio: "Curating policy and central subsidy layouts for active entrepreneurs."
                        },
                        category: "Subsidies",
                        tags: ["Scheme", "MSME"],
                        readingTime: 4,
                        difficulty: "Beginner",
                        lastUpdated: sch.lastUpdated
                      });
                      setActiveArticle(activeArticle); // state setter trigger
                    }}
                    className="neomorph-btn bg-primary text-white border-primary/20 text-xs font-bold px-4 py-2"
                  >
                    Application Guide
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------------- */}
      {/* 6. BUSINESS CALCULATORS TAB */}
      {/* ---------------------------------------------------------------------------- */}
      {activeTab === 'calculators' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column: Selector */}
          <div className="lg:col-span-1 glass-card bg-white border border-slate-200/50 p-6 rounded-3xl h-fit space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Calculators</h3>
            {[
              { id: 'breakeven', label: 'Break-even', desc: 'Units to cover fixed overheads.' },
              { id: 'investment', label: 'Initial Setup', desc: 'CapEx vs OpEx capital.' },
              { id: 'gst', label: 'GST Estimator', desc: 'Add or extract GST rates.' },
              { id: 'emi', label: 'EMI Repayments', desc: 'Monthly loan payments.' },
              { id: 'roi', label: 'ROI Yield', desc: 'Expected yield on capital.' },
              { id: 'valuation', label: 'Valuation', desc: 'Enterprise value multipliers.' },
              { id: 'profit', label: 'Profit Margin', desc: 'Analyze gross margin %.' },
              { id: 'pricing', label: 'Pricing Engine', desc: 'Markup vs Margin costings.' },
              { id: 'cashflow', label: 'Cash Flow', desc: 'Flow projections.' }
            ].map(calc => (
              <button
                key={calc.id}
                onClick={() => setCalcType(calc.id as any)}
                className={`w-full text-left p-3 rounded-2xl border transition-all flex flex-col ${
                  calcType === calc.id
                    ? 'bg-primary/5 border-primary text-primary'
                    : 'bg-slate-50 hover:bg-slate-100 border-transparent text-slate-700'
                }`}
              >
                <span className="text-xs font-bold">{calc.label}</span>
                <span className="text-[10px] text-slate-500 mt-0.5">{calc.desc}</span>
              </button>
            ))}
          </div>

          {/* Right Columns: Active Calculator Screen */}
          <div className="lg:col-span-3 glass-card bg-white border border-slate-200/50 p-8 rounded-3xl">
            {calcType === 'breakeven' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-900">Break-even Point Calculator</h2>
                  <p className="text-xs text-slate-500">Calculate how many sales you must clear to completely recover your operational costs.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Fixed Overheads (Monthly / Annual) - ₹</label>
                      <input 
                        type="number" 
                        value={fixedCosts} 
                        onChange={(e) => setFixedCosts(Number(e.target.value))}
                        className="w-full p-2 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Variable Cost Per Unit - ₹</label>
                      <input 
                        type="number" 
                        value={variableCostPerUnit} 
                        onChange={(e) => setVariableCostPerUnit(Number(e.target.value))}
                        className="w-full p-2 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Selling Price Per Unit - ₹</label>
                      <input 
                        type="number" 
                        value={sellingPricePerUnit} 
                        onChange={(e) => setSellingPricePerUnit(Number(e.target.value))}
                        className="w-full p-2 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Estimated Break-even Metrics</span>
                      <div className="mt-4 space-y-4">
                        <div>
                          <span className="text-xs font-semibold text-slate-500 block">Required Units to Break-even</span>
                          <span className="text-2xl font-extrabold text-slate-900">{breakEvenUnits.toLocaleString('en-IN')} units</span>
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-slate-500 block">Required Revenue to Break-even</span>
                          <span className="text-xl font-bold text-primary">₹ {breakEvenSales.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed border-t border-slate-200/60 pt-4 mt-4">
                      *Margin per unit is ₹{marginPerUnit}. To increase profitability, try lowering your variable product costs or raising selling margins.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {calcType === 'investment' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-900">CapEx & OpEx Setup Investment Estimator</h2>
                  <p className="text-xs text-slate-500">Model machinery CapEx, license procurement, and working capital buffers.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase">Capital Expenditures (CapEx)</h3>
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Machinery & Infrastructure Setup - ₹</label>
                      <input 
                        type="number" 
                        value={capexEquipment} 
                        onChange={(e) => setCapexEquipment(Number(e.target.value))}
                        className="w-full p-2 rounded-2xl border border-slate-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Licenses, Brand Registration & Legal filings - ₹</label>
                      <input 
                        type="number" 
                        value={capexLicensing} 
                        onChange={(e) => setCapexLicensing(Number(e.target.value))}
                        className="w-full p-2 rounded-2xl border border-slate-200 text-sm"
                      />
                    </div>

                    <h3 className="text-xs font-bold text-slate-500 uppercase pt-2">Monthly Operational Expenditures (OpEx)</h3>
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Rent, Utilities & Power loads - ₹</label>
                      <input 
                        type="number" 
                        value={opexRental} 
                        onChange={(e) => setOpexRental(Number(e.target.value))}
                        className="w-full p-2 rounded-2xl border border-slate-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Monthly Staff Salaries - ₹</label>
                      <input 
                        type="number" 
                        value={opexSalary} 
                        onChange={(e) => setOpexSalary(Number(e.target.value))}
                        className="w-full p-2 rounded-2xl border border-slate-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Working Capital Buffer - {workingCapitalMonths} Months</label>
                      <input 
                        type="range" 
                        min="1" 
                        max="12" 
                        value={workingCapitalMonths} 
                        onChange={(e) => setWorkingCapitalMonths(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Required Launch Budget</span>
                      <div className="mt-4 space-y-4">
                        <div>
                          <span className="text-xs font-semibold text-slate-500 block">Total CapEx Required</span>
                          <span className="text-lg font-bold text-slate-900">₹ {totalCapex.toLocaleString('en-IN')}</span>
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-slate-500 block">Working Capital Buffer ({workingCapitalMonths} Mo)</span>
                          <span className="text-lg font-bold text-slate-900">₹ {workingCapitalNeeded.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="pt-3 border-t border-slate-200/60">
                          <span className="text-xs font-bold text-slate-500 block">Minimum Recommended Startup Capital</span>
                          <span className="text-2xl font-extrabold text-primary">₹ {totalInitialInvestment.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed mt-4">
                      *A standard 6 months runway is recommended by BizNxt trade specialists to absorb pre-revenue marketing cycles.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* GST Calculator */}
            {calcType === 'gst' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-900">GST Invoice Rate Estimator</h2>
                  <p className="text-xs text-slate-500">Estimate raw material input GST or total invoice values instantly.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1 font-mono">Invoice Amount - ₹</label>
                      <input 
                        type="number" 
                        value={gstAmount} 
                        onChange={(e) => setGstAmount(Number(e.target.value))}
                        className="w-full p-2 rounded-2xl border border-slate-200 text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Tax Rate percentage (%)</label>
                      <select 
                        value={gstRate} 
                        onChange={(e) => setGstRate(Number(e.target.value))}
                        className="w-full p-2.5 rounded-2xl border border-slate-200 text-xs focus:outline-none"
                      >
                        <option value="5">5% (Slab A)</option>
                        <option value="12">12% (Slab B)</option>
                        <option value="18">18% (Standard Services/MFG)</option>
                        <option value="28">28% (Luxury Goods)</option>
                      </select>
                    </div>
                    <div className="flex space-x-3 pt-2">
                      <button 
                        onClick={() => setGstMode('add')} 
                        className={`flex-1 py-2 rounded-2xl text-xs font-bold border transition-all ${
                          gstMode === 'add' ? 'bg-primary/10 text-primary border-primary' : 'bg-slate-50 text-slate-500 border-transparent'
                        }`}
                      >
                        Add GST
                      </button>
                      <button 
                        onClick={() => setGstMode('remove')} 
                        className={`flex-1 py-2 rounded-2xl text-xs font-bold border transition-all ${
                          gstMode === 'remove' ? 'bg-primary/10 text-primary border-primary' : 'bg-slate-50 text-slate-500 border-transparent'
                        }`}
                      >
                        Extract GST
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">GST Audit Breakdown</span>
                      <div className="mt-4 space-y-3 font-mono">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Base Net Value:</span>
                          <span className="font-bold">₹ {calculatedBaseGst.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">CGST ({(gstRate / 2)}%):</span>
                          <span className="font-bold">₹ {(calculatedGst / 2).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">SGST ({(gstRate / 2)}%):</span>
                          <span className="font-bold">₹ {(calculatedGst / 2).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs border-t border-slate-200/60 pt-3 mt-3">
                          <span className="text-slate-700 font-bold">Total Invoice Value:</span>
                          <span className="font-extrabold text-primary text-base">₹ {calculatedTotalGst.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed mt-4">
                      *Ensure you claim this ITC credit by matching your vendor's GSTR-1 file with your GSTR-2B ledger monthly.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {calcType === 'profit' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-900">Profit Margin Calculator</h2>
                  <p className="text-xs text-slate-500">Analyze your gross profit efficiency based on sales and COGS.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Total Revenue - ₹</label>
                      <input type="number" value={revenueInput} onChange={(e) => setRevenueInput(Number(e.target.value))} className="w-full p-2 border rounded-2xl" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Cost of Goods Sold (COGS) - ₹</label>
                      <input type="number" value={cogsInput} onChange={(e) => setCogsInput(Number(e.target.value))} className="w-full p-2 border rounded-2xl" />
                    </div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border text-center flex flex-col justify-center">
                    <span className="text-xs text-slate-500 uppercase font-bold block">Gross Profit Margin</span>
                    <h3 className="text-3xl font-extrabold text-primary mt-2">{marginPercentage.toFixed(2)}%</h3>
                    <p className="text-xs text-slate-500 mt-2">Gross Profit: ₹{grossProfit.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            )}

            {calcType === 'pricing' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-900">Pricing & Markup Engine</h2>
                  <p className="text-xs text-slate-500">Calculate the ideal selling price to maintain target margins.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Product Cost Price - ₹</label>
                      <input type="number" value={costPrice} onChange={(e) => setCostPrice(Number(e.target.value))} className="w-full p-2 border rounded-2xl" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Desired Margin (%)</label>
                      <input type="number" value={desiredMargin} onChange={(e) => setDesiredMargin(Number(e.target.value))} className="w-full p-2 border rounded-2xl" />
                    </div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border text-center flex flex-col justify-center">
                    <span className="text-xs text-slate-500 uppercase font-bold block">Recommended Selling Price</span>
                    <h3 className="text-3xl font-extrabold text-primary mt-2">₹ {Math.ceil(sellingPrice).toLocaleString('en-IN')}</h3>
                    <p className="text-xs text-slate-500 mt-2">Profit per unit: ₹{(sellingPrice - costPrice).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}

            {calcType === 'cashflow' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-900">Cash Flow Projection</h2>
                  <p className="text-xs text-slate-500">Predict your cash balance over the next 12 months.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Initial Cash Balance - ₹</label>
                      <input type="number" value={initialCash} onChange={(e) => setInitialCash(Number(e.target.value))} className="w-full p-2 border rounded-2xl" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Monthly Cash Inflow - ₹</label>
                      <input type="number" value={monthlyInflow} onChange={(e) => setMonthlyInflow(Number(e.target.value))} className="w-full p-2 border rounded-2xl" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Monthly Cash Outflow - ₹</label>
                      <input type="number" value={monthlyOutflow} onChange={(e) => setMonthlyOutflow(Number(e.target.value))} className="w-full p-2 border rounded-2xl" />
                    </div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border text-center flex flex-col justify-center">
                    <span className="text-xs text-slate-500 uppercase font-bold block">12-Month Projected Balance</span>
                    <h3 className={`text-3xl font-extrabold mt-2 ${projection12Mo < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                      ₹ {projection12Mo.toLocaleString('en-IN')}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2">Monthly Burn/Surplus: ₹{monthlyNet.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            )}
            {['emi', 'roi', 'valuation'].includes(calcType) && (
              <div className="space-y-6">
                {calcType === 'emi' && (
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">EMI Repayment Calculator</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-slate-600 block mb-1">Loan Amount - ₹</label>
                          <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} className="w-full p-2 border rounded-2xl" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-600 block mb-1">Interest Rate (% p.a.)</label>
                          <input type="number" value={loanInterest} onChange={(e) => setLoanInterest(Number(e.target.value))} className="w-full p-2 border rounded-2xl" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-600 block mb-1">Tenure (Years)</label>
                          <input type="number" value={loanTenure} onChange={(e) => setLoanTenure(Number(e.target.value))} className="w-full p-2 border rounded-2xl" />
                        </div>
                      </div>
                      <div className="bg-slate-50 p-5 rounded-2xl border">
                        <span className="text-xs text-slate-500 uppercase font-bold block">Monthly EMI</span>
                        <h3 className="text-2xl font-extrabold text-primary mt-1">₹ {Math.ceil(calculatedEmi).toLocaleString('en-IN')}</h3>
                        
                        <div className="space-y-2 mt-4 text-xs font-mono border-t pt-3">
                          <div className="flex justify-between"><span>Principal Loan:</span><span>₹ {loanAmount.toLocaleString('en-IN')}</span></div>
                          <div className="flex justify-between"><span>Total Interest:</span><span>₹ {Math.ceil(totalInterest).toLocaleString('en-IN')}</span></div>
                          <div className="flex justify-between border-t pt-2 font-bold text-slate-800"><span>Total Payable:</span><span>₹ {Math.ceil(totalPayable).toLocaleString('en-IN')}</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {calcType === 'roi' && (
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">ROI Yield Simulator</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-slate-600 block mb-1">Initial Capital Cost - ₹</label>
                          <input type="number" value={roiInitial} onChange={(e) => setRoiInitial(Number(e.target.value))} className="w-full p-2 border rounded-2xl" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-600 block mb-1">Estimated Final Asset Value / Returns - ₹</label>
                          <input type="number" value={roiGains} onChange={(e) => setRoiGains(Number(e.target.value))} className="w-full p-2 border rounded-2xl" />
                        </div>
                      </div>
                      <div className="bg-slate-50 p-5 rounded-2xl border text-center flex flex-col justify-center">
                        <span className="text-xs text-slate-500 uppercase font-bold block">Calculated ROI</span>
                        <h3 className="text-3xl font-extrabold text-emerald-600 mt-2">{calculatedRoi}%</h3>
                        <p className="text-xs text-slate-500 mt-3">Net Gain / Profit of ₹{(roiGains - roiInitial).toLocaleString('en-IN')} on deployment.</p>
                      </div>
                    </div>
                  </div>
                )}
                {calcType === 'valuation' && (
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Enterprise Valuation Multiples</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-slate-600 block mb-1">Annual EBITDA or Seller Discretionary Earnings (SDE) - ₹</label>
                          <input type="number" value={valuationEbitda} onChange={(e) => setValuationEbitda(Number(e.target.value))} className="w-full p-2 border rounded-2xl" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-600 block mb-1">Industry Multiple (e.g. 2.5x to 5x)</label>
                          <input type="number" step="0.1" value={valuationMultiple} onChange={(e) => setValuationMultiple(Number(e.target.value))} className="w-full p-2 border rounded-2xl" />
                        </div>
                      </div>
                      <div className="bg-slate-50 p-5 rounded-2xl border text-center flex flex-col justify-center">
                        <span className="text-xs text-slate-500 uppercase font-bold block">Estimated Business Valuation</span>
                        <h3 className="text-2xl font-extrabold text-primary mt-2">₹ {calculatedValuation.toLocaleString('en-IN')}</h3>
                        <p className="text-[10px] text-slate-500 mt-3">Based on {valuationMultiple}x multiple of operating profit margins.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------------- */}
      {/* 7. AI ASSISTANT TAB */}
      {/* ---------------------------------------------------------------------------- */}
      {activeTab === 'assistant' && (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/50">
            <div className="flex items-center space-x-2.5 text-primary text-xs font-bold tracking-wider uppercase mb-3">
              <Sparkles className="w-4.5 h-4.5" />
              <span>India's Leading AI Corporate Consultant</span>
            </div>
            <h2 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">
              Ask any Sourcing, Compliance, or Licensing Question
            </h2>
            <p className="text-slate-500 text-sm mt-1 max-w-2xl leading-relaxed">
              BizNxt Assistant scans legal codes, MSME subsidy portals, and export regulations to design professional corporate guidelines.
            </p>

            <form onSubmit={handleAskAi} className="mt-6 flex flex-col md:flex-row gap-3">
              <input 
                type="text"
                placeholder="e.g. How do I apply for CGTMSE collateral-free loan? Or What machinery is needed for potato chip manufacturing?"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                className="flex-1 p-3.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                disabled={aiLoading}
              />
              <button 
                type="submit"
                disabled={aiLoading || !aiQuestion.trim()}
                className="neomorph-btn bg-primary text-white border-primary/20 px-6 py-3.5 text-xs font-bold flex items-center justify-center space-x-2 shrink-0 disabled:opacity-50"
              >
                {aiLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Query Assistant</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* AI Response Display Area */}
          <AnimatePresence mode="wait">
            {aiLoading && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white p-8 rounded-3xl border border-slate-100 flex flex-col items-center justify-center h-64 text-center"
              >
                <RefreshCw className="w-8 h-8 text-primary animate-spin mb-3" />
                <h3 className="text-sm font-bold text-slate-800">Searching BizNxt Knowledge Base...</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">Scanning legal guidelines, factory layout procedures, and custom export modules.</p>
              </motion.div>
            )}

            {aiResponse && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* 1. Primary Educational Answer */}
                <div className="glass-card bg-white border border-slate-200/60 p-8 rounded-3xl">
                  <div className="flex items-center space-x-2 mb-4 border-b border-slate-100 pb-3">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <h3 className="text-base font-bold text-slate-900">Educational Insights & Findings</h3>
                  </div>
                  <div className="prose prose-slate max-w-none text-slate-700">
                    {formatMarkdown(aiResponse.answer)}
                  </div>
                </div>

                {/* 2. Structured Side panels */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Related Blueprints & Sourcing Templates */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/50">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Suggested Checklists & Templates</h4>
                    <div className="space-y-3">
                      {aiResponse.relatedTemplates?.map((t: any, idx: number) => (
                        <div key={idx} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
                          <span className="text-[9px] font-bold text-primary block uppercase">{t.type}</span>
                          <span className="text-xs font-bold text-slate-800 block mt-0.5">{t.name}</span>
                          <span className="text-xs text-slate-500 mt-1 block leading-relaxed">{t.utility}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sourcing Services & Feasibility reports */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/50 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Recommended BizNxt Services</h4>
                      {aiResponse.suggestedServices?.map((srv: any, idx: number) => (
                        <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-start">
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">{srv.name}</span>
                            <span className="text-[11px] text-slate-500 mt-0.5 block leading-relaxed">{srv.benefit}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-slate-100 pt-3">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Market Reports</h4>
                      {aiResponse.recommendedReports?.map((rep: any, idx: number) => (
                        <div key={idx} className="p-2 bg-slate-50 rounded-2xl flex justify-between items-center text-xs">
                          <span className="font-medium text-slate-700">{rep.name}</span>
                          <span className="text-[10px] text-slate-500">{rep.focus}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Recommended Roadmap Path */}
                {aiResponse.learningPath && (
                  <div className="bg-slate-900 text-white p-6 rounded-3xl">
                    <h4 className="text-xs font-bold text-primary-light uppercase tracking-wider mb-3">Recommended Execution Pathway</h4>
                    <h3 className="text-base font-extrabold mb-4">{aiResponse.learningPath.title}</h3>
                    <div className="space-y-3">
                      {aiResponse.learningPath.steps?.map((step: string, idx: number) => (
                        <div key={idx} className="flex items-start space-x-3 text-xs">
                          <span className="w-5 h-5 rounded-2xl bg-primary text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-slate-400 leading-relaxed mt-0.5">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Strict Professional Consulting Disclaimer */}
                {aiResponse.consultingDisclaimer && (
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start space-x-3">
                    <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-[11px] text-amber-800 leading-relaxed">
                      <span className="font-bold uppercase block mb-1">Corporate Regulatory Disclaimer</span>
                      {aiResponse.consultingDisclaimer}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ---------------------------------------------------------------------------- */}
      {/* 8. PROFILE / BOOKMARKS / PROGRESS TAB */}
      {/* ---------------------------------------------------------------------------- */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Progress summary card */}
          <div className="lg:col-span-1 glass-card bg-white border border-slate-200/50 p-6 rounded-3xl space-y-5">
            <h3 className="text-base font-bold text-slate-900">Learning Progress</h3>
            
            <div className="space-y-4 font-mono text-xs">
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500 uppercase">Guides Read:</span>
                <span className="font-bold text-slate-800">{bookmarkedArticles.length} / {articlesList.length}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500 uppercase">SOPs Bookmarked:</span>
                <span className="font-bold text-slate-800">{bookmarkedTemplates.length}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500 uppercase">Video Lessons Watched:</span>
                <span className="font-bold text-slate-800">{completedLessons.length}</span>
              </div>
            </div>

            {/* Achievements and Badges */}
            <div className="border-t border-slate-100 pt-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">My Achievement Badges</h4>
              <div className="flex flex-wrap gap-2">
                {completedLessons.length >= 1 ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-2xl flex items-center space-x-1">
                    <Award className="w-3 h-3" />
                    <span>First Step Sourced</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-2xl">
                    No Badges yet
                  </span>
                )}
                {bookmarkedArticles.length >= 2 && (
                  <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-2xl flex items-center space-x-1">
                    <BookOpen className="w-3 h-3" />
                    <span>Knowledge Seeker</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Columns: Bookmarked Items directory */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Saved Articles & Handbooks</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {bookmarkedArticles.length > 0 ? (
                  articlesList.filter(art => bookmarkedArticles.includes(art.id)).map(art => (
                    <div key={art.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
                      <div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase block">{art.category}</span>
                        <span className="text-xs font-bold text-slate-800 block mt-0.5 line-clamp-1">{art.title}</span>
                      </div>
                      <button 
                        onClick={() => { setActiveArticle(art); setActiveTab('articles'); }}
                        className="text-xs font-bold text-primary hover:underline shrink-0 ml-3"
                      >
                        Open
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">No guides saved. Visit the Guides tab to bookmark items.</p>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Saved Blueprints & Outlines</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {bookmarkedTemplates.length > 0 ? (
                  templatesList.filter(t => bookmarkedTemplates.includes(t.id)).map(t => (
                    <div key={t.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
                      <div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase block">{t.category}</span>
                        <span className="text-xs font-bold text-slate-800 block mt-0.5 line-clamp-1">{t.title}</span>
                      </div>
                      <button 
                        onClick={() => { setActiveTemplate(t); setActiveTab('templates'); }}
                        className="text-xs font-bold text-primary hover:underline shrink-0 ml-3"
                      >
                        Open
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">No document templates saved yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------------- */}
      {/* 9. ADMIN PANEL TAB */}
      {/* ---------------------------------------------------------------------------- */}
      {activeTab === 'admin' && (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/50">
            <h2 className="text-xl font-display font-extrabold text-slate-900 tracking-tight mb-2">
              BizNxt Editorial Console
            </h2>
            <p className="text-xs text-slate-500">Publish fresh articles, guides, custom SOPs, and checklists instantly to the database.</p>
            
            <div className="flex space-x-2 mt-6 border-b border-slate-100 pb-1">
              {['Articles', 'Videos', 'Templates', 'SOPs', 'Schemes'].map(t => (
                <button key={t} className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-primary border-b-2 border-transparent hover:border-primary transition-all">
                  Manage {t}
                </button>
              ))}
            </div>

            <form onSubmit={handleAddArticle} className="space-y-4 mt-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Publish New Article Guide</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Article Title</label>
                  <input 
                    type="text" 
                    value={newArtTitle} 
                    onChange={(e) => setNewArtTitle(e.target.value)}
                    placeholder="e.g. Navigating Dubai Silicon Oasis Licensing"
                    className="w-full p-2.5 rounded-2xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Target Category</label>
                  <select 
                    value={newArtCategory} 
                    onChange={(e) => setNewArtCategory(e.target.value)}
                    className="w-full p-2.5 rounded-2xl border border-slate-200 text-xs focus:outline-none"
                  >
                    {KNOWLEDGE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Short Executive Summary</label>
                <input 
                  type="text" 
                  value={newArtSummary} 
                  onChange={(e) => setNewArtSummary(e.target.value)}
                  placeholder="2-sentence hook detailing margins, licenses, or requirements..."
                  className="w-full p-2.5 rounded-2xl border border-slate-200 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Full Article Body (Markdown supported)</label>
                <textarea 
                  rows={6}
                  value={newArtContent} 
                  onChange={(e) => setNewArtContent(e.target.value)}
                  placeholder="## Heading 1\nDetailed content block here...\n\n* Bullet point"
                  className="w-full p-2.5 rounded-2xl border border-slate-200 text-xs focus:outline-none font-mono"
                ></textarea>
              </div>

              <div className="flex justify-between items-center gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Difficulty level</label>
                  <select 
                    value={newArtDifficulty} 
                    onChange={(e) => setNewArtDifficulty(e.target.value as any)}
                    className="p-2 rounded-2xl border text-xs focus:outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  className="neomorph-btn bg-primary text-white border-primary/20 px-6 py-2.5 text-xs font-bold"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
