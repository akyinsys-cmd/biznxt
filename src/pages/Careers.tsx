import React from 'react';
import { Briefcase, ArrowRight, Star } from 'lucide-react';
import { motion } from 'motion/react';

export default function Careers() {
  const jobs = [
    { title: 'Senior Business Success Manager', department: 'Consulting', location: 'Remote / India', type: 'Full-time' },
    { title: 'Lead Market Analyst', department: 'Research', location: 'Mumbai, IN', type: 'Full-time' },
    { title: 'Full Stack Engineer', department: 'Engineering', location: 'Remote', type: 'Full-time' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Build the Future of Business</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">Join our mission to democratize enterprise-grade intelligence and operational excellence for businesses everywhere.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Impact</h3>
            <p className="text-sm text-slate-500">Shape the trajectory of hundreds of emerging businesses.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Growth</h3>
            <p className="text-sm text-slate-500">Accelerated learning in a high-performance environment.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Culture</h3>
            <p className="text-sm text-slate-500">A supportive, ambitious, and remote-friendly team.</p>
          </div>
        </div>

        <h2 className="text-2xl font-black text-slate-900 mb-8">Open Positions</h2>
        <div className="space-y-4">
          {jobs.map((job, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between hover:border-blue-200 transition-colors group cursor-pointer"
            >
              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                <div className="flex items-center space-x-4 mt-2 text-sm font-medium text-slate-500">
                  <span className="flex items-center"><Briefcase className="w-4 h-4 mr-1" /> {job.department}</span>
                  <span>•</span>
                  <span>{job.location}</span>
                  <span>•</span>
                  <span>{job.type}</span>
                </div>
              </div>
              <div className="mt-4 sm:mt-0">
                <button className="flex items-center text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  Apply Now <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
