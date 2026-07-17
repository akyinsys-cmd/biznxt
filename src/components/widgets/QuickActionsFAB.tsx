import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, FileText, Briefcase, HelpCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function QuickActionsFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { role } = useAuth();

  const actions = [
    ...(role !== 'customer' ? [{ id: 'support', label: 'Support', icon: HelpCircle, color: 'bg-blue-500', onClick: () => navigate('/support') }] : []),
    { id: 'new-project', label: 'New Project', icon: Briefcase, color: 'bg-emerald-500', onClick: () => navigate('/launch') },
    { id: 'create-document', label: 'Create Document', icon: FileText, color: 'bg-indigo-500', onClick: () => navigate('/documents') },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex flex-col-reverse gap-3 mb-4 items-end"
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 20 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => { setIsOpen(false); action.onClick(); }}
                className="flex items-center gap-3 group"
              >
                <span className="bg-white px-3 py-1.5 rounded-full text-sm font-semibold text-slate-700 shadow-sm border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                  {action.label}
                </span>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg shadow-black/10 transition-transform hover:scale-110 ${action.color}`}>
                  <action.icon className="w-5 h-5" />
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl shadow-primary/20 transition-all duration-300 ${
          isOpen ? 'bg-slate-800 rotate-45' : 'bg-primary hover:bg-primary-dark hover:scale-105'
        }`}
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
