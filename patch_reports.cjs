const fs = require('fs');

const reportsContent = `
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Download, Eye, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SkeletonComponent } from '../components/SkeletonComponent';
import { cn } from '../lib/utils';

export default function Reports() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-[80vh]">
      <div className="bg-white/60 backdrop-blur-xl border border-white/50 p-10 rounded-3xl shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/5 rounded-3xl blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Research Reports</h1>
            <p className="text-slate-500 font-medium tracking-tight">View and download your finalized industry analysis and feasibility reports.</p>
          </div>
        </div>
      </div>

      <div className="min-h-[50vh] bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 p-8 shadow-inner">
        <div className="bg-white rounded-[2rem] border border-slate-100 p-12 text-center min-h-[300px] flex flex-col items-center justify-center shadow-sm">
          <FileText size={48} className="text-slate-300 mb-6" />
          <h3 className="text-2xl font-black text-slate-900 mb-2">No Reports Available</h3>
          <p className="text-slate-500 font-medium max-w-md mx-auto">You currently have no finalized reports. Once your Business Success Manager completes a research request, it will appear here.</p>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/pages/Reports.tsx', reportsContent);
console.log("Patched Reports.tsx");
