const fs = require('fs');
let content = fs.readFileSync('src/pages/Settings.tsx', 'utf8');

content = content.replace(/import \{ useAutoSave \} from '\.\.\/hooks\/useAutoSave';\n/g, '');
content = content.replace(/const \{ data: settings, setData: setSettings, lastSaved, clearAutoSave \} = useAutoSave\('biznxt_settings_draft', \{/g, 'const [settings, setSettings] = useState({');
content = content.replace(/clearAutoSave\(\);/g, '');

// Also remove `lastSaved` from JSX if present
content = content.replace(/\{lastSaved && \([^)]*\)\}/g, '');
content = content.replace(/Last saved: \{lastSaved\.toLocaleTimeString\(\)\}/g, '');

fs.writeFileSync('src/pages/Settings.tsx', content);
console.log("Patched Settings.tsx");
