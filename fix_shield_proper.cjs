const fs = require('fs');
let code = fs.readFileSync('src/pages/Services.tsx', 'utf8');

code = code.replace(/import \{ Shield, /g, "import { ");
code = code.replace(
  "import { \n  Briefcase,",
  "import {\n  Shield,\n  Briefcase,"
);

fs.writeFileSync('src/pages/Services.tsx', code);
