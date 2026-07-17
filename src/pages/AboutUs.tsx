import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import {
  ArrowRight, ShieldCheck, Users, Target, Rocket, Lightbulb, CheckCircle2, FileText, Search, BarChart3, Briefcase, Mail, MessageCircle, MapPin, BarChart4, ClipboardList, FileCheck, Factory, Palette, Globe, TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClayCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-slate-100 rounded-3xl p-8 shadow-[8px_8px_16px_#c3cad5,-8px_-8px_16px_#ffffff,inset_2px_2px_4px_rgba(255,255,255,0.5),inset_-2px_-2px_4px_rgba(0,0,0,0.05)] border border-white/50 ${className}`}>
    {children}
  </div>
);

const ClayButton = ({ children, primary = false, onClick, className = "" }: { children: React.ReactNode, primary?: boolean, onClick?: () => void, className?: string }) => (
  <button 
    onClick={onClick}
    className={`px-8 py-4 rounded-2xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 ${
      primary 
        ? 'bg-slate-900 text-white shadow-[8px_8px_16px_rgba(0,0,0,0.2),-8px_-8px_16px_rgba(255,255,255,0.1)] hover:bg-slate-800' 
        : 'bg-slate-100 text-slate-800 shadow-[6px_6px_12px_#c3cad5,-6px_-6px_12px_#ffffff] hover:shadow-[4px_4px_8px_#c3cad5,-4px_-4px_8px_#ffffff]'
    } ${className}`}
  >
    {children}
  </button>
);

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: "easeOut" as any as any }
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-100px" },
  transition: { staggerChildren: 0.1 }
};

export default function AboutUs() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden selection:bg-slate-900 selection:text-white">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-blue-100 rounded-2xl mix-blend-multiply filter blur-3xl opacity-50"
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] bg-purple-100 rounded-2xl mix-blend-multiply filter blur-3xl opacity-50"
          animate={{ x: [0, -100, 0], y: [0, 100, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute bottom-[-10%] left-[20%] w-[30vw] h-[30vw] bg-rose-100 rounded-2xl mix-blend-multiply filter blur-3xl opacity-50"
          animate={{ x: [0, 50, 0], y: [0, -100, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
          <motion.div {...fadeIn} transition={{ duration: 0.8 }} className="space-y-8 max-w-4xl">
            <span className="inline-block py-2 px-6 rounded-full bg-white shadow-[inset_2px_2px_4px_rgba(255,255,255,1),inset_-2px_-2px_4px_rgba(0,0,0,0.05),4px_4px_8px_rgba(0,0,0,0.05)] text-sm font-bold tracking-widest uppercase text-slate-500">
              India's Business Success Partner
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1] text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-slate-800 to-slate-500">
              Start. Build. <br/> Scale.
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto">
              Helping entrepreneurs transform business ideas into successful businesses through AI-powered research, expert guidance and end-to-end execution.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <ClayButton primary onClick={() => navigate('/onboarding')} className="w-full sm:w-auto text-lg">
                Start Your Business
                <ArrowRight className="w-5 h-5" />
              </ClayButton>
              <ClayButton onClick={() => navigate('/search')} className="w-full sm:w-auto text-lg">
                Get Business Research Report
              </ClayButton>
            </div>
          </motion.div>
        </section>

        {/* OUR STORY */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <motion.div {...fadeIn} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-8">Why BizNxt Exists</h2>
              <div className="space-y-6 text-lg text-slate-600 leading-relaxed font-medium">
                <p>
                  Starting a business in India is often confusing. Entrepreneurs struggle to find reliable information, trusted experts, manufacturers, legal guidance and clear next steps.
                </p>
                <p>
                  BizNxt was created to simplify that journey.
                </p>
                <p>
                  Our mission is to help every entrepreneur—from first-time founders to growing businesses—make informed decisions using AI-assisted research and experienced business support.
                </p>
              </div>
            </div>
            <div className="relative">
              <ClayCard className="aspect-square relative overflow-hidden group p-0">
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-slate-700 opacity-90 transition-opacity group-hover:opacity-100" />
                <div className="absolute inset-0 p-12 flex flex-col justify-end text-white">
                  <Lightbulb className="w-16 h-16 mb-8 text-yellow-400" />
                  <h3 className="text-3xl font-bold mb-4">Empowering Ideas</h3>
                  <p className="text-slate-300 font-medium">Bridging the gap between a great concept and a launched enterprise.</p>
                </div>
              </ClayCard>
            </div>
          </motion.div>
        </section>

        {/* MISSION & VISION */}
        <section className="py-24 px-6 bg-white/40 backdrop-blur-3xl border-y border-white/60">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div {...fadeIn}>
              <ClayCard className="h-full bg-slate-50">
                <Target className="w-12 h-12 text-slate-900 mb-6" />
                <h3 className="text-2xl font-black mb-4">Our Mission</h3>
                <p className="text-lg text-slate-600 font-medium leading-relaxed">
                  To make starting and growing a business simple, transparent and accessible for everyone.
                </p>
              </ClayCard>
            </motion.div>
            <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
              <ClayCard className="h-full bg-slate-50">
                <Rocket className="w-12 h-12 text-slate-900 mb-6" />
                <h3 className="text-2xl font-black mb-4">Our Vision</h3>
                <p className="text-lg text-slate-600 font-medium leading-relaxed">
                  To become India's most trusted Business Success Platform and help entrepreneurs expand globally.
                </p>
              </ClayCard>
            </motion.div>
          </div>
        </section>

        {/* OUR VALUES */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <motion.div {...fadeIn} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Our Values</h2>
            <p className="text-xl text-slate-600 font-medium">The principles that guide everything we do.</p>
          </motion.div>
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-wrap justify-center gap-4"
          >
            {['Trust', 'Transparency', 'Innovation', 'Customer Success', 'Long-Term Relationships', 'Quality', 'Execution'].map((value, idx) => (
              <motion.div key={idx} variants={fadeIn}>
                <ClayCard className="py-4 px-8 rounded-full bg-white text-lg font-bold text-slate-800">
                  {value}
                </ClayCard>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* HOW BIZNXT WORKS */}
        <section className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-700 via-slate-900 to-slate-900" />
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div {...fadeIn} className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">How BizNxt Works</h2>
              <p className="text-xl text-slate-400 font-medium">A clear path from idea to execution.</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 relative">
              {[
                { step: 1, title: 'Business Idea', icon: Lightbulb },
                { step: 2, title: 'Research Report', icon: BarChart4 },
                { step: 3, title: 'Business Plan', icon: ClipboardList },
                { step: 4, title: 'Registrations & Licenses', icon: FileCheck },
                { step: 5, title: 'Manufacturer / White Label', icon: Factory },
                { step: 6, title: 'Branding & Packaging', icon: Palette },
                { step: 7, title: 'Website & Marketing', icon: Globe },
                { step: 8, title: 'Business Launch', icon: Rocket },
                { step: 9, title: 'Growth & Expansion', icon: TrendingUp },
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  variants={fadeIn}
                  transition={{ delay: idx * 0.05 }}
                  className="relative flex flex-col items-center text-center group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 group-hover:bg-slate-700 transition-all duration-300">
                    <item.icon className="w-8 h-8 text-slate-300 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-widest">Step {item.step}</span>
                  <h4 className="text-lg font-bold text-slate-200">{item.title}</h4>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY CHOOSE BIZNXT */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <motion.div {...fadeIn} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Why Choose BizNxt</h2>
            <p className="text-xl text-slate-600 font-medium">Built differently to guarantee your success.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'AI Assisted Research', 'Human Expert Review', 'Personal Business Success Manager', 
              'Transparent Pricing', 'End-to-End Business Support', 'Verified Partners', 
              'Secure Payments', 'Professional Reports'
            ].map((feature, idx) => (
              <motion.div key={idx} variants={fadeIn} transition={{ delay: idx * 0.05 }}>
                <ClayCard className="h-full flex flex-col items-center text-center p-6 bg-white shadow-xl shadow-slate-200/50 hover:scale-[1.02] transition-transform cursor-default">
                  <CheckCircle2 className="w-10 h-10 text-slate-900 mb-4" />
                  <h4 className="font-bold text-slate-800">{feature}</h4>
                </ClayCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* OUR SERVICES */}
        <section className="py-24 px-6 bg-white/40 backdrop-blur-3xl border-y border-white/60">
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeIn} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Our Services</h2>
              <p className="text-xl text-slate-600 font-medium">Everything you need under one roof.</p>
            </motion.div>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                'Business Research', 'Business Registration', 'GST', 'Trademark', 'MSME', 'FSSAI', 'IEC', 
                'Manufacturer Search', 'White Label', 'Private Label', 'Import Export', 'Business Funding', 
                'Website Development', 'Marketing', 'Business Growth'
              ].map((service, idx) => (
                <motion.div key={idx} variants={fadeIn} transition={{ delay: idx * 0.02 }}>
                  <div className="px-5 py-2.5 bg-slate-100 rounded-full border border-white shadow-sm font-bold text-slate-700 text-sm hover:bg-slate-200 transition-colors cursor-default">
                    {service}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* OUR PROMISE & SOCIAL PROOF */}
        <section className="py-24 px-6 max-w-7xl mx-auto text-center">
          <motion.div {...fadeIn} className="max-w-4xl mx-auto mb-24">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-8">Our Promise</h2>
            <ClayCard className="bg-slate-900 text-white !shadow-[8px_8px_16px_#c3cad5,-8px_-8px_16px_#ffffff]">
              <p className="text-2xl md:text-4xl font-black leading-tight">
                We don't just give advice.<br/>
                <span className="text-slate-400">We work with entrepreneurs until their business is launched successfully.</span>
              </p>
            </ClayCard>
          </motion.div>

          {/* Animated Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Businesses Guided', value: '10,000+' },
              { label: 'Reports Delivered', value: '25,000+' },
              { label: 'Projects Completed', value: '5,000+' },
              { label: 'Customer Satisfaction', value: '99%' },
            ].map((stat, idx) => (
              <motion.div key={idx} variants={fadeIn} transition={{ delay: idx * 0.1 }} className="flex flex-col items-center">
                <span className="text-4xl md:text-5xl font-black text-slate-900 mb-2">{stat.value}</span>
                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section className="py-24 px-6 bg-slate-100 border-t border-white/50">
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeIn} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Connect With Us</h2>
              <p className="text-xl text-slate-600 font-medium">We're here to support your journey.</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <a href="mailto:care@biznxt.online" className="block group">
                <ClayCard className="bg-white flex flex-col items-center text-center group-hover:scale-[1.02] transition-transform h-full">
                  <Mail className="w-10 h-10 text-slate-900 mb-4" />
                  <h4 className="font-bold text-lg mb-2">Email Us</h4>
                  <p className="text-slate-500 font-medium">care@biznxt.online</p>
                </ClayCard>
              </a>
              <a href="https://www.instagram.com/biznxt_online" target="_blank" rel="noopener noreferrer" className="block group">
                <ClayCard className="bg-white flex flex-col items-center text-center group-hover:scale-[1.02] transition-transform h-full">
                  <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-lg mb-2">Instagram</h4>
                  <p className="text-slate-500 font-medium">Follow @biznxt_online</p>
                </ClayCard>
              </a>
              <a href="https://whatsapp.com/channel/0029Vb7mx244CrfnO7UhEQ1n" target="_blank" rel="noopener noreferrer" className="block group">
                <ClayCard className="bg-white flex flex-col items-center text-center group-hover:scale-[1.02] transition-transform h-full">
                  <MessageCircle className="w-10 h-10 text-slate-900 mb-4" />
                  <h4 className="font-bold text-lg mb-2">WhatsApp</h4>
                  <p className="text-slate-500 font-medium">Join our Channel</p>
                </ClayCard>
              </a>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="py-32 px-6 bg-slate-900 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-900 opacity-50" />
          <motion.div {...fadeIn} className="max-w-4xl mx-auto space-y-8 relative z-10">
            <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight">Ready to Start Your Business?</h2>
            <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto">
              Join the new generation of Indian entrepreneurs building with BizNxt.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
              <ClayButton onClick={() => navigate('/onboarding')} className="bg-[#C1121F] text-white hover:bg-[#A00F1A] border-none">
                Start Business
              </ClayButton>
              <ClayButton onClick={() => navigate('/search')} className="bg-white text-slate-900 border-none">
                Get Research Report
              </ClayButton>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
