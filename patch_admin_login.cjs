const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminLogin.tsx', 'utf8');

// Remove debug states and functions
content = content.replace(/const \[debugLogs, setDebugLogs\] = useState<string\[\]>\(\[\]\);\n/g, '');
content = content.replace(/const \[showDebugPanel, setShowDebugPanel\] = useState\(false\);\n/g, '');
content = content.replace(/const addLog = \(msg: string\) => \{\n.*?setDebugLogs.*?\n.*?console\.log.*?\n\s*\};\n/gs, '');

// Replace all addLog calls with nothing
content = content.replace(/addLog\('.*?'\);\n/g, '');
content = content.replace(/addLog\(`.*?`\);\n/g, '');
content = content.replace(/setDebugLogs\(\[\]\);\n/g, '');
content = content.replace(/setShowDebugPanel\(true\);\n/g, '');

// Remove the debug panel UI
content = content.replace(/\{\/\* Debug & Diagnostics Panel \*\/\}.*?<\/div>\n\s*<\/div>\n\s*\)\}/gs, '');

fs.writeFileSync('src/pages/AdminLogin.tsx', content);
console.log("Patched AdminLogin.tsx to remove debug panel");
