export interface Service {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  gst: number;
  timeline: string;
  description: string;
}

export const LAUNCH_SERVICES: Service[] = [
  // STEP 2: REGISTRATION
  { id: 'pvt_ltd', name: 'Private Ltd Registration', category: 'registration', basePrice: 0, gst: 18, timeline: '10-15 Days', description: 'Complete company incorporation with MCA' },
  { id: 'gst_reg', name: 'GST Registration', category: 'registration', basePrice: 0, gst: 18, timeline: '3-5 Days', description: 'Get your GSTIN within days' },
  { id: 'trademark', name: 'Trademark Filing', category: 'registration', basePrice: 0, gst: 18, timeline: '2 Days (Filing)', description: 'Protect your brand identity' },
  { id: 'msme', name: 'MSME / Udyam', category: 'registration', basePrice: 0, gst: 18, timeline: '1 Day', description: 'Udyam registration for MSME benefits' },
  { id: 'fssai', name: 'FSSAI License', category: 'registration', basePrice: 0, gst: 18, timeline: '7-10 Days', description: 'Food safety license for food businesses' },
  
  // STEP 3: BRANDING
  { id: 'logo_design', name: 'Premium Logo Design', category: 'branding', basePrice: 0, gst: 18, timeline: '3 Days', description: '3 concepts with unlimited revisions' },
  { id: 'brand_identity', name: 'Brand Identity Kit', category: 'branding', basePrice: 0, gst: 18, timeline: '7 Days', description: 'Typography, colors, and usage guidelines' },
  { id: 'packaging', name: 'Packaging Design', category: 'branding', basePrice: 0, gst: 18, timeline: '5 Days', description: 'Custom packaging and label design' },
  
  // STEP 4: DIGITAL
  { id: 'website_basic', name: 'Business Landing Page', category: 'digital', basePrice: 0, gst: 18, timeline: '5 Days', description: 'Conversion optimized landing page' },
  { id: 'ecom_store', name: 'E-commerce Website', category: 'digital', basePrice: 0, gst: 18, timeline: '15 Days', description: 'Full-featured Shopify/WooCommerce store' },
  { id: 'mobile_app', name: 'Android / iOS App', category: 'digital', basePrice: 0, gst: 18, timeline: '45 Days', description: 'Custom mobile application' },
  
  // STEP 5: MARKETING
  { id: 'seo_basic', name: 'Local SEO Setup', category: 'marketing', basePrice: 0, gst: 18, timeline: 'Monthly', description: 'Google Business Profile optimization' },
  { id: 'meta_ads', name: 'Meta Ads Management', category: 'marketing', basePrice: 0, gst: 18, timeline: 'Monthly', description: 'Facebook & Instagram ad campaigns' },
  
  // STEP 6: MANUFACTURING
  { id: 'mfg_search', name: 'Manufacturer Sourcing', category: 'manufacturing', basePrice: 0, gst: 18, timeline: '10 Days', description: 'Finding verified OEM/White Label partners' },
  
  // STEP 7: FINANCE
  { id: 'pitch_deck', name: 'Investor Pitch Deck', category: 'finance', basePrice: 0, gst: 18, timeline: '7 Days', description: 'Professional deck for fundraising' },
  { id: 'loan_asst', name: 'Business Loan Assistance', category: 'finance', basePrice: 0, gst: 18, timeline: 'Timeline varies', description: 'End-to-end support for bank loans' },
];
