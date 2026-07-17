const fs = require('fs');
let rtw = fs.readFileSync('src/components/ResearchTeamWorkspace.tsx', 'utf8');
rtw = rtw.replace(/const \[aiDraftType, setAiDraftType\] = useState<string>\('executive_summary'\);/, '');
rtw = rtw.replace(/const \[aiDraftOutput, setAiDraftOutput\] = useState<string>\(''\);/, '');
// Remove the whole block for AI Draft Generation
rtw = rtw.replace(/\/\/ Trigger AI Draft Generation from server endpoint[\s\S]*?\/\/ Commit and Save Manual Findings/g, '// Commit and Save Manual Findings');
// Remove UI block
rtw = rtw.replace(/\{\/\* Smart Co-Pilot Generation Center \*\/\}[\s\S]*?\{\/\* Live Research Notebook \*\/\}/, '{/* Live Research Notebook */}');
fs.writeFileSync('src/components/ResearchTeamWorkspace.tsx', rtw);
console.log("Cleaned up drafts");
