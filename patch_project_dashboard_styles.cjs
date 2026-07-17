const fs = require('fs');
let content = fs.readFileSync('src/pages/ProjectDashboard.tsx', 'utf8');

// Ensure buttons are pill-shaped (rounded-full)
content = content.replace(/className="([^"]*?)rounded-2xl([^"]*?transition-all[^"]*?)"/g, (match, p1, p2) => {
    if (match.includes('button') || match.includes('px-') || match.includes('h-12') || match.includes('h-10')) {
        return `className="${p1}rounded-full${p2}"`;
    }
    return match;
});

// Ensure cards use premium claymorphism (rounded-3xl or rounded-[2rem] with backdrop-blur)
// Many are already rounded-[2rem] or rounded-[2.5rem], let's check for standard rounded-xl or rounded-2xl on divs
// and upgrade them.
content = content.replace(/rounded-xl/g, 'rounded-2xl');
content = content.replace(/rounded-2xl/g, 'rounded-3xl');

fs.writeFileSync('src/pages/ProjectDashboard.tsx', content);
console.log("Patched ProjectDashboard styles");
