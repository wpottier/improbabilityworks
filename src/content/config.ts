import { defineCollection, z } from 'astro:content';

/**
 * Collection `legal` — one MDX entry per (locale × document).
 *
 * urlSlug    : the locale-specific URL segment (/en/legal/, /fr/mentions-legales/ …)
 *              NB: `slug` is a reserved field in Astro content collections (auto-computed
 *              from the filename), so we use `urlSlug` for our custom URL segment.
 * canonical  : document key matching SLUG_MAP ('legal' | 'eula' | 'privacy')
 * locale     : 'en' | 'fr'
 * lastUpdated: z.coerce.date() because YAML bare dates (2026-04-18) are parsed
 *              as Date objects before Zod sees them.
 */
const legal = defineCollection({
  type: 'content',
  schema: z.object({
    locale: z.enum(['en', 'fr']),
    canonical: z.enum(['legal', 'eula', 'privacy']),
    urlSlug: z.string(),
    title: z.string(),
    description: z.string(),
    lastUpdated: z.coerce.date(),
  }),
});

/**
 * Collection `games` — one MDX entry per (game × locale).
 *
 * gameId   : canonical identifier for the game ('velvet-door', …).
 *            Used to pair locale variants together (language switcher, hreflang).
 * order    : display order when multiple games appear on the home page.
 * status   : gates which CTAs appear (wishlist vs early-access vs released).
 *
 * The MDX body carries the extended pitch prose (rich text, formattable).
 * Structured data (features, links, gallery paths…) lives in frontmatter
 * so it can be iterated and mapped without touching the rendered content.
 */
const games = defineCollection({
  type: 'content',
  schema: z.object({
    locale: z.enum(['en', 'fr']),
    gameId: z.string(),
    order: z.number().default(0),
    status: z
      .enum(['announced', 'in-development', 'early-access', 'released'])
      .default('in-development'),

    // Display
    eyebrow: z.string(),
    title: z.string(),
    tagline: z.string(),
    pitchLede: z.string(),

    // Feature cards
    features: z.array(
      z.object({
        title: z.string(),
        body: z.string(),
      }),
    ),

    // Links — optional so future games can omit unavailable platforms
    steamUrl: z.string().optional(),
    epicUrl: z.string().optional(),
    pressKitUrl: z.string().optional(),

    // Gallery — ordered list of image paths relative to /public
    gallery: z.array(z.string()).default([]),

    // Locale-specific UI labels kept inside the entry for self-containment
    ui: z.object({
      ctaWishlist: z.string().optional(),
      ctaEpic: z.string().optional(),
      ctaEpicSoon: z.string().optional(),
      pressKit: z.string(),
      galleryHint: z.string(),
      pressKitNote: z.string(),
    }),

    // Structured data hints for JSON-LD (VideoGame schema)
    genre: z.array(z.string()).default([]),
    platforms: z.array(z.string()).default(['PC']),
    minPlayers: z.number().optional(),
    maxPlayers: z.number().optional(),
  }),
});

export const collections = { legal, games };
