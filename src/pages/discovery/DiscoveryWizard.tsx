import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { triggerHapticFeedback } from '../../lib/vibration';
import { formDraftsDB } from '../../lib/indexedDB';
import { 
  ChevronRight, ChevronLeft, Bot, Sparkles, User, Wallet, 
  MapPin, Store, Heart, Target, AlertTriangle, Briefcase, 
  CheckCircle2, ArrowRight
} from 'lucide-react';

export default function DiscoveryWizard() {
  const { user } = useAuth();
  const { error: showError, success: showSuccess } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const startType = searchParams.get('type') || 'scratch';

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal
    age: '', education: '', occupation: '', experience: '', skills: '', languages: '', currentIncome: '',
    // Step 2: Investment
    availableBudget: '', maximumBudget: '', loanRequired: 'No', investmentTimeline: '', monthlyInvestmentCapacity: '',
    // Step 3: Location
    country: 'India', state: '', city: '', pinCode: '', canRelocate: 'No', preferredArea: 'Urban',
    // Step 4: Business Preference
    businessPreference: [] as string[],
    // Step 5: Interest Categories
    interestCategories: [] as string[],
    // Step 6: Goals
    monthlyIncomeGoal: '', fiveYearGoal: '', tenYearGoal: '', expansionGoals: [] as string[],
    // Step 7: Risk Profile
    riskProfile: 'Medium',
    // Step 8: Additional Information
    currentBusiness: '', availableTeam: '', factory: 'No', warehouse: 'No', office: 'No', vehicle: 'No', licenses: '', otherAssets: ''
  });

  useEffect(() => {
    const loadDraft = async () => {
      try {
        const draft = await formDraftsDB.getDraft('discovery_wizard_draft');
        if (draft) {
          setFormData(draft);
          showSuccess('Draft loaded from local storage.');
        }
      } catch (err) {
        console.warn('Failed to load draft', err);
      }
    };
    loadDraft();
  }, []);

  useEffect(() => {
    const saveDraft = async () => {
      try {
        await formDraftsDB.saveDraft('discovery_wizard_draft', formData);
      } catch (err) {
        console.warn('Failed to save draft', err);
      }
    };
    const t = setTimeout(saveDraft, 1000);
    return () => clearTimeout(t);
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayToggle = (field: 'businessPreference' | 'interestCategories' | 'expansionGoals', value: string) => {
    setFormData(prev => {
      const array = prev[field];
      if (array.includes(value)) {
        return { ...prev, [field]: array.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...array, value] };
      }
    });
  };

  const steps = [
    { num: 1, title: 'Personal Profile', icon: User },
    { num: 2, title: 'Investment', icon: Wallet },
    { num: 3, title: 'Location', icon: MapPin },
    { num: 4, title: 'Business Preference', icon: Store },
    { num: 5, title: 'Interests', icon: Heart },
    { num: 6, title: 'Goals', icon: Target },
    { num: 7, title: 'Risk Profile', icon: AlertTriangle },
    { num: 8, title: 'Additional Assets', icon: Briefcase },
  ];

  const handleNext = () => {
    triggerHapticFeedback('light');
    if (currentStep < 8) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    triggerHapticFeedback('light');
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    triggerHapticFeedback('success');
    if (!user) {
      showError("Please log in to generate discovery results.");
      navigate('/login');
      return;
    }

    setGenerating(true);
    
    try {
      // 1. Call AI API
      const response = await fetch('/api/ai/business-discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to generate insights');
      }

      const resultData = await response.json();

      // 2. Save to Firestore
      const discoveryRef = await addDoc(collection(db, 'user_discoveries'), {
        userId: user.uid,
        formData,
        analysis: resultData.analysis,
        topRecommendations: resultData.topRecommendations,
        createdAt: serverTimestamp(),
        startType
      });

      // Also add to business_discovery collection for global tracking/admin
      await addDoc(collection(db, 'business_discovery'), {
        userId: user.uid,
        discoveryId: discoveryRef.id,
        summary: resultData.analysis.investmentSuitability,
        score: resultData.analysis.businessOpportunityScore,
        createdAt: serverTimestamp(),
      });

      showSuccess("Discovery Engine complete! Ideas generated.");
      navigate(`/discovery/results/\${discoveryRef.id}`);
      
    } catch (err: any) {
      console.error(err);
      showError(err.message || "An error occurred during discovery generation.");
      setGenerating(false);
    }
  };

  // UI helpers
  const businessTypes = ['Trading', 'Manufacturing', 'OEM', 'White Label', 'Private Label', 'Import', 'Export', 'Retail', 'Wholesale', 'Service', 'Agency', 'AI Startup', 'SaaS', 'Franchise', 'Other'];
  const categories = ['Food', 'Automobile', 'Healthcare', 'Beauty', 'Perfume', 'Fashion', 'Agriculture', 'Technology', 'Construction', 'Finance', 'Travel', 'Education', 'Industrial', 'Chemical', 'Packaging', 'Electronics', 'Renewable Energy'];
  const expansions = ['India Expansion', 'Dubai Expansion', 'Global Expansion', 'Brand Building', 'Passive Income', 'High Growth'];

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight flex items-center">
          <Bot className="w-8 h-8 mr-3 text-primary" />
          AI Discovery Engine
        </h1>
        <p className="text-slate-500 mt-2">Tell us about yourself. Our AI will analyze your profile and find the perfect business matches.</p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-8 shadow-sm overflow-x-auto scrollbar-none">
        <div className="flex items-center min-w-[700px]">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = currentStep === step.num;
            const isPast = currentStep > step.num;
            return (
              <React.Fragment key={step.num}>
                <div className="flex flex-col items-center relative z-10">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-colors \${
                    isActive ? 'bg-primary border-primary text-white' : 
                    isPast ? 'bg-emerald-500 border-emerald-500 text-white' : 
                    'bg-slate-50 border-slate-200 text-slate-500'
                  }`}>
                    {isPast ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider mt-2 absolute -bottom-6 whitespace-nowrap \${
                    isActive ? 'text-primary' : isPast ? 'text-emerald-600' : 'text-slate-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className="flex-1 h-1 mx-2 bg-slate-100 rounded-2xl overflow-hidden">
                    <div className={`h-full bg-emerald-500 transition-all duration-500 \${isPast ? 'w-full' : 'w-0'}`} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden mt-10">
        <div className="p-8 min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Personal */}
            {currentStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Personal Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-bold mb-2">Age</label><input type="number" name="age" value={formData.age} onChange={handleInputChange} className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20" placeholder="e.g. 30" /></div>
                  <div><label className="block text-sm font-bold mb-2">Education</label><input type="text" name="education" value={formData.education} onChange={handleInputChange} className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20" placeholder="e.g. MBA, B.Tech" /></div>
                  <div><label className="block text-sm font-bold mb-2">Current Occupation</label><input type="text" name="occupation" value={formData.occupation} onChange={handleInputChange} className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20" placeholder="e.g. Software Engineer" /></div>
                  <div><label className="block text-sm font-bold mb-2">Years of Experience</label><input type="text" name="experience" value={formData.experience} onChange={handleInputChange} className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20" placeholder="e.g. 5 Years" /></div>
                  <div className="md:col-span-2"><label className="block text-sm font-bold mb-2">Key Skills</label><input type="text" name="skills" value={formData.skills} onChange={handleInputChange} className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20" placeholder="e.g. Marketing, Coding, Sales" /></div>
                  <div><label className="block text-sm font-bold mb-2">Languages Known</label><input type="text" name="languages" value={formData.languages} onChange={handleInputChange} className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20" placeholder="e.g. English, Hindi" /></div>
                  <div><label className="block text-sm font-bold mb-2">Current Income (Annual)</label><input type="text" name="currentIncome" value={formData.currentIncome} onChange={handleInputChange} className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20" placeholder="e.g. 12 LPA" /></div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Investment */}
            {currentStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Investment & Capital</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-bold mb-2">Available Budget (Liquid)</label><input type="text" name="availableBudget" value={formData.availableBudget} onChange={handleInputChange} className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20" placeholder="e.g. ₹5,00,000" /></div>
                  <div><label className="block text-sm font-bold mb-2">Maximum Budget Capability</label><input type="text" name="maximumBudget" value={formData.maximumBudget} onChange={handleInputChange} className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20" placeholder="e.g. ₹20,00,000" /></div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Loan Required?</label>
                    <select name="loanRequired" value={formData.loanRequired} onChange={handleInputChange} className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20">
                      <option value="No">No, self-funded</option>
                      <option value="Yes - Small">Yes, small business loan</option>
                      <option value="Yes - Large">Yes, large corporate loan</option>
                    </select>
                  </div>
                  <div><label className="block text-sm font-bold mb-2">Investment Timeline</label><input type="text" name="investmentTimeline" value={formData.investmentTimeline} onChange={handleInputChange} className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20" placeholder="e.g. Next 3 months" /></div>
                  <div className="md:col-span-2"><label className="block text-sm font-bold mb-2">Monthly Investment Capacity (Working Capital)</label><input type="text" name="monthlyInvestmentCapacity" value={formData.monthlyInvestmentCapacity} onChange={handleInputChange} className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20" placeholder="e.g. ₹50,000/month" /></div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Location */}
            {currentStep === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Location Preferences</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-bold mb-2">Country</label><input type="text" name="country" value={formData.country} onChange={handleInputChange} className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20" placeholder="e.g. India" /></div>
                  <div><label className="block text-sm font-bold mb-2">State</label><input type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20" placeholder="e.g. Maharashtra" /></div>
                  <div><label className="block text-sm font-bold mb-2">City</label><input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20" placeholder="e.g. Mumbai" /></div>
                  <div><label className="block text-sm font-bold mb-2">PIN Code</label><input type="text" name="pinCode" value={formData.pinCode} onChange={handleInputChange} className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20" placeholder="e.g. 400001" /></div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Can you relocate for business?</label>
                    <select name="canRelocate" value={formData.canRelocate} onChange={handleInputChange} className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20">
                      <option value="No">No</option>
                      <option value="Yes - Same State">Yes, within state</option>
                      <option value="Yes - Anywhere">Yes, anywhere</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Preferred Area Type</label>
                    <select name="preferredArea" value={formData.preferredArea} onChange={handleInputChange} className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20">
                      <option value="Urban">Urban / Metro</option>
                      <option value="Semi Urban">Semi-Urban / Tier 2</option>
                      <option value="Rural">Rural / Industrial Zone</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Business Preference */}
            {currentStep === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Business Preference (Select multiple)</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {businessTypes.map(type => (
                    <button 
                      key={type} 
                      onClick={() => handleArrayToggle('businessPreference', type)}
                      className={`p-4 rounded-2xl border-2 text-sm font-bold transition-all text-center \${formData.businessPreference.includes(type) ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 hover:border-slate-200 text-slate-600'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 5: Interests */}
            {currentStep === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Interest Categories (Select multiple)</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {categories.map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => handleArrayToggle('interestCategories', cat)}
                      className={`p-4 rounded-2xl border-2 text-sm font-bold transition-all text-center \${formData.interestCategories.includes(cat) ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-100 hover:border-slate-200 text-slate-600'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 6: Goals */}
            {currentStep === 6 && (
              <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Goals & Vision</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div><label className="block text-sm font-bold mb-2">Monthly Income Goal</label><input type="text" name="monthlyIncomeGoal" value={formData.monthlyIncomeGoal} onChange={handleInputChange} className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20" placeholder="e.g. ₹2,00,000/month" /></div>
                  <div><label className="block text-sm font-bold mb-2">5 Year Goal</label><input type="text" name="fiveYearGoal" value={formData.fiveYearGoal} onChange={handleInputChange} className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20" placeholder="e.g. 10 Crores revenue" /></div>
                  <div><label className="block text-sm font-bold mb-2">10 Year Goal</label><input type="text" name="tenYearGoal" value={formData.tenYearGoal} onChange={handleInputChange} className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20" placeholder="e.g. IPO or Market Leader" /></div>
                  <div>
                    <label className="block text-sm font-bold mb-4">Expansion Goals (Select multiple)</label>
                    <div className="flex flex-wrap gap-3">
                      {expansions.map(exp => (
                        <button 
                          key={exp} 
                          onClick={() => handleArrayToggle('expansionGoals', exp)}
                          className={`px-4 py-2 rounded-2xl border text-sm font-bold transition-all \${formData.expansionGoals.includes(exp) ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-600'}`}
                        >
                          {exp}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 7: Risk */}
            {currentStep === 7 && (
              <motion.div key="step7" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Risk Profile</h2>
                <div className="space-y-4 max-w-2xl">
                  {['Very Low', 'Low', 'Medium', 'High', 'Aggressive'].map(risk => (
                    <button
                      key={risk}
                      onClick={() => setFormData({...formData, riskProfile: risk})}
                      className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between \${formData.riskProfile === risk ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 hover:border-slate-200 text-slate-700'}`}
                    >
                      <span className="font-bold">{risk} Risk</span>
                      {formData.riskProfile === risk && <CheckCircle2 className="w-5 h-5" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 8: Assets */}
            {currentStep === 8 && (
              <motion.div key="step8" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Additional Assets & Resources</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2"><label className="block text-sm font-bold mb-2">Current Business (if any)</label><input type="text" name="currentBusiness" value={formData.currentBusiness} onChange={handleInputChange} className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20" placeholder="e.g. Retail Shop" /></div>
                  <div className="md:col-span-2"><label className="block text-sm font-bold mb-2">Available Team Size</label><input type="text" name="availableTeam" value={formData.availableTeam} onChange={handleInputChange} className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20" placeholder="e.g. Me and 2 partners" /></div>
                  
                  <div>
                    <label className="block text-sm font-bold mb-2">Do you have a Factory/Land?</label>
                    <select name="factory" value={formData.factory} onChange={handleInputChange} className="w-full p-3 rounded-2xl border border-slate-200">
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Do you have a Warehouse?</label>
                    <select name="warehouse" value={formData.warehouse} onChange={handleInputChange} className="w-full p-3 rounded-2xl border border-slate-200">
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Do you have an Office Space?</label>
                    <select name="office" value={formData.office} onChange={handleInputChange} className="w-full p-3 rounded-2xl border border-slate-200">
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Commercial Vehicles?</label>
                    <select name="vehicle" value={formData.vehicle} onChange={handleInputChange} className="w-full p-3 rounded-2xl border border-slate-200">
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                  <div className="md:col-span-2"><label className="block text-sm font-bold mb-2">Existing Licenses (e.g. GST, FSSAI)</label><input type="text" name="licenses" value={formData.licenses} onChange={handleInputChange} className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20" placeholder="e.g. GST Number" /></div>
                  <div className="md:col-span-2"><label className="block text-sm font-bold mb-2">Other Valuable Assets</label><input type="text" name="otherAssets" value={formData.otherAssets} onChange={handleInputChange} className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20" placeholder="e.g. Strong political connections, family funds" /></div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="bg-slate-50 border-t border-slate-200 p-6 flex items-center justify-between">
          <button 
            disabled={currentStep === 1 || generating}
            onClick={handlePrev}
            className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 disabled:opacity-50 flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Back
          </button>
          
          {currentStep < 8 ? (
            <button 
              onClick={handleNext}
              className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 flex items-center"
            >
              Continue <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={generating}
              className="px-8 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark flex items-center shadow-lg shadow-primary/30 disabled:opacity-70"
            >
              {generating ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing Profile...
                </>
              ) : (
                <>
                  Generate AI Discovery <Sparkles className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
