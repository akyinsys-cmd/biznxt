import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, ArrowLeft, X, Sparkles, HelpCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface TourStep {
  targetId?: string;
  title: string;
  description: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

const TOUR_STEPS: TourStep[] = [
  {
    title: "Welcome to BizNxt Platform Tour! 🚀",
    description: "Let's take a quick 1-minute walkthrough of your new Enterprise Operating System workspace to learn the core modules.",
  },
  {
    targetId: "tour-header-brand",
    title: "BIZNXT Brand Anchor",
    description: "This is your main command anchor. Click this at any point to instantly return to your central operating dashboard.",
    placement: "bottom"
  },
  {
    targetId: "tour-desktop-nav",
    title: "Global Workflow Suite",
    description: "Seamlessly navigate across your company filings, project launch trackers, document vaults, regulatory calendar, and custom OS modules.",
    placement: "bottom"
  },
  {
    targetId: "tour-search",
    title: "Universal Search Engine",
    description: "Quickly index regulatory standards, draft documents, search partners, or lookup corporate intelligence files instantly.",
    placement: "bottom"
  },
  {
    targetId: "tour-notification-center",
    title: "Operational Status Feed",
    description: "Monitor immediate actions required for your legal filings, partner updates, and message indicators in real-time.",
    placement: "bottom"
  },
  {
    targetId: "tour-quick-actions",
    title: "Floating Quick Action Center",
    description: "Trigger critical tasks instantly from anywhere — create LLC projects, manage customer documents, or file support requests without opening deep menus.",
    placement: "top"
  },
  {
    title: "All Systems Operational! 🎉",
    description: "Your BizNxt workstation is fully configured. Pro-tip: Press 'Ctrl+K' anywhere to open the Universal Command Palette, or 'Alt+D' to return to your dashboard.",
  }
];

export function TourGuide() {
  const { user } = useAuth();
  const { success } = useToast();
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [highlightRect, setHighlightRect] = useState<{ top: number; left: number; width: number; height: number; padding: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Monitor screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Listen to external triggers to start the tour
  useEffect(() => {
    if (!user) {
      setIsActive(false);
      return;
    }

    // Check if we finished the FirstLoginWizard or if we should auto-start
    const shouldStartOnComplete = localStorage.getItem('start_tour_on_complete') === 'true';
    const hasSeenTour = localStorage.getItem(`has_seen_tour_${user.uid}`) === 'true';

    if (shouldStartOnComplete || (!hasSeenTour && user)) {
      // Clear the trigger
      localStorage.removeItem('start_tour_on_complete');
      
      // Delay slightly to allow the dashboard to load fully
      const timer = setTimeout(() => {
        setIsActive(true);
        setCurrentStepIndex(0);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user]);

  // Global listener to trigger tour manually from keyboard shortcuts or buttons
  useEffect(() => {
    const handleTriggerTour = (e: CustomEvent) => {
      setIsActive(true);
      setCurrentStepIndex(0);
    };
    window.addEventListener('trigger-platform-tour' as any, handleTriggerTour);
    return () => window.removeEventListener('trigger-platform-tour' as any, handleTriggerTour);
  }, []);

  // Track the bounding rectangle of the target element
  useEffect(() => {
    if (!isActive) {
      setHighlightRect(null);
      return;
    }

    const currentStep = TOUR_STEPS[currentStepIndex];
    if (!currentStep?.targetId || isMobile) {
      setHighlightRect(null);
      return;
    }

    const updatePosition = () => {
      const element = document.getElementById(currentStep.targetId!);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
          setHighlightRect(null);
          return;
        }
        
        setHighlightRect({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
          padding: 8
        });

        // Scroll into view smoothly
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        setHighlightRect(null);
      }
    };

    // Calculate position
    updatePosition();

    // Listen to window size and scroll changes to recalculate coordinates
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [currentStepIndex, isActive, isMobile]);

  if (!isActive || !user) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setIsActive(false);
    localStorage.setItem(`has_seen_tour_${user.uid}`, 'true');
    localStorage.removeItem('start_tour_on_complete');
    success("Tour completed! Press 'Ctrl+K' at any time to open shortcuts.");
  };

  // Helper to compute dialog positioning on desktop
  const getTooltipStyle = (): React.CSSProperties => {
    if (!highlightRect || isMobile) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
      };
    }

    const placement = currentStep.placement || 'bottom';
    const gap = 16;
    const padding = highlightRect.padding;
    const style: React.CSSProperties = {
      position: 'absolute',
      zIndex: 1000,
      width: '320px'
    };

    if (placement === 'bottom') {
      style.top = highlightRect.top + highlightRect.height + padding + gap;
      style.left = highlightRect.left + (highlightRect.width / 2);
      style.transform = 'translateX(-50%)';
    } else if (placement === 'top') {
      style.top = highlightRect.top - padding - gap;
      style.left = highlightRect.left + (highlightRect.width / 2);
      style.transform = 'translate(-50%, -100%)';
    } else if (placement === 'left') {
      style.top = highlightRect.top + (highlightRect.height / 2);
      style.left = highlightRect.left - padding - gap;
      style.transform = 'translate(-100%, -50%)';
    } else if (placement === 'right') {
      style.top = highlightRect.top + (highlightRect.height / 2);
      style.left = highlightRect.left + highlightRect.width + padding + gap;
      style.transform = 'translate(0, -50%)';
    }

    return style;
  };

  return (
    <div className="absolute inset-0 z-[999] pointer-events-none">
      {/* Semi-transparent backdrop with click blocking */}
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-[2px] pointer-events-auto transition-opacity duration-300" />

      {/* SVG Spotlight Mask for Desktop */}
      {highlightRect && !isMobile && (
        <svg className="fixed inset-0 w-full h-full pointer-events-none z-[999]">
          <defs>
            <mask id="spotlight-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <rect
                x={highlightRect.left - highlightRect.padding - window.scrollX}
                y={highlightRect.top - highlightRect.padding - window.scrollY}
                width={highlightRect.width + (highlightRect.padding * 2)}
                height={highlightRect.height + (highlightRect.padding * 2)}
                rx="16"
                fill="black"
              />
            </mask>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="rgba(15, 23, 42, 0.7)" mask="url(#spotlight-mask)" />
        </svg>
      )}

      {/* Spotlight Highlight Ring */}
      {highlightRect && !isMobile && (
        <motion.div
          layoutId="tour-highlight-ring"
          className="absolute border-2 border-primary rounded-2xl shadow-[0_0_0_9999px_rgba(15,23,42,0.1),0_0_15px_rgba(37,99,235,0.5)] z-[1000] pointer-events-none"
          style={{
            top: highlightRect.top - highlightRect.padding,
            left: highlightRect.left - highlightRect.padding,
            width: highlightRect.width + (highlightRect.padding * 2),
            height: highlightRect.height + (highlightRect.padding * 2),
          }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        />
      )}

      {/* Floating Tooltip Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStepIndex}
          initial={{ opacity: 0, scale: 0.95, y: isMobile ? 20 : 0 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: isMobile ? -20 : 0 }}
          transition={{ duration: 0.2 }}
          style={getTooltipStyle()}
          className="pointer-events-auto w-full max-w-sm sm:max-w-md md:max-w-xs bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 flex flex-col gap-4 text-left font-sans"
          id={`tour-tooltip-${currentStepIndex}`}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Step {currentStepIndex + 1} of {TOUR_STEPS.length}
              </span>
            </div>
            <button
              onClick={handleSkip}
              className="p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
              title="Skip Tour"
              id="tour-btn-skip-icon"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div>
            <h4 className="text-base font-black text-slate-900 tracking-tight leading-tight mb-2">
              {currentStep.title}
            </h4>
            <p className="text-xs font-semibold text-slate-500 leading-relaxed">
              {currentStep.description}
            </p>
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-2">
            <button
              onClick={handleSkip}
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
              id="tour-btn-skip"
            >
              Skip
            </button>

            <div className="flex items-center gap-2">
              {currentStepIndex > 0 && (
                <button
                  onClick={handlePrev}
                  className="p-2 text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors inline-flex"
                  title="Previous Step"
                  id="tour-btn-prev"
                >
                  <ArrowLeft size={14} />
                </button>
              )}
              
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-full transition-all shadow-md flex items-center gap-1.5"
                id="tour-btn-next"
              >
                <span>{currentStepIndex === TOUR_STEPS.length - 1 ? "Get Started" : "Next"}</span>
                {currentStepIndex < TOUR_STEPS.length - 1 && <ArrowRight size={12} />}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
