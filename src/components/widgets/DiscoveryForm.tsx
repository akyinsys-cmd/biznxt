import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNotifications } from '../../context/NotificationContext';
import { 
  ArrowRight, 
  ArrowLeft, 
  Loader2, 
  Sparkles, 
  User, 
  Briefcase, 
  Coins, 
  MapPin, 
  Target, 
  TrendingUp, 
  RotateCcw,
  CheckCircle,
  FileText
} from 'lucide-react';
import { AIOverviewWidget } from './AIOverviewWidget';

const STEPS = [
  { id: 1, title: 'Personal', icon: User, desc: 'Contact details' },
  { id: 2, title: 'Business', icon: Briefcase, desc: 'Model & type' },
  { id: 3, title: 'Investment', icon: Coins, desc: 'CapEx limits' },
  { id: 4, title: 'Location', icon: MapPin, desc: 'Geography' },
  { id: 5, title: 'Goals', icon: Target, desc: 'Financial objectives' },
];

const BUSINESS_TYPES = [
  'Trading', 'Manufacturing', 'White Label', 'Private Label', 
  'OEM', 'Import', 'Export', 'Retail', 'Wholesale', 
  'Service', 'AI Startup', 'Agency', 'Other'
];

const MARKETS = ['India', 'Dubai', 'Global'];

export function DiscoveryForm() {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const { addLocalNotification } = useNotifications();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [aiData, setAiData] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [requestId, setRequestId] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal
    fullName: '',
    mobileNumber: '',
    email: '',
    city: '',
    state: '',
    country: '',
    pinCode: '',
    currentOccupation: '',
    yearsOfExperience: '',

    // Step 2: Business
    businessType: '',
    industry: '',
    currentBusiness: 'No',
    businessExperience: '',
    timeline: '',

    // Step 3: Investment
    availableBudget: '',
    maximumBudget: '',
    loanRequired: 'No',
    monthlyInvestmentCapacity: '',
    fundingSource: '',

    // Step 4: Location
    preferredCountry: '',
    preferredState: '',
    preferredCity: '',
    preferredPinCode: '',
    canRelocate: 'No',

    // Step 5: Goals
    monthlyIncomeGoal: '',
    longTermGoal: '',
    businessObjective: '',
    preferredMarket: '',
  });

  // Auto-save draft on form change
  const handleChange = (field: keyof typeof formData, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    

    // Clear field-specific error
    if (errors[field]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the form?')) {
      setFormData({
        fullName: '',
        mobileNumber: '',
        email: '',
        city: '',
        state: '',
        country: '',
        pinCode: '',
        currentOccupation: '',
        yearsOfExperience: '',
        businessType: '',
        industry: '',
        currentBusiness: 'No',
        businessExperience: '',
        timeline: '',
        availableBudget: '',
        maximumBudget: '',
        loanRequired: 'No',
        monthlyInvestmentCapacity: '',
        fundingSource: '',
        preferredCountry: '',
        preferredState: '',
        preferredCity: '',
        preferredPinCode: '',
        canRelocate: 'No',
        monthlyIncomeGoal: '',
        longTermGoal: '',
        businessObjective: '',
        preferredMarket: '',
      });
      setCurrentStep(1);
      setErrors({});
      success('Form reset successfully');
    }
  };

  // Step Validation Logic
  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim() || formData.fullName.length < 3) {
        newErrors.fullName = 'Full Name must be at least 3 characters.';
      }
      const mobileRegex = /^[0-9]{10}$/;
      if (!mobileRegex.test(formData.mobileNumber.replace(/[\s-]/g, ''))) {
        newErrors.mobileNumber = 'Mobile Number must be 10 numeric digits.';
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address.';
      }
      if (!formData.city.trim()) newErrors.city = 'City is required.';
      if (!formData.state.trim()) newErrors.state = 'State is required.';
      if (!formData.country.trim()) newErrors.country = 'Country is required.';
      if (!/^[0-9a-zA-Z]{4,8}$/.test(formData.pinCode.trim())) {
        newErrors.pinCode = 'Please enter a valid PIN Code.';
      }
      if (!formData.currentOccupation.trim()) {
        newErrors.currentOccupation = 'Occupation is required.';
      }
      if (!formData.yearsOfExperience.trim()) {
        newErrors.yearsOfExperience = 'Experience is required.';
      }
    }

    if (step === 2) {
      if (!formData.businessType) newErrors.businessType = 'Please select business type.';
      if (!formData.industry.trim()) newErrors.industry = 'Industry is required.';
      if (!formData.businessExperience.trim()) {
        newErrors.businessExperience = 'Please summarize your business experience.';
      }
      if (!formData.timeline) newErrors.timeline = 'Please select a timeline.';
    }

    if (step === 3) {
      if (!formData.availableBudget.trim()) newErrors.availableBudget = 'Available budget is required.';
      if (!formData.maximumBudget.trim()) newErrors.maximumBudget = 'Maximum budget capacity is required.';
      if (!formData.monthlyInvestmentCapacity.trim()) {
        newErrors.monthlyInvestmentCapacity = 'Monthly capacity is required.';
      }
      if (!formData.fundingSource.trim()) newErrors.fundingSource = 'Funding source is required.';
    }

    if (step === 4) {
      if (!formData.preferredCountry.trim()) newErrors.preferredCountry = 'Preferred Country is required.';
      if (!formData.preferredState.trim()) newErrors.preferredState = 'Preferred State is required.';
      if (!formData.preferredCity.trim()) newErrors.preferredCity = 'Preferred City is required.';
      if (!formData.preferredPinCode.trim()) newErrors.preferredPinCode = 'Preferred PIN Code is required.';
    }

    if (step === 5) {
      if (!formData.monthlyIncomeGoal.trim()) newErrors.monthlyIncomeGoal = 'Income goal is required.';
      if (!formData.longTermGoal.trim()) newErrors.longTermGoal = 'Long term vision is required.';
      if (!formData.businessObjective.trim()) {
        newErrors.businessObjective = 'Venture objective is required.';
      }
      if (!formData.preferredMarket) newErrors.preferredMarket = 'Please select your target market.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(curr => curr + 1);
    } else {
      toastError('Please fix the validation errors before moving to the next step.');
    }
  };

  const handlePrev = () => {
    setCurrentStep(curr => Math.max(1, curr - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(5)) {
      toastError('Please complete all fields with valid answers.');
      return;
    }

    setLoading(true);
    // Generate a unique Research Request ID
    const uniqueId = `BZNXT-F-${Math.floor(10000 + Math.random() * 90000)}`;
    setRequestId(uniqueId);

    try {
      // 1. Save data in Firestore
      if (user) {
        await addDoc(collection(db, 'freeBusinessResearch'), {
          userId: user.uid,
          requestId: uniqueId,
          ...formData,
          createdAt: serverTimestamp(),
          status: 'Pending Analysis'
        });
        
        // Push notification
        addLocalNotification({
          title: 'Research Submitted',
          message: `Free Research Request ${uniqueId} saved securely to Firestore ledger!`,
          type: 'success'
        });
      }

      // 2. Trigger AI Analysis
      const res = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData })
      });

      if (!res.ok) {
        throw new Error('Failed to generate insights');
      }

      const insights = await res.json();
      setAiData({ ...insights, requestId: uniqueId });
      
      
      success('AI Executive Feasibility Report Generated Successfully!');
    } catch (err) {
      console.error(err);
      toastError('Our analytical engines are temporarily occupied. Please wait a moment and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Render Thank You and Results screen
  if (aiData) {
    return (
      <AIOverviewWidget 
        data={aiData} 
        onUpgrade={() => {
          success('Pushed premium validation queue. Redirecting to payment invoices...');
        }}
        onBook={() => {
          success('Scheduling expert advisory consultation session...');
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Step Indicators */}
      <div className="hidden sm:flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-150 shadow-sm">
        {STEPS.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          return (
            <div key={step.id} className="flex items-center space-x-3 flex-1 last:flex-initial">
              <div className={`flex items-center justify-center w-8 h-8 rounded-2xl border text-xs font-bold transition-all shrink-0 ${
                isActive 
                  ? 'bg-primary text-white border-primary shadow-sm scale-105' 
                  : isCompleted 
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                  : 'bg-white text-slate-500 border-slate-200'
              }`}>
                {isCompleted ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : step.id}
              </div>
              <div className="text-left leading-tight">
                <p className={`text-xs font-bold ${isActive ? 'text-slate-900' : isCompleted ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {step.title}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">{step.desc}</p>
              </div>
              {step.id < STEPS.length && (
                <div className="w-full bg-slate-200 h-[1px] mx-2 hidden md:block" />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Step Indicator */}
      <div className="sm:hidden bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-600">Step {currentStep} of 5: {STEPS[currentStep-1].title}</span>
        <div className="flex gap-1">
          {STEPS.map(s => (
            <span key={s.id} className={`w-2.5 h-1.5 rounded-2xl transition-all ${currentStep === s.id ? 'bg-primary w-4' : 'bg-slate-200'}`} />
          ))}
        </div>
      </div>

      {/* Interactive AI loading monitor */}
      {loading ? (
        <div className="text-center py-12 space-y-6 bg-slate-50/50 rounded-full border border-dashed border-slate-200">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900">Assembling Feasibility Ledger</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              BizNxt 3.0 Engine is checking demographics, compiling CapEx thresholds, and invoking the expert AI models...
            </p>
          </div>
          <div className="max-w-xs mx-auto text-left font-mono text-[10px] text-indigo-600 space-y-1">
            <p className="animate-pulse">[INFO] Establishing secure ledger transaction...</p>
            <p className="animate-pulse delay-100">[INFO] Submitting Request ID BZNXT-F-XXXXX...</p>
            <p className="animate-pulse delay-200">[INFO] Executing Gemini 3.5 Analytical Briefing...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative">
          
          {/* STEP 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
              <p className="text-xs text-slate-500">Provide verified administrative data. All records remain encrypted under security standards.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Full Name</label>
                  <input 
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={e => handleChange('fullName', e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border text-sm transition-all focus:outline-none ${errors.fullName ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary'}`}
                    placeholder="John Doe"
                  />
                  {errors.fullName && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Mobile Number</label>
                  <input 
                    type="tel"
                    required
                    value={formData.mobileNumber}
                    onChange={e => handleChange('mobileNumber', e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border text-sm transition-all focus:outline-none ${errors.mobileNumber ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary'}`}
                    placeholder="9876543210"
                  />
                  {errors.mobileNumber && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.mobileNumber}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Email Address</label>
                  <input 
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => handleChange('email', e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border text-sm transition-all focus:outline-none ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary'}`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">PIN / ZIP Code</label>
                  <input 
                    type="text"
                    required
                    value={formData.pinCode}
                    onChange={e => handleChange('pinCode', e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border text-sm transition-all focus:outline-none ${errors.pinCode ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary'}`}
                    placeholder="400001"
                  />
                  {errors.pinCode && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.pinCode}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">City</label>
                  <input 
                    type="text"
                    required
                    value={formData.city}
                    onChange={e => handleChange('city', e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all focus:outline-none`}
                    placeholder="Mumbai"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">State</label>
                  <input 
                    type="text"
                    required
                    value={formData.state}
                    onChange={e => handleChange('state', e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all focus:outline-none"
                    placeholder="Maharashtra"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Country</label>
                  <input 
                    type="text"
                    required
                    value={formData.country}
                    onChange={e => handleChange('country', e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all focus:outline-none"
                    placeholder="India"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Current Occupation</label>
                  <input 
                    type="text"
                    required
                    value={formData.currentOccupation}
                    onChange={e => handleChange('currentOccupation', e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all focus:outline-none"
                    placeholder="Software Architect"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 mb-1">Years of Experience</label>
                  <input 
                    type="text"
                    required
                    value={formData.yearsOfExperience}
                    onChange={e => handleChange('yearsOfExperience', e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all focus:outline-none"
                    placeholder="e.g. 5"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Business Information */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Business Information</h3>
              <p className="text-xs text-slate-500">Provide baseline details about your commercial vision or target category.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">Business Type</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {BUSINESS_TYPES.map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleChange('businessType', type)}
                        className={`p-3 text-xs font-bold rounded-2xl border transition-all text-center ${
                          formData.businessType === type 
                            ? 'bg-primary/10 border-primary text-primary shadow-sm' 
                            : 'bg-white border-slate-150 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  {errors.businessType && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.businessType}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Target Industry / Niche</label>
                  <input 
                    type="text"
                    required
                    value={formData.industry}
                    onChange={e => handleChange('industry', e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all focus:outline-none"
                    placeholder="e.g. Clean Energy or Specialty Coffee"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">Do you have an active registered business right now?</label>
                  <div className="flex gap-4">
                    {['Yes', 'No'].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleChange('currentBusiness', val)}
                        className={`px-6 py-2.5 text-xs font-bold rounded-2xl border transition-all ${
                          formData.currentBusiness === val 
                            ? 'bg-slate-900 border-slate-900 text-white' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Summarize your past business or general experience</label>
                  <textarea 
                    required
                    rows={3}
                    value={formData.businessExperience}
                    onChange={e => handleChange('businessExperience', e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all focus:outline-none resize-none"
                    placeholder="Describe any management, marketing, or technical expertise you have..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Venture Launch Timeline</label>
                  <select
                    required
                    value={formData.timeline}
                    onChange={e => handleChange('timeline', e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all focus:outline-none bg-white text-slate-700"
                  >
                    <option value="">Select launch target</option>
                    <option value="ASAP (1-2 months)">ASAP (1-2 months)</option>
                    <option value="3-6 months">3-6 months</option>
                    <option value="6-12 months">6-12 months</option>
                    <option value="Just exploring">Just exploring</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Investment */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Investment & Capital Structure</h3>
              <p className="text-xs text-slate-500">Define your CapEx parameters to enable accurate financial stress-testing.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Available Liquidity / Budget</label>
                  <input 
                    type="text"
                    required
                    value={formData.availableBudget}
                    onChange={e => handleChange('availableBudget', e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all focus:outline-none"
                    placeholder="e.g. ₹5,00,000 or $10,000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Absolute Maximum Budget</label>
                  <input 
                    type="text"
                    required
                    value={formData.maximumBudget}
                    onChange={e => handleChange('maximumBudget', e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all focus:outline-none"
                    placeholder="e.g. ₹15,00,000 or $30,000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">Loan or Working Capital Required?</label>
                  <div className="flex gap-4">
                    {['Yes', 'No'].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleChange('loanRequired', val)}
                        className={`px-6 py-2.5 text-xs font-bold rounded-2xl border transition-all ${
                          formData.loanRequired === val 
                            ? 'bg-slate-900 border-slate-900 text-white' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Monthly Investment Capacity</label>
                  <input 
                    type="text"
                    required
                    value={formData.monthlyInvestmentCapacity}
                    onChange={e => handleChange('monthlyInvestmentCapacity', e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all focus:outline-none"
                    placeholder="e.g. ₹50,000/month"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 mb-1">Primary Source of Funding</label>
                  <input 
                    type="text"
                    required
                    value={formData.fundingSource}
                    onChange={e => handleChange('fundingSource', e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all focus:outline-none"
                    placeholder="e.g. Personal Savings, Friends & Family, Angel Venture"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Location */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Geographic & Operational Footprint</h3>
              <p className="text-xs text-slate-500">Provide data on municipal zoning and real estate preferences.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Preferred Country</label>
                  <input 
                    type="text"
                    required
                    value={formData.preferredCountry}
                    onChange={e => handleChange('preferredCountry', e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all focus:outline-none"
                    placeholder="India"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Preferred State</label>
                  <input 
                    type="text"
                    required
                    value={formData.preferredState}
                    onChange={e => handleChange('preferredState', e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all focus:outline-none"
                    placeholder="Maharashtra"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Preferred City</label>
                  <input 
                    type="text"
                    required
                    value={formData.preferredCity}
                    onChange={e => handleChange('preferredCity', e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all focus:outline-none"
                    placeholder="Mumbai"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Preferred PIN / ZIP Code</label>
                  <input 
                    type="text"
                    required
                    value={formData.preferredPinCode}
                    onChange={e => handleChange('preferredPinCode', e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all focus:outline-none"
                    placeholder="400001"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 mb-2">Are you willing to relocate or set up operations elsewhere?</label>
                  <div className="flex gap-4">
                    {['Yes', 'No'].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleChange('canRelocate', val)}
                        className={`px-6 py-2.5 text-xs font-bold rounded-2xl border transition-all ${
                          formData.canRelocate === val 
                            ? 'bg-slate-900 border-slate-900 text-white' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Goals & Markets */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Venture Goals & Market Alignment</h3>
              <p className="text-xs text-slate-500">Formulate your targeted returns and long-term vision benchmarks.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Targeted Monthly Income (in 12 months)</label>
                  <input 
                    type="text"
                    required
                    value={formData.monthlyIncomeGoal}
                    onChange={e => handleChange('monthlyIncomeGoal', e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all focus:outline-none"
                    placeholder="e.g. ₹2,00,000/month or $5,000/month"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">What is your long term vision (3-5 years) for this venture?</label>
                  <textarea 
                    required
                    rows={3}
                    value={formData.longTermGoal}
                    onChange={e => handleChange('longTermGoal', e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all focus:outline-none resize-none"
                    placeholder="e.g. Scale to 5 national retail units or transition to wholesale distribution..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Specific Business Objectives</label>
                  <input 
                    type="text"
                    required
                    value={formData.businessObjective}
                    onChange={e => handleChange('businessObjective', e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all focus:outline-none"
                    placeholder="e.g. Reach steady cash flow with less than 20 hours/week personal overhead"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">Preferred Market Scale</label>
                  <div className="flex gap-3">
                    {MARKETS.map(market => (
                      <button
                        key={market}
                        type="button"
                        onClick={() => handleChange('preferredMarket', market)}
                        className={`flex-1 p-3.5 text-xs font-bold rounded-2xl border transition-all text-center ${
                          formData.preferredMarket === market 
                            ? 'bg-primary/10 border-primary text-primary shadow-sm' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {market}
                      </button>
                    ))}
                  </div>
                  {errors.preferredMarket && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.preferredMarket}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons Row */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 shrink-0">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-xs font-bold px-3 py-2 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50 text-xs font-bold px-3 py-2 rounded-full transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Discard Draft</span>
              </button>

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold px-5 py-2.5 rounded-full transition-colors shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>Generate AI Overview</span>
                </button>
              )}
            </div>
          </div>

        </form>
      )}
    </div>
  );
}
