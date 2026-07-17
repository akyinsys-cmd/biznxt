import React from 'react';
import { motion } from 'motion/react';
import { CreditCard, FileText, Download, CheckCircle, Clock, MessageCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface Invoice {
  id: string;
  invoiceNo: string;
  service: string;
  amount: string;
  dueDate: string;
  status: 'paid' | 'pending';
}

const INVOICES: Invoice[] = [
  {
    id: 'i1',
    invoiceNo: 'BZNXT-INV-9021',
    service: 'SME Feasibility Audit Report Fee',
    amount: '₹4,999',
    dueDate: 'July 8, 2026',
    status: 'paid'
  },
  {
    id: 'i2',
    invoiceNo: 'BZNXT-INV-9140',
    service: 'LLC State Filing & Incorporation Package',
    amount: '₹14,999',
    dueDate: 'July 24, 2026',
    status: 'pending'
  }
];

export function PaymentsInvoices({ onPayInvoice }: { onPayInvoice?: (id: string) => void }) {
  const { success } = useToast();
  return (
    <div className="glass-card bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Payments & Invoices</h3>
          <p className="text-xs text-slate-500 mt-0.5">Track and pay fees associated with active registrations.</p>
        </div>
        <CreditCard className="w-5 h-5 text-slate-500" />
      </div>

      <div className="space-y-3">
        {INVOICES.map((inv) => {
          const isPaid = inv.status === 'paid';
          return (
            <div 
              key={inv.id}
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-colors ${
                isPaid ? 'border-success/20 bg-success/5' : 'border-slate-150 bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-2xl mt-0.5 ${
                  isPaid ? 'bg-success/10 text-success' : 'bg-slate-100 text-slate-500'
                }`}>
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 leading-none">{inv.service}</h4>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-2xl font-bold border capitalize leading-none ${
                      isPaid 
                        ? 'bg-success/10 text-success border-success/20' 
                        : 'bg-warning/10 text-warning border-warning/20'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-1 font-medium font-mono">
                    <span>{inv.invoiceNo}</span>
                    <span>•</span>
                    <span>Due: {inv.dueDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                <span className="text-sm font-extrabold text-slate-900 font-mono">{inv.amount}</span>
                {isPaid ? (
                  <button 
                    onClick={() => success(`Downloading PDF receipt for invoice ${inv.invoiceNo}...`)}
                    className="p-1.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors flex items-center gap-1 text-[11px] font-bold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Receipt</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => onPayInvoice?.(inv.id)}
                    className="px-3 py-1.5 rounded-full bg-primary hover:bg-primary-dark text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                  >
                    <span>Settle Invoice</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 mt-6 border-t border-slate-100">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Official Support & Payment Channels</p>
          <div className="flex items-center gap-4">
            <a href="mailto:care@biznxt.online" className="text-[10px] font-bold text-slate-500 hover:text-primary transition-colors flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> care@biznxt.online
            </a>
            <a href="https://whatsapp.com/channel/0029Vb7mx244CrfnO7UhEQ1n" target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1.5">
              <MessageCircle className="w-3 h-3" /> Support Channel
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
