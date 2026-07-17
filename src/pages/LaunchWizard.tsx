import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft,
  Loader2, 
  Save, 
  Building2, 
  ShieldCheck, 
  Palette, 
  Globe, 
  Megaphone, 
  Factory, 
  Banknote,
  Plus,
  Trash2,
  FileText,
  Download,
  Percent,
  Calculator
} from 'lucide-react';
import { doc, getDoc, setDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNotifications } from '../context/NotificationContext';
import { LAUNCH_SERVICES } from '../data/services';
import { useNavigate } from 'react-router-dom';
import { triggerHapticFeedback } from '../lib/vibration';

const STEPS = [
  { id: 'basics', title: 'Business Info', icon: Building2 },
  { id: 'registration', title: 'Services', icon: ShieldCheck },
  { id: 'branding', title: 'Branding', icon: Palette },
  { id: 'digital', title: 'Digital', icon: Globe },
  { id: 'marketing', title: 'Marketing', icon: Megaphone },
  { id: 'manufacturing', title: 'Manufacturing', icon: Factory },
  { id: 'finance', title: 'Finance', icon: Banknote },
];

export default function LaunchWizard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { success, warning, error: toastError } = useToast();
  const { addLocalNotification } = useNotifications();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<any>({
    businessName: '',
    industry: '',
    businessType: 'Pvt Ltd',
    budget: '5-10 Lakhs',
    timeline: '30 Days',
    targetCity: '',
    expansionPlan: 'Regional',
    selectedServices: [] as string[],
    couponCode: '',
    discount: 0
  });

  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null);

  useEffect(() => {
    async function loadData() {

      if (!user) return; triggerHapticFeedback('success');
      try {
        setLoading(true);
        const docRef = doc(db, 'launchFlow', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData(prev => ({ ...prev, ...data }));
        }
      } catch (err: any) {
        if (err?.code === 'unavailable' || err?.message?.includes('offline')) {
          console.warn('Client offline, using local draft.');
        } else {
          console.error('Error loading launch data:', err);
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const formDataRef = React.useRef(formData);
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // Auto-save to Firestore every 30 seconds
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(async () => {
      try {
        await setDoc(doc(db, 'launchFlow', user.uid), {
          ...formDataRef.current,
          lastAutosave: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn('Failed to auto-save to Firestore:', err);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const selectedServicesData = useMemo(() => {
    return LAUNCH_SERVICES.filter(s => formData.selectedServices.includes(s.id));
  }, [formData.selectedServices]);

  const totals = useMemo(() => {
    const subtotal = selectedServicesData.reduce((acc, s) => acc + s.basePrice, 0);
    const gstTotal = selectedServicesData.reduce((acc, s) => acc + (s.basePrice * (s.gst / 100)), 0);
    const discount = appliedCoupon ? (subtotal * (appliedCoupon.discount / 100)) : 0;
    return {
      subtotal,
      gstTotal,
      discount,
      total: subtotal + gstTotal - discount
    };
  }, [selectedServicesData, appliedCoupon]);

  const toggleService = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter(id => id !== serviceId)
        : [...prev.selectedServices, serviceId]
    }));
  };

  const handleApplyCoupon = () => {
    if (formData.couponCode.toUpperCase() === 'FIRST10') {
      setAppliedCoupon({ code: 'FIRST10', discount: 10 });
      success('Coupon applied! 10% discount added.');
    } else {
      warning('Invalid coupon code');
    }
  };

  const handleSave = async (autoSave = false) => {
    if (!user) return; triggerHapticFeedback('success');
    try {
      setSaving(true);
      await setDoc(doc(db, 'launchFlow', user.uid), {
        ...formData,
        updatedAt: serverTimestamp()
      }, { merge: true });
      if (!autoSave) success('Progress saved successfully');
    } catch (err) {
      console.error('Error saving:', err);
      if (!autoSave) toastError('Failed to save progress');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) return; triggerHapticFeedback('success');
    if (formData.selectedServices.length === 0) {
      warning('Please select at least one service to continue');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // 1. Create Project
      const projectRef = await addDoc(collection(db, 'client_projects'), {
        clientName: user.displayName || 'Client',
        clientEmail: user.email,
        businessName: formData.businessName,
        businessCategory: formData.industry,
        investmentAmount: formData.budget,
        currentTimelineStep: 'Onboarding',
        bsmId: 'SYSTEM_ASSIGNED', // Will be assigned by admin
        status: 'Quotation Pending',
        createdAt: serverTimestamp()
      });

      // 2. Create Quotation
      await addDoc(collection(db, 'quotations'), {
        projectId: projectRef.id,
        customerId: user.uid,
        title: `Business Launch - ${formData.businessName}`,
        totalAmount: totals.total,
        status: 'draft',
        createdAt: serverTimestamp()
      });

      success('Project initialized! Redirecting to dashboard...');
      addLocalNotification({
        title: 'Project Launched',
        message: `Your project ${formData.businessName} has been initialized. A BSM will be assigned shortly.`,
        type: 'success'
      });
      
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error('Error submitting project:', err);
      toastError('Failed to initialize project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      await handleSave(true);
      { triggerHapticFeedback('light'); setCurrentStep(curr => curr + 1); };
    } else {
      handleSubmit();
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentStepInfo = STEPS[currentStep];
  const StepIcon = currentStepInfo.icon;

  return (
    <div className="flex-1 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">Business Launch Wizard</h1>
            <p className="text-slate-500 font-medium mt-1">Configure your enterprise launch stack and get a dynamic quote.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleSave()}
              className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Progress
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: STEPPER & FORM */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Horizontal Stepper */}
            <div className="glass-card bg-white shadow-xl shadow-slate-200/50 p-6 overflow-x-auto">
              <div className="flex items-center justify-between min-w-[600px] relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-100 z-0"></div>
                {STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const isCompleted = idx < currentStep;
                  const isActive = idx === currentStep;
                  return (
                    <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        isCompleted ? 'bg-primary text-white scale-90' :
                        isActive ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' :
                        'bg-white border border-slate-200 text-slate-400'
                      }`}>
                        {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FORM CONTENT */}
            <div className="glass-card bg-white shadow-xl shadow-slate-200/50 p-8 min-h-[500px] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <StepIcon className="w-64 h-64" />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10 space-y-8"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Step {currentStep + 1} of 7</span>
                    <h2 className="text-2xl font-display font-bold text-slate-900">{currentStepInfo.title}</h2>
                  </div>

                  {/* STEP 1: BASICS */}
                  {currentStep === 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Business Name</label>
                        <input 
                          type="text"
                          value={formData.businessName}
                          onChange={e => setFormData({...formData, businessName: e.target.value})}
                          placeholder="e.g. Acme Innovations"
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Industry</label>
                        <select 
                          value={formData.industry}
                          onChange={e => setFormData({...formData, industry: e.target.value})}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium appearance-none"
                        >
                          <option value="">Select Industry</option>
                          <option value="SaaS">SaaS / Technology</option>
                          <option value="Retail">Retail & E-commerce</option>
                          <option value="Manufacturing">Manufacturing</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Education">Education</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Budget</label>
                        <select 
                          value={formData.budget}
                          onChange={e => setFormData({...formData, budget: e.target.value})}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium appearance-none"
                        >
                          <option value="1-5 Lakhs">1-5 Lakhs</option>
                          <option value="5-10 Lakhs">5-10 Lakhs</option>
                          <option value="10-50 Lakhs">10-50 Lakhs</option>
                          <option value="50 Lakhs+">50 Lakhs+</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Launch Timeline</label>
                        <select 
                          value={formData.timeline}
                          onChange={e => setFormData({...formData, timeline: e.target.value})}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium appearance-none"
                        >
                          <option value="15 Days">15 Days (Express)</option>
                          <option value="30 Days">30 Days (Standard)</option>
                          <option value="60 Days">60 Days (Enterprise)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* SERVICE SELECTION STEPS (2-7) */}
                  {currentStep > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {LAUNCH_SERVICES.filter(s => s.category === currentStepInfo.id).map(service => {
                        const isSelected = formData.selectedServices.includes(service.id);
                        return (
                          <button
                            key={service.id}
                            onClick={() => toggleService(service.id)}
                            className={`p-6 rounded-3xl text-left transition-all duration-300 group relative border-2 ${
                              isSelected 
                                ? 'bg-primary/5 border-primary shadow-lg shadow-primary/10' 
                                : 'bg-white border-slate-100 hover:border-slate-200'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
                                isSelected ? 'bg-primary text-white' : 'bg-slate-50 text-slate-400 group-hover:text-primary'
                              }`}>
                                <Calculator className="w-5 h-5" />
                              </div>
                              {isSelected && <Check className="w-5 h-5 text-primary" />}
                            </div>
                            <h4 className={`font-bold text-lg mb-1 ${isSelected ? 'text-primary' : 'text-slate-900'}`}>{service.name}</h4>
                            <p className="text-xs text-slate-500 font-medium mb-4 line-clamp-2">{service.description}</p>
                            <div className="flex items-center justify-between">
                              {service.basePrice > 0 && <span className="text-sm font-black text-slate-900">₹{service.basePrice.toLocaleString()}</span>}
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{service.timeline}</span>
                            </div>
                          </button>
                        );
                      })}
                      {LAUNCH_SERVICES.filter(s => s.category === currentStepInfo.id).length === 0 && (
                        <div className="col-span-2 py-12 flex flex-col items-center justify-center text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                          <Plus className="w-12 h-12 text-slate-300 mb-4" />
                          <h4 className="font-bold text-slate-900">Custom Services Coming Soon</h4>
                          <p className="text-xs text-slate-500 max-w-xs mt-2">Our SME network is expanding. For specific requirements in this category, contact our consultants.</p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* ACTION BUTTONS */}
              <div className="mt-12 flex items-center justify-between pt-8 border-t border-slate-100">
                <button
                  onClick={() => { triggerHapticFeedback('light'); setCurrentStep(c => Math.max(0, c - 1)); }}
                  disabled={currentStep === 0}
                  className="px-6 py-4 rounded-full font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 disabled:opacity-0"
                >
                  <ChevronLeft className="w-5 h-5" /> Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="px-8 py-4 rounded-full bg-primary text-white font-black text-sm uppercase tracking-widest hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 flex items-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {currentStep === STEPS.length - 1 ? 'Launch My Business' : 'Save & Continue'}
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: SMART QUOTATION ENGINE */}
          <div className="lg:col-span-4 sticky top-8 space-y-6">
            <div className="glass-card bg-slate-900 text-white p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold leading-none">Smart Quote</h3>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Real-time Est.</span>
                  </div>
                </div>
                <button className="p-2 rounded-2xl bg-white/5 text-white/40 hover:text-white transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {selectedServicesData.length > 0 ? (
                  selectedServicesData.map(service => (
                    <div key={service.id} className="flex justify-between items-start group">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold block">{service.name}</span>
                        <span className="text-[10px] text-slate-500 block">{service.timeline}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {service.basePrice > 0 && <span className="text-xs font-mono font-bold">₹{service.basePrice.toLocaleString()}</span>}
                        <button 
                          onClick={() => toggleService(service.id)}
                          className="opacity-0 group-hover:opacity-100 text-rose-500 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center space-y-2">
                    <Calculator className="w-8 h-8 text-slate-700 mx-auto" />
                    <p className="text-xs text-slate-500 font-medium italic">No services selected. Build your stack to see estimate.</p>
                  </div>
                )}
              </div>

              {/* COUPON SECTION */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input 
                      type="text"
                      value={formData.couponCode}
                      onChange={e => setFormData({...formData, couponCode: e.target.value})}
                      placeholder="Coupon Code"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold focus:outline-none focus:border-primary"
                    />
                  </div>
                  <button 
                    onClick={handleApplyCoupon}
                    className="px-4 py-3 bg-white text-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* TOTALS */}
              <div className="space-y-3 pt-6 border-t border-white/10">
                <div className="flex justify-between text-xs font-bold text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-white font-mono">₹{totals.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-400">
                  <span>GST (18%)</span>
                  <span className="text-white font-mono">₹{totals.gstTotal.toLocaleString()}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-xs font-bold text-emerald-400">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span className="font-mono">-₹{totals.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-end pt-2">
                  <div>
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] block">Grand Total</span>
                    <span className="text-3xl font-display font-black tracking-tight">₹{totals.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
                <div className="flex gap-3">
                  <div className="p-2 bg-primary/20 rounded-2xl h-fit">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-[10px] font-medium text-slate-400 leading-relaxed">
                    BizNxt Assurance: Your payment is held in escrow and only released after milestone verification.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card bg-white shadow-xl shadow-slate-200/50 p-6">
              <h4 className="text-sm font-bold text-slate-900 mb-4">Why choose BizNxt?</h4>
              <ul className="space-y-4">
                {[
                  { t: 'Verified Experts', d: 'Hand-picked SME partners' },
                  { t: 'Price Protection', d: 'Best-in-market rates guaranteed' },
                  { t: 'Timeline SLA', d: 'Refundable delay protection' }
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="w-5 h-5 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900">
                      <Check className="w-3 h-3" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block leading-none">{item.t}</span>
                      <span className="text-[10px] text-slate-500">{item.d}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
