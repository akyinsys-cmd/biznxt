import React from 'react';
import { FileText, FolderOpen } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';

interface Report {
  id: string;
  name: string;
}

interface RecentReportsProps {
  reports: Report[];
  onBrowse: () => void;
}

export function RecentReports({ reports, onBrowse }: RecentReportsProps) {
  return (
    <div className="glass-card bg-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-900">Latest Documents</h2>
        <button 
          onClick={onBrowse}
          className="text-primary text-sm font-medium hover:text-primary-dark transition-colors"
        >
          Browse Drive
        </button>
      </div>
      
      {reports.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {reports.map((doc) => (
            <div 
              key={doc.id} 
              className="flex items-center p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 mr-4 shrink-0 group-hover:bg-slate-200 transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-sm font-medium text-slate-900 truncate group-hover:text-primary transition-colors">
                  {doc.name}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5 truncate">Google Workspace</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={FolderOpen}
          title="No documents yet"
          description="Your latest business documents and generated reports will appear here."
          action={
            <button 
              onClick={onBrowse}
              className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-2xl font-medium text-sm transition-colors"
            >
              Upload Document
            </button>
          }
        />
      )}
    </div>
  );
}
