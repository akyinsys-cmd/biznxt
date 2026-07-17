import React from 'react';
import { cn } from '../lib/utils';

interface SkeletonComponentProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
}

export function SkeletonComponent({ className, variant = 'rectangular' }: SkeletonComponentProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-slate-200/50",
        variant === 'circular' ? "rounded-2xl" : "rounded-2xl",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer" />
    </div>
  );
}

export function ProjectDashboardSkeleton() {
  return <PremiumDashboardSkeleton />;
}

export function PremiumDashboardSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-150 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <SkeletonComponent className="h-4 w-24" />
              <SkeletonComponent className="h-8 w-8 rounded-2xl" />
            </div>
            <SkeletonComponent className="h-8 w-32" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 bg-white p-8 rounded-3xl border border-slate-150 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <SkeletonComponent className="h-6 w-48" />
            <SkeletonComponent className="h-8 w-24 rounded-2xl" />
          </div>
          <SkeletonComponent className="h-64 w-full rounded-2xl" />
        </div>
        <div className="col-span-12 lg:col-span-4 bg-white p-8 rounded-3xl border border-slate-150 shadow-sm space-y-6">
          <SkeletonComponent className="h-6 w-32" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <SkeletonComponent className="h-10 w-10 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <SkeletonComponent className="h-4 w-3/4" />
                  <SkeletonComponent className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProjectListSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-8">
        <SkeletonComponent className="h-10 w-64 rounded-full" />
        <SkeletonComponent className="h-10 w-32 rounded-full" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-150 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SkeletonComponent className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <SkeletonComponent className="h-5 w-48" />
                <SkeletonComponent className="h-3 w-32" />
              </div>
            </div>
            <div className="flex gap-4">
               <SkeletonComponent className="h-8 w-24 rounded-2xl" />
               <SkeletonComponent className="h-8 w-24 rounded-2xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MarketplaceGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-300">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
          <SkeletonComponent className="h-48 w-full rounded-none" />
          <div className="p-5 flex-1 flex flex-col space-y-4">
            <SkeletonComponent className="h-3 w-20" />
            <SkeletonComponent className="h-6 w-3/4" />
            <SkeletonComponent className="h-16 w-full" />
            <div className="space-y-2 mt-auto">
              <SkeletonComponent className="h-4 w-full" />
              <SkeletonComponent className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="flex-1 bg-slate-50 min-h-screen flex flex-col space-y-8 animate-in fade-in duration-300 text-left">
      {/* Top Banner mock */}
      <div className="bg-slate-900 px-8 py-10 relative overflow-hidden shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 shrink-0">
            <SkeletonComponent className="h-8 w-64 bg-slate-800" />
            <SkeletonComponent className="h-4 w-40 bg-slate-800" />
          </div>
          <SkeletonComponent className="h-10 w-full max-w-md rounded-2xl bg-slate-800" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 flex-1 flex flex-col gap-8">
        {/* Dynamic Sparkline Card skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 shrink-0">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm flex items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <SkeletonComponent className="h-3 w-24" />
                <SkeletonComponent className="h-8 w-32" />
                <SkeletonComponent className="h-3 w-20" />
              </div>
              <SkeletonComponent className="h-12 w-28 rounded-full" />
            </div>
          ))}
        </div>

        {/* Tab switcher row skeleton */}
        <div className="bg-white rounded-2xl p-2 flex flex-wrap gap-2 shadow-sm border border-slate-100 shrink-0">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i}>
              <SkeletonComponent className="h-10 w-32 rounded-full" />
            </div>
          ))}
        </div>

        {/* Primary Content Container skeleton */}
        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm flex-1 min-h-[400px] flex flex-col space-y-6">
          <div className="flex justify-between items-center pb-6 border-b border-slate-50">
            <div className="space-y-2">
              <SkeletonComponent className="h-6 w-48" />
              <SkeletonComponent className="h-3.5 w-32" />
            </div>
            <SkeletonComponent className="h-10 w-28 rounded-full" />
          </div>
          
          <div className="space-y-4 flex-1">
            {[1, 2, 3, 4].map((row) => (
              <div key={row} className="flex justify-between items-center py-4 border-b border-slate-50 gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <SkeletonComponent className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1 max-w-md">
                    <SkeletonComponent className="h-4 w-3/4" />
                    <SkeletonComponent className="h-3 w-1/2" />
                  </div>
                </div>
                <SkeletonComponent className="h-8 w-24 rounded-2xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

