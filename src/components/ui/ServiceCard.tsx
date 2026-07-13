import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  delay?: number;
  className?: string;
}

export function ServiceCard({ title, description, icon: Icon, path, delay = 0, className }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
      className={cn(
        "group relative flex flex-col justify-between p-6 bg-white border border-slate-100 rounded-2xl hover:shadow-lg transition-all",
        className
      )}
    >
      <div>
        <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-500 mb-4 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        <h4 className="text-lg font-bold text-slate-900 mb-2">{title}</h4>
        <p className="text-sm text-slate-500 leading-relaxed mb-6">{description}</p>
      </div>
      
      <Link 
        to={path}
        className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark transition-colors mt-auto"
      >
        Learn more <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </Link>
    </motion.div>
  );
}
