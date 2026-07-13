import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, collection, query, where, orderBy, onSnapshot, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { DocumentTemplate, GeneratedDocument, DocumentVersion } from '../../types/document';
import { ArrowLeft, Save, Download, Printer, FileSignature, CheckCircle2, History, RotateCcw, ShieldCheck, Clock, User, ChevronRight, X, Share2, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import DOMPurify from 'dompurify';
import { format } from 'date-fns';

export default function DocumentBuilder() {
  const { templateId, documentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [template, setTemplate] = useState<DocumentTemplate | null>(null);
  const [documentMeta, setDocumentMeta] = useState<GeneratedDocument | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [history, setHistory] = useState<DocumentVersion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  
  const previewRef = useRef<HTMLDivElement>(null);
  const autoSaveTimer = useRef<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (documentId) {
          const docSnap = await getDoc(doc(db, 'document_orders', documentId));
          if (docSnap.exists()) {
            const docData = { id: docSnap.id, ...docSnap.data() } as GeneratedDocument;
            setDocumentMeta(docData);
            setFormData(docData.formData);
            
            // Load its template
            const tSnap = await getDoc(doc(db, 'document_templates', docData.templateId));
            if (tSnap.exists()) {
              setTemplate({ id: tSnap.id, ...tSnap.data() } as DocumentTemplate);
            }

            // Load history
            const hq = query(
              collection(db, 'document_versions'), 
              where('documentId', '==', documentId),
              orderBy('version', 'desc')
            );
            onSnapshot(hq, (snap) => {
              setHistory(snap.docs.map(d => ({ id: d.id, ...d.data() } as DocumentVersion)));
            });
          }
        } else if (templateId) {
          const tSnap = await getDoc(doc(db, 'document_templates', templateId));
          if (tSnap.exists()) {
            setTemplate({ id: tSnap.id, ...tSnap.data() } as DocumentTemplate);
          }
        }
      } catch (err) {
        console.error("Error loading document:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [templateId, documentId]);

  // Auto-save logic
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(() => {
        saveDocument('Draft', false);
      }, 30000); // 30 seconds auto-save
    }
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [formData]);

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const getPreviewContent = () => {
    if (!template) return '';
    let content = template.contentTemplate;
    
    template.formFields.forEach(field => {
      const regex = new RegExp(`{{${field.id}}}`, 'g');
      const val = formData[field.id] || `<span class="bg-amber-100 text-amber-800 px-1 rounded text-[10px] font-bold animate-pulse">[${field.label}]</span>`;
      content = content.replace(regex, val);
    });
    
    return DOMPurify.sanitize(content);
  };

  const saveDocument = async (status: 'Draft' | 'Completed', createVersion = false) => {
    if (!user || !template) return;
    setSaving(true);
    
    const content = getPreviewContent();
    const docId = documentId || doc(collection(db, 'document_orders')).id;
    
    const data: Partial<GeneratedDocument> = {
      userId: user.uid,
      templateId: template.id,
      title: formData.documentTitle || `${template.name} - ${new Date().toLocaleDateString()}`,
      category: template.category,
      formData,
      content,
      status,
      version: documentMeta ? (createVersion ? documentMeta.version + 1 : documentMeta.version) : 1,
      updatedAt: Timestamp.now()
    };

    if (!documentId) {
      data.createdAt = Timestamp.now();
    }

    await setDoc(doc(db, 'document_orders', docId), data, { merge: true });
    
    if (createVersion) {
      await addDoc(collection(db, 'document_versions'), {
        documentId: docId,
        content,
        formData,
        version: data.version,
        createdAt: Timestamp.now(),
        actorName: user.email?.split('@')[0] || 'User'
      });
    }

    setLastSaved(new Date());
    setSaving(false);
    if (!documentId) {
      navigate(`/documents/edit/${docId}`, { replace: true });
    } else {
      setDocumentMeta({ ...documentMeta, ...data } as GeneratedDocument);
    }
  };

  const restoreVersion = (v: DocumentVersion) => {
    if (confirm(`Restore version ${v.version}? This will overwrite your current progress.`)) {
      setFormData(v.formData);
      setShowHistory(false);
    }
  };

  const exportPDF = async () => {
    if (!previewRef.current) return;
    await saveDocument('Completed', true);
    
    const canvas = await html2canvas(previewRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${documentMeta?.title || template?.name || 'document'}.pdf`);
  };

  const analyzeAI = async () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setAiInsights([
        "Legal compliance verified against BIZNXT standard v3.0.",
        "Detected 3 key operational clauses requiring signature.",
        "Risk Assessment: Low. Document adheres to enterprise data privacy rules.",
        "Optimization: Consider adding a liability waiver for Section 4."
      ]);
      setIsAnalyzing(false);
      setShowAI(true);
    }, 1500);
  };

  const copyShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('Share link copied to clipboard!');
  };

  if (loading) return (
    <div className="flex-1 flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-2xl animate-spin" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Initializing Workspace...</p>
      </div>
    </div>
  );

  if (!template) return <div className="flex-1 flex items-center justify-center min-h-screen">Template not found</div>;

  return (
    <div className="flex-1 bg-slate-50 min-h-screen font-sans flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-2xl blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-500/5 rounded-2xl blur-[100px]" />
      </div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-2xl border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/documents')} className="p-3 text-slate-400 hover:text-primary bg-slate-50 hover:bg-white rounded-2xl transition-all shadow-sm border border-transparent hover:border-slate-100">
            <ArrowLeft size={20} />
          </button>
          <div className="h-10 w-px bg-slate-100 mx-2" />
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">{template.name}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-2.5 py-1 rounded-2xl">{template.category}</span>
              {documentMeta && (
                <>
                  <span className="text-slate-200">•</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-2xl shadow-sm ${
                    documentMeta.status === 'Completed' ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-amber-500 text-white shadow-amber-500/20'
                  }`}>
                    {documentMeta.status}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden xl:flex items-center gap-1.5 mr-4 bg-slate-100/50 px-4 py-2 rounded-2xl">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-2xl bg-indigo-500 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">JD</div>
              <div className="w-6 h-6 rounded-2xl bg-emerald-500 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">AK</div>
              <div className="w-6 h-6 rounded-2xl bg-amber-500 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">+1</div>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Collaborating</span>
          </div>

          <div className="hidden lg:flex flex-col items-end mr-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <CheckCircle2 size={12} className={lastSaved ? "text-emerald-500" : "text-slate-200"} />
              {lastSaved ? `Synced ${format(lastSaved, 'HH:mm:ss')}` : 'Waiting for changes...'}
            </span>
          </div>

          <button 
            onClick={analyzeAI}
            className={`p-3 rounded-2xl transition-all border ${
              showAI 
                ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20' 
                : 'text-slate-400 hover:text-primary bg-slate-50 border-transparent hover:border-slate-100 shadow-sm'
            }`}
            title="AI Analysis"
          >
            <Sparkles size={20} className={isAnalyzing ? "animate-pulse" : ""} />
          </button>

          <button 
            onClick={copyShareLink}
            className="p-3 text-slate-400 hover:text-primary bg-slate-50 hover:bg-white rounded-2xl transition-all shadow-sm border border-transparent hover:border-slate-100"
            title="Copy Share Link"
          >
            <Share2 size={20} />
          </button>

          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`p-3 rounded-2xl transition-all border ${
              showHistory 
                ? 'bg-slate-900 text-white border-slate-900 shadow-xl' 
                : 'text-slate-400 hover:text-primary bg-slate-50 border-transparent hover:border-slate-100 shadow-sm'
            }`}
            title="Version History"
          >
            <History size={20} />
          </button>

          <button 
            onClick={() => saveDocument('Draft', true)}
            disabled={saving}
            className="neo-button px-6 py-3 text-[11px] font-black uppercase tracking-[0.15em] text-slate-900 rounded-2xl flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={18} className="text-primary" /> {saving ? 'Saving...' : 'Checkpoint'}
          </button>
          
          <button 
            onClick={exportPDF}
            className="bg-slate-900 hover:bg-slate-800 text-white px-7 py-3 text-[11px] font-black uppercase tracking-[0.15em] rounded-2xl flex items-center gap-2 shadow-2xl shadow-slate-900/30 transition-all hover:scale-[1.03] active:scale-[0.98]"
          >
            <Download size={18} /> Finish & Export
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 max-w-[1800px] w-full mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8 relative z-10">
        {/* Form Panel */}
        <div className="w-full lg:w-[400px] xl:w-[440px] flex flex-col gap-6 shrink-0">
          <div className="glass-card p-8 lg:sticky lg:top-24 border-white/60 shadow-2xl shadow-slate-200/40">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                <FileSignature size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">Drafting</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Template variables</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="neo-inset p-5 rounded-[2.5rem] bg-white/50 group focus-within:bg-white transition-all">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Document Alias</label>
                <input 
                  type="text" 
                  value={formData.documentTitle || ''} 
                  onChange={(e) => handleInputChange('documentTitle', e.target.value)}
                  placeholder={`${template.name} - ${new Date().toLocaleDateString()}`}
                  className="w-full bg-transparent border-none p-0 text-sm font-black text-slate-900 outline-none placeholder:text-slate-300"
                />
              </div>

              <div className="h-px bg-slate-100/60 my-2" />

              <div className="space-y-6">
                {template.formFields.map(field => (
                  <div key={field.id} className="animate-in fade-in slide-in-from-bottom-2">
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-2 px-1">
                      {field.label} {field.required && <span className="text-primary">*</span>}
                    </label>
                    
                    <div className="neo-inset p-4 rounded-[2.5rem] bg-white/50 focus-within:bg-white transition-all">
                      {field.type === 'textarea' ? (
                        <textarea 
                          value={formData[field.id] || ''}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          placeholder={field.placeholder}
                          rows={4}
                          className="w-full bg-transparent border-none p-1 text-sm font-medium text-slate-700 outline-none resize-none placeholder:text-slate-300 leading-relaxed"
                        />
                      ) : field.type === 'select' ? (
                        <select 
                          value={formData[field.id] || ''}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          className="w-full bg-transparent border-none p-1 text-sm font-black text-slate-900 outline-none appearance-none cursor-pointer"
                        >
                          <option value="">Choose option...</option>
                          {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      ) : (
                        <input 
                          type={field.type} 
                          value={formData[field.id] || ''}
                          onChange={(e) => handleInputChange(field.id, e.target.type === 'checkbox' ? e.target.checked : e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full bg-transparent border-none p-1 text-sm font-black text-slate-900 outline-none placeholder:text-slate-300"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 p-5 rounded-[2.5rem] bg-slate-900 text-white flex items-center gap-5 shadow-2xl shadow-slate-900/20">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400 shadow-inner">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Legal Verification</p>
                <p className="text-sm font-bold tracking-tight">Enterprise Verified</p>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex-1 bg-slate-200/40 rounded-[2.5rem] p-4 md:p-12 flex justify-center overflow-y-auto shadow-inner min-h-[calc(100vh-160px)]" style={{ maxHeight: 'calc(100vh - 120px)' }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            ref={previewRef}
            className="bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] max-w-[850px] w-full min-h-[1100px] p-16 md:p-24 prose prose-slate prose-base relative overflow-hidden"
            dangerouslySetInnerHTML={{ __html: getPreviewContent() }}
          />
        </div>

        {/* AI Analysis Sidebar */}
        <AnimatePresence>
          {showAI && (
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed inset-y-0 right-0 w-96 bg-slate-900 shadow-2xl z-50 flex flex-col text-white"
            >
              <div className="p-8 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight">AI Insights</h3>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-1">Intelligent Analysis</p>
                  </div>
                </div>
                <button onClick={() => setShowAI(false)} className="p-3 bg-white/5 text-white/40 hover:text-white rounded-2xl transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                <div className="bg-white/5 rounded-[2.5rem] p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle size={18} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Summary Report</span>
                  </div>
                  <p className="text-sm font-medium text-white/70 leading-relaxed italic">
                    "This document is a standard {template.category} agreement. It contains all mandatory clauses required for enterprise compliance in your region."
                  </p>
                </div>

                <div className="space-y-4">
                  {aiInsights.map((insight, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                    >
                      <div className="w-6 h-6 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 size={14} />
                      </div>
                      <p className="text-xs font-bold text-white/80 leading-relaxed">{insight}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="pt-8 mt-8 border-t border-white/10">
                  <button className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 transition-all flex items-center justify-center gap-3">
                    <Save size={18} /> Apply Suggestions
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History Sidebar */}
        <AnimatePresence>
          {showHistory && (
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl border-l border-slate-100 z-50 flex flex-col"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Timeline</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Version History</p>
                </div>
                <button onClick={() => setShowHistory(false)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {history.map((v, idx) => (
                  <div key={v.id} className="group glass-card p-6 border-slate-100 hover:border-primary/30 transition-all cursor-default">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <History size={20} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {idx === 0 ? 'Latest' : `v${v.version}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-900 mb-1">
                      <User size={14} className="text-primary" />
                      {v.actorName}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
                      <Clock size={14} className="text-slate-300" />
                      {v.createdAt?.seconds ? format(new Date(v.createdAt.seconds * 1000), 'MMM dd, HH:mm') : 'Just now'}
                    </div>
                    <button 
                      onClick={() => restoreVersion(v)}
                      className="w-full py-3 bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <RotateCcw size={14} /> Restore Points
                    </button>
                  </div>
                ))}

                {history.length === 0 && (
                  <div className="py-20 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <History size={24} className="text-slate-200" />
                    </div>
                    <p className="text-sm font-bold text-slate-400">No versions captured yet.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
