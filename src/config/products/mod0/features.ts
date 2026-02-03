import type { FeaturesConfig } from "@/types/features-config";
import type { IconName } from "@/types/icon-name";

const iconsByOrder: IconName[] = [
  'zap',
  'layers',
  'code',
  'cpu-chip',
  'shield-check',
  'github',
  'wrench',
  'chart',
  'bolt'
];

const featuresPrefix = 'products.mod0.features';
const itemsPrefix = `${featuresPrefix}.items`;

export const MOD0_FEATURES: FeaturesConfig = {
    title: `${featuresPrefix}.title`,
    subtitle: `${featuresPrefix}.subtitle`,
    items: iconsByOrder.map((iconName, index) => ({
      icon: iconName,
      title: `${itemsPrefix}.f${index + 1}.title`,
      description: `${itemsPrefix}.f${index + 1}.description`,
    })),
};