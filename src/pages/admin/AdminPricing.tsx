import { useState } from 'react';
import { DollarSign, Save, Plus, Trash2, Edit2, Zap } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export function AdminPricing() {
  const { success } = useToast();
  const [plans, setPlans] = useState([
    { id: '1', name: 'Starter', price: 999, billing: 'One-time', features: ['Basic Company Setup', 'Essential Documents', 'Email Support'] },
    { id: '2', name: 'Professional', price: 4999, billing: 'One-time', features: ['Full Incorporation', 'Compliance Setup', 'Priority Support', 'GST Registration'] },
    { id: '3', name: 'Enterprise', price: 9999, billing: 'Custom', features: ['Custom Strategy', 'Legal Counsel', '24/7 Support', 'Global Expansion'] },
  ]);

  const handleSave = () => {
    success('Pricing structure updated successfully');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight text-left">Global Pricing Control</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-left">Manage platform plans and service fees</p>
          </div>
          <button 
            onClick={handleSave}
            className="bg-emerald-600 text-white px-6 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
          >
            <Save size={16} />
            Publish Changes
          </button>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 relative group">
                <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 bg-white text-slate-600 rounded-xl shadow-sm hover:text-primary transition-colors">
                    <Edit2 size={14} />
                  </button>
                </div>
                
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                  <Zap size={20} className="text-amber-500" />
                </div>
                
                <h4 className="text-lg font-black text-slate-900 mb-1">{plan.name}</h4>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-2xl font-black text-slate-900">₹{plan.price.toLocaleString()}</span>
                  <span className="text-xs font-bold text-slate-500">/{plan.billing}</span>
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-xs font-bold text-slate-600">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors">
                  Edit Plan Features
                </button>
              </div>
            ))}
            
            <button className="border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center gap-3 p-8 text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all group">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus size={24} />
              </div>
              <span className="text-sm font-black uppercase tracking-widest">Add New Plan</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
        <h3 className="text-lg font-black text-slate-900 mb-6">Tax & Transaction Rules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="block">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">GST Rate (%)</span>
              <input type="number" defaultValue={18} className="mt-1 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:border-primary" />
            </label>
            <label className="block">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Platform Fee (₹)</span>
              <input type="number" defaultValue={250} className="mt-1 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:border-primary" />
            </label>
          </div>
          <div className="bg-blue-50 rounded-2xl p-6">
            <h4 className="text-sm font-black text-blue-900 mb-2">Automated Billing Logic</h4>
            <p className="text-xs font-bold text-blue-700 leading-relaxed">
              BizNxt uses automated invoice generation. These rules affect all checkout sessions and tax calculations globally. Ensure compliance with Indian GST laws before updating.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
