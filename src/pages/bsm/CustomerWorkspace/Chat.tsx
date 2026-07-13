import React, { useState } from 'react';
import { Project } from '../../../types/project';
import { Send, Paperclip, MessageSquare } from 'lucide-react';

export function Chat({ project }: { project: Project }) {
  const [message, setMessage] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    // In a real app, this would save to Firestore
    setMessage('');
    alert('Chat integration is placeholder in this view.');
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm h-[600px] flex flex-col">
      <div className="p-6 border-b border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <MessageSquare size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">Customer Chat</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{project.clientName}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 flex flex-col justify-end">
        <div className="text-center text-slate-400 text-xs font-bold mb-4 uppercase tracking-widest">
          Start of conversation
        </div>
      </div>

      <div className="p-4 border-t border-slate-100 bg-white rounded-b-[2rem]">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <button type="button" className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-2xl transition-colors">
            <Paperclip size={18} />
          </button>
          <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-primary"
          />
          <button type="submit" className="p-3 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20">
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
