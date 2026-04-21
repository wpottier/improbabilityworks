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

    /**
     * Storefront buttons (Steam, Epic) — driven by per-store flags.
     *
     * enabled    : render the button at all. Unset it to remove the CTA entirely.
     * comingSoon : render as a disabled "soon" button. The "Coming soon" suffix
     *              lives in the global i18n dict (games.comingSoon).
     * url        : destination when the store is live (enabled && !comingSoon).
     *
     * Button labels are not stored here — they're shared across games and live
     * in the global i18n dict under games.stores.<key>.{live,comingSoon}.
     */
    stores: z
      .object({
        steam: z
          .object({
            enabled: z.boolean().default(false),
            comingSoon: z.boolean().default(false),
            url: z.string().optional(),
          })
          .optional(),
        epic: z
          .object({
            enabled: z.boolean().default(false),
            comingSoon: z.boolean().default(false),
            url: z.string().optional(),
          })
          .optional(),
      })
      .default({}),

    pressKitUrl: z.string().optional(),

    // Gallery — ordered list of image paths relative to /public
    gallery: z.array(z.string()).default([]),

    // Locale-specific UI labels kept inside the entry for self-containment.
    // pressKitAvailable gates the whole press-kit section — flip to true once
    // a real press kit URL (pressKitUrl) is published.
    ui: z.object({
      pressKitAvailable: z.boolean().default(false),
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

/**
 * Collection `members` — one MDX entry per (member × locale).
 *
 * memberId : canonical identifier ('will', …) pairing locale variants.
 * order    : display order when the team grows beyond one person.
 * avatar   : path under /public to the portrait/avatar asset.
 * links    : social/professional links, platform-keyed so the component can
 *            pick the right icon. Array (not object) to keep order authorial
 *            and allow future platforms without schema churn.
 *
 * The MDX body carries the bio prose (rich text, formattable).
 */
const members = defineCollection({
  type: 'content',
  schema: z.object({
    locale: z.enum(['en', 'fr']),
    memberId: z.string(),
    order: z.number().default(0),

    name: z.string(),
    role: z.string(),
    avatar: z.string(),
    avatarAlt: z.string().optional(),

    links: z
      .array(
        z.object({
          platform: z.enum(['bluesky', 'mastodon', 'github', 'discord', 'website']),
          label: z.string(),
          url: z.string(),
        }),
      )
      .default([]),
  }),
});

export const collections = { legal, games, members };
