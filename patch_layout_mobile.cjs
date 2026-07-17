const fs = require('fs');
let layout = fs.readFileSync('src/components/Layout.tsx', 'utf8');
layout = layout.replace(/block px-4 py-2\.5 rounded-2xl text-sm/g, 'block px-4 py-2.5 rounded-full text-sm');
fs.writeFileSync('src/components/Layout.tsx', layout);
console.log("Patched Layout Mobile");
