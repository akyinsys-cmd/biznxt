import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { DocumentTemplate, FormField } from '../../types/document';
import { Plus, Edit2, Trash2, Settings, FileText, X } from 'lucide-react';

export default function AdminDocumentCenter() {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'document_templates'));
    const unsub = onSnapshot(q, (snap) => {
      setTemplates(snap.docs.map(d => ({ id: d.id, ...d.data() } as DocumentTemplate)));
    });
    return () => unsub();
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Parse formFields JSON
    let formFields: FormField[] = [];
    try {
      formFields = JSON.parse(formData.get('formFields') as string);
    } catch(err) {
      alert("Invalid Form Fields JSON");
      return;
    }

    const data = {
      name: formData.get('name'),
      category: formData.get('category'),
      description: formData.get('description'),
      contentTemplate: formData.get('contentTemplate'),
      formFields,
      isActive: formData.get('isActive') === 'true',
      version: editingTemplate ? editingTemplate.version + 1 : 1,
      updatedAt: new Date()
    };

    try {
      if (editingTemplate) {
        await updateDoc(doc(db, 'document_templates', editingTemplate.id), data);
      } else {
        await addDoc(collection(db, 'document_templates'), { ...data, createdAt: new Date() });
      }
      setShowModal(false);
      setEditingTemplate(null);
    } catch (err) {
      console.error(err);
      alert('Failed to save template');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this template?')) {
      await deleteDoc(doc(db, 'document_templates', id));
    }
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen font-sans flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-2xl blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-500/5 rounded-2xl blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto w-full p-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-2xl shadow-slate-900/20">
                <Settings size={24} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Template Engine</h1>
            </div>
            <p className="text-slate-500 text-sm font-medium">Configure and manage intelligent document blueprints.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={async () => { const { seedDocumentTemplates } = await import("../../seedDocs"); await seedDocumentTemplates(); }} 
              className="px-6 py-3 bg-white border border-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
            >
              Force Sync Seed
            </button>
            <button 
              onClick={() => { setEditingTemplate(null); setShowModal(true); }}
              className="bg-primary hover:bg-primary-dark text-white px-8 py-3 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl flex items-center gap-2 shadow-2xl shadow-primary/20 transition-all hover:scale-[1.03]"
            >
              <Plus size={18} /> New Template
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {templates.map(t => (
            <div key={t.id} className="glass-card p-6 flex flex-col md:flex-row items-center justify-between group hover:border-primary/40 transition-all duration-500">
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center shadow-inner group-hover:bg-primary/5 group-hover:text-primary transition-all duration-500">
                  <FileText size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                    {t.name}
                    {!t.isActive && <span className="text-[10px] bg-rose-500 text-white px-3 py-1 rounded-2xl uppercase tracking-widest shadow-lg shadow-rose-500/20">Inactive</span>}
                  </h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.15em] bg-primary/5 px-3 py-1 rounded-2xl">{t.category}</span>
                    <span className="text-slate-200">•</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">v{t.version}</span>
                    <span className="text-slate-200">•</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.formFields.length} Data Points</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 mt-6 md:mt-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                <button 
                  onClick={() => { setEditingTemplate(t); setShowModal(true); }} 
                  className="p-4 text-slate-400 hover:text-primary bg-slate-50 hover:bg-white rounded-2xl transition-all shadow-sm border border-transparent hover:border-slate-100"
                  title="Configure"
                >
                  <Settings size={20} />
                </button>
                <button 
                  onClick={() => handleDelete(t.id)} 
                  className="p-4 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-white rounded-2xl transition-all shadow-sm border border-transparent hover:border-slate-100"
                  title="Remove"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}

          {templates.length === 0 && (
            <div className="py-32 text-center glass-card border-dashed">
              <div className="w-24 h-24 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Settings className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">No Blueprints Configured</h3>
              <p className="text-slate-400 mt-2 font-medium">Create a new template or sync from seed data.</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl p-8 my-8">
            <div className="flex items-center justify-between mb-6">
          <button onClick={async () => { const { seedDocumentTemplates } = await import("../../seedDocs"); await seedDocumentTemplates(); }} className="px-4 py-2 bg-emerald-100 text-emerald-700 font-bold rounded-2xl mr-4 hover:bg-emerald-200">Seed Templates</button>
              <h3 className="text-xl font-black text-slate-900">{editingTemplate ? 'Edit Template' : 'New Template'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSave} className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Name</label>
                  <input name="name" defaultValue={editingTemplate?.name} required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Category</label>
                  <input name="category" defaultValue={editingTemplate?.category} required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Description</label>
                  <textarea name="description" defaultValue={editingTemplate?.description} rows={2} required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</label>
                  <select name="isActive" defaultValue={editingTemplate?.isActive ? 'true' : 'false'} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:border-primary">
                    <option value="true">Active (Published)</option>
                    <option value="false">Draft (Hidden)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Form Fields (JSON)</label>
                  <textarea 
                    name="formFields" 
                    defaultValue={JSON.stringify(editingTemplate?.formFields || [{id: "companyName", label: "Company Name", type: "text", required: true}], null, 2)} 
                    rows={8} 
                    required 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-xs font-mono text-slate-700 outline-none focus:border-primary" 
                  />
                </div>
              </div>
              
              <div className="h-full flex flex-col">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">HTML/Markdown Template (use {"{{fieldId}}"})</label>
                <textarea 
                  name="contentTemplate" 
                  defaultValue={editingTemplate?.contentTemplate} 
                  required 
                  className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-xs font-mono text-slate-700 outline-none focus:border-primary" 
                  placeholder="<h1>{{companyName}}</h1>..."
                />
              </div>

              <div className="col-span-2 flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-2xl hover:bg-slate-200">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-2xl hover:bg-primary/90">Save Template</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
