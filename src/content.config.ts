import { defineCollection, z } from 'astro:content';

const legal = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
  }),
});

export const collections = {
  'legal': legal,
};