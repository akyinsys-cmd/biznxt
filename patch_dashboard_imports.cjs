const fs = require('fs');
let content = fs.readFileSync('src/pages/business-os/index.tsx', 'utf8');

content = content.replace(/import \{ DocumentVault \} from '\.\/DocumentVault';\n/g, '');
content = content.replace(/import \{ AiAssistant \} from '\.\.\/\.\.\/components\/widgets\/AiAssistant';\n/g, '');
content = content.replace(/import \{ TaskManager \} from '\.\.\/\.\.\/components\/TaskManager';\n/g, '');
content = content.replace(/import \{ FileSignature, FolderLock, Sparkles, MessageCircle, Activity, Globe, Scale \} from 'lucide-react';/, "import { FileText, FolderLock, Activity } from 'lucide-react';");

fs.writeFileSync('src/pages/business-os/index.tsx', content);
console.log("Patched Dashboard.tsx imports");
