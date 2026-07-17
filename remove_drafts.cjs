const fs = require('fs');

const rtwPath = 'src/components/ResearchTeamWorkspace.tsx';
let rtw = fs.readFileSync(rtwPath, 'utf8');

// Remove AI draft API calling from ResearchTeamWorkspace
rtw = rtw.replace(/const handleGenerateAIDraft = async \(\) => \{.*?\};/s, 'const handleGenerateAIDraft = async () => {};');

fs.writeFileSync(rtwPath, rtw);
console.log("Cleaned up drafts in RTW");
