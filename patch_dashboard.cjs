const fs = require('fs');
let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// Replace standard rounded-3xl with rounded-full for specific elements
content = content.replace(/rounded-3xl/g, 'rounded-3xl'); // default no-op

content = content.replace(/px-6 py-3 rounded-3xl/g, 'px-6 py-3 rounded-full');
content = content.replace(/p-3 rounded-3xl/g, 'p-3 rounded-full');
content = content.replace(/w-2 h-2 rounded-3xl/g, 'w-2 h-2 rounded-full');
content = content.replace(/w-4 h-4 rounded-3xl/g, 'w-4 h-4 rounded-full');
content = content.replace(/w-5 h-5 rounded-3xl/g, 'w-5 h-5 rounded-full');
content = content.replace(/w-12 h-12 rounded-3xl/g, 'w-12 h-12 rounded-3xl'); // leave as squircle
content = content.replace(/w-16 h-16 rounded-3xl/g, 'w-16 h-16 rounded-3xl'); // leave as squircle
content = content.replace(/px-2\.5 py-1(.*?|)rounded-3xl/g, 'px-2.5 py-1$1rounded-full');
content = content.replace(/py-2\.5(.*?)rounded-3xl/g, 'py-2.5$1rounded-full');
content = content.replace(/p-1\.5 rounded-3xl/g, 'p-1.5 rounded-full');
// For list items: "w-full flex items-center justify-between p-3 rounded-full bg-white/10"
// I already replaced p-3 rounded-3xl with p-3 rounded-full above, so those list items are now pill shaped.

fs.writeFileSync('src/pages/Dashboard.tsx', content);
console.log("Patched Dashboard.tsx");
