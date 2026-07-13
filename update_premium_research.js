import fs from 'fs';

const file = 'src/pages/PremiumResearch.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/id: 'basic',[\s\S]*?name: 'Basic Research',[\s\S]*?price: '₹9,999',[\s\S]*?priceVal: 9999,/, `id: 'basic',
    name: 'Basic Research',
    price: '₹499',
    priceVal: 499,`);

content = content.replace(/id: 'pro',[\s\S]*?name: 'Professional Research',[\s\S]*?price: '₹19,999',[\s\S]*?priceVal: 19999,/, `id: 'pro',
    name: 'Professional Research',
    price: '₹4,999',
    priceVal: 4999,`);

content = content.replace(/id: 'premium',[\s\S]*?name: 'Premium Research',[\s\S]*?price: '₹34,999',[\s\S]*?priceVal: 34999,/, `id: 'premium',
    name: 'Premium Research',
    price: '₹9,999',
    priceVal: 9999,`);

content = content.replace(/id: 'enterprise',[\s\S]*?name: 'Enterprise Research',[\s\S]*?price: '₹59,999',[\s\S]*?priceVal: 59999,/, `id: 'enterprise',
    name: 'Enterprise Research',
    price: '₹19,999',
    priceVal: 19999,`);

content = content.replace(/id: 'corporate',[\s\S]*?name: 'Corporate Research',[\s\S]*?price: '₹1,19,999',[\s\S]*?priceVal: 119999,/, `id: 'corporate',
    name: 'Corporate Research',
    price: '₹49,999',
    priceVal: 49999,`);

fs.writeFileSync(file, content, 'utf8');
