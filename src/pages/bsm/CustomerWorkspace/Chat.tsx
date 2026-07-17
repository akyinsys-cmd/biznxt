import React, { useState } from 'react';
import { Project } from '../../../types/project';
import { Send, Paperclip, MessageSquare } from 'lucide-react';

export function Chat({ project }: { project: Project }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ id: string; sender: 'me' | 'them' | 'system'; text: string; time: string }>>([
    { id: '1', sender: 'system', text: 'Secure business channel initialized with high-grade compliance encryption.', time: '10:00 AM' },
    { id: '2', sender: 'them', text: 'Hello! I had a quick question regarding the latest document drafting stage.', time: '10:02 AM' }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const newMsg = {
      id: Date.now().toString(),
      sender: 'me' as const,
      text: message.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMsg]);
    setMessage('');

    // Simulate auto response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'them' as const,
        text: 'Thank you for the message. Our operations team has received this update and will review it shortly.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  return (
    <div className="clay-card h-[600px] flex flex-col !p-0 overflow-hidden">
      <div className="p-6 border-b border-slate-200/50 flex items-center justify-between bg-white/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-primary shadow-inner">
            <MessageSquare size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">Customer Chat</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{project.clientName}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 flex flex-col gap-4">
        {messages.map(msg => {
          if (msg.sender === 'system') {
            return (
              <div key={msg.id} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest my-2">
                {msg.text}
              </div>
            );
          }
          const isMe = msg.sender === 'me';
          return (
            <div key={msg.id} className={`flex flex-col max-w-[70%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
              <div className={`p-4 rounded-3xl text-sm font-bold shadow-sm ${
                isMe 
                  ? 'bg-slate-900 text-white rounded-br-none' 
                  : 'bg-white text-slate-800 border border-slate-200/50 rounded-bl-none shadow-[2px_2px_5px_rgba(0,0,0,0.02)]'
              }`}>
                {msg.text}
              </div>
              <span className="text-[9px] font-bold text-slate-400 mt-1 px-1">{msg.time}</span>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-200/50 bg-white/40 backdrop-blur-md">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <button type="button" className="p-3 text-slate-400 hover:text-slate-600 hover:bg-white/60 rounded-2xl transition-all active:scale-95 shadow-sm">
            <Paperclip size={18} />
          </button>
          <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-white/80 border border-slate-200/50 rounded-full px-5 py-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all shadow-inner"
          />
          <button type="submit" className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-md">
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
