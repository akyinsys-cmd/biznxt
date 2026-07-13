import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPIStatCardProps {
  title: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  icon: React.ElementType;
  sparklineData?: number[];
  className?: string;
}

export function KPIStatCard({
  title,
  value,
  trend,
  trendValue,
  icon: Icon,
  sparklineData,
  className = ''
}: KPIStatCardProps) {
  // Simple SVG sparkline generator
  const renderSparkline = () => {
    if (!sparklineData || sparklineData.length < 2) return null;
    
    const min = Math.min(...sparklineData);
    const max = Math.max(...sparklineData);
    const range = max - min || 1;
    
    const width = 100;
    const height = 30;
    
    const points = sparklineData.map((val, i) => {
      const x = (i / (sparklineData.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    const strokeColor = trend === 'up' ? '#10b981' : trend === 'down' ? '#f43f5e' : '#64748b';

    return (
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible preserve-3d">
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden ${className}`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-xs font-semibold text-slate-400 font-mono">{title}</h4>
        <div className="p-2 bg-slate-800 rounded-2xl">
          <Icon className="w-4 h-4 text-slate-300" />
        </div>
      </div>
      
      <div className="flex items-end justify-between mt-4">
        <div>
          <span className="text-2xl font-bold text-slate-100 font-display tracking-tight">{value}</span>
          <div className="flex items-center mt-1">
            {trend === 'up' ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500 mr-1" />
            ) : trend === 'down' ? (
              <TrendingDown className="w-3.5 h-3.5 text-rose-500 mr-1" />
            ) : (
              <div className="w-3.5 h-3.5 mr-1" />
            )}
            <span className={`text-xs font-medium ${
              trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-rose-500' : 'text-slate-500'
            }`}>
              {trendValue}
            </span>
          </div>
        </div>
        
        {sparklineData && (
          <div className="w-24 h-8 opacity-70">
            {renderSparkline()}
          </div>
        )}
      </div>
    </motion.div>
  );
}
