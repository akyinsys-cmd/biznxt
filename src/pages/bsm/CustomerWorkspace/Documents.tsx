import React, { useState, useEffect } from 'react';
import { Project, CustomerDocument } from '../../../types/project';
import { collection, query, where, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { FileText, Download, Upload, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

export function Documents({ project }: { project: Project }) {
  const [documents, setDocuments] = useState<CustomerDocument[]>([]);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'customer_documents'), where('projectId', '==', project.id));
    const unsub = onSnapshot(q, (snap) => {
      setDocuments(snap.docs.map(d => ({ id: d.id, ...d.data() } as CustomerDocument)));
    });
    return () => unsub();
  }, [project.id]);

  const handleRequestDoc = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    await addDoc(collection(db, 'customer_documents'), {
      projectId: project.id,
      clientId: project.clientId,
      name: formData.get('name'),
      type: formData.get('type'),
      status: 'Pending Upload',
      version: 1,
      requestedAt: new Date()
    });
    setShowUpload(false);
  };

  return (
    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm min-h-[600px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Documents Vault</h3>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Manage project files</p>
        </div>
        <button 
          onClick={() => setShowUpload(true)}
          className="px-6 py-2.5 bg-slate-900 text-white text-[10px] font-black rounded-full uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800"
        >
          <Upload size={16} /> Request Document
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map(doc => (
          <div key={doc.id} className="p-5 rounded-2xl border border-slate-200 hover:border-primary/50 transition-all flex flex-col group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center group-hover:text-primary group-hover:bg-primary/5 transition-colors">
                <FileText size={20} />
              </div>
              <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
                doc.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' :
                doc.status === 'Pending Upload' ? 'bg-amber-100 text-amber-600' :
                doc.status === 'Rejected' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {doc.status}
              </span>
            </div>
            
            <h4 className="text-sm font-black text-slate-900 line-clamp-1">{doc.name}</h4>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 mb-4">{doc.type} • v{doc.version}</p>
            
            <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                <Clock size={12} /> {doc.uploadedAt ? format(new Date(doc.uploadedAt), 'MMM dd') : 'Not uploaded'}
              </span>
              {doc.url && (
                <button className="text-primary hover:bg-primary/10 p-1.5 rounded-2xl transition-colors">
                  <Download size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl p-8">
            <h3 className="text-xl font-black text-slate-900 mb-6">Request Document</h3>
            <form onSubmit={handleRequestDoc} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Document Name</label>
                <input name="name" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Type</label>
                <select name="type" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:border-primary">
                  <option>ID Proof</option>
                  <option>Address Proof</option>
                  <option>Business Plan</option>
                  <option>GST Certificate</option>
                  <option>Trademark</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowUpload(false)} className="px-6 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-full hover:bg-slate-200">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-full hover:bg-slate-800">Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
