const fs = require('fs');

let code = fs.readFileSync('src/pages/Services.tsx', 'utf8');

code = code.replace(
  /const benchmarkPrice = service\.price - \(service\.discount \|\| 0\);\s*const finalPrice = calculatePremiumPrice\(benchmarkPrice, pricingConfig\.enableAutomatedAdjustment\);/,
  "const benchmarkPrice = service.benchmark_price || service.price - (service.discount || 0);\n                  const finalPrice = pricingConfig.enableAutomatedAdjustment ? (service.biznxt_price || calculatePremiumPrice(benchmarkPrice, true)) : benchmarkPrice;"
);

// We should also replace the strikethrough price display: 
// {hasDiscount && <span className="text-[10px] text-slate-500 line-through block">₹{service.price.toLocaleString()}</span>}
// We will replace it with benchmarkPrice
code = code.replace(
  /\{hasDiscount && \(\s*<span className="text-\[10px\] text-slate-500 line-through block">₹\{service\.price\.toLocaleString\(\)\}<\/span>\s*\)\}/g,
  `{<span className="text-[10px] text-slate-500 line-through block" title="Standard Market Price">₹{benchmarkPrice.toLocaleString()}</span>}`
);

fs.writeFileSync('src/pages/Services.tsx', code);
