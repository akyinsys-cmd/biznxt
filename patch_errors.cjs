const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.{ts,tsx}');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Replace error(err.message || 'default') with error('default')
    const errRegex = /(?:showToast|error|toastError|showError|showToastError)\(\s*(?:err\.message|error\.message)\s*\|\|\s*('[^']+'|"[^"]+")\s*(?:,\s*['"]error['"])?\s*\)/g;
    if (content.match(errRegex)) {
        content = content.replace(errRegex, (match, p1) => {
            if (match.startsWith('showToast(') || match.startsWith('showToastError(')) {
                return `showToast(${p1}, 'error')`;
            } else if (match.startsWith('showError(')) {
                return `showError(${p1})`;
            } else {
                return `error(${p1})`;
            }
        });
        changed = true;
    }

    // Replace error('Prefix: ' + err.message) with error('Prefix')
    const errRegex2 = /error\('([^']+)'\s*\+\s*(?:err\.message|error\.message)\)/g;
    if (content.match(errRegex2)) {
        content = content.replace(errRegex2, (match, p1) => {
            const cleanPrefix = p1.replace(/:\s*$/, '');
            return `error('${cleanPrefix}. Please try again later.')`;
        });
        changed = true;
    }
    
    // Replace err.message usage in variables like const msg = err.message || '...';
    const errRegex3 = /const (msg|errorMsg|errMsg) = (?:err\.message|error\.message) \|\| ('[^']+'|"[^"]+");/g;
    if (content.match(errRegex3)) {
        content = content.replace(errRegex3, (match, p1, p2) => {
            return `const ${p1} = ${p2};`;
        });
        changed = true;
    }
    
    // Handle specific console.error stack traces in ErrorBoundary
    if (file.includes('ErrorBoundary.tsx')) {
        content = content.replace(/console\.error\('Error details\/stack trace:', errorInfo\.componentStack\);/g, `console.debug('Component stack trace captured.');`);
        content = content.replace(/console\.error\('Error caught by global ErrorBoundary:', error\);/g, `console.warn('An application error occurred. System has recovered gracefully.');`);
        changed = true;
    }

    if (file.includes('ResearchFeedbackDialog.tsx')) {
        content = content.replace(/console\.error\('Firestore Error: ', JSON\.stringify\(errInfo\)\);/g, `console.warn('Unable to sync feedback at this time.');`);
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content);
        console.log("Patched errors in " + file);
    }
});
