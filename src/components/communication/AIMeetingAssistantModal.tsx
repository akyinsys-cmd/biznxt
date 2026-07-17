import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2, FileText, CheckCircle2, Mic, Square, Volume2 } from 'lucide-react';
import { DictateButton } from '../documents/DictateButton';
import { useToast } from '../../context/ToastContext';

interface AIMeetingAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomName: string;
}

export function AIMeetingAssistantModal({ isOpen, onClose, roomName }: AIMeetingAssistantModalProps) {
  const { error: toastError, info: toastInfo } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState<any>(null);

  const generateNotes = async () => {
    if (!transcript) {
      toastInfo("No audio transcript available to summarize.");
      return;
    }
    setLoading(true);
    setNotes(null);
    try {
      const response = await fetch('/api/meetings/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: `[AUDIO TRANSCRIPT]\n${transcript}` })
      });
      
      if (!response.ok) throw new Error('Summarization failed');
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error(error);
      toastError('Failed to generate meeting notes.');
    } finally {
      setLoading(false);
      setIsRecording(false);
    }
  };

  const handleDictate = (text: string) => {
    setTranscript(prev => prev ? prev + ' ' + text : text);
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
          className="bg-white w-full max-w-3xl rounded-[2rem] shadow-2xl flex flex-col overflow-hidden max-h-[90vh]"
        >
          <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shadow-sm">
                <Mic size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">AI Meeting Assistant</h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">Live Audio Transcription</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
              <X size={20} className="text-slate-400 hover:text-slate-900" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1 bg-white shadow-xl shadow-slate-200/50 flex flex-col gap-6">
            
            {/* Audio Controls */}
            {!notes && !loading && (
              <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-[2rem] border border-slate-100 relative overflow-hidden">
                <div className={`absolute inset-0 bg-indigo-500/5 transition-opacity duration-1000 ${isRecording ? 'opacity-100 animate-pulse' : 'opacity-0'}`} />
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 relative z-10">Meeting Transcription</h3>
                
                <div className="flex items-center gap-4 relative z-10">
                  <div className="scale-[1.5]">
                    <DictateButton onResult={handleDictate} />
                  </div>
                  {transcript && (
                    <button 
                      onClick={generateNotes}
                      className="px-6 py-4 bg-indigo-600 text-white rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 shadow-xl shadow-indigo-600/30 transition-all hover:scale-105"
                    >
                      <FileText size={16} /> Generate Minutes
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Transcript View */}
            {!notes && !loading && (
              <div className="flex-1 min-h-[200px]">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Volume2 size={14} /> Live Transcript
                </h4>
                <textarea 
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Dictate using the mic or paste meeting transcript here..."
                  className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl text-slate-700 leading-relaxed min-h-[150px] outline-none focus:border-indigo-300 resize-y"
                />
              </div>
            )}

            {/* Results */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Loader2 size={40} className="text-indigo-600 animate-spin mb-4" />
                <h3 className="text-lg font-black text-slate-900">Processing Audio...</h3>
                <p className="text-sm text-slate-500 font-medium mt-2">Generating structured minutes, extracting action items.</p>
              </div>
            ) : notes ? (
              <div className="space-y-8 p-8 bg-slate-50 rounded-3xl border border-slate-100">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Executive Summary</h3>
                  <p className="text-slate-800 leading-relaxed text-sm font-medium">{notes.summary}</p>
                </div>
                
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Key Points</h3>
                  <ul className="space-y-3">
                    {notes.points?.map((pt: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 font-medium bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                        <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 text-xs font-bold">{idx + 1}</div>
                        <span className="pt-0.5">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {notes.decisions && notes.decisions.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Decisions</h3>
                    <ul className="space-y-3">
                      {notes.decisions.map((dec: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-3 text-sm text-slate-700 font-medium bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                          <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                          <span>{dec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Action Items</h3>
                  <div className="space-y-3">
                    {notes.tasks?.map((task: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <span className="text-sm font-bold text-slate-800">{task.task}</span>
                        <span className="text-[10px] font-black px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full uppercase tracking-wider">
                          {task.assignee}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          
          {notes && (
            <div className="p-6 border-t border-slate-100 flex justify-end bg-slate-50">
              <button 
                onClick={onClose}
                className="px-8 py-3 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all hover:scale-105"
              >
                Close & Save Minutes
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
