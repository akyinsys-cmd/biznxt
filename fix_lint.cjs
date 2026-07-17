const fs = require('fs');

// ResearchTeamWorkspace.tsx
let rtw = fs.readFileSync('src/components/ResearchTeamWorkspace.tsx', 'utf8');

// There is a remnant of AI Draft UI in RTW.
const blockStart = '<div className="md:col-span-1 space-y-4">';
const blockEndIdx = rtw.indexOf('{/* Live Research Notebook */}');
if (rtw.includes(blockStart) && blockEndIdx !== -1) {
    const startIdx = rtw.indexOf(blockStart);
    // Find the enclosing <div className="grid md:grid-cols-3 gap-6"> which started before this.
    const enclosingBlockStart = '<div className="grid md:grid-cols-3 gap-6">';
    if (rtw.includes(enclosingBlockStart)) {
        const enclosingStartIdx = rtw.indexOf(enclosingBlockStart);
        if (enclosingStartIdx < startIdx && enclosingStartIdx > rtw.indexOf('{/* Sub-Tab 2: AI Research Desk Assistant */}')) {
             rtw = rtw.slice(0, enclosingStartIdx) + rtw.slice(blockEndIdx);
        } else {
             // Fallback
             rtw = rtw.slice(0, startIdx) + rtw.slice(blockEndIdx);
        }
    } else {
        rtw = rtw.slice(0, startIdx) + rtw.slice(blockEndIdx);
    }
}
// Clean up any remaining ai_assistant code
rtw = rtw.replace(/\{\/\* Sub-Tab 2: AI Research Desk Assistant \*\/\}[\s\S]*?\{\/\* Sub-Tab 3:/, '{/* Sub-Tab 3:');

fs.writeFileSync('src/components/ResearchTeamWorkspace.tsx', rtw);

// AdminLogin.tsx
let al = fs.readFileSync('src/pages/AdminLogin.tsx', 'utf8');
al = al.replace(/showToast\(/g, 'showToastError(');
fs.writeFileSync('src/pages/AdminLogin.tsx', al);

console.log("Fixed lint errors");
