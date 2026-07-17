import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, MapPin, Target, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

export function FirstLoginWizard() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);

  // Form State
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [goal, setGoal] = useState('');

  useEffect(() => {
    if (!user) return;
    
    const checkWizardStatus = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          if (!data.profileSetupComplete && data.role === 'customer') {
            setIsOpen(true);
          }
        }
      } catch (err: any) {
        console.warn('Failed to check wizard status', err);
      } finally {
        setLoading(false);
      }
    };
    checkWizardStatus();
  }, [user]);

  const handleComplete = async () => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        profileSetupComplete: true,
        businessName,
        industry,
        location,
        primaryGoal: goal
      });
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
      setIsOpen(false);
    } catch (err) {
      console.error('Failed to complete setup', err);
    }
  };

  if (loading || !isOpen) return null;

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const steps = [
    {
      title: "Welcome to BizNxt OS",
      desc: "Let's set up your business profile so we can tailor the experience to your needs.",
      icon: <Briefcase className="w-12 h-12 text-blue-500 mb-4" />,
      content: (
        <div className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Business Name</label>
            <input 
              type="text" 
              placeholder="E.g. Acme Corp" 
              value={businessName}
              onChange={e => setBusinessName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Industry</label>
            <select 
              value={industry}
              onChange={e => setIndustry(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">Select Industry...</option>
              <option value="Technology">Technology</option>
              <option value="Retail">Retail</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Services">Professional Services</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      )
    },
    {
      title: "Where are you located?",
      desc: "This helps us identify local compliance and tax requirements.",
      icon: <MapPin className="w-12 h-12 text-emerald-500 mb-4" />,
      content: (
        <div className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">City or Region</label>
            <input 
              type="text" 
              placeholder="E.g. Bangalore, Karnataka" 
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>
      )
    },
    {
      title: "What is your primary goal?",
      desc: "We will prioritize dashboard metrics based on this goal.",
      icon: <Target className="w-12 h-12 text-purple-500 mb-4" />,
      content: (
        <div className="grid grid-cols-1 gap-3 text-left">
          {['Launch a New Business', 'Scale Existing Operations', 'Find Investors', 'Optimize Taxes'].map(g => (
            <button
              key={g}
              onClick={() => setGoal(g)}
              className={`p-4 border rounded-2xl flex items-center justify-between transition-all ${
                goal === g ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="font-medium text-sm">{g}</span>
              {goal === g && <CheckCircle2 className="w-5 h-5" />}
            </button>
          ))}
        </div>
      )
    }
  ];

  const currentStep = steps[step];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          <div className="flex-1 p-8 sm:p-10 text-center">
            <div className="flex justify-center">
              {currentStep.icon}
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">{currentStep.title}</h2>
            <p className="text-sm text-slate-500 mb-8">{currentStep.desc}</p>
            
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep.content}
            </motion.div>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <div className="flex space-x-1">
              {steps.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i === step ? 'bg-slate-800' : 'bg-slate-300'}`} />
              ))}
            </div>
            
            <div className="flex space-x-3">
              {step > 0 && (
                <button 
                  onClick={prevStep}
                  className="px-6 py-3 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
              )}
              {step < steps.length - 1 ? (
                <button 
                  onClick={nextStep}
                  className="px-6 py-3 flex items-center space-x-2 text-sm font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  onClick={handleComplete}
                  className="px-8 py-3 text-sm font-black text-white uppercase tracking-widest bg-slate-900 rounded-full hover:bg-slate-800 transition-colors shadow-xl shadow-slate-900/20"
                >
                  Complete Setup
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
