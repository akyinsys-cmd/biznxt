const fs = require('fs');

let servicesCode = fs.readFileSync('src/pages/Services.tsx', 'utf8');

// The line is: const finalPrice = service.price - (service.discount || 0);
// We should replace this with calculatePremiumPrice

servicesCode = servicesCode.replace(
  `const finalPrice = service.price - (service.discount || 0);`,
  `const benchmarkPrice = service.price - (service.discount || 0);\n                  const finalPrice = calculatePremiumPrice(benchmarkPrice, pricingConfig.enableAutomatedAdjustment);`
);

// Add the ValueComparison modal trigger to the card UI
// Under the price, let's add a button to compare
const originalPriceUI = `
                        <div className="flex items-end gap-2">
                          <span className="text-3xl font-black text-slate-900 tracking-tighter">₹{finalPrice.toLocaleString()}</span>
                          {service.discount && service.discount > 0 && (
                            <span className="text-[10px] text-slate-500 line-through block">₹{service.price.toLocaleString()}</span>
                          )}
                        </div>
                        
                        {pricingConfig.enableAutomatedAdjustment && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setCompareServiceTitle(service.title);
                              setCompareModalOpen(true);
                            }}
                            className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark transition-colors bg-rose-50 px-3 py-1.5 rounded-full w-max"
                          >
                            <Shield className="w-3.5 h-3.5" />
                            View Premium Value
                          </button>
                        )}
`;

servicesCode = servicesCode.replace(
  /<div className="flex items-end gap-2">[\s\S]*?<span className="text-3xl font-black text-slate-900 tracking-tighter">₹\{finalPrice.toLocaleString\(\)\}<\/span>[\s\S]*?\{service\.discount && service\.discount > 0 && \([\s\S]*?<span className="text-\[10px\] text-slate-500 line-through block">₹\{service\.price\.toLocaleString\(\)\}<\/span>[\s\S]*?\)\][\s\S]*?<\/div>/m,
  originalPriceUI
);

// We need to insert <ValueComparisonModal /> inside the return statement, ideally before </Layout>
servicesCode = servicesCode.replace(
  `{/* View Service Details Modal */}`,
  `<ValueComparisonModal isOpen={compareModalOpen} onClose={() => setCompareModalOpen(false)} serviceTitle={compareServiceTitle} />\n      {/* View Service Details Modal */}`
);

fs.writeFileSync('src/pages/Services.tsx', servicesCode);
