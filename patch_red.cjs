const fs = require('fs');
let content = fs.readFileSync('src/pages/ResearchExecutiveDashboard.tsx', 'utf8');
content = content.replace(/const handleGenerateDraft = async \(\) => \{[\s\S]*?\}\s*};\s*\/\/\s*Submit report to QA Review/m, '// Submit report to QA Review');
content = content.replace(/\{\/\* AI Co-Pilot drafting module \*\/\}[\s\S]*?\{\/\* QA Peer Audit & Revisions Control Section \*\/\}/m, '{/* QA Peer Audit & Revisions Control Section */}');
content = content.replace(/Once your document drafts and primary location analyses are gathered/g, 'Once your primary location analyses are gathered');
content = content.replace(/start drafting and peer-review audits/g, 'start peer-review audits');
fs.writeFileSync('src/pages/ResearchExecutiveDashboard.tsx', content);
console.log("Patched ResearchExecutiveDashboard.tsx for drafts");
