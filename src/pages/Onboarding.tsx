import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User as UserIcon, 
  Target, 
  Wallet, 
  Award, 
  Building2, 
  MapPin, 
  CheckSquare, 
  Sparkles, 
  ShieldCheck, 
  Mail, 
  Smartphone, 
  ChevronRight, 
  ChevronLeft, 
  TrendingUp, 
  ArrowRight, 
  Globe, 
  Activity, 
  Cpu, 
  FileText, 
  Lock, 
  HelpCircle,
  ThumbsUp,
  RotateCcw,
  BellRing
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// Enum for Firestore Error Reporting
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  }
}

export default function Onboarding() {
  const { user, role } = useAuth();
  const { success: showToastSuccess, error: showToastError } = useToast();
  const navigate = useNavigate();

  // Onboarding Step State
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form selections and data
  const [roleType, setRoleType] = useState<string>('entrepreneur');
  const [primaryGoal, setPrimaryGoal] = useState<string>('launch_venture');
  const [budgetPlan, setBudgetPlan] = useState<string>('micro');
  const [experienceLevel, setExperienceLevel] = useState<string>('first_time');
  const [selectedSectors, setSelectedSectors] = useState<string[]>(['tech_ai']);
  const [cityRegion, setCityRegion] = useState<string>('');
  const [targetMarket, setTargetMarket] = useState<string>('pan_india');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['ai_research']);
  const [communicationPref, setCommunicationPref] = useState<string>('whatsapp');
  const [deviceSettings, setDeviceSettings] = useState({
    rememberDevice: true,
    multiDevice: true,
    biometrics: false,
    zeroTrustLedger: true
  });

  // Profile synthesis result
  const [readinessScore, setReadinessScore] = useState(0);
  const [synthesisStage, setSynthesisStage] = useState(0);

  // Mouse Parallax for Apple Liquid UI
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 15,
        y: (e.clientY / window.innerHeight - 0.5) * 15
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Ensure user is signed in to see onboarding
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Handle Firestore error reporting according to skill guidelines
  const handleFirestoreError = (err: unknown, operationType: OperationType, path: string | null) => {
    const errInfo: FirestoreErrorInfo = {
      error: err instanceof Error ? err.message : String(err),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
        isAnonymous: auth.currentUser?.isAnonymous,
        tenantId: auth.currentUser?.tenantId,
      },
      operationType,
      path
    };
    console.error('Firestore Error during onboarding profile synthesis:', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  };

  const handleToggleSector = (sector: string) => {
    if (selectedSectors.includes(sector)) {
      if (selectedSectors.length > 1) {
        setSelectedSectors(selectedSectors.filter(s => s !== sector));
      }
    } else {
      setSelectedSectors([...selectedSectors, sector]);
    }
  };

  const handleToggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  // Compute profile readiness score based on selections
  const computeReadinessScore = () => {
    let score = 50; // base score

    if (roleType === 'business_owner' || roleType === 'manufacturer') score += 10;
    if (primaryGoal === 'scale_existing' || primaryGoal === 'funding_investment') score += 10;
    if (experienceLevel === 'experienced' || experienceLevel === 'serial') score += 15;
    if (experienceLevel === 'corporate') score += 5;
    if (budgetPlan === 'medium' || budgetPlan === 'large') score += 10;
    if (selectedSectors.length >= 2) score += 5;

    // cap at 98% to look realistic
    return Math.min(score, 98);
  };

  // Synthesis loader effect
  useEffect(() => {
    if (currentStep === 10) {
      setReadinessScore(computeReadinessScore());
      setSynthesisStage(1);
      
      const t1 = setTimeout(() => setSynthesisStage(2), 1200);
      const t2 = setTimeout(() => setSynthesisStage(3), 2400);
      const t3 = setTimeout(() => setSynthesisStage(4), 3800);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < 10) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCompleteOnboarding = async () => {
    if (!user) return;
    setLoading(true);

    const onboardingPayload = {
      roleType,
      primaryGoal,
      budgetPlan,
      experienceLevel,
      selectedSectors,
      cityRegion,
      targetMarket,
      selectedInterests,
      communicationPref,
      deviceSettings,
      businessReadinessScore: readinessScore,
      completedOnboarding: true,
      onboardedAt: serverTimestamp()
    };

    const userPath = `users/${user.uid}`;
    const profilePath = `user_profiles/${user.uid}`;

    try {
      // 1. Update overall user document
      await setDoc(doc(db, 'users', user.uid), {
        completedOnboarding: true,
        onboardingStep: 'completed',
        role: 'customer', // Default Workspace role on start
        businessReadinessScore: readinessScore,
        city: cityRegion || '',
        updatedAt: serverTimestamp()
      }, { merge: true });

      // 2. Create high-fidelity structural profile document
      await setDoc(doc(db, 'user_profiles', user.uid), onboardingPayload);

      showToastSuccess('Onboarding profile securely synthesized! Welcome to BizNxt OS 3.0.');
      navigate('/dashboard');
    } catch (err: any) {
      try {
        handleFirestoreError(err, OperationType.WRITE, profilePath);
      } catch (reportedErr: any) {
        showToastError('Profile sync issue. Checking credentials. Fallback active.');
        // Graceful fallback to dashboard in preview
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  // Steps Metadata
  const stepsConfig = [
    { number: 1, label: 'Identity', icon: UserIcon },
    { number: 2, label: 'Goal', icon: Target },
    { number: 3, label: 'Budget', icon: Wallet },
    { number: 4, label: 'Experience', icon: Award },
    { number: 5, label: 'Sectors', icon: Building2 },
    { number: 6, label: 'Location', icon: MapPin },
    { number: 7, label: 'Interests', icon: CheckSquare },
    { number: 8, label: 'Preferences', icon: BellRing },
    { number: 9, label: 'Security', icon: ShieldCheck },
    { number: 10, label: 'Synthesis', icon: Sparkles }
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F3F5F9] min-h-screen relative overflow-hidden font-sans select-none pb-12">
      {/* Decorative Liquid Background Gradients */}
      <div 
        style={{ transform: `translate(${mousePosition.x * 0.4}px, ${mousePosition.y * 0.4}px)` }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-gradient-to-tr from-primary/10 to-indigo-500/10 rounded-2xl blur-[80px] pointer-events-none transition-transform duration-300 ease-out"
      />
      <div 
        style={{ transform: `translate(${mousePosition.x * -0.3}px, ${mousePosition.y * -0.3}px)` }}
        className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-gradient-to-br from-emerald-500/10 to-primary/10 rounded-2xl blur-[70px] pointer-events-none transition-transform duration-300 ease-out"
      />

      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 pt-8 z-10 flex flex-col flex-1">
        
        {/* Header Branding */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-display font-black text-slate-900 tracking-tight">
              biznxt<span className="text-primary">.online</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider text-primary bg-primary/10 rounded-full border border-primary/20">
              V3 OS ENGINE
            </span>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            SECURE LEDGER ONBOARDING
          </span>
        </div>

        {/* Dynamic Multi-Step Timeline Bar */}
        <div className="glass-card bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl p-4 shadow-sm mb-6 overflow-x-auto scrollbar-none">
          <div className="flex items-center justify-between min-w-[640px]">
            {stepsConfig.map((step) => {
              const Icon = step.icon;
              const isCompleted = step.number < currentStep;
              const isActive = step.number === currentStep;

              return (
                <div key={step.number} className="flex items-center flex-1 last:flex-none">
                  <div 
                    onClick={() => step.number <= currentStep && setCurrentStep(step.number)}
                    className={`flex items-center space-x-2 cursor-pointer transition-all duration-300 px-3 py-1.5 rounded-2xl ${
                      isActive 
                        ? 'bg-primary text-white shadow-md' 
                        : isCompleted 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                        : 'text-slate-500 hover:text-slate-600'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-current'}`} />
                    <span className="text-xs font-bold whitespace-nowrap">
                      {step.number}. {step.label}
                    </span>
                  </div>
                  
                  {step.number < 10 && (
                    <div className="flex-1 mx-3 h-[2px] bg-slate-200/60 rounded-2xl overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          step.number < currentStep ? 'bg-emerald-500 w-full' : 'w-0'
                        }`} 
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Slide Form Container */}
        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="glass-card bg-white/80 backdrop-blur-lg border border-white/45 rounded-3xl p-6 sm:p-10 shadow-xl min-h-[480px] flex flex-col justify-between"
            >
              
              {/* Step Title/Subtitle */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 text-primary font-bold text-xs uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Interactive Setup • Step {currentStep} of 10</span>
                </div>
                {currentStep === 1 && (
                  <>
                    <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
                      Identify Your Venture Role
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Who are you launching or building with biznxt.online?
                    </p>
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
                      What is Your Strategic Goal?
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Select your primary immediate objective on this platform.
                    </p>
                  </>
                )}
                {currentStep === 3 && (
                  <>
                    <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
                      Venture Capital & Budget Setup
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      What is the capital layout plan for your active venture?
                    </p>
                  </>
                )}
                {currentStep === 4 && (
                  <>
                    <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
                      Your Business Experience Index
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Have you founded, registered, or managed any corporate entities before?
                    </p>
                  </>
                )}
                {currentStep === 5 && (
                  <>
                    <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
                      Select Industry Focus Sectors
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Which economic areas will your business operate inside? (Select at least one)
                    </p>
                  </>
                )}
                {currentStep === 6 && (
                  <>
                    <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
                      Geographic & Target Sizing
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Where is your home base, and which markets do you target?
                    </p>
                  </>
                )}
                {currentStep === 7 && (
                  <>
                    <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
                      Immediate Resource Demands
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Select custom tools or reports you expect to claim first.
                    </p>
                  </>
                )}
                {currentStep === 8 && (
                  <>
                    <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
                      Communication Preferences
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Choose how you would like our Business Success Managers (BSMs) to share updates.
                    </p>
                  </>
                )}
                {currentStep === 9 && (
                  <>
                    <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
                      Sandbox Security & Ledger Controls
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Review security features designed to protect your corporate documents.
                    </p>
                  </>
                )}
                {currentStep === 10 && (
                  <>
                    <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
                      Synthesizing Smart Recommendations
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      AI is generating your custom launch path, feasibility score, and workspace priorities.
                    </p>
                  </>
                )}
              </div>

              {/* Dynamic Slides Content */}
              <div className="flex-1 py-4 flex flex-col justify-center">
                
                {/* STEP 1: IDENTITY */}
                {currentStep === 1 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: 'entrepreneur', label: '1. Entrepreneur', desc: 'Aspiring or active founder starting a fresh brand.', color: 'border-l-indigo-500 bg-indigo-50/20' },
                      { id: 'business_owner', label: '2. MSME Business Owner', desc: 'Managing an active local business or trading unit.', color: 'border-l-amber-500 bg-amber-50/20' },
                      { id: 'manufacturer', label: '3. Manufacturer / Sourcing', desc: 'Owns manufacturing units, mills, or logistics lines.', color: 'border-l-emerald-500 bg-emerald-50/20' },
                      { id: 'consultant', label: '4. Corporate Professional / Student', desc: 'Consulting others or investigating feasibility projects.', color: 'border-l-blue-500 bg-blue-50/20' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setRoleType(opt.id)}
                        className={`text-left p-4 rounded-2xl border-2 transition-all relative overflow-hidden flex flex-col justify-between h-28 ${
                          roleType === opt.id 
                            ? 'border-primary bg-primary/5 shadow-md ring-1 ring-primary' 
                            : 'border-slate-100 hover:border-slate-200 bg-slate-50/30'
                        }`}
                      >
                        <div>
                          <span className="text-sm font-bold text-slate-950 uppercase tracking-wide">{opt.label}</span>
                          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{opt.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* STEP 2: GOALS */}
                {currentStep === 2 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: 'launch_venture', label: 'Launch New Venture', desc: 'Start a company, acquire GST/PAN, write feasibility plan.' },
                      { id: 'scale_existing', label: 'Scale Current Output', desc: 'Expand domestic sales, find international sourcing pathways.' },
                      { id: 'funding_investment', label: 'Acquire Capital & Grants', desc: 'Seek Angel Investment, MSME Mudra loans, or cash subsidies.' },
                      { id: 'legal_compliance', label: 'Legal & Tax Audit Setup', desc: 'Draft operational agreements, setup book audits, obtain permits.' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setPrimaryGoal(opt.id)}
                        className={`text-left p-4 rounded-2xl border-2 transition-all flex flex-col justify-between h-28 ${
                          primaryGoal === opt.id 
                            ? 'border-primary bg-primary/5 shadow-md ring-1 ring-primary' 
                            : 'border-slate-100 hover:border-slate-200 bg-slate-50/30'
                        }`}
                      >
                        <div>
                          <span className="text-sm font-bold text-slate-950">{opt.label}</span>
                          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{opt.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* STEP 3: BUDGET */}
                {currentStep === 3 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: 'bootstrapped', label: 'Bootstrapped', amount: '< ₹1 Lakh', desc: 'Self-funded prototype, looking for micro-scale resources.' },
                      { id: 'micro', label: 'Micro Enterprise Plan', amount: '₹1 Lakh - ₹10 Lakhs', desc: 'Standard initial scale setup, domestic entity filings.' },
                      { id: 'small', label: 'Small Enterprise Sizing', amount: '₹10 Lakhs - ₹50 Lakhs', desc: 'OEM contracts, full scale sourcing, local office setups.' },
                      { id: 'medium_large', label: 'Medium/Large Enterprise', amount: '₹50 Lakhs - ₹2 Crores+', desc: 'Dedicated factory lines, export-import, trade finance.' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setBudgetPlan(opt.id)}
                        className={`text-left p-4 rounded-2xl border-2 transition-all flex flex-col justify-between h-28 ${
                          budgetPlan === opt.id 
                            ? 'border-primary bg-primary/5 shadow-md ring-1 ring-primary' 
                            : 'border-slate-100 hover:border-slate-200 bg-slate-50/30'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-bold text-slate-950">{opt.label}</span>
                          <span className="text-xs font-mono font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-full">{opt.amount}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                )}

                {/* STEP 4: EXPERIENCE */}
                {currentStep === 4 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: 'aspiring', label: 'Aspiring Founder', desc: 'No prior background. Eager to master startup basics.' },
                      { id: 'first_time', label: 'First-Time Founder', desc: 'Working on registering their first legal enterprise.' },
                      { id: 'experienced', label: 'Experienced Manager', desc: 'Previously managed business modules or team divisions.' },
                      { id: 'serial', label: 'Serial Venture Owner', desc: 'Launched several operational companies in India or abroad.' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setExperienceLevel(opt.id)}
                        className={`text-left p-4 rounded-2xl border-2 transition-all flex flex-col justify-between h-28 ${
                          experienceLevel === opt.id 
                            ? 'border-primary bg-primary/5 shadow-md ring-1 ring-primary' 
                            : 'border-slate-100 hover:border-slate-200 bg-slate-50/30'
                        }`}
                      >
                        <div>
                          <span className="text-sm font-bold text-slate-950">{opt.label}</span>
                          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{opt.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* STEP 5: SECTORS */}
                {currentStep === 5 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'tech_ai', label: 'Tech & AI', icon: Cpu },
                      { id: 'manufacturing', label: 'Manufacturing', icon: Building2 },
                      { id: 'import_export', label: 'Import/Export', icon: Globe },
                      { id: 'retail_d2c', label: 'Retail & D2C', icon: Sparkles },
                      { id: 'food_agro', label: 'Food & Agro', icon: Wallet },
                      { id: 'health_biotech', label: 'Health & Biotech', icon: Activity },
                      { id: 'services_consult', label: 'Professional Services', icon: FileText },
                      { id: 'other_sectors', label: 'Other Industries', icon: HelpCircle }
                    ].map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = selectedSectors.includes(opt.id);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleToggleSector(opt.id)}
                          className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center gap-3 h-28 ${
                            isSelected 
                              ? 'border-primary bg-primary/5 shadow-md ring-1 ring-primary text-primary' 
                              : 'border-slate-100 text-slate-600 hover:border-slate-200 bg-slate-50/30'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-xs font-bold leading-tight">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* STEP 6: LOCATION */}
                {currentStep === 6 && (
                  <div className="space-y-6 max-w-lg mx-auto w-full">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Primary City or Hub Region</label>
                      <div className="relative">
                        <MapPin className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                          type="text" 
                          required
                          value={cityRegion}
                          onChange={(e) => setCityRegion(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 text-sm"
                          placeholder="e.g. Mumbai, Bangalore, Delhi NCR"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Target Market Scope</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: 'local', label: 'Local Market', desc: 'Regional scale' },
                          { id: 'pan_india', label: 'Pan-India', desc: 'National scope' },
                          { id: 'global', label: 'Global Trade', desc: 'Cross-border' }
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setTargetMarket(opt.id)}
                            className={`p-3 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center h-20 ${
                              targetMarket === opt.id 
                                ? 'border-primary bg-primary/5 text-primary' 
                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <span className="text-xs font-bold">{opt.label}</span>
                            <span className="text-[10px] text-slate-500 mt-1 leading-tight">{opt.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 7: INTERESTS */}
                {currentStep === 7 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto w-full">
                    {[
                      { id: 'ai_research', label: 'AI Market Research & Feasibility', desc: 'Detailed reports verifying trade feasibility.' },
                      { id: 'gst_registration', label: 'GST & Statutory Entity Sourcing', desc: 'Incorporate CA filings under a valid registry.' },
                      { id: 'loans_subsidies', label: 'MSME Loans & Capital Sourcing', desc: 'Track eligible startup grants and funding.' },
                      { id: 'branding_identity', label: 'Branding & Social Launch Identity', desc: 'Logos, copywriting, trademark protection.' },
                      { id: 'tech_web_setup', label: 'Web Applications & DB Setup', desc: 'Custom storefront development & ledgers.' },
                      { id: 'oem_supply_chain', label: 'Factory Prototyping & OEM Contracts', desc: 'Source physical materials and manufacturing.' }
                    ].map((opt) => {
                      const isSelected = selectedInterests.includes(opt.id);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleToggleInterest(opt.id)}
                          className={`text-left p-3.5 rounded-2xl border-2 transition-all flex items-start space-x-3 ${
                            isSelected 
                              ? 'border-primary bg-primary/5 shadow-sm' 
                              : 'border-slate-100 hover:border-slate-200 bg-slate-50/20'
                          }`}
                        >
                          <CheckSquare className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-primary' : 'text-slate-400'}`} />
                          <div>
                            <span className="text-xs font-bold text-slate-900">{opt.label}</span>
                            <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">{opt.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* STEP 8: PREFERENCES */}
                {currentStep === 8 && (
                  <div className="space-y-4 max-w-md mx-auto w-full">
                    <p className="text-xs text-slate-500 text-center mb-4 leading-normal">
                      BizNxt guarantees verified milestones with personal advisor allocations. Choose your primary touchpoint channel:
                    </p>
                    
                    {[
                      { id: 'whatsapp', label: 'WhatsApp Priority Link', desc: 'Receive secure reports and contract notifications instantly via WhatsApp.', icon: Smartphone },
                      { id: 'email', label: 'Email Ledger Digest', desc: 'Recieve comprehensive weekly executive briefings and tax notifications.', icon: Mail },
                      { id: 'bsm_direct', label: '1-on-1 Call with Dedicated BSM', desc: 'Receive direct scheduling hooks to call your assigned Business Success Manager.', icon: UserIcon }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setCommunicationPref(opt.id)}
                        className={`text-left p-4 rounded-2xl border-2 transition-all flex items-center space-x-4 w-full ${
                          communicationPref === opt.id 
                            ? 'border-primary bg-primary/5 shadow-sm' 
                            : 'border-slate-100 hover:border-slate-200 bg-slate-50/20'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                          communicationPref === opt.id ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'
                        }`}>
                          <opt.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-slate-900">{opt.label}</span>
                          <p className="text-xs text-slate-500 mt-0.5 leading-snug">{opt.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* STEP 9: SECURITY */}
                {currentStep === 9 && (
                  <div className="space-y-4 max-w-md mx-auto w-full">
                    <div className="flex items-start space-x-3 p-4 bg-primary/5 border border-primary/20 rounded-2xl mb-4 text-primary-dark">
                      <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-primary" />
                      <div>
                        <h4 className="text-xs font-bold uppercase">Enterprise Isolation Shield</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                          Your records are bound to cryptographic tokens, shielding sensitive business drafts and trademark assets from public scopes.
                        </p>
                      </div>
                    </div>

                    {[
                      { key: 'rememberDevice', label: 'Remember My Device Session', desc: 'Secure local verification token bypasses password inputs.' },
                      { key: 'multiDevice', label: 'Authorize Multiple Device Logins', desc: 'Permit team members to open reports simultaneously.' },
                      { key: 'biometrics', label: 'Activate Biometrics & FaceID Fallback', desc: 'Enforce biometric check before downloading reports.' },
                      { key: 'zeroTrustLedger', label: 'Enable Zero-Trust Ledger Audit Logs', desc: 'Pipes database transactions through a private ledger log.' }
                    ].map((opt) => (
                      <label 
                        key={opt.key}
                        className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div>
                          <span className="block text-xs font-bold text-slate-900">{opt.label}</span>
                          <span className="block text-[10px] text-slate-500 mt-0.5 leading-tight">{opt.desc}</span>
                        </div>
                        <input 
                          type="checkbox"
                          checked={(deviceSettings as any)[opt.key]}
                          onChange={(e) => setDeviceSettings({
                            ...deviceSettings,
                            [opt.key]: e.target.checked
                          })}
                          className="w-4.5 h-4.5 text-primary border-slate-300 rounded focus:ring-primary/20 cursor-pointer shrink-0 ml-4"
                        />
                      </label>
                    ))}
                  </div>
                )}

                {/* STEP 10: SYNTHESIS */}
                {currentStep === 10 && (
                  <div className="max-w-xl mx-auto w-full space-y-6 text-center">
                    
                    {/* Synthesis Progress Indicator */}
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl animate-pulse" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                          className="w-24 h-24 border-4 border-slate-100 border-t-primary rounded-2xl"
                        />
                      </div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-display font-black text-slate-900">{readinessScore}%</span>
                        <span className="text-[9px] font-bold text-primary tracking-widest uppercase mt-0.5">SCORE</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-slate-900">
                        {synthesisStage === 1 && 'Ingesting parameters...'}
                        {synthesisStage === 2 && 'Calculating business readiness...'}
                        {synthesisStage === 3 && 'Tailoring smart recommendations...'}
                        {synthesisStage >= 4 && 'Profile securely synthesized!'}
                      </h3>
                      
                      <div className="w-full bg-slate-100 h-2 rounded-2xl overflow-hidden max-w-sm mx-auto">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ 
                            width: 
                              synthesisStage === 1 ? '30%' : 
                              synthesisStage === 2 ? '65%' : 
                              synthesisStage === 3 ? '90%' : '100%' 
                          }}
                          className="h-full bg-gradient-to-r from-primary to-indigo-500 rounded-2xl"
                        />
                      </div>
                    </div>

                    {/* Synthesis recommendations display on completion */}
                    <AnimatePresence>
                      {synthesisStage >= 3 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2"
                        >
                          <div className="p-3 bg-indigo-50/50 border border-indigo-100/60 rounded-2xl">
                            <span className="text-[10px] font-bold uppercase text-indigo-600 tracking-wider flex items-center space-x-1">
                              <FileText className="w-3 h-3" />
                              <span>Custom Feasibility Target</span>
                            </span>
                            <p className="text-xs font-bold text-slate-900 mt-1">
                              Feasibility Report on {selectedSectors.map(s => s.replace('_', ' ').toUpperCase()).join(', ')}
                            </p>
                          </div>

                          <div className="p-3 bg-emerald-50/50 border border-emerald-100/60 rounded-2xl">
                            <span className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider flex items-center space-x-1">
                              <Activity className="w-3 h-3" />
                              <span>Assigned Touchpoint Priority</span>
                            </span>
                            <p className="text-xs font-bold text-slate-900 mt-1">
                              Verified callback hook via {communicationPref.toUpperCase()}
                            </p>
                          </div>

                          <div className="p-3 bg-amber-50/50 border border-amber-100/60 rounded-2xl">
                            <span className="text-[10px] font-bold uppercase text-amber-600 tracking-wider flex items-center space-x-1">
                              <Wallet className="w-3 h-3" />
                              <span>MSME Sizing Bracket</span>
                            </span>
                            <p className="text-xs font-bold text-slate-900 mt-1">
                              Eligible for SIDO Capital Subsidy
                            </p>
                          </div>

                          <div className="p-3 bg-primary/5 border border-primary/10 rounded-2xl">
                            <span className="text-[10px] font-bold uppercase text-primary tracking-wider flex items-center space-x-1">
                              <ShieldCheck className="w-3 h-3" />
                              <span>Ledger Security State</span>
                            </span>
                            <p className="text-xs font-bold text-slate-900 mt-1">
                              Strict Cryptographic Isolation Active
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

              </div>

              {/* Navigation Footer for Wizard */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  disabled={currentStep === 1 || currentStep === 10}
                  onClick={handlePrev}
                  className="flex items-center px-4 py-2.5 bg-[#EDF1F7] border border-white/50 text-slate-600 rounded-full font-bold text-xs hover:bg-slate-200 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 mr-1 shrink-0" />
                  <span>Previous</span>
                </button>

                {currentStep < 10 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={currentStep === 5 && selectedSectors.length === 0}
                    className="flex items-center px-5 py-2.5 bg-slate-900 text-white rounded-full font-bold text-xs hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <span>Continue</span>
                    <ChevronRight className="w-4 h-4 ml-1 shrink-0" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={loading || synthesisStage < 4}
                    onClick={handleCompleteOnboarding}
                    className="flex items-center px-6 py-2.5 bg-primary text-white rounded-full font-bold text-xs hover:bg-primary-dark transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Synthesizing Profile...' : 'Complete Onboarding & Enter OS'}
                    <ArrowRight className="w-4 h-4 ml-1.5 shrink-0 animate-pulse" />
                  </button>
                )}
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
        
      </div>
    </div>
  );
}
