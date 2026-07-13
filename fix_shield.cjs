const fs = require('fs');
let code = fs.readFileSync('src/pages/Services.tsx', 'utf8');

if (!code.includes(" Shield,")) {
  code = code.replace(
    "import { ",
    "import { Shield, "
  );
}

fs.writeFileSync('src/pages/Services.tsx', code);
