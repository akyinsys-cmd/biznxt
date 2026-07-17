const fs = require('fs');
let content = fs.readFileSync('src/pages/PremiumResearch.tsx', 'utf8');

content = content.replace(/import \{ formDraftsDB \} from '\.\.\/lib\/indexedDB';\n/g, '');

const loadDraftRegex = /\/\/ Draft loading and saving\s*useEffect\(\(\) => \{\s*const loadDraft = async \(\) => \{[\s\S]*?loadDraft\(\);\s*\}, \[\]\);\s*/;
content = content.replace(loadDraftRegex, '');

const saveDraftRegex = /useEffect\(\(\) => \{\s*const saveDraft = async \(\) => \{[\s\S]*?return \(\) => clearTimeout\(timeout\);\s*\}, \[formFields\]\);\s*/;
content = content.replace(saveDraftRegex, '');

fs.writeFileSync('src/pages/PremiumResearch.tsx', content);
console.log("Patched PremiumResearch.tsx");
