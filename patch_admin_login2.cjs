const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminLogin.tsx', 'utf8');

const debugPanelStart = content.indexOf('{/* Debug & Diagnostics Panel */}');
if (debugPanelStart !== -1) {
    // Find the end of this block by finding the next sibling element or the closing of the parent div.
    // Actually we can just find the string that comes after it, which is the end of the return statement.
    content = content.replace(/\{\/\* Debug & Diagnostics Panel \*\/\}[\s\S]*?\{showDebugPanel && \([\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?\)\}/, '');
    fs.writeFileSync('src/pages/AdminLogin.tsx', content);
    console.log("Removed debug UI");
}
