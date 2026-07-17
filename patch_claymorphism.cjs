const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.{ts,tsx}');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Ensure buttons have rounded-full
    const buttonRegex = /className="([^"]*?)(?:rounded-xl|rounded-2xl|rounded-lg|rounded-md)([^"]*?)"/g;
    content = content.replace(buttonRegex, (match, p1, p2) => {
        if (match.includes('button') || match.includes('px-') || match.includes('py-') || match.includes('h-10') || match.includes('h-12')) {
            // Check if it's explicitly a card or dialog which shouldn't be rounded-full
            if (!match.includes('p-6') && !match.includes('p-8') && !match.includes('w-full') && !match.includes('max-w-')) {
                return `className="${p1}rounded-full${p2}"`;
            }
        }
        return match;
    });

    // Ensure large cards have rounded-3xl and backdrop blur if they have glass properties
    const cardRegex = /className="([^"]*?)bg-white([^"]*?)"/g;
    content = content.replace(cardRegex, (match, p1, p2) => {
        if (match.includes('p-6') || match.includes('p-8') || match.includes('p-10')) {
            let res = match;
            if (!res.includes('rounded-') || res.includes('rounded-2xl') || res.includes('rounded-xl')) {
                res = res.replace(/rounded-(?:2xl|xl|lg|md)/, 'rounded-3xl');
            }
            if (!res.includes('shadow-')) {
                res = res.replace('bg-white', 'bg-white shadow-xl shadow-slate-200/50');
            }
            return res;
        }
        return match;
    });

    if (content !== fs.readFileSync(file, 'utf8')) {
        fs.writeFileSync(file, content);
        console.log("Patched claymorphism in " + file);
    }
});
