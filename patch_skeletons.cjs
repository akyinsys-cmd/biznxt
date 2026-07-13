const fs = require('fs');
let code = fs.readFileSync('src/components/SkeletonComponent.tsx', 'utf8');

const listSkeletons = `
export function ProjectListSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-8">
        <SkeletonComponent className="h-10 w-64 rounded-xl" />
        <SkeletonComponent className="h-10 w-32 rounded-xl" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SkeletonComponent className="h-12 w-12 rounded-xl" />
              <div className="space-y-2">
                <SkeletonComponent className="h-5 w-48" />
                <SkeletonComponent className="h-3 w-32" />
              </div>
            </div>
            <div className="flex gap-4">
               <SkeletonComponent className="h-8 w-24 rounded-lg" />
               <SkeletonComponent className="h-8 w-24 rounded-lg" />
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
`;

code += listSkeletons;
fs.writeFileSync('src/components/SkeletonComponent.tsx', code);
