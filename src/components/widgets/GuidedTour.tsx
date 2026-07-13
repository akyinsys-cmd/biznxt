import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface TourStep {
  targetId: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const STEPS: TourStep[] = [
  {
    targetId: 'tour-health-score',
    title: 'Business Health Score',
    content: 'Keep track of your overall business readiness and growth metrics here.',
    position: 'bottom'
  },
  {
    targetId: 'tour-quick-actions',
    title: 'Quick Actions',
    content: 'Launch new projects, get expert consultation, or find services with one click.',
    position: 'left'
  },
  {
    targetId: 'tour-active-projects',
    title: 'Active Projects',
    content: 'Monitor the status of your ongoing tasks and business setups.',
    position: 'top'
  }
];

export function GuidedTour() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const checkTourStatus = async () => {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists() && !userDoc.data().hasSeenTour) {
            setIsVisible(true);
          }
        } catch (error: any) {
          if (error?.code === 'unavailable' || error?.message?.includes('offline')) {
            console.warn("Client offline, skipping tour check.");
          } else {
            console.error("Failed to fetch tour status", error);
          }
        }
      };
      checkTourStatus();
    }
  }, [user]);

  useEffect(() => {
    if (!isVisible) return;
    
    const updatePosition = () => {
      const step = STEPS[currentStep];
      const element = document.getElementById(step.targetId);
      if (element) {
        setTargetRect(element.getBoundingClientRect());
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    
    // Give elements time to render
    const timeout = setTimeout(updatePosition, 500);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      clearTimeout(timeout);
    };
  }, [currentStep, isVisible]);

  const dismissTour = async () => {
    setIsVisible(false);
    if (user) {
      await setDoc(doc(db, 'users', user.uid), { hasSeenTour: true }, { merge: true });
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      dismissTour();
    }
  };

  if (!isVisible || !targetRect) return null;

  const step = STEPS[currentStep];
  
  // Calculate position based on target rect
  let top = 0;
  let left = 0;
  
  const tooltipWidth = 280;
  const tooltipHeight = 150; // Approximate

  if (step.position === 'bottom') {
    top = targetRect.bottom + 16;
    left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
  } else if (step.position === 'top') {
    top = targetRect.top - tooltipHeight - 16;
    left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
  } else if (step.position === 'left') {
    top = targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2);
    left = targetRect.left - tooltipWidth - 16;
  } else if (step.position === 'right') {
    top = targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2);
    left = targetRect.right + 16;
  }

  // Bound to window
  if (left < 16) left = 16;
  if (left + tooltipWidth > window.innerWidth - 16) left = window.innerWidth - tooltipWidth - 16;
  if (top < 16) top = 16;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 pointer-events-none">
        {/* Highlight ring around target */}
        <div 
          className="absolute border-2 border-[#780116] rounded-2xl transition-all duration-300 pointer-events-none shadow-[0_0_0_9999px_rgba(15,23,42,0.4)]"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="absolute bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 w-[280px] pointer-events-auto"
          style={{ top, left }}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-bold text-sm text-[#780116] dark:text-[#f7b538]">{step.title}</h4>
            <button onClick={dismissTour} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">{step.content}</p>
          
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400">
              Step {currentStep + 1} of {STEPS.length}
            </span>
            <div className="flex space-x-2">
              <button 
                disabled={currentStep === 0}
                onClick={() => setCurrentStep(curr => curr - 1)}
                className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={nextStep}
                className="px-3 py-1 text-xs font-bold rounded bg-[#780116] text-white hover:bg-[#780116]/90 transition-colors flex items-center"
              >
                {currentStep === STEPS.length - 1 ? 'Finish' : 'Next'}
                {currentStep < STEPS.length - 1 && <ChevronRight className="w-3 h-3 ml-1" />}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
