const fs = require('fs');
let code = fs.readFileSync('src/pages/Settings.tsx', 'utf8');

// I accidentally replaced the closing brace for activeTab === 'profile'.
// Actually, `)}` was removed and it broke things. Wait, the output of sed says `)}` is at line 230 but it's not well-formed because of the Fragment.
// Let's restore the file and patch it properly.

code = code.replace(`              )}`, `                  </>\n              )}`);
fs.writeFileSync('src/pages/Settings.tsx', code);
