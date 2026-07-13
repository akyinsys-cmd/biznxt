import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, FileText, FileSignature, Clock, Plus, Filter, LayoutGrid, Download, Edit, Settings, FolderLock, CheckCircle2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { DocumentTemplate, GeneratedDocument } from '../../types/document';
import { format } from 'date-fns';

export default function DocumentCenter() {
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const [activeTab, setActiveTab] = useState<'templates' | 'my-documents'>('templates');
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [myDocs, setMyDocs] = useState<GeneratedDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAdminMode, setIsAdminMode] = useState(false);

  const isAdmin = role === 'admin' || role === 'superadmin';

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch Templates
    const tq = query(collection(db, 'document_templates'), where('isActive', '==', true));
    const unsubT = onSnapshot(tq, (snap) => {
      setTemplates(snap.docs.map(d => ({ id: d.id, ...d.data() } as DocumentTemplate)));
      setLoading(false);
    }, () => setLoading(false));

    if (!user) {
      setLoading(false);
      return;
    }
    
    // Fetch My Documents
    const dq = query(collection(db, 'document_orders'), where('userId', '==', user.uid), orderBy('updatedAt', 'desc'));
    const unsubD = onSnapshot(dq, (snap) => {
      setMyDocs(snap.docs.map(d => ({ id: d.id, ...d.data() } as GeneratedDocument)));
    }, () => setLoading(false));

    return () => { unsubT(); unsubD(); };
  }, [user]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-2xl animate-spin" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Document Repository...</p>
        </div>
      </div>
    );
  }

  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))];

  const filteredTemplates = templates.filter(t => 
    (selectedCategory === 'All' || t.category === selectedCategory) &&
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDocs = myDocs.filter(d =>
    (selectedCategory === 'All' || d.category === selectedCategory) &&
    d.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: myDocs.length,
    completed: myDocs.filter(d => d.status === 'Completed').length,
    drafts: myDocs.filter(d => d.status === 'Draft').length
  };

  const deleteDocument = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this document permanently?')) {
      try {
        await deleteDoc(doc(db, 'document_orders', id));
      } catch (err) {
        console.error("Error deleting document:", err);
      }
    }
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen font-sans flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-2xl blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-500/5 rounded-2xl blur-[100px]" />
      </div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-2xl border-b border-slate-100 px-8 py-10 relative z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                <FileSignature size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">BizNxt <span className="text-primary">Docs</span></h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Intelligent Document Automation</p>
              </div>
            </div>
            <p className="text-slate-500 max-w-xl text-sm font-medium leading-relaxed">
              Generate, sign, and manage enterprise-grade legal and business documents with real-time automation and secure cloud archiving.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Workspace</p>
              <p className="text-xs font-bold text-slate-900">{user?.email}</p>
            </div>
            <div className="w-px h-10 bg-slate-100" />
            {isAdmin && (
              <button
                onClick={() => navigate('/documents/admin')}
                className="neo-button px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2"
              >
                <Settings size={14} className="text-primary" /> Admin Panel
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-6 relative z-40 flex-1 flex flex-col mb-12">
        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Cloud Archive', value: stats.total, icon: FolderLock, color: 'text-slate-900', bg: 'bg-white' },
            { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-white' },
            { label: 'Pending Drafts', value: stats.drafts, icon: Clock, color: 'text-amber-500', bg: 'bg-white' },
          ].map((item, idx) => (
            <motion.div 
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`glass-card p-6 flex items-center gap-6 border-white/60 shadow-xl shadow-slate-200/20`}
            >
              <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center shadow-inner`}>
                <item.icon size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                <p className={`text-2xl font-black ${item.color}`}>{item.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation & Search */}
        <div className="glass-card p-4 mb-10 flex flex-col lg:flex-row gap-6 justify-between items-center shadow-2xl shadow-slate-200/40 border-white/40">
          <div className="flex bg-slate-100/50 p-1.5 rounded-2xl w-full lg:w-auto">
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex-1 md:flex-none px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === 'templates' ? 'bg-white text-primary shadow-lg shadow-primary/10' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <LayoutGrid size={14} /> Templates
            </button>
            <button
              onClick={() => setActiveTab('my-documents')}
              className={`flex-1 md:flex-none px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === 'my-documents' ? 'bg-white text-primary shadow-lg shadow-primary/10' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <FileText size={14} /> My Archive
            </button>
          </div>

          <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search documents or templates..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all"
              />
            </div>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-600 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all appearance-none cursor-pointer"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'templates' ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filteredTemplates.map((template, idx) => (
                <motion.div 
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass-card p-8 group hover:scale-[1.03] hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col border-white/60"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner group-hover:shadow-lg group-hover:shadow-primary/30">
                    <FileText size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight leading-tight">{template.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.1em] text-primary bg-primary/5 px-3 py-1.5 rounded-2xl">{template.category}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-500 mb-10 flex-1 leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">{template.description}</p>
                  
                  <button 
                    onClick={() => navigate(`/documents/build/${template.id}`)}
                    className="neo-button w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500"
                  >
                    <Plus size={18} className="text-primary group-hover:text-white" /> Create Now
                  </button>
                </motion.div>
              ))}
              {filteredTemplates.length === 0 && (
                <div className="col-span-full py-32 text-center glass-card border-white/60 shadow-xl bg-white/40 backdrop-blur-md rounded-3xl">
                  <div className="w-24 h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-primary shadow-inner">
                    <FileSignature size={48} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-4">No Templates Found</h3>
                  <p className="text-slate-500 max-w-sm mx-auto mb-10 font-medium leading-relaxed">
                    We couldn't find any document templates matching your current criteria. Try expanding your search or filters.
                  </p>
                  <button 
                    onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                    className="bg-slate-900 text-white px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/20 transition-all hover:scale-[1.05]"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filteredDocs.map((doc, idx) => (
                <motion.div 
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass-card p-8 group hover:scale-[1.03] hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 flex flex-col border-white/60"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-2xl shadow-slate-900/30 group-hover:bg-primary transition-all duration-500">
                      <FileSignature size={32} />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-2xl shadow-lg ${
                      doc.status === 'Completed' ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-amber-500 text-white shadow-amber-500/20'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight line-clamp-1 leading-tight">{doc.title}</h3>
                  <span className="text-[10px] font-black uppercase tracking-[0.1em] text-primary mb-8 block bg-primary/5 px-3 py-1.5 rounded-2xl w-fit">{doc.category}</span>
                  
                  <div className="flex-1"></div>
                  
                  <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 mb-10 uppercase tracking-widest bg-slate-50 p-3 rounded-2xl w-fit group-hover:bg-slate-100 transition-colors">
                    <Clock size={16} className="text-primary" />
                    {doc.updatedAt?.seconds ? format(new Date(doc.updatedAt.seconds * 1000), 'MMM dd, yyyy') : 'Recently Updated'}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => navigate(`/documents/edit/${doc.id}`)}
                      className="flex-1 py-5 bg-slate-50 hover:bg-slate-900 text-slate-900 hover:text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-500"
                    >
                      <Edit size={18} className="text-primary group-hover:text-white" /> {doc.status === 'Draft' ? 'Continue' : 'Manage'}
                    </button>
                    <button 
                      onClick={(e) => deleteDocument(doc.id, e)}
                      className="p-5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
              {filteredDocs.length === 0 && (
                <div className="col-span-full py-32 text-center glass-card border-white/60 shadow-xl bg-white/40 backdrop-blur-md rounded-3xl">
                  <div className="w-24 h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-primary shadow-inner">
                    <FolderLock size={48} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Archive is Empty</h3>
                  <p className="text-slate-500 max-w-sm mx-auto mb-10 font-medium leading-relaxed">
                    You haven't generated any documents yet. Start by selecting a template from the catalog.
                  </p>
                  <button 
                    onClick={() => setActiveTab('templates')}
                    className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 transition-all hover:scale-[1.05]"
                  >
                    Browse Templates
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
