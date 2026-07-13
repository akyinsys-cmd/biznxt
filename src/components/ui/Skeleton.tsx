import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
}

export function Skeleton({ className, variant = 'rectangular' }: SkeletonProps) {
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

export function DashboardSkeleton({ dark = false }: { dark?: boolean }) {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
            <Skeleton className="w-16 h-16 rounded-[1.5rem]" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3 w-1/2 opacity-50" />
              <Skeleton className="h-8 w-3/4" />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-12 lg:col-span-8 bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm h-[600px]">
          <div className="flex justify-between mb-12">
            <div className="space-y-3">
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-3 w-48 opacity-50" />
            </div>
            <Skeleton className="h-10 w-32 rounded-2xl" />
          </div>
          <Skeleton className="h-[400px] w-full rounded-[2rem]" />
        </div>
        <div className={`col-span-12 lg:col-span-4 p-10 rounded-[3.5rem] shadow-sm h-[600px] ${dark ? 'bg-slate-900 border-none' : 'bg-white border border-slate-100'}`}>
          <div className="flex items-center gap-4 mb-10">
            <Skeleton className={`w-12 h-12 rounded-2xl ${dark ? 'bg-slate-800' : ''}`} />
            <div className="space-y-3">
              <Skeleton className={`h-5 w-32 ${dark ? 'bg-slate-800' : ''}`} />
              <Skeleton className={`h-3 w-24 opacity-50 ${dark ? 'bg-slate-800' : ''}`} />
            </div>
          </div>
          <div className="space-y-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className={`w-1 h-12 rounded-2xl ${dark ? 'bg-slate-800' : 'bg-slate-100'}`} />
                <div className="flex-1 space-y-3">
                  <Skeleton className={`h-4 w-full ${dark ? 'bg-slate-800' : ''}`} />
                  <Skeleton className={`h-3 w-3/4 opacity-50 ${dark ? 'bg-slate-800' : ''}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
