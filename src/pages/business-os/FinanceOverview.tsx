import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  IndianRupee, 
  Plus, 
  TrendingDown, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { FinanceRecord } from './types';

interface FinanceOverviewProps {
  finance: FinanceRecord[];
  onAddRecord: (record: Omit<FinanceRecord, 'id' | 'ownerId' | 'createdAt'>) => Promise<void>;
}

export function FinanceOverview({ finance, onAddRecord }: FinanceOverviewProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [type, setType] = useState<FinanceRecord['type']>('Expense');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<FinanceRecord['status']>('Completed');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Math sum calculations
  const totalRevenue = finance
    .filter(f => f.type === 'Revenue' && f.status === 'Completed')
    .reduce((sum, f) => sum + f.amount, 0);

  const totalExpense = finance
    .filter(f => (f.type === 'Expense' || f.type === 'Service Payment') && f.status === 'Completed')
    .reduce((sum, f) => sum + f.amount, 0);

  const pendingPayments = finance
    .filter(f => f.status === 'Pending')
    .reduce((sum, f) => sum + f.amount, 0);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category.trim() || !amount) return;
    setSubmitting(true);
    try {
      await onAddRecord({
        type,
        category: category.trim(),
        amount: parseFloat(amount) || 0,
        status,
        dueDate: dueDate || undefined,
        description: description.trim()
      });
      setCategory('');
      setAmount('');
      setDueDate('');
      setDescription('');
      setShowAddModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-primary p-4 rounded-2xl text-white">
            <IndianRupee className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">Treasury & Financial Overview</h2>
            <p className="text-xs text-slate-500">Track company outlays, domestic client receipts, trade credit limits, and service payments.</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-2xl font-semibold text-sm shadow-sm hover:shadow transition-all duration-150 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Record Transaction
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Revenue */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed Receipts</p>
            <p className="text-2xl font-extrabold text-slate-800 mt-2">{formatCurrency(totalRevenue)}</p>
          </div>
          <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600 border border-emerald-100">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed Expenses</p>
            <p className="text-2xl font-extrabold text-slate-800 mt-2">{formatCurrency(totalExpense)}</p>
          </div>
          <div className="bg-rose-50 p-3 rounded-2xl text-primary-dark border border-primary/20">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Invoices */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Outlays / Invoices</p>
            <p className="text-2xl font-extrabold text-slate-800 mt-2">{formatCurrency(pendingPayments)}</p>
          </div>
          <div className="bg-amber-50 p-3 rounded-2xl text-amber-600 border border-amber-100">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Transactions list */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 p-6 border-b border-slate-50">
          <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-800 font-display">Treasury Transaction Ledger</h3>
        </div>

        {finance.length > 0 ? (
          <div className="divide-y divide-slate-50">
            {finance.map((rec) => (
              <div key={rec.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-2xl border ${
                    rec.type === 'Revenue' 
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                      : 'bg-rose-50 border-primary/20 text-primary-dark'
                  }`}>
                    {rec.type === 'Revenue' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{rec.category}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{rec.description}</p>
                    {rec.dueDate && (
                      <span className="text-[10px] text-slate-500 font-mono block mt-1">Due Date: {rec.dueDate}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6 justify-between sm:justify-end shrink-0">
                  <span className={`text-base font-bold font-mono ${
                    rec.type === 'Revenue' ? 'text-emerald-600' : 'text-slate-800'
                  }`}>
                    {rec.type === 'Revenue' ? '+' : '-'}{formatCurrency(rec.amount)}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-2xl border ${
                    rec.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : 'bg-amber-50 text-amber-700 border-amber-100'
                  }`}>
                    {rec.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center text-sm text-slate-500">No treasury transactions mapped yet.</div>
        )}
      </div>

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative z-10 border border-slate-100 space-y-4"
            >
              <h3 className="text-lg font-bold text-slate-900 font-display">Record Treasury Transaction</h3>
              
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Transaction Type</label>
                    <select
                      value={type}
                      onChange={e => setType(e.target.value as FinanceRecord['type'])}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none"
                    >
                      <option value="Expense">Corporate Expense</option>
                      <option value="Revenue">Domestic / Export Revenue</option>
                      <option value="Service Payment">BizNxt Service Payment</option>
                      <option value="Invoice">Supplier Invoice</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Amount (INR)</label>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      placeholder="e.g. 50000"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Status</label>
                    <select
                      value={status}
                      onChange={e => setStatus(e.target.value as FinanceRecord['status'])}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none"
                    >
                      <option value="Completed">Paid / Received</option>
                      <option value="Pending">Pending / Invoiced</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Due Date</label>
                    <input 
                      type="date" 
                      value={dueDate}
                      onChange={e => setDueDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Budget Category</label>
                  <input 
                    type="text" 
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    placeholder="e.g. Legal Fees, Supplier Outlay"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Transaction Description</label>
                  <input 
                    type="text" 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Describe transaction references..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowAddModal(false)}
                    className="w-1/2 border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-2xl font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-1/2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-2xl font-bold text-xs shadow-sm"
                  >
                    {submitting ? 'Recording...' : 'Commit Outlay'}
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
