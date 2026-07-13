import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Send, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export function SupportTicketForm({ onSuccess }: { onSuccess?: () => void }) {
  const { user } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toastError('You must be logged in to submit a ticket.');
      return;
    }
    if (!subject.trim() || !message.trim()) {
      toastError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    
    try {
      await addDoc(collection(db, 'tickets'), {
        userId: user.uid,
        userEmail: user.email,
        subject,
        message,
        status: 'Open',
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
      setSubject('');
      setMessage('');
      toastSuccess('Support ticket created successfully!');
      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    } catch (err) {
      console.error('Error submitting ticket:', err);
      toastError('Failed to submit ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Send className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Message Sent!</h3>
        <p className="text-slate-500">Our support team will get back to you shortly.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-6 text-primary font-medium hover:text-primary-dark"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
        <input 
          type="text" 
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          placeholder="What do you need help with?"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
        <textarea 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
          placeholder="Provide detailed information about your inquiry..."
          required
        />
      </div>
      
      <button 
        type="submit" 
        disabled={loading}
        className="w-full flex items-center justify-center px-4 py-3 bg-slate-900 text-white rounded-2xl font-medium hover:bg-slate-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Submit Ticket
            <Send className="w-4 h-4 ml-2" />
          </>
        )}
      </button>
    </form>
  );
}
