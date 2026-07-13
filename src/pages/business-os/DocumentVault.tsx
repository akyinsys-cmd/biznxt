import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FolderLock, 
  Upload, 
  FileText, 
  Filter, 
  Clock, 
  History,
  CheckCircle2,
  Trash
} from 'lucide-react';
import { BusinessDocument } from './types';

interface DocumentVaultProps {
  documents: BusinessDocument[];
  onUploadDocument: (doc: Omit<BusinessDocument, 'id' | 'ownerId' | 'uploadedAt' | 'version' | 'history'>) => Promise<void>;
  onDeleteDocument: (docId: string) => Promise<void>;
}

const CATEGORIES: BusinessDocument['category'][] = [
  'GST', 'PAN', 'IEC', 'Trademark', 'Business Registration', 'Invoice', 'Research Report', 'Business Plan', 'Contract', 'Certificate'
];

export function DocumentVault({ documents, onUploadDocument, onDeleteDocument }: DocumentVaultProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [docName, setDocName] = useState('');
  const [docCategory, setDocCategory] = useState<BusinessDocument['category']>('GST');
  const [submitting, setSubmitting] = useState(false);

  const filteredDocs = selectedCategory === 'All' 
    ? documents 
    : documents.filter(d => d.category === selectedCategory);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;
    setSubmitting(true);
    try {
      await onUploadDocument({
        name: docName.trim().endsWith('.pdf') ? docName.trim() : `${docName.trim()}.pdf`,
        category: docCategory,
        url: '#'
      });
      setDocName('');
      setShowUploadModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-slate-900 p-4 rounded-2xl text-white shadow-xl shadow-slate-900/20">
            <FolderLock className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 font-display tracking-tight leading-none mb-1">Document Vault</h2>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Safe Place for Legal Files</p>
          </div>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 whitespace-nowrap"
        >
          <Upload className="w-4 h-4" strokeWidth={2.5} />
          Securely Upload Certificate
        </button>
      </div>

      {/* Filter and Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category Filters Left */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-2 h-fit">
          <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            Category Filtering
          </h3>
          <button
            onClick={() => setSelectedCategory('All')}
            className={`w-full text-left px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-150 ${
              selectedCategory === 'All' 
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100/50' 
                : 'text-slate-600 hover:bg-slate-50 border border-transparent'
            }`}
          >
            All Vault Items ({documents.length})
          </button>
          {CATEGORIES.map(cat => {
            const count = documents.filter(d => d.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-150 flex justify-between items-center ${
                  selectedCategory === cat 
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-100/50' 
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <span>{cat}</span>
                <span className="font-mono bg-slate-100 text-slate-500 rounded-2xl px-2 py-0.5 text-[9px]">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Documents list Right */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            {filteredDocs.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {filteredDocs.map((doc) => (
                  <div key={doc.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                    {/* Document Icon and Info */}
                    <div className="flex items-start gap-4">
                      <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600 shrink-0 border border-indigo-100/50">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{doc.name}</h4>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500 font-medium">
                          <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-2xl text-[9px] font-black uppercase tracking-widest">
                            {doc.category}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {new Date(doc.uploadedAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-2xl text-[9px] font-black uppercase tracking-widest">
                            <CheckCircle2 className="w-3 h-3" />
                            V{doc.version}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Document Actions */}
                    <div className="flex items-center gap-3 justify-end">
                      <button 
                        onClick={() => onDeleteDocument(doc.id!)}
                        className="text-slate-400 hover:text-primary-dark p-2.5 rounded-2xl hover:bg-slate-50 transition-all duration-150"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center text-sm text-slate-500">
                No legal or business documents found in this category. Click 'Securely Upload Certificate' to register files.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Document Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowUploadModal(false)}></div>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative z-10 border border-slate-100 space-y-4"
            >
              <h3 className="text-lg font-bold text-slate-900 font-display">Securely Register Certificate</h3>
              
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Document Title</label>
                  <input 
                    type="text" 
                    value={docName}
                    onChange={e => setDocName(e.target.value)}
                    placeholder="e.g. Apex_GST_Certificate_MH"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Compliance Category</label>
                  <select
                    value={docCategory}
                    onChange={e => setDocCategory(e.target.value as BusinessDocument['category'])}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-1 bg-slate-50/50">
                  <Upload className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">Drag & Drop certificate files here</p>
                  <p className="text-[10px] text-slate-500">PDF, PNG, JPG accepted (Max 10MB)</p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowUploadModal(false)}
                    className="w-1/2 border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-2xl font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-1/2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-2xl font-bold text-xs shadow-sm"
                  >
                    {submitting ? 'Encrypting...' : 'Register File'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
