const fs = require('fs');
let content = fs.readFileSync('src/pages/LaunchWizard.tsx', 'utf8');

content = content.replace(/import \{ useAutoSave \} from '\.\.\/hooks\/useAutoSave';\n/g, '');
content = content.replace(/const \{ data: formData, setData: setFormData, lastSaved: autoSavedAt, clearAutoSave \} = useAutoSave<any>\('biznxt_launch_wizard_draft', \{/g, 'const [formData, setFormData] = useState<any>({');
content = content.replace(/clearAutoSave\(\);/g, '');

content = content.replace(/\{autoSavedAt && \([\s\S]*?<\/div>\s*\)\}/g, '');

fs.writeFileSync('src/pages/LaunchWizard.tsx', content);
console.log("Patched LaunchWizard.tsx for useAutoSave");
