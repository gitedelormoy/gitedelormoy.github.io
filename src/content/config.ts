import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    image: z.string().optional(),
    category: z.enum(['activites', 'region', 'sejour', 'conseils']).optional(),
    readingTime: z.number().optional(), // in minutes
    draft: z.boolean().default(false),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };
