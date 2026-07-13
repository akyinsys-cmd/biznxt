import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Award, FileText, ArrowRight, Star, Globe, ShieldAlert } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  price: string;
  rating: string;
  category: string;
  tag: string;
  description: string;
}

const RECOMMENDED_SERVICES: Service[] = [
  {
    id: 's1',
    name: 'LLC Entity Incorporation & Pan/TAN',
    price: '₹14,999',
    rating: '4.9',
    category: 'Corporate Registration',
    tag: 'Popular',
    description: 'Fast entity setup with complete statutory filing and state government liaison.'
  },
  {
    id: 's2',
    name: 'Dubai Expansion & Golden Visa Advice',
    price: '$1,999',
    rating: '5.0',
    category: 'Global Mobility',
    tag: 'Premium',
    description: 'Establish absolute tax-free business structures in Meydan or DAFZA freezones.'
  },
  {
    id: 's3',
    name: 'Trademark & Brand Intellectual IP Secure',
    price: '₹8,499',
    rating: '4.8',
    category: 'IP & Legal',
    tag: 'Essential',
    description: 'Comprehensive trademark check, filing, objection defense, and legal drafting.'
  }
];

export function RecommendedServices({ onSelectService }: { onSelectService?: (serviceName: string) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-bold text-slate-900 text-base">Recommended Services</h3>
        <p className="text-xs text-slate-500 mt-0.5">SME-tailored regulatory filings and strategic setup support packages.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {RECOMMENDED_SERVICES.map((serv) => (
          <motion.div 
            key={serv.id}
            whileHover={{ y: -3 }}
            className="bg-white p-4 rounded-2xl border border-slate-150 hover:border-primary/20 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] bg-slate-50 border border-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold uppercase tracking-wider">
                  {serv.category}
                </span>
                <span className="text-[10px] bg-primary/10 border border-primary/5 px-2 py-0.5 rounded text-primary font-extrabold tracking-tight">
                  {serv.tag}
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-900 leading-tight mb-1">{serv.name}</h4>
              <p className="text-[11px] text-slate-500 leading-normal mb-3 line-clamp-2">{serv.description}</p>
            </div>

            <div className="border-t border-slate-50 pt-3 flex justify-between items-center mt-2">
              <div>
                <span className="text-[10px] text-slate-500 block font-medium">Fee starts from</span>
                <span className="text-sm font-extrabold text-slate-900">{serv.price}</span>
              </div>
              <button 
                onClick={() => onSelectService?.(serv.name)}
                className="p-1.5 rounded-2xl bg-slate-50 hover:bg-primary hover:text-white border border-slate-200 hover:border-primary text-slate-600 transition-all"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
