import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, MessageCircle, MapPin, Clock, Send, ShieldCheck, HelpCircle, Instagram } from 'lucide-react';
import { siteConfig } from '../config/site';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const ClayCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-slate-100 rounded-3xl p-8 shadow-[8px_8px_16px_#c3cad5,-8px_-8px_16px_#ffffff,inset_2px_2px_4px_rgba(255,255,255,0.5),inset_-2px_-2px_4px_rgba(0,0,0,0.05)] border border-white/50 ${className}`}>
    {children}
  </div>
);

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function ContactUs() {
  const [formType, setFormType] = useState<'inquiry' | 'support'>('inquiry');
  const [status, setStatus] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'contact_inquiries'), {
        ...formData,
        type: formType,
        createdAt: serverTimestamp(),
      });
      setStatus("Message sent successfully! We'll get back to you shortly.");
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Error submitting form:', err);
      setStatus("There was an error sending your message. Please try again later.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setStatus(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-32 pb-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeIn} className="text-center mb-16">
          <span className="inline-block py-2 px-6 rounded-2xl bg-white shadow-[inset_2px_2px_4px_rgba(255,255,255,1),inset_-2px_-2px_4px_rgba(0,0,0,0.05),4px_4px_8px_rgba(0,0,0,0.05)] text-sm font-bold tracking-widest uppercase text-slate-500 mb-6">
            Get in Touch
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-slate-900">
            How can we help you <br className="hidden md:block"/> succeed today?
          </h1>
          <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto">
            Whether you have a business idea, need support with your existing project, or want to explore partnerships, our team is ready to assist you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
          <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
            <ClayCard className="h-full flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm">
                <Mail className="w-8 h-8 text-[#C1121F]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Email Us</h3>
              <p className="text-slate-500 mb-4 flex-1">For general inquiries and support.</p>
              <a href={`mailto:${siteConfig.contact.email}`} className="font-bold text-[#C1121F] hover:underline">
                {siteConfig.contact.email}
              </a>
            </ClayCard>
          </motion.div>

          <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
            <ClayCard className="h-full flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm">
                <MessageCircle className="w-8 h-8 text-[#C1121F]" />
              </div>
              <h3 className="text-xl font-bold mb-2">WhatsApp Channel</h3>
              <p className="text-slate-500 mb-4 flex-1">Join our channel for instant updates.</p>
              <a href={siteConfig.links.whatsapp} target="_blank" rel="noopener noreferrer" className="font-bold text-[#C1121F] hover:underline">
                Follow BizNxt
              </a>
            </ClayCard>
          </motion.div>

          <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
            <ClayCard className="h-full flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm">
                <Clock className="w-8 h-8 text-[#C1121F]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Business Hours</h3>
              <p className="text-slate-500 mb-4 flex-1">We are here to help during these hours.</p>
              <span className="font-bold text-slate-700">
                {siteConfig.contact.businessHours}
              </span>
            </ClayCard>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form Section */}
          <motion.div {...fadeIn} transition={{ delay: 0.4 }}>
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-[#C1121F]" />
              <div className="flex space-x-4 mb-8">
                <button 
                  onClick={() => setFormType('inquiry')}
                  className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm transition-all ${
                    formType === 'inquiry' 
                      ? 'bg-slate-900 text-white shadow-md' 
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  Business Inquiry
                </button>
                <button 
                  onClick={() => setFormType('support')}
                  className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm transition-all ${
                    formType === 'support' 
                      ? 'bg-slate-900 text-white shadow-md' 
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  Support Request
                </button>
              </div>

              {status && (
                <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-2xl font-medium flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5" />
                  <span>{status}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F] transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F] transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    {formType === 'inquiry' ? 'Business Type / Industry' : 'Related Project / ID'}
                  </label>
                  <input 
                    type="text" 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F] transition-all"
                    placeholder={formType === 'inquiry' ? 'e.g. Retail, Technology' : 'Optional'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                  <textarea 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F] transition-all resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <span>Send Message</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>

          {/* Map & FAQ */}
          <motion.div {...fadeIn} transition={{ delay: 0.5 }} className="space-y-8">
            <ClayCard className="p-1 overflow-hidden">
              <div className="w-full h-64 bg-slate-200 rounded-2xl overflow-hidden relative group">
                {/* Google Maps Placeholder */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-200 text-slate-500">
                  <MapPin className="w-12 h-12 mb-2 text-[#C1121F]/40 group-hover:scale-110 transition-transform duration-500" />
                  <span className="font-bold text-slate-700">Future Office Location</span>
                  <span className="text-xs font-medium">Coming Soon to New Delhi, India</span>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-slate-900 mb-1">Corporate Address</h4>
                <p className="text-xs text-slate-500 font-medium">BizNxt Operations Hub, Digital India Tower, New Delhi - 110001</p>
              </div>
            </ClayCard>

            <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C1121F]/10 rounded-2xl -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
              
              <div className="flex items-center space-x-3 mb-6 relative z-10">
                <HelpCircle className="w-6 h-6 text-[#C1121F]" />
                <h3 className="text-xl font-bold">Quick FAQ</h3>
              </div>
              <div className="space-y-4 relative z-10">
                {[
                  { q: "How quickly do you respond?", a: "We typically respond to all inquiries within 24 business hours." },
                  { q: "Can I schedule a consultation?", a: "Yes, once you submit an inquiry, our team will share a link to book a consultation." },
                  { q: "Do you offer support for existing users?", a: "Absolutely. Please use the Support Request form for priority assistance." }
                ].map((faq, idx) => (
                  <div key={idx} className="border-b border-slate-800 pb-4 last:border-0 last:pb-0">
                    <h4 className="font-bold text-sm mb-1 text-slate-200">{faq.q}</h4>
                    <p className="text-sm text-slate-400 font-medium">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <ClayCard className="bg-white">
              <h3 className="text-lg font-bold mb-4">Connect Socially</h3>
              <div className="grid grid-cols-2 gap-4">
                <a href={siteConfig.links.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all border border-slate-100 group">
                  <div className="w-8 h-8 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">Instagram</span>
                </a>
                <a href={siteConfig.links.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all border border-slate-100 group">
                  <div className="w-8 h-8 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">WhatsApp</span>
                </a>
              </div>
            </ClayCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
