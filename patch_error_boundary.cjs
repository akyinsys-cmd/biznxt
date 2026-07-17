const fs = require('fs');
let content = fs.readFileSync('src/components/ErrorBoundary.tsx', 'utf8');

content = content.replace(/Unexpected Application Error/, 'Service Interruption');
content = content.replace(/A runtime error occurred that caused the client-side system to crash\. The platform state has been isolated to prevent corruption\./, 'We are experiencing a temporary issue. Our team is working on it and everything will be back to normal shortly.');

// Remove the whole error diagnostics block
content = content.replace(/\{\/\* Error diagnostics block \*\/\}[\s\S]*?\{\/\* Navigation actions \*\/\}/, '{/* Navigation actions */}');

// Style rounded-2xl -> rounded-full
content = content.replace(/rounded-2xl/g, 'rounded-full');

fs.writeFileSync('src/components/ErrorBoundary.tsx', content);
console.log("Patched ErrorBoundary.tsx");
