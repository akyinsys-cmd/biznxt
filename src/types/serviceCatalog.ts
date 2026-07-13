export interface PremiumFeature {
  text: string;
  highlight?: string;
  roi?: string;
}

export interface ServiceCatalogEntry {
  id: string;
  title: string;
  category: string;
  subCategory: string;
  description: string;
  overview?: string;
  deliverables?: string;
  timeline?: string;
  estimatedDuration?: number;
  requiredDocuments?: string;
  eligibility?: string;
  faqs?: Array<{ q: string; a: string }>;
  terms?: string;
  cancellationPolicy?: string;

  // Pricing
  price: number;
  discount?: number;
  benchmark_price?: number;
  biznxt_price?: number;

  // Premium features list
  premium_features_list?: PremiumFeature[];

  createdAt?: string;
  isActive?: boolean;
}
