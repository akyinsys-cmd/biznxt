const fs = require('fs');
let code = fs.readFileSync('src/pages/LaunchWizard.tsx', 'utf8');

// Add warning to useToast import/destructuring
code = code.replace(
  "const { success, error: toastError } = useToast();",
  "const { success, warning, error: toastError } = useToast();"
);

// Add basic validation
const handleNextCode = `
  const handleNext = async () => {
    if (currentStep === 0) {
      if (!formData.businessName || !formData.industry) {
        warning('Please fill in both Business Name and Industry');
        return;
      }
    }
    
    if (currentStep < STEPS.length - 1) {
      await handleSave(true);
      setCurrentStep(curr => curr + 1);
    } else {
      await handleSave(true);
      success('Launch details submitted successfully!');
    }
  };
`;

code = code.replace(/const handleNext = async \(\) => \{[\s\S]*?\};\n/m, handleNextCode);

fs.writeFileSync('src/pages/LaunchWizard.tsx', code);
