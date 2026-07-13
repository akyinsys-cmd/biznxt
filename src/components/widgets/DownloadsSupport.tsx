import React from 'react';
import { motion } from 'motion/react';
import { Download, ArrowUpRight, HelpCircle, FileCheck, ShieldAlert, LifeBuoy } from 'lucide-react';

interface FileDownload {
  id: string;
  name: string;
  type: string;
  size: string;
}

const DOWNLOADABLE_FILES: FileDownload[] = [
  {
    id: 'f1',
    name: 'Incorporation Draft Certificate (LLC)',
    type: 'PDF Document',
    size: '1.4 MB'
  },
  {
    id: 'f2',
    name: 'Venture CapEx Financial Projection Model',
    type: 'Excel Sheet template',
    size: '4.2 MB'
  },
  {
    id: 'f3',
    name: 'Trademark Legal Verification Brief',
    type: 'PDF Document',
    size: '850 KB'
  }
];

export function DownloadsSupport({ onSupportOpen }: { onSupportOpen?: () => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Downloads list */}
      <div className="glass-card bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base">My Downloads</h3>
          <p className="text-xs text-slate-500 mt-0.5">Access filed compliance forms, models, and signed deeds.</p>
        </div>

        <div className="space-y-3">
          {DOWNLOADABLE_FILES.map((file) => (
            <div 
              key={file.id}
              className="p-3 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50/60 rounded-2xl text-primary">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors">{file.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500 font-medium">
                    <span>{file.type}</span>
                    <span>•</span>
                    <span className="font-mono">{file.size}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => alert(`Initiating download for ${file.name}...`)}
                className="p-2 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Support desk card */}
      <div className="glass-card bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Support Desk Matrix</h3>
              <p className="text-xs text-slate-500 mt-0.5">Immediate assistance for regulatory, legal, or trade bottlenecks.</p>
            </div>
            <LifeBuoy className="w-5 h-5 text-indigo-500" />
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-600 leading-relaxed mt-4">
            Our SLA ensures legal sign-off queries are resolved within <span className="font-bold text-slate-900">4 business hours</span>. Connect with our experts via live ticket channels instantly.
          </div>
        </div>

        <div className="pt-4 flex gap-3">
          <button 
            onClick={onSupportOpen}
            className="flex-1 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Raise Urgent Ticket</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          
          <button 
            onClick={() => alert('Initiating secure support messenger call...')}
            className="flex-1 py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
          >
            Call Consultant
          </button>
        </div>
      </div>
    </div>
  );
}
