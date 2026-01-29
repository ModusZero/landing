import type { HowItWorksConfig } from "@/types/how-it-works-config";

const BASE_PREFIX = "products.mod0.how_it_works";
const STEPS_PREFIX = `${BASE_PREFIX}.steps`;

export const MOD0_HOW_IT_WORKS: HowItWorksConfig = {
  title: `${BASE_PREFIX}.title`,
  subtitle: `${BASE_PREFIX}.subtitle`,
  steps: [
    {
      title: `${STEPS_PREFIX}.step_1.title`,
      description: `${STEPS_PREFIX}.step_1.description`,
    },
    {
      title: `${STEPS_PREFIX}.step_2.title`,
      description: `${STEPS_PREFIX}.step_2.description`,
    },
    {
      title: `${STEPS_PREFIX}.step_3.title`,
      description: `${STEPS_PREFIX}.step_3.description`,
    },
    {
      title: `${STEPS_PREFIX}.step_4.title`,
      description: `${STEPS_PREFIX}.step_4.description`,
    },
    {
      title: `${STEPS_PREFIX}.step_5.title`,
      description: `${STEPS_PREFIX}.step_5.description`,
    },
    {
      title: `${STEPS_PREFIX}.step_6.title`,
      description: `${STEPS_PREFIX}.step_6.description`,
    },
  ],
};