import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2, FileText, CheckCircle2 } from 'lucide-react';
import { ChatMessage } from '../../types/communication';
import { useToast } from '../../context/ToastContext';

interface QuickMeetingNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  roomName: string;
}

export function QuickMeetingNotesModal({ isOpen, onClose, messages, roomName }: QuickMeetingNotesModalProps) {
  const { error: toastError } = useToast();
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      generateNotes();
    }
  }, [isOpen]);

  const generateNotes = async () => {
    setLoading(true);
    setNotes(null);
    try {
      const transcript = messages.map(m => `${m.senderName}: ${m.content}`).join('\n');
      
      const response = await fetch('/api/meetings/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript })
      });
      
      if (!response.ok) throw new Error('Summarization failed');
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error(error);
      toastError('Failed to generate meeting notes.');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          exit={{ y: 20, opacity: 0 }}
          className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]"
        >
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <FileText size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">AI Meeting Notes</h2>
                <p className="text-xs text-slate-500 font-medium">{roomName}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Loader2 size={40} className="text-primary animate-spin mb-4" />
                <h3 className="text-lg font-bold text-slate-900">Analyzing Transcript...</h3>
                <p className="text-sm text-slate-500">Generating structured minutes and action items.</p>
              </div>
            ) : notes ? (
              <div className="space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">Executive Summary</h3>
                  <p className="text-slate-700 leading-relaxed text-sm">{notes.summary}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">Key Points</h3>
                  <ul className="space-y-2">
                    {notes.points?.map((pt: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {notes.decisions && notes.decisions.length > 0 && (
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">Decisions</h3>
                    <ul className="space-y-2">
                      {notes.decisions.map((dec: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                          <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                          <span>{dec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">Action Items</h3>
                  <div className="space-y-3">
                    {notes.tasks?.map((task: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-sm font-medium text-slate-800">{task.task}</span>
                        <span className="text-[10px] font-bold px-2 py-1 bg-white border border-slate-200 rounded-full text-slate-500">
                          {task.assignee}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          
          <div className="p-6 border-t border-slate-100 flex justify-end bg-white shadow-xl shadow-slate-200/50">
            <button 
              onClick={onClose}
              className="px-6 py-3 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-800 shadow-sm transition-colors"
            >
              Close Notes
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
