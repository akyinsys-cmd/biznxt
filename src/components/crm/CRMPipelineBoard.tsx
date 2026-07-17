import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  ArrowRight, 
  ArrowLeft, 
  Trash2, 
  ChevronRight, 
  Settings, 
  SlidersHorizontal,
  FolderMinus,
  Sparkles,
  RefreshCw,
  Eye,
  Tag,
  Search,
  X,
  Target,
  Zap,
  MoreVertical
} from 'lucide-react';

interface CRMPipelineBoardProps {
  leads: any[];
  stages: string[];
  onUpdateStage: (leadId: string, nextStage: string) => void;
  onSelectLead: (lead: any) => void;
  onAddLead: () => void;
  onUpdateStages: (stages: string[]) => void;
}

export default function CRMPipelineBoard({
  leads,
  stages,
  onUpdateStage,
  onSelectLead,
  onAddLead,
  onUpdateStages
}: CRMPipelineBoardProps) {
  const [showConfig, setShowConfig] = useState(false);
  const [newStageName, setNewStageName] = useState('');
  const [editingStageIndex, setEditingStageIndex] = useState<number | null>(null);
  const [editingStageValue, setEditingStageValue] = useState('');

  // Handle stage configuration
  const handleAddStage = () => {
    if (!newStageName.trim()) return;
    if (stages.includes(newStageName.trim())) return;
    const nextStages = [...stages, newStageName.trim()];
    onUpdateStages(nextStages);
    setNewStageName('');
  };

  const handleRemoveStage = (index: number) => {
    const nextStages = stages.filter((_, i) => i !== index);
    onUpdateStages(nextStages);
  };

  const handleSaveStageEdit = (index: number) => {
    if (!editingStageValue.trim()) return;
    const nextStages = [...stages];
    nextStages[index] = editingStageValue.trim();
    onUpdateStages(nextStages);
    setEditingStageIndex(null);
  };

  return (
    <div className="space-y-12">
      {/* Board Controls */}
      <div className="bg-white/80 backdrop-blur-[30px] p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <Target size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tighter">Strategic Pipeline</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Global Fulfillment Router</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input 
              type="text" 
              placeholder="Search target nodes..." 
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
            />
          </div>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-500 hover:text-primary transition-all shadow-sm active:scale-95"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={onAddLead}
            className="px-6 py-3.5 bg-slate-900 text-white text-[10px] font-black rounded-full uppercase tracking-widest hover:bg-primary transition-all shadow-lg active:scale-95 flex items-center gap-2"
          >
            <Plus size={14} />
            <span>New Target</span>
          </button>
        </div>
      </div>

      {/* Configuration Drawer */}
      <AnimatePresence>
        {showConfig && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8 space-y-6 overflow-hidden shadow-inner"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Pipeline Schema Orchestration</h4>
              <button onClick={() => setShowConfig(false)} className="text-slate-500 hover:text-slate-900">
                <X size={16} />
              </button>
            </div>
            
            <div className="flex gap-4 max-w-xl">
              <input 
                type="text" 
                placeholder="New workflow node name..." 
                value={newStageName}
                onChange={(e) => setNewStageName(e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-full px-6 py-3 text-[11px] font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
              />
              <button
                onClick={handleAddStage}
                className="px-6 py-3 bg-primary text-white text-[10px] font-black rounded-full uppercase tracking-widest hover:bg-primary/90 transition-all"
              >
                Insert Node
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {stages.map((stage, idx) => (
                <motion.div 
                  layout
                  key={stage} 
                  className="bg-white border border-slate-200 rounded-full px-4 py-2 flex items-center gap-3 shadow-sm group"
                >
                  {editingStageIndex === idx ? (
                    <div className="flex items-center gap-2">
                      <input 
                        autoFocus
                        value={editingStageValue}
                        onChange={(e) => setEditingStageValue(e.target.value)}
                        className="bg-slate-50 text-[11px] font-bold px-2 py-1 rounded border border-slate-200 w-24 outline-none"
                      />
                      <button onClick={() => handleSaveStageEdit(idx)} className="text-emerald-500 font-black text-[10px] uppercase">OK</button>
                    </div>
                  ) : (
                    <span 
                      className="text-[11px] font-bold text-slate-700 cursor-pointer hover:text-primary"
                      onClick={() => {
                        setEditingStageIndex(idx);
                        setEditingStageValue(stage);
                      }}
                    >
                      {stage}
                    </span>
                  )}
                  {stages.length > 1 && (
                    <button 
                      onClick={() => handleRemoveStage(idx)}
                      className="text-slate-400 hover:text-primary transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kanban Stage Grid */}
      <div className="flex gap-8 overflow-x-auto pb-12 no-scrollbar perspective-[2000px]">
        {stages.map((stage, sIdx) => {
          const stageLeads = leads.filter(l => (l.status || 'New Lead') === stage);
          
          return (
            <motion.div 
              key={stage} 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: sIdx * 0.1 }}
              className="w-[380px] shrink-0 flex flex-col gap-6"
            >
              {/* Lane Header */}
              <div className="flex justify-between items-center px-4">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-2xl bg-primary shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">{stage}</h4>
                </div>
                <div className="px-3 py-1 bg-slate-100 rounded-full">
                  <span className="text-[10px] font-black text-slate-500">{stageLeads.length}</span>
                </div>
              </div>

              {/* Lane Content */}
              <div className="bg-slate-50/50 rounded-[2.5rem] p-4 border border-slate-100 flex-1 min-h-[600px] flex flex-col gap-4">
                <AnimatePresence mode="popLayout">
                  {stageLeads.length === 0 ? (
                    <div className="flex-1 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center text-center p-8">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-200 mb-4 shadow-sm">
                        <FolderMinus size={24} />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">Stage Node Empty</p>
                    </div>
                  ) : (
                    stageLeads.map((lead, lIdx) => (
                      <motion.div
                        layout
                        key={lead.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={() => onSelectLead(lead)}
                        className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-xl hover:border-primary/20 transition-all cursor-pointer group relative"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className={`px-3 py-1 rounded-2xl text-[9px] font-black uppercase tracking-widest ${
                            lead.priority === 'Hot' ? 'bg-rose-50 text-primary' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {lead.priority || 'Standard'}
                          </div>
                          <button className="text-slate-400 hover:text-slate-900 transition-colors">
                            <MoreVertical size={14} />
                          </button>
                        </div>

                        <h5 className="text-[13px] font-black text-slate-900 tracking-tight mb-1 group-hover:text-primary transition-colors">{lead.customerName}</h5>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 truncate">{lead.businessName}</p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-2xl bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-500">
                              {lead.industry?.[0]}
                            </div>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{lead.industry}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Value</p>
                            <p className="text-[11px] font-black text-slate-900 tracking-tighter">₹{(lead.budget/1000).toFixed(0)}k</p>
                          </div>
                        </div>

                        {/* Transition Controls */}
                        <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0" onClick={e => e.stopPropagation()}>
                          {stages.indexOf(stage) > 0 && (
                            <button
                              onClick={() => onUpdateStage(lead.id, stages[stages.indexOf(stage) - 1])}
                              className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition-all flex items-center justify-center"
                            >
                              <ArrowLeft size={12} />
                            </button>
                          )}
                          <button
                            onClick={() => onSelectLead(lead)}
                            className="flex-1 py-2 bg-primary/5 hover:bg-primary/10 rounded-full text-primary transition-all flex items-center justify-center"
                          >
                            <Eye size={12} />
                          </button>
                          {stages.indexOf(stage) < stages.length - 1 && (
                            <button
                              onClick={() => onUpdateStage(lead.id, stages[stages.indexOf(stage) + 1])}
                              className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition-all flex items-center justify-center"
                            >
                              <ArrowRight size={12} />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
