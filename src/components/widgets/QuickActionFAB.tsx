import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Rocket, FileText, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

export function QuickActionFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const actions = [
    { name: 'Launch Wizard', path: '/launch', icon: Rocket, color: 'text-primary', bg: 'bg-primary/5' },
    { name: 'New Report', path: '/reports', icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50' },
    { name: 'Browse Services', path: '/services', icon: Briefcase, color: 'text-success', bg: 'bg-success/10' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50" ref={containerRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-16 right-0 mb-2 flex flex-col gap-2 min-w-[200px]"
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.15, delay: index * 0.05 }}
              >
                <Link
                  to={action.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-2xl shadow-lg hover:bg-slate-50 transition-colors group"
                >
                  <div className={`p-2 rounded-2xl ${action.bg} ${action.color}`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-sm text-slate-700 group-hover:text-slate-900">
                    {action.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary hover:bg-primary-dark text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 transition-transform hover:scale-105 active:scale-95"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Plus className="w-7 h-7" />
        </motion.div>
      </button>
    </div>
  );
}
