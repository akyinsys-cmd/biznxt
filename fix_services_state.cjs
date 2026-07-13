const fs = require('fs');

let code = fs.readFileSync('src/pages/Services.tsx', 'utf8');

// Add imports
if (!code.includes("import { ValueComparisonModal }")) {
  code = code.replace(
    "import { logEvent } from 'firebase/analytics';",
    "import { logEvent } from 'firebase/analytics';\nimport { ValueComparisonModal } from '../components/widgets/ValueComparisonModal';\nimport { calculatePremiumPrice, subscribeToPricingConfig } from '../lib/pricingService';"
  );
}
if (!code.includes("Shield")) {
  code = code.replace(
    "import { ",
    "import { Shield, "
  );
}

// Add state
if (!code.includes("const [pricingConfig")) {
  code = code.replace(
    "const [searchQuery, setSearchQuery] = useState('');",
    "const [searchQuery, setSearchQuery] = useState('');\n  const [pricingConfig, setPricingConfig] = useState({ enableAutomatedAdjustment: true });\n  const [compareModalOpen, setCompareModalOpen] = useState(false);\n  const [compareServiceTitle, setCompareServiceTitle] = useState('');"
  );
}

// Add useEffect
if (!code.includes("subscribeToPricingConfig")) {
  const effectCode = `
  useEffect(() => {
    const unsub = subscribeToPricingConfig((config) => {
      setPricingConfig(config);
    });
    return () => unsub();
  }, []);
`;
  code = code.replace(
    /useEffect\(\(\) => \{\n    const fetchServices = async/,
    `${effectCode}\n  useEffect(() => {\n    const fetchServices = async`
  );
}

fs.writeFileSync('src/pages/Services.tsx', code);
