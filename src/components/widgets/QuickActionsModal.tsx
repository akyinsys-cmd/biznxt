import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight } from 'lucide-react';
import { SupportTicketForm } from './SupportTicketForm';
import { DiscoveryForm } from './DiscoveryForm';

export type QuickActionType = 'research' | 'consultation' | 'support' | null;

interface QuickActionsModalProps {
  isOpen: boolean;
  actionType: QuickActionType;
  onClose: () => void;
}

export function QuickActionsModal({ isOpen, actionType, onClose }: QuickActionsModalProps) {
  const getTitle = () => {
    switch (actionType) {
      case 'research': return 'Free Discovery & AI Overview';
      case 'consultation': return 'Book a Consultation';
      case 'support': return 'Contact Support';
      default: return '';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 z-10 flex flex-col max-h-full"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <h2 className="text-xl font-bold text-slate-900">{getTitle()}</h2>
              <button 
                onClick={onClose}
                className="p-2 text-slate-500 hover:text-slate-600 hover:bg-slate-100 rounded-2xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {actionType === 'research' && (
                <DiscoveryForm />
              )}

              {actionType === 'consultation' && (
                <div className="space-y-4">
                  <p className="text-sm text-slate-500 mb-6">Schedule a one-on-one session with our business experts to discuss your strategy and execution plan.</p>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Topic</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="e.g. Company Registration & GST"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                        <input 
                          type="date" 
                          className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                        <input 
                          type="time" 
                          className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700"
                        />
                     </div>
                  </div>
                  <button className="w-full flex items-center justify-center px-4 py-3 bg-primary text-white rounded-2xl font-medium hover:bg-primary-dark transition-colors mt-6">
                    Book Session <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              )}

              {actionType === 'support' && (
                <SupportTicketForm onSuccess={onClose} />
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
