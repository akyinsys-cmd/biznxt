const fs = require('fs');

let code = fs.readFileSync('src/pages/Services.tsx', 'utf8');

const regex = /price: (\d+),/g;
let newCode = code.replace(regex, (match, price) => {
  return `price: ${price},
    benchmark_price: ${price},
    biznxt_price: ${price},
    premium_features_list: [
      { text: "Dedicated Success Manager", highlight: "1-on-1 proactive guidance and project tracking." },
      { text: "Expert Quality Assurance", highlight: "Multi-point manual review by senior professionals." },
      { text: "Business Health Scoring", highlight: "AI-driven compliance and regulatory tracking." }
    ],`;
});

fs.writeFileSync('src/pages/Services.tsx', newCode);
