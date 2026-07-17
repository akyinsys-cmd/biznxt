const fs = require('fs');
let content = fs.readFileSync('src/components/widgets/DiscoveryForm.tsx', 'utf8');

const loadDraftRegex = /\s*\/\/ Load draft from localStorage on mount[\s\S]*?useEffect\(\(\) => \{[\s\S]*?const draft = localStorage\.getItem\('biznxt_discovery_draft'\);[\s\S]*?if \(draft\) \{[\s\S]*?try \{[\s\S]*?const parsed = JSON\.parse\(draft\);[\s\S]*?setFormData\(parsed\);[\s\S]*?success\('Loaded draft business research form!'\);[\s\S]*?\} catch \(err\) \{[\s\S]*?console\.error\('Error parsing draft:', err\);[\s\S]*?\}[\s\S]*?\}[\s\S]*?\}, \[\]\);/;
content = content.replace(loadDraftRegex, '');

content = content.replace(/localStorage\.setItem\('biznxt_discovery_draft', JSON\.stringify\(updated\)\);/, '');
content = content.replace(/\/\/ Clear current draft\s*const handleReset = \(\) => \{\s*if \(window\.confirm\('Are you sure you want to discard your draft\?'\)\) \{\s*localStorage\.removeItem\('biznxt_discovery_draft'\);/, "const handleReset = () => {\n    if (window.confirm('Are you sure you want to reset the form?')) {");
content = content.replace(/\/\/ Clear localStorage draft upon successful submission\s*localStorage\.removeItem\('biznxt_discovery_draft'\);/, '');

fs.writeFileSync('src/components/widgets/DiscoveryForm.tsx', content);
console.log("Patched DiscoveryForm.tsx");
