import React, { useState, useEffect } from 'react';
import { WifiOff, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function NetworkStatus() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-[2rem] shadow-2xl shadow-slate-900/20"
        >
          <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">
            <WifiOff size={16} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-rose-400">Connection Lost</p>
            <p className="text-[10px] font-medium text-slate-400">Please check your internet connection. We'll reconnect you shortly.</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
