import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum([
      'robes-tenues',
      'organisation-mariage',
      'lieux-mariage',
      'prestataires-mariage',
    ]),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    draft: z.boolean().default(false),
    budgetCalculatorGuests: z.number().int().min(20).max(200).optional(),
  }),
});

export const collections = {
  blog,
};
