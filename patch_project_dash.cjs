const fs = require('fs');
let content = fs.readFileSync('src/pages/ProjectDashboard.tsx', 'utf8');

// Buttons / Pill shapes that currently use rounded-3xl instead of rounded-full
content = content.replace(/rounded-3xl hover:bg-emerald-600/g, 'rounded-full hover:bg-emerald-600');
content = content.replace(/rounded-3xl hover:bg-primary\/90/g, 'rounded-full hover:bg-primary/90');
content = content.replace(/bg-emerald-50 text-emerald-700 rounded-3xl/g, 'bg-emerald-50 text-emerald-700 rounded-full');
// w-8 h-8 and small indicators
content = content.replace(/w-8 h-8 bg-slate-900 rounded-3xl/g, 'w-8 h-8 bg-slate-900 rounded-full');
content = content.replace(/w-4 h-4 bg-emerald-500 border-4 border-white rounded-3xl/g, 'w-4 h-4 bg-emerald-500 border-4 border-white rounded-full');

fs.writeFileSync('src/pages/ProjectDashboard.tsx', content);
console.log("Patched ProjectDashboard");
