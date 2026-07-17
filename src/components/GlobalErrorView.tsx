import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

interface GlobalErrorViewProps {
  onReset?: () => void;
}

export function GlobalErrorView({ onReset }: GlobalErrorViewProps) {
  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-[60vh] bg-transparent flex items-center justify-center p-6 text-left font-sans">
      <div className="relative max-w-md w-full bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-full flex items-center justify-center text-red-500 mb-6 shadow-sm">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-3">Service Interruption</h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          We are experiencing a temporary issue. Our team is working on it and everything will be back to normal shortly.
        </p>
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={handleReset}
            className="w-full py-4 px-6 bg-slate-900 text-white rounded-full transition-all text-xs font-black uppercase tracking-widest hover:bg-slate-800 flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <button
            onClick={() => {
              if (onReset) onReset();
              window.location.href = '/';
            }}
            className="w-full py-4 px-6 bg-white text-slate-700 border border-slate-200 rounded-full transition-all text-xs font-black uppercase tracking-widest hover:bg-slate-50 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
}

