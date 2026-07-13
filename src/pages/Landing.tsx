import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Building2, 
  Search, 
  Zap, 
  MessageSquare,
  Briefcase, 
  Play, 
  Rocket,
  X, 
  Shield, 
  Globe, 
  Award, 
  Sparkles, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  HelpCircle, 
  BookOpen, 
  Clock, 
  Users, 
  ArrowUpRight, 
  Check,
  Landmark,
  Scale,
  FileText,
  Compass,
  ExternalLink
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export default function Landing() {
  const navigate = useNavigate();
  const { success } = useToast();

  // Welcome Splash Screen State
  const [showSplash, setShowSplash] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Landing Page Interactive States
  const [activeStep, setActiveStep] = useState(0);
  const [industryFilter, setIndustryFilter] = useState('all');
  const [successStoryIndex, setSuccessStoryIndex] = useState(0);
  const [serviceCategory, setServiceCategory] = useState('all');
  const [pricingCycle, setPricingCycle] = useState('annual'); // annual or monthly
  const [faqSearch, setFaqSearch] = useState('');
  const [faqCategory, setFaqCategory] = useState('all');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeDemoTab, setActiveDemoTab] = useState('ai_report');

  // Interactive showcase carousel shift state
  const [showcaseIndex, setShowcaseIndex] = useState(0);

  // Mouse Parallax Effect for Apple Liquid UI
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Splash Loading Simulator
  useEffect(() => {
    // Check if splash was already shown in this session
    const alreadyShown = sessionStorage.getItem('biznxt_splash_shown_v3');
    if (alreadyShown) {
      setShowSplash(false);
      return;
    }

    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShowSplash(false);
            sessionStorage.setItem('biznxt_splash_shown_v3', 'true');
          }, 400);
          return 100;
        }
        // Smooth random increments to look premium
        const increment = Math.floor(Math.random() * 12) + 6;
        return Math.min(prev + increment, 100);
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  // Handler for booking consultation directly from landing page
  const handleDirectConsultationBook = () => {
    success("Navigating to setup call scheduling panel inside your workspace...");
    navigate('/dashboard');
  };

  const industries = [
    { id: 'all', name: 'All Sectors' },
    { id: 'manufacturing', name: 'Manufacturing', icon: Building2, desc: 'Factory setup, custom clearance, sourcing & supply line operations.' },
    { id: 'trade', name: 'Import & Export', icon: Globe, desc: 'DGFT licensing, custom compliance, global trade logistics, freight forwarding.' },
    { id: 'retail', name: 'Retail & D2C', icon: Zap, desc: 'E-commerce operations, local distribution networks, trademark filing, packaging.' },
    { id: 'tech', name: 'Technology & AI', icon: Sparkles, desc: 'SaaS licensing, data governance, funding audits, IP protection.' },
    { id: 'food', name: 'Food & Agro', icon: Briefcase, desc: 'FSSAI compliance, cold chain mapping, regional trade certifications.' },
  ];

  const filteredIndustries = industryFilter === 'all' 
    ? industries.filter(ind => ind.id !== 'all') 
    : industries.filter(ind => ind.id === industryFilter);

  const steps = [
    { 
      number: '01', 
      title: 'Free Discovery', 
      subtitle: 'Free Business Assessment',
      desc: 'Enter your raw startup or manufacturing expansion idea. Our real-time AI parses market feasibility, estimates GST/custom thresholds, and generates an instant structural scorecard.' 
    },
    { 
      number: '02', 
      title: 'Premium Research', 
      subtitle: 'Market Intelligence',
      desc: 'Commission a deep-dive research dossier compiled by verified analysts. Covers competition heatmaps, industrial zone recommendations, and compliance cost pipelines.' 
    },
    { 
      number: '03', 
      title: 'Business Launch', 
      subtitle: 'Operational Incorporation',
      desc: 'Get incorporated securely. We assign a dedicated Business Success Manager to coordinate company registration, GST setup, state industrial permits, and legal trust deeds.' 
    },
    { 
      number: '04', 
      title: 'Business Growth', 
      subtitle: 'Operational Scaling',
      desc: 'Deploy automated CRM systems, manage verified partners, structure MSME scheme applications, and initiate supply chain search algorithms directly from your cockpit.' 
    },
    { 
      number: '05', 
      title: 'Global Expansion', 
      subtitle: 'Cross-Border Domination',
      desc: 'Export with confidence. Avail premium DGFT advisory, source foreign buyers with verified intelligence, and streamline multi-currency trade invoice processing.' 
    },
  ];

  const successStories = [
    {
      company: 'Zenith Organic Polymers',
      location: 'Ahmedabad, Gujarat',
      growth: '340% YoY Growth',
      tagline: 'From Local Batching to Global Export',
      before: 'Sourcing reliable raw materials took 6 weeks. Heavy compliance overhead led to import cargo holding.',
      after: 'Onboarded via BizNxt verified manufacturers network. Custom clearance and IEC license expedited in 5 days.',
      author: 'Rajesh Shah',
      role: 'Managing Director',
      rating: 5,
    },
    {
      company: 'AeroDrive Telematics',
      location: 'Pune, Maharashtra',
      growth: '180% Faster Launch',
      tagline: 'Pre-Engineered Setup to Series-A',
      before: 'Stuck with unverified consultants demanding 2% equity for basic corporate structuring and GST filing.',
      after: 'AI Business Setup wizard defined standard LLP structure. Dedicated CS oversaw setup for ₹12,500 flat fee.',
      author: 'Anjali Deshmukh',
      role: 'Co-founder & COO',
      rating: 5,
    },
    {
      company: 'KisanCare Agro Exports',
      location: 'Nashik, Maharashtra',
      growth: '₹2.8 Crore Export Order Value',
      tagline: 'Secured Global Cold Chain Operations',
      before: 'Zero knowledge on export compliance pathways or APEDA trade subsidies.',
      after: 'Acquired automated Premium Market Intelligence report. Secured APEDA subsidies worth ₹18 Lakhs on platform.',
      author: 'Siddharth Patil',
      role: 'Founder',
      rating: 5,
    },
  ];

  const services = [
    { id: '1', title: 'Basic Research', category: 'setup', desc: 'Entry level business research overview with local market feasibility insights.', price: '₹499', rating: '4.9/5' },
    { id: '2', title: 'GST Registration + Filing', category: 'trade', desc: 'Complete GST registration and assistance with your first filing.', price: '₹4,999', rating: '4.8/5' },
    { id: '3', title: 'ITR Filing', category: 'setup', desc: 'Professional assistance with filing your Income Tax Return.', price: '₹4,999', rating: '4.9/5' },
    { id: '4', title: 'Trade License - Karnataka', category: 'growth', desc: 'Assistance in obtaining a trade license from local authorities in Karnataka.', price: '₹14,999', rating: '4.7/5' },
    { id: '5', title: 'CA Assisted Tax Filing', category: 'legal', desc: 'Dedicated CA assistance for complex tax situations and planning.', price: '₹18,999', rating: '4.9/5' },
    { id: '6', title: 'Enterprise Research', category: 'legal', desc: 'Comprehensive research covering multi-location expansion and operational planning.', price: '₹19,999', rating: '4.9/5' },
  ];

  const filteredServices = serviceCategory === 'all' 
    ? services 
    : services.filter(ser => ser.category === serviceCategory);

  const faqList = [
    { q: "What exactly is BizNxt OS 3.0?", a: "BizNxt OS is a comprehensive business operating system designed for modern Indian founders, manufacturers, and global traders. It bridges the gap between high-scale AI business intelligence and verified human consulting. We provide automated research, compliance setup, MSME loan facilitation, and cross-border trade routing on a single ledger.", cat: "general" },
    { q: "How does the Free Business Discovery report work?", a: "When you start a discovery task, our AI parses your business proposal against real-world parameters: regional competitor density, required compliance matrices (GST, FSSAI, IEC, Factory Acts), state-wise incentives, and custom-duty tariffs. It generates a detailed preliminary report instantly.", cat: "research" },
    { q: "What is the role of a Business Success Manager (BSM)?", a: "A BSM is your human single-point-of-contact who owns your business tickets. When you purchase an incorporation, trade, or trademark service, a verified BSM coordinates the entire legal draft preparation, schedules CA review calls, and ensures fast delivery without any hidden charges.", cat: "consulting" },
    { q: "Is the pricing truly transparent?", a: "Yes. All service fees, government registry charges, and expert commission payouts are detailed upfront. There are no hidden back-end retainers or unexpected compliance charges.", cat: "pricing" },
    { q: "Can BizNxt assist in raising MSME business loans?", a: "Yes. We help prepare the bankable Project Report, perform credit feasibility scores, align your Udhyam certification, and route your pitch to our verified network of PSU and Private banking partners.", cat: "growth" }
  ];

  const filteredFaqs = faqList.filter(faq => {
    const matchesSearch = faq.q.toLowerCase().includes(faqSearch.toLowerCase()) || faq.a.toLowerCase().includes(faqSearch.toLowerCase());
    const matchesCat = faqCategory === 'all' || faq.cat === faqCategory;
    return matchesSearch && matchesCat;
  });

  const blogPosts = [
    {
      title: "How to Secure Interest Subvention Under India's MSME Schemes (2026)",
      desc: "An in-depth guide on the Credit Guarantee Fund Trust (CGTMSE) and how setup-ready manufacturing units can claim up to 2% interest relief on working capital.",
      category: "Government Schemes",
      time: "5 min read",
      author: "Pranav Iyer, CA",
      date: "July 08, 2026"
    },
    {
      title: "Mastering the RoDTEP Scheme for Global Exporters",
      desc: "Maximize your custom duty refunds. Learn the precise compliance steps to declare RoDTEP codes on shipping bills to claim up to 4.3% rebate on export value.",
      category: "Import Export",
      time: "8 min read",
      author: "Meera Krishnan, Custom Attorney",
      date: "July 01, 2026"
    },
    {
      title: "Choosing Between LLP vs. Private Limited for Bootstrapped Startups",
      desc: "Unpacking setup timelines, statutory compliance costs, and tax optimization avenues. Why 80% of tech startups prefer Pvt Ltd for equity-based fundraising.",
      category: "Business Setup",
      time: "6 min read",
      author: "Siddhesh Desai, CS",
      date: "June 25, 2026"
    }
  ];

  return (
    <div className="flex-1 w-full relative min-h-screen">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10 bg-background overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            x: [0, 30, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-3xl blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, -40, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-3xl blur-[100px]" 
        />
      </div>

      <div className="w-full relative pt-12 pb-24">
        {/* HERO SECTION */}
        <section className="relative text-center max-w-5xl mx-auto pt-16 pb-24 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 glass-card rounded-3xl mb-8"
          >
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-3xl bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-3xl h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">BizNxt OS 5.0 Enterprise Edition</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-display font-black text-slate-900 tracking-tighter leading-[0.9] mb-8"
          >
            Start and Grow <br />
            Your Business <span className="text-primary">Faster.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-lg sm:text-xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed mb-12"
          >
            The all-in-one platform to <span className="text-primary font-bold">set up, manage, and scale</span> your company in India. 
            We combine smart AI tools with real experts to make business simple for everyone.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <Link
              to="/search"
              className="neo-button bg-primary text-white border-primary/20 px-10 py-5 rounded-3xl text-[11px] font-black tracking-widest uppercase flex items-center gap-3 whitespace-nowrap"
            >
              <span>Start Free Search</span>
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>

            <button
              onClick={handleDirectConsultationBook}
              className="neo-button bg-white text-slate-900 px-10 py-5 rounded-3xl text-[11px] font-black tracking-widest uppercase flex items-center gap-3 whitespace-nowrap"
            >
              <Compass size={16} strokeWidth={2.5} className="text-primary" />
              <span>Talk to an Expert</span>
            </button>
          </motion.div>
        </section>

        {/* MISSION & VISION */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card neomorph-flat p-10 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
              <div className="w-14 h-14 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-6 shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-500">
                <Compass className="w-7 h-7" strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-display font-black text-slate-900 mb-6 tracking-tight">Our Mission</h3>
              <p className="text-base font-semibold text-slate-500 leading-relaxed">
                To make starting a business in India easy for everyone. We provide you with smart tools, 
                clear steps to follow, and a team of experts to help you succeed every step of the way. 
                We turn complex paperwork into a simple digital experience.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card neomorph-flat p-10 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
              <div className="w-14 h-14 rounded-3xl bg-accent/10 text-accent flex items-center justify-center mb-6 shadow-sm group-hover:bg-accent group-hover:text-white transition-all duration-500">
                <Rocket className="w-7 h-7" strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-display font-black text-slate-900 mb-6 tracking-tight">Our Vision</h3>
              <p className="text-base font-semibold text-slate-500 leading-relaxed">
                To build the future of business in India, where any idea can be 
                launched and grown globally in just a few days. We want to make sure 
                nothing stops you from building a great company.
              </p>
            </motion.div>
          </div>
        </section>

        {/* METRICS SECTION */}
        <section className="py-24 px-6">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Asset Utilization', value: '99.4%', trend: '+2.4%', color: 'primary' },
                { label: 'Compliance Audit', value: 'Verified', trend: '100%', color: 'success' },
                { label: 'Market Intelligence', value: 'Deep Search', trend: 'Live', color: 'accent' },
                { label: 'Capital Routed', value: '₹40Cr+', trend: 'Total', color: 'warning' },
              ].map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card glass-card-hover p-8 rounded-3xl"
                >
                  <div className="flex justify-between items-start mb-6 whitespace-nowrap">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 whitespace-nowrap">{stat.label}</span>
                    <span className={`text-[10px] font-bold text-${stat.color} bg-${stat.color}/10 px-2 py-0.5 rounded-3xl whitespace-nowrap`}>{stat.trend}</span>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

          {/* Ambient Platform Highlight screenshot block */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 relative"
          >
            {/* Interactive Demo Sandbox inside Landing Page */}
            <div className="glass-card neomorph-flat p-4 sm:p-6 text-left border border-white/50 shadow-2xl relative overflow-hidden">
              
              {/* Inner Window Headers */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-200/50 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-3xl bg-danger/80" />
                  <span className="w-3 h-3 rounded-3xl bg-warning/80" />
                  <span className="w-3 h-3 rounded-3xl bg-success/80" />
                  <span className="text-[10px] font-mono font-bold text-slate-500 ml-2">BIZNXT OS 3.0 • CONSOLE</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setActiveDemoTab('ai_report')}
                    className={`px-3 py-1.5 rounded-3xl text-[10px] font-extrabold uppercase tracking-wider transition-all ${activeDemoTab === 'ai_report' ? 'bg-primary text-white shadow-sm' : 'bg-slate-200/50 text-slate-500 hover:bg-slate-200'}`}
                  >
                    AI Discovery
                  </button>
                  <button 
                    onClick={() => setActiveDemoTab('compliance')}
                    className={`px-3 py-1.5 rounded-3xl text-[10px] font-extrabold uppercase tracking-wider transition-all ${activeDemoTab === 'compliance' ? 'bg-primary text-white shadow-sm' : 'bg-slate-200/50 text-slate-500 hover:bg-slate-200'}`}
                  >
                    Setup Ledger
                  </button>
                  <button 
                    onClick={() => setActiveDemoTab('growth')}
                    className={`px-3 py-1.5 rounded-3xl text-[10px] font-extrabold uppercase tracking-wider transition-all ${activeDemoTab === 'growth' ? 'bg-primary text-white shadow-sm' : 'bg-slate-200/50 text-slate-500 hover:bg-slate-200'}`}
                  >
                    Global Trade
                  </button>
                </div>
              </div>

              {/* Dynamic Sandbox Display */}
              <AnimatePresence mode="wait">
                {activeDemoTab === 'ai_report' && (
                  <motion.div
                    key="ai_report"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    <div className="col-span-2 bg-[#F3F5F9]/80 p-4 rounded-3xl border border-white/60 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-primary flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" /> AI Setup Feasibility Matrix
                        </span>
                        <span className="text-[10px] font-mono font-bold text-success bg-success/10 px-2 py-0.5 rounded-md">8.8/10 feasiBle</span>
                      </div>
                      <div className="space-y-1.5 text-xs text-slate-700">
                        <p className="font-semibold text-slate-900">Recommended Structuring: Private Limited</p>
                        <p className="text-[11px] text-slate-500 leading-relaxed">Based on your requirement of food processing & export to Middle-East, we mapped FSSAI State level permits & DGFT Custom clearances automatically.</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2.5 pt-2">
                        <div className="neomorph-pressed p-2 text-center">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Estimated setup fees</span>
                          <span className="text-sm font-extrabold text-slate-900">₹14,200</span>
                        </div>
                        <div className="neomorph-pressed p-2 text-center">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Timeline to launch</span>
                          <span className="text-sm font-extrabold text-slate-900">12 Days</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#EDF1F7] p-4 rounded-3xl border border-white/60 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Compliance Roadmap</span>
                        <div className="space-y-2 mt-3">
                          <div className="flex items-center gap-2 text-[11px] text-slate-600 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-success" /> GST Identification (IN)
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-600 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-success" /> APEDA Food Export Board
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-600 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> IEC Custom Port Routing
                          </div>
                        </div>
                      </div>
                      <Link 
                        to="/search" 
                        className="mt-4 w-full py-2 bg-primary text-white text-[10px] font-extrabold uppercase tracking-widest text-center rounded-[2rem] block border border-primary/20"
                      >
                        Run Assessment
                      </Link>
                    </div>
                  </motion.div>
                )}

                {activeDemoTab === 'compliance' && (
                  <motion.div
                    key="compliance"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    <div className="bg-[#F3F5F9]/80 p-4 rounded-3xl border border-white/60 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                          <Shield className="w-4 h-4 text-primary" /> Expert Document Folder
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">A safe place for your files. Drag and drop your ID and business papers here for our team to check.</p>
                      </div>
                      <div className="mt-4 p-3 border-2 border-dashed border-slate-300 rounded-[2rem] text-center text-[10px] font-bold text-slate-500">
                        Drop Registration docs here
                      </div>
                    </div>
                    <div className="col-span-2 bg-[#F3F5F9]/80 p-4 rounded-3xl border border-white/60 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-900">My Progress</span>
                        <span className="text-[10px] font-bold text-primary">Registration Filed</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-[#EDF1F7] rounded-[2rem] border border-white/40">
                          <span className="text-[11px] font-bold text-slate-700">1. Digital Signature Setup</span>
                          <span className="text-[9px] font-extrabold text-emerald-600 uppercase bg-emerald-500/10 px-2 py-0.5 rounded">Done</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-[#EDF1F7] rounded-[2rem] border border-white/40">
                          <span className="text-[11px] font-bold text-slate-700">2. Business Name Approval</span>
                          <span className="text-[9px] font-extrabold text-emerald-600 uppercase bg-emerald-500/10 px-2 py-0.5 rounded">Approved</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-[#EDF1F7] rounded-[2rem] border border-white/40">
                          <span className="text-[11px] font-bold text-slate-700">3. Final Registration Form</span>
                          <span className="text-[9px] font-extrabold text-slate-600 uppercase bg-slate-500/10 px-2 py-0.5 rounded">In Review</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeDemoTab === 'growth' && (
                  <motion.div
                    key="growth"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    <div className="col-span-2 bg-[#F3F5F9]/80 p-4 rounded-3xl border border-white/60 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                          <Globe className="w-3.5 h-3.5 text-primary animate-spin-slow" /> Tax & Duty Calculator
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-500">HSN: 39269099</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="neomorph-pressed p-2 text-center">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide block">Basic Custom Duty</span>
                          <span className="text-xs font-extrabold text-slate-800">10.0%</span>
                        </div>
                        <div className="neomorph-pressed p-2 text-center">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide block">Social Welfare Surchg</span>
                          <span className="text-xs font-extrabold text-slate-800">1.0%</span>
                        </div>
                        <div className="neomorph-pressed p-2 text-center">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide block">Integrated GST</span>
                          <span className="text-xs font-extrabold text-slate-800">18.0%</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 italic">Subsidized shipping rates available via Cochin/Nhava Sheva ports under Free Trade Agreement.</p>
                    </div>
                    <div className="bg-[#EDF1F7] p-4 rounded-3xl border border-white/60 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Port Routing Hub</span>
                        <p className="text-[11px] font-bold text-slate-700 mt-2">Active: Mundra Port (INMUN1)</p>
                        <p className="text-[10px] text-slate-500">Connected to shipping and customs systems.</p>
                      </div>
                      <Link 
                        to="/services" 
                        className="mt-4 w-full py-2 bg-slate-950 text-white text-[10px] font-extrabold uppercase tracking-widest text-center rounded-[2rem] block border border-slate-900"
                      >
                        Global Services
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Visual Shadows mimicking NeoMorph behind screen */}
            <div className="absolute inset-x-8 bottom-0 h-4 bg-black/10 blur-md rounded-3xl -z-10" />
          </motion.div>
        </div>
      
        {/* ============================================================== */}
        {/* TRUST SECTION (METRICS & PARTNERS) */}
        {/* ============================================================== */}
        <section className="py-16 relative">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-10">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary block mb-2">Validated Ledger Stats</span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-950">Backed By India's Largest Corporate Legal Trust</h2>
            </div>

            {/* Metric counters with Neumorphic Floating Cards */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
              {[
                { label: 'Verified Partners', count: '150+', desc: 'CAs, CS, Patent Attys' },
                { label: 'Research Reports', count: '1,200+', desc: 'Detailed Dossiers' },
                { label: 'Operational Services', count: '45+', desc: 'End-to-End Solutions' },
                { label: 'Customer Satisfaction', count: '99.2%', desc: 'CSAT Audit Core' },
                { label: 'Global Trade Hubs', count: '12+', desc: 'Ports Monitored' },
                { label: 'MSME Capital Routed', count: '₹40Cr+', desc: 'Collateral-free pathways' }
              ].map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="neomorph-flat p-4 text-center border-none flex flex-col justify-between min-h-[140px]"
                >
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide leading-tight block mb-2">{stat.label}</span>
                  <span className="text-2xl sm:text-3xl font-display font-extrabold text-primary block my-1">{stat.count}</span>
                  <span className="text-[10px] font-semibold text-slate-500 mt-2 block">{stat.desc}</span>
                </motion.div>
              ))}
            </div>

            {/* Partner Logotypes scrolling slider mimicking linear/stripe */}
            <div className="mt-14 p-4 glass-card border border-white/50 backdrop-blur-md overflow-hidden">
              <div className="text-center mb-4">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">Supported by certified bodies & portals</span>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300">
                <span className="text-xs font-black tracking-widest text-slate-600 uppercase">Ministry of MSME</span>
                <span className="text-xs font-black tracking-widest text-slate-600 uppercase">DGFT India</span>
                <span className="text-xs font-black tracking-widest text-slate-600 uppercase">FSSAI Certified</span>
                <span className="text-xs font-black tracking-widest text-slate-600 uppercase">Startup India</span>
                <span className="text-xs font-black tracking-widest text-slate-600 uppercase">MCA Registrar</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* WHY BIZNXT SECTION */}
        {/* ============================================================== */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-primary block mb-2">Unmatched Capabilities</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-950">Why Leaders Build On BizNxt OS</h2>
              <p className="mt-4 text-xs font-semibold text-slate-500">Traditional business setups are broken. We combined instant automated market intelligence with high-performing operational consulting to construct a dynamic, predictable system.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: 'Business Research', icon: Search, desc: 'Detailed competitor mapping, regional market size evaluation, and compliance risk parameters compiled instantly.', url: '/search' },
                { title: 'MSME Business Loans', icon: Landmark, desc: 'Direct mapping to collateral-free CGTMSE loans, public sector banking partnerships, and project report automation.', url: '/dashboard' },
                { title: 'Legal & Trademark', icon: Scale, desc: 'Corporate structuring, trademark searches with 98.4% conflict accuracy, and MCA statutory registries.', url: '/services' },
                { title: 'Manufacturer Search', icon: Building2, desc: 'Direct connections to verified fabrication plants, custom packaging molders, and raw material channels.', url: '/services' },
                { title: 'GST & Compliance Audit', icon: FileText, desc: 'Automate tax numbers, monthly invoice reconciliations, and state pollution control certificates.', url: '/services' },
                { title: 'Brand, Packaging & Web', icon: Zap, desc: 'Elevate your enterprise presence with brand kits, packaging structural drafts, and performant web modules.', url: '/services' },
                { title: 'Global Port Expansion', icon: Globe, desc: 'Ready-to-export DGFT setups, trade credit advisory, custom logistics clearing, and HSN tariff optimization.', url: '/services' },
                { title: 'Dedicated AI Assistant', icon: Sparkles, desc: 'Our trained model monitors MCA, DGFT, and Finance ministry updates to notify changes to your ledger automatically.', url: '/dashboard' }
              ].map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="glass-card glass-card-hover p-6 border-none flex flex-col justify-between min-h-[220px]"
                >
                  <div>
                    <div className="w-9 h-9 rounded-[2rem] bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-950 mb-2">{item.title}</h4>
                    <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                  <Link 
                    to={item.url}
                    className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-primary hover:text-primary-dark transition-colors mt-4 self-start"
                  >
                    <span>Activate</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* HOW IT WORKS TIMELINE SECTION */}
        {/* ============================================================== */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4">
            
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-primary block mb-2">Dynamic Operational Flow</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-950">How BizNxt Orchestrates Setup</h2>
              <p className="mt-4 text-xs font-semibold text-slate-500">From raw hypothesis to global customs routing. Click on any step to trace the automated workflow.</p>
            </div>

            {/* Interactive Steps Controls */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
              {steps.map((step, idx) => (
                <button
                  key={step.number}
                  onClick={() => setActiveStep(idx)}
                  className={`neomorph-btn p-4 border-none text-left flex flex-col justify-between transition-all ${activeStep === idx ? 'bg-primary text-white' : 'hover:bg-slate-100'}`}
                >
                  <span className={`text-[10px] font-mono font-bold block mb-2 ${activeStep === idx ? 'text-white/80' : 'text-slate-500'}`}>{step.number}</span>
                  <span className="text-xs font-bold uppercase tracking-wider">{step.title}</span>
                </button>
              ))}
            </div>

            {/* Display Panel for Selected Step */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="glass-card neomorph-flat p-8 sm:p-10 border-none relative overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-8 items-center"
              >
                
                {/* Step Metadata */}
                <div className="md:col-span-2 space-y-4">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest block bg-primary/10 px-3 py-1 rounded-3xl border border-primary/20 w-fit">
                    {steps[activeStep].subtitle}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-950">
                    Step {steps[activeStep].number}: {steps[activeStep].title}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-slate-500 leading-relaxed">
                    {steps[activeStep].desc}
                  </p>
                  
                  <div className="pt-4 flex gap-4">
                    <Link
                      to="/search"
                      className="neomorph-btn bg-slate-950 text-white hover:bg-slate-900 border-slate-950 px-5 py-3 text-[10px] font-extrabold uppercase tracking-widest"
                    >
                      Initialize System
                    </Link>
                    <button
                      onClick={handleDirectConsultationBook}
                      className="neomorph-btn hover:text-primary px-5 py-3 text-[10px] font-extrabold uppercase tracking-widest"
                    >
                      Consult expert
                    </button>
                  </div>
                </div>

                {/* Animated Graphic representation mock */}
                <div className="bg-[#EDF1F7] p-6 rounded-[2.5rem] border border-white/60 space-y-4 text-center">
                  <div className="w-12 h-12 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2 animate-bounce-slow">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">System Orchestration</span>
                  <div className="space-y-1 text-xs font-bold text-slate-700">
                    <p className="text-primary">100% Secure Ledger</p>
                    <p className="text-emerald-600">Verified CS Checks</p>
                    <p className="text-slate-500">Government Registry Hook</p>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-3xl overflow-hidden relative p-0.5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(activeStep + 1) * 20}%` }}
                      className="h-full bg-primary rounded-3xl"
                    />
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* ============================================================== */}
        {/* INDUSTRIES CORNER */}
        {/* ============================================================== */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4">
            
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-primary block mb-2">Targeted Sector Verticals</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-950">Engineered For Diverse Industries</h2>
              <p className="mt-4 text-xs font-semibold text-slate-500">We construct custom checklists, tax mappings, and partner routing based on your precise market classification.</p>
            </div>

            {/* Industry Filter Chips */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {industries.map(ind => (
                <button
                  key={ind.id}
                  onClick={() => setIndustryFilter(ind.id)}
                  className={`px-4 py-2 rounded-[2rem] text-xs font-bold transition-all border ${industryFilter === ind.id ? 'bg-primary text-white border-primary/15 shadow-md' : 'bg-[#EDF1F7] text-slate-600 border-white/40 hover:bg-slate-200'}`}
                >
                  {ind.name}
                </button>
              ))}
            </div>

            {/* Filtered Display Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIndustries.map((ind, index) => {
                const IconComponent = ind.icon || Building2;
                return (
                  <motion.div
                    key={ind.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="neomorph-flat p-6 border-none flex flex-col justify-between min-h-[200px]"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-[2rem] bg-primary/10 text-primary flex items-center justify-center">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest bg-slate-200/40 px-2 py-0.5 rounded-md">
                          Verified sector
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-950 mb-2">{ind.name}</h4>
                      <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">{ind.desc}</p>
                    </div>
                    <Link
                      to="/services"
                      className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-primary hover:text-primary-dark transition-colors mt-6 self-start"
                    >
                      <span>Explore Sector Services</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </section>

        {/* ============================================================== */}
        {/* SUCCESS STORIES SECTION */}
        {/* ============================================================== */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4">
            
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-primary block mb-2">Proven Track Record</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-950">SME Success Ledger</h2>
              <p className="mt-4 text-xs font-semibold text-slate-500">Real customer data. Unfiltered transformation metrics audited on platform.</p>
            </div>

            {/* Slider container */}
            <div className="relative max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={successStoryIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="glass-card neomorph-flat p-8 sm:p-10 border-none grid grid-cols-1 md:grid-cols-5 gap-8 items-center"
                >
                  
                  {/* Left block metrics */}
                  <div className="md:col-span-2 space-y-4">
                    <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-3xl border border-emerald-500/20 block w-fit">
                      {successStories[successStoryIndex].growth}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-display font-extrabold text-slate-950">
                      {successStories[successStoryIndex].company}
                    </h3>
                    <p className="text-[11px] font-bold text-slate-500">
                      {successStories[successStoryIndex].location}
                    </p>
                    <div className="flex gap-1">
                      {[...Array(successStories[successStoryIndex].rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Right block details - Before vs After */}
                  <div className="md:col-span-3 space-y-4 text-left">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Transformation Journey</span>
                    
                    <div className="space-y-3">
                      <div className="p-3.5 bg-red-500/5 rounded-3xl border border-red-500/10">
                        <span className="text-[9px] font-extrabold text-red-500 uppercase tracking-wider block mb-1">Traditional bottleneck</span>
                        <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">"{successStories[successStoryIndex].before}"</p>
                      </div>
                      <div className="p-3.5 bg-emerald-500/5 rounded-3xl border border-emerald-500/10">
                        <span className="text-[9px] font-extrabold text-emerald-500 uppercase tracking-wider block mb-1">BizNxt OS acceleration</span>
                        <p className="text-[11px] font-semibold text-slate-700 leading-relaxed">"{successStories[successStoryIndex].after}"</p>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-between items-center border-t border-slate-200/50">
                      <div>
                        <span className="text-xs font-bold text-slate-950 block">{successStories[successStoryIndex].author}</span>
                        <span className="text-[10px] font-semibold text-slate-500">{successStories[successStoryIndex].role}</span>
                      </div>
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>

              {/* Slider Navigation */}
              <div className="flex justify-center gap-3 mt-6">
                <button
                  onClick={() => setSuccessStoryIndex(prev => (prev === 0 ? successStories.length - 1 : prev - 1))}
                  className="neomorph-btn p-3 text-slate-600 hover:text-primary border-none"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSuccessStoryIndex(prev => (prev === successStories.length - 1 ? 0 : prev + 1))}
                  className="neomorph-btn p-3 text-slate-600 hover:text-primary border-none"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* ============================================================== */}
        {/* SERVICE SHOWCASE CAROUSEL */}
        {/* ============================================================== */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4">
            
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-primary block mb-2">A La Carte Services</span>
                <h2 className="text-3xl font-display font-bold text-slate-950">Trending Operations Catalogs</h2>
                <p className="mt-2 text-xs font-semibold text-slate-500 max-w-lg">Acquire legal certificates, DGFT permits, or tax registrations instantly on clear, upfront pricing.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {['all', 'setup', 'trade', 'growth', 'legal'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setServiceCategory(cat);
                      setShowcaseIndex(0);
                    }}
                    className={`px-3 py-1.5 rounded-3xl text-[10px] font-extrabold uppercase tracking-widest transition-all border ${serviceCategory === cat ? 'bg-primary text-white border-primary/20 shadow-sm' : 'bg-[#EDF1F7] text-slate-500 border-white/40'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Horizontal Draggable/Slide Container */}
            <div className="relative overflow-hidden py-4 px-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredServices.map((service, idx) => (
                  <motion.div
                    key={service.id}
                    layout
                    className="glass-card glass-card-hover p-6 border-none flex flex-col justify-between min-h-[240px] relative overflow-hidden"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[9px] font-mono font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                          {service.category}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
                          <Star className="w-3 h-3 fill-amber-500" /> {service.rating}
                        </div>
                      </div>
                      <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-slate-950 mb-2">{service.title}</h4>
                      <p className="text-[11px] font-semibold text-slate-500 leading-relaxed mb-6">{service.desc}</p>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-200/50">
                      <div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Flat rate fee</span>
                        <span className="text-sm font-extrabold text-slate-950">{service.price}</span>
                      </div>
                      <Link
                        to="/services"
                        className="neomorph-btn bg-[#F3F5F9] px-3.5 py-2 text-[9px] font-extrabold uppercase tracking-widest text-primary hover:bg-primary hover:text-white border-none"
                      >
                        Book Ticket
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ============================================================== */}
        {/* PRICING PLANS */}
        {/* ============================================================== */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4">
            
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-primary block mb-2">Transparent Subscriptions</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-950">Scale Packages Suited For Your Journey</h2>
              <p className="mt-4 text-xs font-semibold text-slate-500 font-medium">All plans include secure corporate cloud folders, compliance ledgers, and automated AI assistance audits.</p>
              
              {/* Billing toggle */}
              <div className="inline-flex items-center gap-3 bg-[#EDF1F7] p-1 rounded-[2rem] border border-white/40 mt-8">
                <button
                  onClick={() => setPricingCycle('monthly')}
                  className={`px-4 py-2 rounded-3xl text-[10px] font-extrabold uppercase tracking-widest transition-all ${pricingCycle === 'monthly' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'}`}
                >
                  Monthly Retainer
                </button>
                <button
                  onClick={() => setPricingCycle('annual')}
                  className={`px-4 py-2 rounded-3xl text-[10px] font-extrabold uppercase tracking-widest transition-all ${pricingCycle === 'annual' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'}`}
                >
                  Annual Billing (Save 20%)
                </button>
              </div>
            </div>

            {/* Pricing Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Card 1 */}
              <div className="neomorph-flat p-8 border-none flex flex-col justify-between min-h-[500px]">
                <div className="space-y-4 text-left">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Idea Validation</span>
                  <h3 className="text-lg font-bold uppercase text-slate-900">Discovery Plan</h3>
                  <p className="text-[11px] font-semibold text-slate-500">Perfect for bootstrapped founders and student ventures trying to evaluate viability.</p>
                  
                  <div className="py-2">
                    <span className="text-3xl font-display font-extrabold text-slate-950">₹0</span>
                    <span className="text-[10px] font-bold text-slate-500 block mt-1">Free Forever</span>
                  </div>

                  <ul className="space-y-2.5 pt-4 text-[11px] font-semibold text-slate-600">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-primary shrink-0" /> Real-time Feasibility Audits
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-primary shrink-0" /> LLP Structuring Scorecards
                    </li>
                    <li className="flex items-center gap-2 font-bold text-slate-800">
                      <Check className="w-3.5 h-3.5 text-primary shrink-0" /> Standard AI Chatbot Access
                    </li>
                    <li className="flex items-center gap-2 text-slate-500 line-through">
                      <X className="w-3.5 h-3.5 text-slate-500 shrink-0" /> Premium Market Analyst Report
                    </li>
                    <li className="flex items-center gap-2 text-slate-500 line-through">
                      <X className="w-3.5 h-3.5 text-slate-500 shrink-0" /> Dedicated Business Success Manager
                    </li>
                  </ul>
                </div>

                <Link
                  to="/search"
                  className="mt-8 w-full py-3 neomorph-btn text-center text-xs font-extrabold uppercase tracking-widest hover:text-primary border-none"
                >
                  Start Discovery Free
                </Link>
              </div>

              {/* Card 2 (Popular Option) */}
              <div className="neomorph-flat p-8 border-none flex flex-col justify-between min-h-[500px] relative bg-white ring-2 ring-primary/20">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white text-[9px] font-extrabold uppercase tracking-[0.25em] px-4 py-1.5 rounded-3xl border border-primary/20">
                  Most Requested Scale Plan
                </div>

                <div className="space-y-4 text-left">
                  <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest block">Operational Growth</span>
                  <h3 className="text-lg font-bold uppercase text-slate-900">SME Expansion</h3>
                  <p className="text-[11px] font-semibold text-slate-500">For active manufacturers, retail operations, and D2C startups requiring ongoing compliance filing.</p>
                  
                  <div className="py-2">
                    <span className="text-4xl font-display font-extrabold text-slate-950">
                      {pricingCycle === 'annual' ? '₹8,500' : '₹10,500'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 block mt-1">per Month {pricingCycle === 'annual' && '(billed annually)'}</span>
                  </div>

                  <ul className="space-y-2.5 pt-4 text-[11px] font-semibold text-slate-600">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-primary shrink-0" /> MCA filings & ongoing secretarial audits
                    </li>
                    <li className="flex items-center gap-2 font-bold text-slate-800">
                      <Check className="w-3.5 h-3.5 text-primary shrink-0" /> Dedicated Business Success Manager
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-primary shrink-0" /> GST filings & custom port routing checks
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-primary shrink-0" /> Fast-track MSME loan project dossiers
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-primary shrink-0" /> Global Trademark and Patent monitoring
                    </li>
                  </ul>
                </div>

                <button
                  onClick={handleDirectConsultationBook}
                  className="mt-8 w-full py-3 neomorph-btn bg-primary text-white hover:bg-primary-dark text-xs font-extrabold uppercase tracking-widest border-none"
                >
                  Request Onboarding Call
                </button>
              </div>

              {/* Card 3 */}
              <div className="neomorph-flat p-8 border-none flex flex-col justify-between min-h-[500px]">
                <div className="space-y-4 text-left">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Cross-Border Domination</span>
                  <h3 className="text-lg font-bold uppercase text-slate-900">Global Corporate</h3>
                  <p className="text-[11px] font-semibold text-slate-500">For heavy manufacturers, high-volume trading desks, and international corporations.</p>
                  
                  <div className="py-2">
                    <span className="text-3xl font-display font-extrabold text-slate-950">Custom Pricing</span>
                    <span className="text-[10px] font-bold text-slate-500 block mt-1">Tailored Quote on Audit</span>
                  </div>

                  <ul className="space-y-2.5 pt-4 text-[11px] font-semibold text-slate-600">
                    <li className="flex items-center gap-2 font-bold text-slate-800">
                      <Check className="w-3.5 h-3.5 text-primary shrink-0" /> Full MCA compliance & custom board resolutions
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-primary shrink-0" /> International customs advisory & trade finance
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-primary shrink-0" /> DGFT/RoDTEP benefit maximization audit
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-primary shrink-0" /> Factory safety & labor statutory setups
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-primary shrink-0" /> High-tier API access to compliance ledger
                    </li>
                  </ul>
                </div>

                <button
                  onClick={handleDirectConsultationBook}
                  className="mt-8 w-full py-3 neomorph-btn text-center text-xs font-extrabold uppercase tracking-widest hover:text-primary border-none"
                >
                  Schedule Enterprise Call
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* FAQ ACCORDION SECTION */}
        {/* ============================================================== */}
        <section className="py-20 relative">
          <div className="max-w-4xl mx-auto px-4">
            
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-primary block mb-2">Instant Clarifications</span>
              <h2 className="text-3xl font-display font-bold text-slate-950">Frequently Asked Questions</h2>
              <p className="mt-4 text-xs font-semibold text-slate-500">Type in your query below or filter by categorical tags.</p>
            </div>

            {/* Category tabs + Search bar inside FAQ */}
            <div className="space-y-4 mb-10">
              <input
                type="text"
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                placeholder="Search queries e.g. GST, MCA, BSM..."
                className="w-full px-4 py-3.5 neomorph-pressed text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
              />
              <div className="flex flex-wrap gap-2 justify-center">
                {['all', 'general', 'research', 'consulting', 'pricing', 'growth'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFaqCategory(cat)}
                    className={`px-3 py-1.5 rounded-3xl text-[10px] font-extrabold uppercase tracking-widest transition-all ${faqCategory === cat ? 'bg-primary text-white shadow-sm' : 'bg-slate-200/50 text-slate-500 hover:bg-slate-200'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Expandable Accordion */}
            <div className="space-y-4">
              {filteredFaqs.length > 0 ? filteredFaqs.map((faq, i) => (
                <div key={i} className="neomorph-flat p-5 border-none">
                  <div className="flex gap-3 justify-between items-start text-left">
                    <span className="w-1.5 h-1.5 rounded-3xl bg-primary mt-2 shrink-0" />
                    <div className="flex-1">
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-950 uppercase tracking-wide">{faq.q}</h4>
                      <p className="text-[11px] font-semibold text-slate-500 mt-2 leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 text-xs font-bold text-slate-500">
                  No matches found for "{faqSearch}". Try another keyword or request custom consulting.
                </div>
              )}
            </div>

          </div>
        </section>

        {/* ============================================================== */}
        {/* BLOG SECTION */}
        {/* ============================================================== */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4">
            
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-primary block mb-2">Platform Library</span>
                <h2 className="text-3xl font-display font-bold text-slate-950">Market Intelligence & Guides</h2>
                <p className="mt-2 text-xs font-semibold text-slate-500 max-w-lg font-medium">Keep pace with latest Union budget provisions, MSME subsidies, and DGFT custom updates.</p>
              </div>
              <button
                onClick={() => success("Navigating to dynamic educational database catalog...")}
                className="neomorph-btn px-4 py-2.5 text-[10px] font-extrabold uppercase tracking-widest hover:text-primary border-none"
              >
                Browse All Guides
              </button>
            </div>

            {/* Blog Post cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogPosts.map((post, i) => (
                <div key={i} className="glass-card glass-card-hover p-6 border-none flex flex-col justify-between min-h-[300px]">
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between items-center text-[9px] font-extrabold uppercase tracking-widest text-slate-500">
                      <span className="text-primary bg-primary/10 px-2.5 py-1 rounded-3xl border border-primary/20">{post.category}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.time}</span>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-950 uppercase tracking-wide leading-snug hover:text-primary transition-colors cursor-pointer pt-1">
                      {post.title}
                    </h3>
                    <p className="text-[11px] font-semibold text-slate-500 leading-relaxed line-clamp-3">
                      {post.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200/50 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-bold text-slate-950 block">{post.author}</span>
                      <span className="text-[9px] font-semibold text-slate-500">{post.date}</span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 hover:text-primary transition-colors cursor-pointer" />
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      
        {/* ============================================================== */}
        {/* CUSTOMER TESTIMONIALS SECTION */}
        {/* ============================================================== */}
        <section className="py-24 bg-slate-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-primary block mb-2">Wall of Success</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-950">Voices of the New India</h2>
              <p className="mt-4 text-xs font-semibold text-slate-500">From solo entrepreneurs to high-growth ventures, BizNxt is the catalyst for Indian business success.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Vikram Mehta",
                  role: "Founder, GreenGrid Solutions",
                  content: "BizNxt transformed our complex EV charging infrastructure idea into a fully operational business in record time. Their AI research is pure gold.",
                  image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram"
                },
                {
                  name: "Ananya Iyer",
                  role: "CEO, BioCraft India",
                  content: "The end-to-end execution support from BizNxt is unmatched. From GST to trademark, everything was handled with extreme professionalism.",
                  image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya"
                },
                {
                  name: "Rahul Khanna",
                  role: "Director, Apex Logistics",
                  content: "Starting a business in India used to be a nightmare. BizNxt made it feel like a walk in the park. Highly recommended for every new founder.",
                  image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul"
                }
              ].map((testimonial, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card p-8 rounded-[2.5rem] flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex text-amber-400 gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm font-medium text-slate-700 italic leading-relaxed">"{testimonial.content}"</p>
                  </div>
                  <div className="flex items-center gap-4 mt-8 pt-6 border-t border-slate-100">
                    <div className="w-12 h-12 rounded-3xl overflow-hidden bg-slate-100 border-2 border-white shadow-sm">
                      <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-none">{testimonial.name}</h4>
                      <p className="text-[10px] font-semibold text-slate-500 mt-1">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="py-24 px-6 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto glass-card neomorph-flat p-12 sm:p-20 text-center relative overflow-hidden group"
          >
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-3xl -ml-32 -mt-32 blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/5 rounded-3xl -mr-32 -mb-32 blur-3xl animate-pulse" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary block mb-6">
                Operational Readiness Protocol
              </span>
              <h2 className="text-4xl sm:text-6xl font-display font-black text-slate-900 mb-8 tracking-tighter leading-tight">
                Ready to Architect Your <br />
                <span className="text-primary italic">Global Success?</span>
              </h2>
              <p className="text-lg font-semibold text-slate-500 mb-12 leading-relaxed">
                Join 1,200+ Indian manufacturers and startups who have automated their compliance, 
                funding, and global trade operations using the BizNxt OS.
              </p>
              
              <div className="flex flex-wrap justify-center gap-6">
                <Link
                  to="/login"
                  className="neomorph-btn bg-primary text-white hover:bg-primary-dark border-none px-10 py-5 text-[11px] font-black tracking-widest uppercase flex items-center gap-3 shadow-xl shadow-primary/20"
                >
                  <span>Initialize Your OS</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/contact"
                  className="neomorph-btn bg-white text-slate-900 border-none px-10 py-5 text-[11px] font-black tracking-widest uppercase flex items-center gap-3 shadow-xl"
                >
                  <MessageSquare size={16} className="text-primary" />
                  <span>Talk to an Architect</span>
                </Link>
              </div>

              <div className="mt-12 flex items-center justify-center gap-8 grayscale opacity-50">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-slate-900" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ISO 27001 Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-slate-900" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">99.9% Up-time SLA</span>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

      <AnimatePresence>
        {isVideoModalOpen ? (
          <div className="fixed inset-0 z-[10000] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-3xl glass-card border border-white/50 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start pb-4 border-b border-slate-200/50">
                <div>
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-primary block">BIZNXT Interactive Workspace Walkthrough</span>
                  <h3 className="text-lg font-display font-bold text-slate-950 mt-1">Explore the Enterprise Operations Panel</h3>
                </div>
                <button
                  onClick={() => setIsVideoModalOpen(false)}
                  className="neomorph-btn p-2 text-slate-500 hover:text-slate-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Dynamic Simulated Walkthrough Interface with interactive checklist */}
              <div className="bg-[#EDF1F7] p-5 rounded-[2.5rem] border border-white/60 space-y-6">
                
                <div className="flex justify-between items-center bg-white p-3.5 rounded-3xl border border-white/60">
                  <span className="text-xs font-extrabold text-slate-950">Quick-Action Checklist for Setup</span>
                  <span className="text-[10px] font-bold text-primary font-mono">Real-Time Sync Ready</span>
                </div>

                <div className="space-y-3">
                  {[
                    { id: '1', title: '1. Auto-Initiate MCA Company Registration Name Search', status: 'ready' },
                    { id: '2', title: '2. Prepare DSC & DIN founders credentials pipeline', status: 'ready' },
                    { id: '3', title: '3. Formulate SPICe+ digital application dossier', status: 'ready' },
                    { id: '4', title: '4. Register MSME Udhyam portal hooks for subsidies', status: 'ready' },
                    { id: '5', title: '5. Route Trade credentials to DGFT custom portals', status: 'ready' }
                  ].map(act => (
                    <div 
                      key={act.id} 
                      className="flex items-center justify-between p-3 bg-[#F3F5F9]/80 rounded-3xl border border-white/60"
                    >
                      <span className="text-xs font-bold text-slate-700">{act.title}</span>
                      <button 
                        onClick={() => success(`Simulated demo action successfully parsed: ${act.title}`)}
                        className="px-3.5 py-1.5 bg-primary text-white text-[9px] font-extrabold uppercase tracking-widest rounded-[2rem] border border-primary/20"
                      >
                        Run Walkthrough
                      </button>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] text-slate-500 text-center italic">
                  This simulated walkthrough demonstrates how the BizNxt OS automated hooks resolve legal registrations instantly in the backend.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/50">
                <button
                  onClick={() => setIsVideoModalOpen(false)}
                  className="neomorph-btn px-5 py-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-600"
                >
                  Dismiss Walkthrough
                </button>
                <Link
                  to="/search"
                  className="neomorph-btn bg-primary text-white hover:bg-primary-dark px-5 py-3 text-[10px] font-extrabold uppercase tracking-widest border-none"
                >
                  Initialize Free System
                </Link>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
);
}
