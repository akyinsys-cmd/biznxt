const fs = require('fs');
let content = fs.readFileSync('src/components/ResearchTeamWorkspace.tsx', 'utf8');

// Replace handleGenerateAiDraft
content = content.replace(/\/\/ Trigger AI Draft Generation from server endpoint[\s\S]*?const handleApplyDraftToWorkspace = \(\) => \{[\s\S]*?setWorkspaceSubTab\('manual'\);\n  \};/g, '');

// Also remove the JSX referencing aiDraftType and handleGenerateAiDraft
content = content.replace(/\{\/\* Smart Co-Pilot Generation Center \*\/\}[\s\S]*?\{\/\* Terminal Output \*\/\}[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/g, '');
// Nuke from <div className="space-y-4"> inside Co-Pilot Generation Center to its end
content = content.replace(/<div className="p-6 bg-slate-900 border-b border-white\/10">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g, '</div></div></div>'); // just a heuristic

fs.writeFileSync('src/components/ResearchTeamWorkspace.tsx', content);
console.log("Patched RTW part 6");
