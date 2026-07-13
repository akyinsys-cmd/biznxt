import fs from 'fs';

const file = 'src/pages/Landing.tsx';
let content = fs.readFileSync(file, 'utf8');

const newServices = `const services = [
    { id: '1', title: 'Basic Research', category: 'setup', desc: 'Entry level business research overview with local market feasibility insights.', price: '₹499', rating: '4.9/5' },
    { id: '2', title: 'GST Registration + Filing', category: 'trade', desc: 'Complete GST registration and assistance with your first filing.', price: '₹4,999', rating: '4.8/5' },
    { id: '3', title: 'ITR Filing', category: 'setup', desc: 'Professional assistance with filing your Income Tax Return.', price: '₹4,999', rating: '4.9/5' },
    { id: '4', title: 'Trade License - Karnataka', category: 'growth', desc: 'Assistance in obtaining a trade license from local authorities in Karnataka.', price: '₹14,999', rating: '4.7/5' },
    { id: '5', title: 'CA Assisted Tax Filing', category: 'legal', desc: 'Dedicated CA assistance for complex tax situations and planning.', price: '₹18,999', rating: '4.9/5' },
    { id: '6', title: 'Enterprise Research', category: 'legal', desc: 'Comprehensive research covering multi-location expansion and operational planning.', price: '₹19,999', rating: '4.9/5' },
  ];`;

content = content.replace(/const services = \[[\s\S]*?\];/, newServices);
fs.writeFileSync(file, content, 'utf8');
