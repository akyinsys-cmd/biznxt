const fs = require('fs');
let code = fs.readFileSync('src/components/AdminWorkspace.tsx', 'utf8');

if (!code.includes("import { PricingAdminConfig }")) {
  code = code.replace(
    "import { logUserActivity } from './widgets/UserActivityLogger';",
    "import { logUserActivity } from './widgets/UserActivityLogger';\nimport { PricingAdminConfig } from './widgets/PricingAdminConfig';"
  );
}

// Replace the placeholder static "Surge Protocols" with PricingAdminConfig
code = code.replace(
  /<div className="p-10 bg-slate-900 rounded-\[3rem\] border border-white\/5 space-y-8">[\s\S]*?<\/div>\s*<\/div>/,
  `<PricingAdminConfig />\n                    </div>`
);

fs.writeFileSync('src/components/AdminWorkspace.tsx', code);
