import { useState } from 'react';
import { 
  LifeBuoy, 
  Search, 
  Filter, 
  Plus, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  User, 
  ChevronRight,
  MessageSquare,
  FileText,
  ShieldAlert,
  ArrowUpRight,
  HelpCircle,
  BookOpen,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SUPPORT_TICKETS } from '../data/communicationData';
import { SupportTicket } from '../types/communication';

export default function SupportCenter() {
  const [activeTab, setActiveTab] = useState<'all' | 'open' | 'resolved'>('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-primary/10 rounded-2xl text-primary">
                  <LifeBuoy size={20} />
                </div>
                <span className="text-sm font-bold text-primary tracking-tight uppercase">Support Center</span>
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                Help & Assistance
              </h1>
              <p className="text-slate-500 max-w-xl text-lg font-medium leading-relaxed">
                Centralized support engine with SLA tracking, enterprise escalation, and real-time resolution.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2">
                <Plus size={18} />
                Create Ticket
              </button>
              <button className="px-6 py-3 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all">
                Knowledge Hub
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content - Tickets List */}
          <div className="lg:col-span-8 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: 'Active Tickets', value: '12', color: 'text-blue-600', bg: 'bg-blue-50', icon: MessageSquare },
                { label: 'Avg Resolution', value: '4.2h', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: Clock },
                { label: 'SLA Compliance', value: '98.5%', color: 'text-indigo-600', bg: 'bg-indigo-50', icon: ShieldAlert },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                    <stat.icon size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                    <h4 className="text-xl font-black text-slate-900">{stat.value}</h4>
                  </div>
                </div>
              ))}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-6 border-b border-slate-200">
              {['all', 'open', 'resolved'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`py-4 text-xs font-black uppercase tracking-widest transition-all relative ${
                    activeTab === tab ? 'text-primary' : 'text-slate-500 hover:text-slate-600'
                  }`}
                >
                  {tab} Tickets
                  {activeTab === tab && (
                    <motion.div layoutId="ticketTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              ))}
            </div>

            {/* Tickets Grid */}
            <div className="space-y-4">
              {SUPPORT_TICKETS.map((ticket) => (
                <div 
                  key={ticket.id} 
                  className="bg-white rounded-[2rem] border border-slate-200 p-8 hover:border-primary transition-all group cursor-pointer"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-2xl ${
                        ticket.priority === 'High' ? 'bg-rose-50 text-primary' : 'bg-slate-50 text-slate-500'
                      }`}>
                        <AlertCircle size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-black text-slate-900 group-hover:text-primary transition-colors">{ticket.subject}</h3>
                          <span className="text-[10px] font-black text-slate-500">#{ticket.id}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{ticket.category} • Created {new Date(ticket.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-2xl text-[10px] font-black uppercase tracking-wider ${
                        ticket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-500 mb-8 line-clamp-2 leading-relaxed">{ticket.description}</p>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-slate-100 rounded-2xl flex items-center justify-center text-[10px] font-bold text-slate-500">
                          <User size={12} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-700">Assigned: {ticket.assignedTo}</span>
                      </div>
                      <div className="flex items-center gap-2 text-primary">
                        <Clock size={12} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">SLA: {new Date(ticket.slaDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                    <button className="text-primary font-black text-xs flex items-center gap-1 hover:underline">
                      View Details <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar - Help Resources */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-2xl blur-3xl -mr-16 -mt-16" />
              <h3 className="text-xl font-black mb-2">Automated Assistant</h3>
              <p className="text-white/60 text-sm mb-8 leading-relaxed">
                Our AI support bot can resolve 80% of common queries instantly.
              </p>
              <button className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center justify-center gap-2">
                <MessageSquare size={18} />
                Chat with AI
              </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8">
              <h3 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-tight">Popular FAQs</h3>
              <div className="space-y-4">
                {[
                  'How to track my research progress?',
                  'How to change manufacturer?',
                  'Updating GST details',
                  'Refund policy overview'
                ].map((faq, i) => (
                  <button key={i} className="w-full p-4 bg-slate-50 rounded-2xl text-left hover:bg-slate-100 transition-all group flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">{faq}</span>
                    <HelpCircle size={14} className="text-slate-400 group-hover:text-primary" />
                  </button>
                ))}
              </div>
              <button className="w-full mt-6 py-4 bg-slate-50 text-slate-500 font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                <BookOpen size={16} />
                Knowledge Base
              </button>
            </div>

            <div className="bg-primary rounded-[2.5rem] p-8 text-white">
              <h3 className="text-xl font-black mb-2">Partner Support</h3>
              <p className="text-rose-100/80 text-sm mb-8 leading-relaxed">
                Are you a service partner? Access the dedicated partner helpdesk.
              </p>
              <button className="w-full py-4 bg-white/10 text-white font-black rounded-2xl border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                Partner Login
                <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Detail Modal Simulation */}
      <AnimatePresence>
        {selectedTicket && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <button onClick={() => setSelectedTicket(null)} className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-slate-600">
                    <ArrowLeft size={20} />
                  </button>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">{selectedTicket.subject}</h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">#{selectedTicket.id} • Status: {selectedTicket.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-rose-50 text-primary-dark text-[10px] font-black rounded-2xl uppercase tracking-widest">{selectedTicket.priority} Priority</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-12">
                <div className="flex gap-6 mb-12">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex-shrink-0" />
                  <div className="flex-1 bg-slate-50 p-6 rounded-[2rem] rounded-tl-none border border-slate-100">
                    <div className="flex justify-between mb-4">
                      <span className="text-xs font-black text-slate-900">{selectedTicket.customerName}</span>
                      <span className="text-[10px] font-bold text-slate-500">{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{selectedTicket.description}</p>
                  </div>
                </div>

                <div className="flex flex-row-reverse gap-6 mb-12">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex-shrink-0 flex items-center justify-center text-primary">
                    <ShieldAlert size={24} />
                  </div>
                  <div className="flex-1 bg-primary text-white p-6 rounded-[2rem] rounded-tr-none shadow-xl shadow-primary/20">
                    <div className="flex justify-between mb-4">
                      <span className="text-xs font-black">{selectedTicket.assignedTo}</span>
                      <span className="text-[10px] font-bold opacity-60">Today, 05:45 AM</span>
                    </div>
                    <p className="text-sm leading-relaxed">
                      Hello Dr. Khan, I have reviewed the transaction logs. The bank has confirmed a timeout at their end. We have initiated a re-verification, and if unsuccessful, we will process a manual credit within 4 hours.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-slate-100 bg-slate-50/50">
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    placeholder="Type your reply here..." 
                    className="flex-1 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button className="px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center gap-2">
                    Send Reply
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
