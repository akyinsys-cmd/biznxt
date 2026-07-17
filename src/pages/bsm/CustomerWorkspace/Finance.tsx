import { useState, useEffect } from 'react';
import { Project, Quotation } from '../../../types/project';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { FileText, Download, CheckCircle2, DollarSign, Send } from 'lucide-react';
import { format } from 'date-fns';

export function Finance({ project }: { project: Project }) {
  const [activeTab, setActiveTab] = useState<'quotations' | 'invoices' | 'payments'>('quotations');
  const [quotations, setQuotations] = useState<Quotation[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'quotations'), where('projectId', '==', project.id));
    const unsub = onSnapshot(q, (snap) => {
      setQuotations(snap.docs.map(d => ({ id: d.id, ...d.data() } as Quotation)));
    });
    return () => unsub();
  }, [project.id]);

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm min-h-[600px] overflow-hidden flex flex-col">
      <div className="p-8 border-b border-slate-50 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Financials</h3>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Quotations, Invoices & Payments</p>
        </div>
      </div>

      <div className="flex border-b border-slate-100 px-8 gap-6 shrink-0">
        {[
          { id: 'quotations', label: 'Quotations' },
          { id: 'invoices', label: 'Invoices' },
          { id: 'payments', label: 'Payments' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-4 px-1 border-b-2 text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 p-8">
        {activeTab === 'quotations' && (
          <div className="space-y-4">
            {quotations.map(quote => (
              <div key={quote.id} className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 hover:border-primary/30 hover:shadow-sm transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">{quote.title}</h4>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      {quote.createdAt?.seconds ? format(new Date(quote.createdAt.seconds * 1000), 'MMM dd, yyyy') : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">₹{(quote.totalAmount || 0).toLocaleString()}</p>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                      quote.status === 'Accepted' ? 'bg-emerald-100 text-emerald-600' :
                      quote.status === 'Sent' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {quote.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-slate-400 hover:bg-slate-50 hover:text-primary rounded-2xl transition-colors"><Send size={16} /></button>
                    <button className="p-2 text-slate-400 hover:bg-slate-50 hover:text-primary rounded-2xl transition-colors"><Download size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
            {quotations.length === 0 && (
              <div className="text-center py-12 text-slate-500 font-bold text-sm">
                No quotations generated yet.
              </div>
            )}
          </div>
        )}

        {(activeTab === 'invoices' || activeTab === 'payments') && (
          <div className="text-center py-12 text-slate-500 font-bold text-sm flex flex-col items-center">
            <DollarSign className="w-12 h-12 opacity-20 mb-4" />
            No {activeTab} found for this project.
          </div>
        )}
      </div>
    </div>
  );
}
