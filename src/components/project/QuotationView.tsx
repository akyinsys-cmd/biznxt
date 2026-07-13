import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  AlertTriangle,
  CreditCard,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { doc, getDocs, query, collection, where, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Quotation, QuotationItem } from '../../types/project';
import { useToast } from '../../context/ToastContext';

interface QuotationViewProps {
  projectId: string;
  onAccepted?: () => void;
}

export default function QuotationView({ projectId, onAccepted }: QuotationViewProps) {
  const { success, error } = useToast();
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    async function fetchQuotation() {
      try {
        const q = query(collection(db, 'quotations'), where('projectId', '==', projectId));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const quoteData = { id: snap.docs[0].id, ...snap.docs[0].data() } as Quotation;
          
          // Fetch items for this quotation
          const itemsSnap = await getDocs(query(collection(db, 'quotation_items'), where('quotationId', '==', quoteData.id)));
          const items = itemsSnap.docs.map(d => ({ id: d.id, ...d.data() } as QuotationItem));
          
          setQuotation({ ...quoteData, items });
        }
      } catch (err) {
        console.error('Error fetching quotation:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuotation();
  }, [projectId]);

  const handleAction = async (status: 'accepted' | 'rejected') => {
    if (!quotation) return;
    try {
      setProcessing(true);
      await updateDoc(doc(db, 'quotations', quotation.id), {
        status,
        updatedAt: serverTimestamp()
      });

      if (status === 'accepted') {
        // Also update project status
        await updateDoc(doc(db, 'client_projects', projectId), {
          status: 'Active',
          currentStage: 'Compliance & Registration',
          progress: 5
        });
        success('Quotation accepted! Project is now active.');
        onAccepted?.();
      } else {
        success('Quotation rejected.');
      }
      
      setQuotation(prev => prev ? { ...prev, status } : null);
    } catch (err) {
      console.error('Error updating quotation:', err);
      error('Failed to update quotation.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  if (!quotation) {
    return (
      <div className="p-12 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900">No active quotation found</h3>
        <p className="text-sm text-slate-500 mt-1">Our BSM team is preparing your custom business launch quote.</p>
      </div>
    );
  }

  const isPending = quotation.status === 'draft' || quotation.status === 'sent';

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{quotation.title}</h2>
            <span className={`px-3 py-1 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
              quotation.status === 'accepted' ? 'bg-emerald-500 text-white' :
              quotation.status === 'rejected' ? 'bg-rose-500 text-white' :
              'bg-amber-500 text-white'
            }`}>
              {quotation.status}
            </span>
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Quote ID: {quotation.id.slice(0, 8)} • Generated {new Date(quotation.createdAt?.toDate()).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-900 font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-all">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 grid grid-cols-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <div className="col-span-2">Service Description</div>
              <div className="text-center">Timeline</div>
              <div className="text-right">Price (INR)</div>
            </div>
            <div className="divide-y divide-slate-100">
              {quotation.items?.map((item) => (
                <div key={item.id} className="px-8 py-6 grid grid-cols-4 items-center group hover:bg-slate-50 transition-colors">
                  <div className="col-span-2">
                    <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{item.name}</h4>
                    <span className="text-[10px] text-slate-400 font-bold">SAC: 998311 • GST {item.gst}%</span>
                  </div>
                  <div className="text-center">
                    <span className="px-3 py-1 bg-slate-100 rounded-2xl text-[10px] font-bold text-slate-600 uppercase tracking-widest">{item.timeline}</span>
                  </div>
                  <div className="text-right font-mono font-bold text-slate-900">
                    ₹{item.price.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 bg-amber-50 rounded-[2rem] border border-amber-200 flex gap-6">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-600 shadow-sm shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-amber-900 text-lg mb-1">Standard Terms & Conditions</h4>
              <ul className="text-xs text-amber-800 font-medium space-y-2 list-disc pl-4 opacity-80">
                <li>Government fees (where applicable) are included in the above quote unless specified otherwise.</li>
                <li>Timelines are estimates and depend on external agency approvals (MCA, GSTN, etc).</li>
                <li>BizNxt Milestone Escrow ensures your funds are only released upon successful completion of each stage.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-900/20">
            <h3 className="text-xl font-black mb-8 tracking-tight">Summary</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-400 text-sm font-bold">
                <span>Subtotal</span>
                <span className="text-white font-mono">₹{(quotation.totalAmount / 1.18).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-sm font-bold">
                <span>GST (18%)</span>
                <span className="text-white font-mono">₹{(quotation.totalAmount - (quotation.totalAmount / 1.18)).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                <span className="text-xs font-black uppercase tracking-widest text-primary">Grand Total</span>
                <span className="text-3xl font-black tracking-tight">₹{quotation.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {isPending && (
              <div className="space-y-4">
                <button 
                  onClick={() => handleAction('accepted')}
                  disabled={processing}
                  className="w-full py-4 bg-primary text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Accept & Initialize
                </button>
                <button 
                  onClick={() => handleAction('rejected')}
                  disabled={processing}
                  className="w-full py-4 bg-white/5 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-2 border border-white/5"
                >
                  <XCircle className="w-4 h-4" />
                  Decline Quote
                </button>
              </div>
            )}

            {quotation.status === 'accepted' && (
              <div className="p-6 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-center">
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-emerald-400">Payment Verified</h4>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">Your project has been successfully initialized in our execution engine.</p>
              </div>
            )}
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100">
            <h4 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-widest">Next Execution Steps</h4>
            <div className="space-y-6">
              {[
                { title: 'BSM Assignment', desc: 'A dedicated Business Success Manager will be assigned within 2 hours.' },
                { title: 'KYC Verification', desc: 'Securely upload your identity documents to the Vault.' },
                { title: 'Milestone Kickoff', desc: 'Your first execution sprint begins automatically.' }
              ].map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-2xl bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-900 shrink-0 border border-slate-100">
                    {i + 1}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 leading-tight">{step.title}</h5>
                    <p className="text-[10px] text-slate-500 mt-1 font-medium">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
