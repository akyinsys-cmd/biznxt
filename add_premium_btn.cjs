const fs = require('fs');

let code = fs.readFileSync('src/pages/Services.tsx', 'utf8');

const replacement = `
                        <div className="flex flex-col gap-1">
                          {hasDiscount && (
                            <span className="text-[10px] text-slate-500 line-through block">₹{service.price.toLocaleString()}</span>
                          )}
                          <span className="text-lg font-bold text-white">₹{finalPrice.toLocaleString()}</span>
                          {pricingConfig.enableAutomatedAdjustment && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setCompareServiceTitle(service.title);
                                setCompareModalOpen(true);
                              }}
                              className="text-[10px] text-primary hover:text-blue-300 font-bold underline underline-offset-2 flex items-center mt-1"
                            >
                              <Shield className="w-3 h-3 mr-1" /> Compare Value
                            </button>
                          )}
                        </div>
`;

code = code.replace(
  /<div>\s*\{hasDiscount && \(\s*<span className="text-\[10px\] text-slate-500 line-through block">₹\{service\.price\.toLocaleString\(\)\}<\/span>\s*\)\}\s*<span className="text-lg font-bold text-white">₹\{finalPrice\.toLocaleString\(\)\}<\/span>\s*<\/div>/,
  replacement
);

fs.writeFileSync('src/pages/Services.tsx', code);
