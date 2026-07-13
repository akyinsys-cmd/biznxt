import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, User, CheckCircle2, TrendingUp, Sparkles, Globe } from 'lucide-react';

const ACTIVITIES = [
  { id: 1, type: 'document', text: 'New Private Limited Company registered', user: 'Arjun S.', location: 'Mumbai', icon: CheckCircle2, color: 'text-emerald-500' },
  { id: 2, type: 'upgrade', text: 'Enterprise OS v3.0 license activated', user: 'Priya K.', location: 'Bengaluru', icon: Sparkles, color: 'text-primary' },
  { id: 3, type: 'compliance', text: 'GST Filings verified for Trade Project', user: 'Rahul V.', location: 'New Delhi', icon: TrendingUp, color: 'text-indigo-500' },
  { id: 4, type: 'order', text: 'Import License Package secured', user: 'Ananya M.', location: 'Chennai', icon: ShoppingBag, color: 'text-amber-500' },
  { id: 5, type: 'user', text: 'New MSME Partner joined the network', user: 'Vikram R.', location: 'Hyderabad', icon: User, color: 'text-blue-500' },
  { id: 6, type: 'global', text: 'Dubai-India Trade Line established', user: 'Sameer G.', location: 'Pune', icon: Globe, color: 'text-violet-500' },
];

export default function FOMOPopup() {
  const [currentIdx, setCurrentIdx] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showNext = () => {
      const nextIdx = Math.floor(Math.random() * ACTIVITIES.length);
      setCurrentIdx(nextIdx);
      setIsVisible(true);

      // Hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    // Initial delay
    const initialTimer = setTimeout(showNext, 5000);

    // Loop every 25-35 seconds (less annoying for premium feel)
    const interval = setInterval(() => {
      showNext();
    }, 30000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  if (currentIdx === null) return null;

  const activity = ACTIVITIES[currentIdx];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.8, y: 20, transition: { duration: 0.3 } }}
          className="fixed bottom-8 right-8 z-[100] max-w-sm w-full"
        >
          <div className="glass-card p-4 flex items-center gap-4 border-white/60 shadow-2xl shadow-slate-900/10 rounded-2xl hover:shadow-primary/10 transition-all overflow-hidden bg-white/90">
            <div className={`w-12 h-12 rounded-2xl bg-slate-50 ${activity.color} flex items-center justify-center shrink-0 shadow-inner`}>
              <activity.icon size={22} />
            </div>
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate">
                  {activity.user} • {activity.location}
                </p>
                <span className="text-[8px] font-black text-primary/60 uppercase shrink-0">Just now</span>
              </div>
              <p className="text-[11px] font-bold text-slate-900 mt-0.5 leading-tight truncate">
                {activity.text}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
