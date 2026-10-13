import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** The five layers of the hero; every project declares which ones it proves. */
export const LAYERS = ['design', 'frontend', 'backend', 'ai', 'infra'] as const;
export type Layer = (typeof LAYERS)[number];

/**
 * Projects. Fields are a subset of the archive's project.yaml (schema v1).
 * `permission` is enforced at build time: a project without explicit
 * clearance cannot become a page (plan §5.2).
 */
const work = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      tagline: z.string(),
      summary: z.string(),
      order: z.number(),
      year: z.string(),
      period: z.string(),
      role: z.string(),
      type: z.string(),
      status: z.string(),
      layers: z.array(z.enum(LAYERS)).min(1),
      stack: z.array(z.string()),
      liveUrl: z.url().optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      /** false = listed on /work with no case-study page yet. */
      hasPage: z.boolean().default(true),
      permission: z.object({
        caseStudy: z.literal(true),
        screenshots: z.boolean(),
        source: z.string(),
      }),
      related: z.array(reference('work')).default([]),
    }),
});

export const collections = { work };
