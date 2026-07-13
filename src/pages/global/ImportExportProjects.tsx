import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Ship, 
  ArrowLeft,
  ArrowRight,
  PackageSearch,
  Users
} from 'lucide-react';

export default function ImportExportProjects() {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <button 
        onClick={() => navigate('/global')}
        className="flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Global Dashboard
      </button>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight flex items-center">
            <Ship className="w-8 h-8 mr-3 text-blue-600" />
            Import / Export Projects
          </h1>
          <p className="text-slate-500 mt-2">Start a new global sourcing or international expansion project.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all cursor-pointer group" onClick={() => navigate('/services')}>
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
            <PackageSearch className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">Start Import Project</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Source high-quality products globally. We help you find verified international manufacturers, handle customs clearance, freight forwarding, and trade compliance.
          </p>
          <div className="flex items-center text-sm font-bold text-blue-600">
            Configure Import Requirements <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all cursor-pointer group" onClick={() => navigate('/services')}>
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
            <Users className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors">Start Export Project</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Take your Indian products to the global market. Find international buyers, manage export documentation, and optimize your global supply chain.
          </p>
          <div className="flex items-center text-sm font-bold text-emerald-600">
            Configure Export Strategy <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}
