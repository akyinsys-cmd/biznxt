import React from 'react';

export function PageLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Loading module...</p>
      </div>
    </div>
  );
}
