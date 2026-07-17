import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion } from 'motion/react';
import { useToast } from '../../context/ToastContext';

export function DictateButton({ onResult }: { onResult: (text: string) => void }) {
  const { error: toastError } = useToast();
  const [recognition, setRecognition] = useState<any>(null);
  const [isDictating, setIsDictating] = useState(false);

  useEffect(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      
      rec.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript + ' ';
          }
        }
        if (transcript) {
          onResult(transcript);
        }
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsDictating(false);
      };

      rec.onend = () => {
        setIsDictating(false);
      };
      
      setRecognition(rec);
    }
  }, [onResult]);

  const toggleDictation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!recognition) {
      toastError("Speech recognition is not supported in this browser.");
      return;
    }
    
    if (isDictating) {
      recognition.stop();
      setIsDictating(false);
    } else {
      recognition.start();
      setIsDictating(true);
    }
  };

  if (!recognition) return null;

  return (
    <button 
      onClick={toggleDictation}
      title={isDictating ? "Stop Dictating" : "Start Dictating"}
      className={`absolute right-4 bottom-4 w-10 h-10 rounded-full flex items-center justify-center transition-all z-10 ${isDictating ? 'bg-rose-100 text-rose-500 animate-pulse shadow-md' : 'bg-slate-100 text-slate-400 hover:bg-primary/10 hover:text-primary shadow-sm'}`}
    >
      {isDictating ? <MicOff size={18} /> : <Mic size={18} />}
      {isDictating && (
        <motion.span 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1.2 }}
          transition={{ repeat: Infinity, duration: 1, repeatType: 'reverse' }}
          className="absolute -inset-2 rounded-full border-2 border-rose-400 opacity-50"
        />
      )}
    </button>
  );
}
