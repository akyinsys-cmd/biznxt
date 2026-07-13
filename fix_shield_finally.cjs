const fs = require('fs');
let code = fs.readFileSync('src/pages/Services.tsx', 'utf8');

code = code.replace("import { Shield, motion, AnimatePresence } from 'motion/react';", "import { motion, AnimatePresence } from 'motion/react';");

// Check if modal exists
if (!code.includes("<ValueComparisonModal")) {
  code = code.replace(
    /    <\/div>\n  \);\n\}\n?$/,
    "      <ValueComparisonModal isOpen={compareModalOpen} onClose={() => setCompareModalOpen(false)} serviceTitle={compareServiceTitle} />\n    </div>\n  );\n}\n"
  );
}

fs.writeFileSync('src/pages/Services.tsx', code);
