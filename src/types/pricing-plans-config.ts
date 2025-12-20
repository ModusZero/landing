export type PricingPlansConfig = {
  title: string;
  subtitle: string;
  plans: PricingPlan[];

}

type PricingPlan = {
  name: string;
  price: string;
  description: string;
  period: '/day' | '/month' | '/year' | '';
  features: string[];
  cta: { text: string; href: string };
  featured: boolean;
  isPopular?: boolean;
  badge?: string;
};