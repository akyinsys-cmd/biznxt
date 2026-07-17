const fs = require('fs');

// server.ts
let server = fs.readFileSync('server.ts', 'utf8');
server = server.replace(/\/\/ AI Research Assistant Draft Generator API[\s\S]*?app\.post\("\/api\/research\/draft", async \(req, res\) => \{[\s\S]*?res\.status\(500\)\.json\(\{ error: "Failed to generate research segment draft due to an internal error\." \}\);\s*\}\s*\}\);/g, '');
fs.writeFileSync('server.ts', server);

// ResearchTeamWorkspace.tsx
let rtw = fs.readFileSync('src/components/ResearchTeamWorkspace.tsx', 'utf8');
rtw = rtw.replace(/const \[aiDraftType, setAiDraftType\] = useState<string>\('executive_summary'\);/, '');
rtw = rtw.replace(/const \[aiDraftOutput, setAiDraftOutput\] = useState<string>\(''\);/, '');
rtw = rtw.replace(/<div className="bg-indigo-900 border border-indigo-700\/50 rounded-2xl p-6 text-white shadow-xl shadow-indigo-900\/20 space-y-5">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g, '</div></div>'); // This removes the AI Copilot UI in RTW.

fs.writeFileSync('src/components/ResearchTeamWorkspace.tsx', rtw);

// ResearchExecutiveDashboard.tsx
let red = fs.readFileSync('src/pages/ResearchExecutiveDashboard.tsx', 'utf8');
red = red.replace(/const \[aiDraftType, setAiDraftType\] = useState<string>\('executive_summary'\);/, '');
red = red.replace(/const \[aiInstructions, setAiInstructions\] = useState<string>\(''\);/, '');
red = red.replace(/const \[aiOutput, setAiOutput\] = useState<string>\(''\);/, '');
red = red.replace(/const \[generating, setGenerating\] = useState<boolean>\(false\);/, '');

// UI
red = red.replace(/<div className="bg-indigo-50\/50 border border-indigo-100 rounded-3xl p-6 shadow-sm space-y-4">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g, '');
fs.writeFileSync('src/pages/ResearchExecutiveDashboard.tsx', red);

console.log("Cleaned server.ts, RTW.tsx, RED.tsx");
