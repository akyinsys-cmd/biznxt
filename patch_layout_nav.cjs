const fs = require('fs');
let layout = fs.readFileSync('src/components/Layout.tsx', 'utf8');
layout = layout.replace(/bg-slate-50\/50 p-1\.5 rounded-2xl/g, 'bg-slate-50/50 p-1.5 rounded-full');
layout = layout.replace(/px-4 py-2 rounded-2xl text-\[10px\]/g, 'px-4 py-2 rounded-full text-[10px]');
fs.writeFileSync('src/components/Layout.tsx', layout);
console.log("Patched Layout Nav");
